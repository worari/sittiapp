-- CreateTable
CREATE TABLE "submission" (
    "id" SERIAL NOT NULL,
    "citizen_id" VARCHAR(13) NOT NULL,
    "prefix" VARCHAR(50),
    "first_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "organization" VARCHAR(255),
    "book_location" TEXT,
    "book_date" DATE,
    "officer_type" VARCHAR(20),
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
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "submission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "submission_citizen_id_key" ON "submission"("citizen_id");
