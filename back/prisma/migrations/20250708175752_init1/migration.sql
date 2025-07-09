-- CreateTable
CREATE TABLE "top_wallets" (
    "id" SERIAL NOT NULL,
    "walletAddress" VARCHAR(44) NOT NULL,
    "tokenMint" VARCHAR(44) NOT NULL,
    "tokenQuantity" BIGINT NOT NULL,
    "initialBalanceUi" DOUBLE PRECISION NOT NULL,
    "lastCheckedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "top_wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" SERIAL NOT NULL,
    "signature" VARCHAR(88) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "transactionType" VARCHAR(4) NOT NULL,
    "tokenAmountUi" DOUBLE PRECISION NOT NULL,
    "solAmountUi" DOUBLE PRECISION,
    "protocol" VARCHAR(50),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "walletAddress" VARCHAR(44) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "top_wallets_walletAddress_key" ON "top_wallets"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_signature_key" ON "transactions"("signature");

-- CreateIndex
CREATE INDEX "transactions_walletAddress_idx" ON "transactions"("walletAddress");

-- CreateIndex
CREATE INDEX "transactions_timestamp_idx" ON "transactions"("timestamp");
