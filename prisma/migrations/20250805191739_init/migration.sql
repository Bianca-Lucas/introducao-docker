-- CreateEnum
CREATE TYPE "public"."BookCategory" AS ENUM ('ROMANCE', 'FANTASIA', 'SUSPENSE', 'TERROR', 'BIOGRAFIA', 'INFANTIL', 'RELIGIOSO');

-- CreateTable
CREATE TABLE "public"."Book" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "publicationDate" TEXT,
    "category" "public"."BookCategory",

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);
