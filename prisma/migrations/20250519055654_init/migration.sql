/*
  Warnings:

  - Added the required column `email` to the `potential_students` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_potential_students" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "fn" TEXT NOT NULL,
    "mn" TEXT,
    "sn" TEXT NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guardian_id" TEXT NOT NULL,
    CONSTRAINT "potential_students_guardian_id_fkey" FOREIGN KEY ("guardian_id") REFERENCES "users" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_potential_students" ("created", "fn", "guardian_id", "id", "mn", "sn") SELECT "created", "fn", "guardian_id", "id", "mn", "sn" FROM "potential_students";
DROP TABLE "potential_students";
ALTER TABLE "new_potential_students" RENAME TO "potential_students";
CREATE UNIQUE INDEX "potential_students_email_key" ON "potential_students"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
