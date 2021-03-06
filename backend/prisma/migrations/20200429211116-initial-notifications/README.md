# Migration `20200429211116-initial-notifications`

This migration has been generated by Robert Westbury at 4/29/2020, 9:11:16 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."Notifications" (
    "emailsAddresses" text  NOT NULL DEFAULT '',
    "emailsEnabled" boolean  NOT NULL DEFAULT false,
    "formId" text  NOT NULL ,
    "id" SERIAL,
    PRIMARY KEY ("id")
) 

CREATE UNIQUE INDEX "Notifications_formId" ON "public"."Notifications"("formId")

ALTER TABLE "public"."Notifications" ADD FOREIGN KEY ("formId")REFERENCES "public"."Form"("id") ON DELETE CASCADE  ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200429145742-remove-buttons..20200429211116-initial-notifications
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
@@ -42,10 +42,20 @@
   validation    Validation?
   confirmation  Confirmation?
   appearance    Appearance
   security      Security
+  notifications Notifications
 }
+model Notifications {
+  id              Int     @default(autoincrement()) @id
+  formId          String
+  form            Form    @relation(fields: [formId], references: [id])
+  // Emails
+  emailsEnabled   Boolean @default(false)
+  emailsAddresses String  @default("")
+}
+
 model Security {
   id               Int     @default(autoincrement()) @id
   formId           String
   form             Form    @relation(fields: [formId], references: [id])
```


