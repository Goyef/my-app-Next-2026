-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Subscription" (
    "id_subscription" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3) NOT NULL,
    "stripe_session_id" TEXT,
    "stripe_price_id" TEXT,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id_subscription")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripe_session_id_key" ON "Subscription"("stripe_session_id");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;
