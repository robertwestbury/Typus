# Migration `20200428155913-initial-migration`

This migration has been generated by Robert Westbury at 4/28/2020, 3:59:13 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."User" (
    "email" text  NOT NULL ,
    "id" text  NOT NULL ,
    "password" text  NOT NULL ,
    PRIMARY KEY ("id")
) 

CREATE TABLE "public"."Ip" (
    "address" text  NOT NULL ,
    PRIMARY KEY ("address")
) 

CREATE TABLE "public"."Submission" (
    "createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data" text  NOT NULL ,
    "formId" text  NOT NULL ,
    "id" SERIAL,
    "ipId" text  NOT NULL ,
    "note" text  NOT NULL DEFAULT '',
    "spam" boolean  NOT NULL DEFAULT false,
    PRIMARY KEY ("id")
) 

CREATE TABLE "public"."Form" (
    "id" text  NOT NULL ,
    "name" text  NOT NULL ,
    "ownerId" text  NOT NULL ,
    PRIMARY KEY ("id")
) 

CREATE TABLE "public"."Security" (
    "allowedDomains" text  NOT NULL ,
    "formId" text  NOT NULL ,
    "honey" text  NOT NULL ,
    "id" SERIAL,
    "recaptcha" text  NOT NULL ,
    PRIMARY KEY ("id")
) 

CREATE TABLE "public"."Appearance" (
    "errorBackgroundColor" text  NOT NULL DEFAULT '#fafafa',
    "errorButtonColor" text  NOT NULL DEFAULT '#e02424',
    "errorCustomRedirect" text  NOT NULL DEFAULT '',
    "errorDots" boolean  NOT NULL DEFAULT true,
    "errorIconBackground" text  NOT NULL DEFAULT '#fde8e8',
    "errorIconColor" text  NOT NULL DEFAULT '#e02424',
    "errorMode" text  NOT NULL DEFAULT 'Our',
    "formId" text  NOT NULL ,
    "id" SERIAL,
    "successBackgroundColor" text  NOT NULL DEFAULT '#fafafa',
    "successButtonColor" text  NOT NULL DEFAULT '#057a55',
    "successCustomRedirect" text  NOT NULL DEFAULT '',
    "successDots" boolean  NOT NULL DEFAULT true,
    "successMode" text  NOT NULL DEFAULT 'Our',
    "successText" text  NOT NULL DEFAULT 'Your form has successfully been recieved and processed. Thank you!',
    "successTickBackground" text  NOT NULL DEFAULT '#def7ec',
    "successTickColor" text  NOT NULL DEFAULT '#057a55',
    PRIMARY KEY ("id")
) 

CREATE TABLE "public"."Confirmation" (
    "body" text  NOT NULL DEFAULT '',
    "field" text  NOT NULL DEFAULT '',
    "formId" text  NOT NULL ,
    "fromAddress" text  NOT NULL DEFAULT '',
    "fromName" text  NOT NULL DEFAULT '',
    "id" SERIAL,
    "subject" text  NOT NULL DEFAULT '',
    PRIMARY KEY ("id")
) 

CREATE TABLE "public"."ValidationRule" (
    "createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "detail" text   ,
    "errorMessage" text   ,
    "field" text  NOT NULL ,
    "id" SERIAL,
    "validationId" integer  NOT NULL ,
    "validator" text  NOT NULL ,
    PRIMARY KEY ("id")
) 

CREATE TABLE "public"."Validation" (
    "allowUnknown" boolean  NOT NULL DEFAULT true,
    "formId" text  NOT NULL ,
    "id" SERIAL,
    PRIMARY KEY ("id")
) 

CREATE TABLE "public"."_collaboratingForms" (
    "A" text  NOT NULL ,
    "B" text  NOT NULL 
) 

CREATE UNIQUE INDEX "User.email" ON "public"."User"("email")

CREATE UNIQUE INDEX "Security_formId" ON "public"."Security"("formId")

CREATE UNIQUE INDEX "Appearance_formId" ON "public"."Appearance"("formId")

CREATE UNIQUE INDEX "Confirmation_formId" ON "public"."Confirmation"("formId")

CREATE UNIQUE INDEX "Validation_formId" ON "public"."Validation"("formId")

CREATE UNIQUE INDEX "_collaboratingForms_AB_unique" ON "public"."_collaboratingForms"("A","B")

CREATE  INDEX "_collaboratingForms_B_index" ON "public"."_collaboratingForms"("B")

ALTER TABLE "public"."Submission" ADD FOREIGN KEY ("formId")REFERENCES "public"."Form"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Submission" ADD FOREIGN KEY ("ipId")REFERENCES "public"."Ip"("address") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Form" ADD FOREIGN KEY ("ownerId")REFERENCES "public"."User"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Security" ADD FOREIGN KEY ("formId")REFERENCES "public"."Form"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Appearance" ADD FOREIGN KEY ("formId")REFERENCES "public"."Form"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Confirmation" ADD FOREIGN KEY ("formId")REFERENCES "public"."Form"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."ValidationRule" ADD FOREIGN KEY ("validationId")REFERENCES "public"."Validation"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Validation" ADD FOREIGN KEY ("formId")REFERENCES "public"."Form"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."_collaboratingForms" ADD FOREIGN KEY ("A")REFERENCES "public"."Form"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."_collaboratingForms" ADD FOREIGN KEY ("B")REFERENCES "public"."User"("id") ON DELETE CASCADE  ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200428155913-initial-migration
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,108 @@
+datasource db {
+  provider = "postgresql"
+  url      = env("DATABASE_URL")
+}
+
+generator client {
+  provider      = "prisma-client-js"
+  binaryTargets = ["native", "debian-openssl-1.1.x"]
+}
+
+model User {
+  id                 String @default(uuid()) @id
+  email              String @unique
+  password           String
+  forms              Form[]
+  collaboratingForms Form[] @relation("collaboratingForms")
+}
+
+model Ip {
+  address     String       @id
+  submissions Submission[]
+}
+
+model Submission {
+  id        Int      @default(autoincrement()) @id
+  data      String
+  formId    String
+  form      Form     @relation(fields: [formId], references: [id])
+  ipId      String
+  ip        Ip       @relation(fields: [ipId], references: [address])
+  spam      Boolean  @default(false)
+  createdAt DateTime @default(now())
+  note      String   @default("")
+}
+
+model Form {
+  id            String        @id
+  ownerId       String
+  owner         User          @relation(fields: [ownerId], references: [id])
+  collaborators User[]        @relation("collaboratingForms", references: [id])
+  name          String
+  validation    Validation?
+  confirmation  Confirmation?
+  appearance    Appearance
+  security      Security
+}
+
+model Security {
+  id             Int    @default(autoincrement()) @id
+  formId         String
+  form           Form   @relation(fields: [formId], references: [id])
+  recaptcha      String
+  honey          String
+  allowedDomains String
+}
+
+model Appearance {
+  id                     Int     @default(autoincrement()) @id
+  formId                 String
+  form                   Form    @relation(fields: [formId], references: [id])
+  // Success 
+  successMode            String  @default("Our")
+  successCustomRedirect  String  @default("")
+  successTickBackground  String  @default("#def7ec")
+  successTickColor       String  @default("#057a55")
+  successText            String  @default("Your form has successfully been recieved and processed. Thank you!")
+  successButtonColor     String  @default("#057a55")
+  successBackgroundColor String  @default("#fafafa")
+  successDots            Boolean @default(true)
+  // Error
+  errorMode              String  @default("Our")
+  errorCustomRedirect    String  @default("")
+  errorIconBackground    String  @default("#fde8e8")
+  errorIconColor         String  @default("#e02424")
+  errorButtonColor       String  @default("#e02424")
+  errorBackgroundColor   String  @default("#fafafa")
+  errorDots              Boolean @default(true)
+}
+
+model Confirmation {
+  id          Int    @default(autoincrement()) @id
+  field       String @default("")
+  fromName    String @default("")
+  fromAddress String @default("")
+  subject     String @default("")
+  body        String @default("")
+  formId      String
+  form        Form   @relation(fields: [formId], references: [id])
+}
+
+model ValidationRule {
+  id           Int        @default(autoincrement()) @id
+  field        String
+  validator    String
+  detail       String?
+  errorMessage String?
+  validationId Int
+  validation   Validation @relation(fields: [validationId], references: [id])
+  createdAt    DateTime   @default(now())
+}
+
+model Validation {
+  id           Int              @default(autoincrement()) @id
+  allowUnknown Boolean          @default(true)
+  rules        ValidationRule[]
+  formId       String
+  form         Form             @relation(fields: [formId], references: [id])
+}
```


