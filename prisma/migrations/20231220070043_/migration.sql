-- CreateTable
CREATE TABLE "AIAssistant" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productIntegrationId" TEXT NOT NULL,

    CONSTRAINT "AIAssistant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AIAssistant" ADD CONSTRAINT "AIAssistant_productIntegrationId_fkey" FOREIGN KEY ("productIntegrationId") REFERENCES "ProductIntegration"("id") ON DELETE CASCADE ON UPDATE CASCADE;
