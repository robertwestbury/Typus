# Migration `20200412190756-rename-actions-to-rules`

This migration has been generated by Robert Westbury at 4/12/2020, 7:07:56 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."ValidationRule" (
    "action" text  NOT NULL ,
    "createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "detail" text   ,
    "id" SERIAL,
    "validationId" integer  NOT NULL ,
    PRIMARY KEY ("id")
) 

ALTER TABLE "public"."ValidationRule" ADD FOREIGN KEY ("validationId")REFERENCES "public"."Validation"("id") ON DELETE CASCADE  ON UPDATE CASCADE

DROP TABLE "public"."ValidationAction";
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200412185025-validation-first-pass..20200412190756-rename-actions-to-rules
--- datamodel.dml
+++ datamodel.dml
@@ -1,7 +1,7 @@
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url      = env("DATABASE_URL")
 }
 generator client {
   provider      = "prisma-client-js"
@@ -39,9 +39,9 @@
   name       String
   validation Validation?
 }
-model ValidationAction {
+model ValidationRule {
   id           Int        @default(autoincrement()) @id
   action       String
   detail       String?
   validationId Int
@@ -49,10 +49,10 @@
   createdAt    DateTime   @default(now())
 }
 model Validation {
-  id           Int                @default(autoincrement()) @id
-  allowUnknown Boolean            @default(true)
-  actions      ValidationAction[]
-  formId       String
-  form         Form               @relation(fields: [formId], references: [id])
+  id              Int              @default(autoincrement()) @id
+  allowUnknown    Boolean          @default(true)
+  ValidationRules ValidationRule[]
+  formId          String
+  form            Form             @relation(fields: [formId], references: [id])
 }
```

