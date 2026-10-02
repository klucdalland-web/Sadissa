/*
  Warnings:

  - You are about to drop the column `refreshToken` on the `sessions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[refreshTokenHash]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `refreshTokenHash` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_userId_fkey";

-- DropIndex
DROP INDEX "sessions_refreshToken_key";

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "refreshToken",
ADD COLUMN     "refreshTokenHash" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "sessions_refreshTokenHash_key" ON "sessions"("refreshTokenHash");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
