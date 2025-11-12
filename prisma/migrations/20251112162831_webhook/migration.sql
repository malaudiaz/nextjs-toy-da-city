-- CreateTable
CREATE TABLE "WebhookError" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT,
    "errorType" TEXT NOT NULL,
    "errorMessage" TEXT NOT NULL,
    "payload" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookError_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WebhookError_clerkId_idx" ON "WebhookError"("clerkId");

-- CreateIndex
CREATE INDEX "WebhookError_createdAt_idx" ON "WebhookError"("createdAt");
