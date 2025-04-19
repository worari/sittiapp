-- CreateTable
CREATE TABLE "Person" (
    "id" SERIAL NOT NULL,
    "citizenId" TEXT NOT NULL,
    "prefix" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "documentFrom" TEXT NOT NULL,
    "documentDate" TIMESTAMP(3) NOT NULL,
    "officerType" TEXT NOT NULL,
    "doc_sor3" TEXT,
    "doc_sor8" TEXT,
    "doc_student" TEXT,
    "doc_start" TEXT,
    "doc_end" TEXT,
    "doc_transfer_out" TEXT,
    "doc_transfer_in" TEXT,
    "doc_move" TEXT,
    "doc_history" TEXT,
    "doc_other" TEXT,
    "doc_citizencard" TEXT,
    "doc_gov" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_citizenId_key" ON "Person"("citizenId");
