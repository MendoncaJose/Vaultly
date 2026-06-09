-- AlterTable
ALTER TABLE "price_snapshots" ADD COLUMN     "high" DECIMAL(65,30),
ADD COLUMN     "low" DECIMAL(65,30),
ADD COLUMN     "open" DECIMAL(65,30),
ADD COLUMN     "previousClose" DECIMAL(65,30),
ALTER COLUMN "provider" SET DEFAULT 'FINNHUB',
ALTER COLUMN "currency" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "price_snapshots_symbol_capturedAt_idx" ON "price_snapshots"("symbol", "capturedAt");
