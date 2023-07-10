/*
  Warnings:

  - A unique constraint covering the columns `[enrollmentId]` on the table `Ticket` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Ticket_enrollmentId_key" ON "Ticket"("enrollmentId");
