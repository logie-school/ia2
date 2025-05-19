-- CreateTable
CREATE TABLE "potential_students" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fn" TEXT NOT NULL,
    "mn" TEXT,
    "sn" TEXT NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guardian_id" TEXT NOT NULL,
    CONSTRAINT "potential_students_guardian_id_fkey" FOREIGN KEY ("guardian_id") REFERENCES "users" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_enrol" (
    "enrol_id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "potential_students_id" TEXT,
    "course_id" TEXT NOT NULL,
    "enrolled_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "enrol_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "enrol_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses" ("course_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "enrol_potential_students_id_fkey" FOREIGN KEY ("potential_students_id") REFERENCES "potential_students" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_enrol" ("course_id", "enrol_id", "enrolled_at", "user_id") SELECT "course_id", "enrol_id", "enrolled_at", "user_id" FROM "enrol";
DROP TABLE "enrol";
ALTER TABLE "new_enrol" RENAME TO "enrol";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
