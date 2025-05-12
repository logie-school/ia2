-- CreateTable
CREATE TABLE "staff" (
    "staff_email" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "fn" TEXT NOT NULL,
    "mn" TEXT NOT NULL,
    "sn" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL,
    CONSTRAINT "staff_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "staff_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" TEXT NOT NULL PRIMARY KEY,
    "user_email" TEXT NOT NULL,
    "created" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "auth" (
    "user_id" TEXT NOT NULL PRIMARY KEY,
    "pwd_hash" TEXT NOT NULL,
    "pwd_salt" TEXT NOT NULL,
    "last_updated" DATETIME NOT NULL,
    CONSTRAINT "auth_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "role" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "courses" (
    "course_id" TEXT NOT NULL PRIMARY KEY,
    "course_name" TEXT NOT NULL,
    "course_desc" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "enrol" (
    "enrol_id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "enrolled_at" DATETIME NOT NULL,
    CONSTRAINT "enrol_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "enrol_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses" ("course_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_user_email_key" ON "users"("user_email");

-- CreateIndex
CREATE UNIQUE INDEX "auth_user_id_key" ON "auth"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");
