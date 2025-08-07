/*
  Warnings:

  - The primary key for the `AnswerSheet` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `AnswerSheet` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `AnswerSheetQuestionJunction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `AnswerSheetQuestionJunction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Exam` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Exam` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Question` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Question` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `userId` on the `AnswerSheet` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `examId` on the `AnswerSheet` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `answerSheetId` on the `AnswerSheetQuestionJunction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `questionId` on the `AnswerSheetQuestionJunction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ownerId` on the `Exam` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `examId` on the `Question` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."AnswerSheet" DROP CONSTRAINT "AnswerSheet_examId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnswerSheet" DROP CONSTRAINT "AnswerSheet_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnswerSheetQuestionJunction" DROP CONSTRAINT "AnswerSheetQuestionJunction_answerSheetId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AnswerSheetQuestionJunction" DROP CONSTRAINT "AnswerSheetQuestionJunction_questionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Exam" DROP CONSTRAINT "Exam_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Question" DROP CONSTRAINT "Question_examId_fkey";

-- AlterTable
ALTER TABLE "public"."AnswerSheet" DROP CONSTRAINT "AnswerSheet_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
DROP COLUMN "examId",
ADD COLUMN     "examId" INTEGER NOT NULL,
ADD CONSTRAINT "AnswerSheet_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."AnswerSheetQuestionJunction" DROP CONSTRAINT "AnswerSheetQuestionJunction_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "answerSheetId",
ADD COLUMN     "answerSheetId" INTEGER NOT NULL,
DROP COLUMN "questionId",
ADD COLUMN     "questionId" INTEGER NOT NULL,
ADD CONSTRAINT "AnswerSheetQuestionJunction_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Exam" DROP CONSTRAINT "Exam_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "ownerId",
ADD COLUMN     "ownerId" INTEGER NOT NULL,
ADD CONSTRAINT "Exam_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Question" DROP CONSTRAINT "Question_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "examId",
ADD COLUMN     "examId" INTEGER NOT NULL,
ADD CONSTRAINT "Question_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "public"."Exam" ADD CONSTRAINT "Exam_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Question" ADD CONSTRAINT "Question_examId_fkey" FOREIGN KEY ("examId") REFERENCES "public"."Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnswerSheet" ADD CONSTRAINT "AnswerSheet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnswerSheet" ADD CONSTRAINT "AnswerSheet_examId_fkey" FOREIGN KEY ("examId") REFERENCES "public"."Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnswerSheetQuestionJunction" ADD CONSTRAINT "AnswerSheetQuestionJunction_answerSheetId_fkey" FOREIGN KEY ("answerSheetId") REFERENCES "public"."AnswerSheet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnswerSheetQuestionJunction" ADD CONSTRAINT "AnswerSheetQuestionJunction_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
