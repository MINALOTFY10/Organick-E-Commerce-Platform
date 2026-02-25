-- CreateEnum
CREATE TYPE "SectionType" AS ENUM ('PARAGRAPH', 'HEADING', 'LIST', 'ORDERED_LIST', 'QUOTE');

-- CreateTable
CREATE TABLE "Blog" (
    "id" TEXT NOT NULL,
    "heroImage" TEXT NOT NULL,
    "publishDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "author" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogSection" (
    "id" TEXT NOT NULL,
    "type" "SectionType" NOT NULL,
    "content" TEXT,
    "items" TEXT[],
    "order" INTEGER NOT NULL,
    "blogId" TEXT NOT NULL,

    CONSTRAINT "BlogSection_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BlogSection" ADD CONSTRAINT "BlogSection_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
