-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NanoIds" (
    "id" TEXT NOT NULL,
    "nano_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NanoIds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Analytics" (
    "id" TEXT NOT NULL,
    "time_stamps" TEXT NOT NULL,
    "region" TEXT NOT NULL DEFAULT '',
    "country" TEXT NOT NULL DEFAULT '',
    "nano_id" TEXT NOT NULL,
    "device_model" TEXT NOT NULL DEFAULT '',
    "ip_address" TEXT NOT NULL DEFAULT '',
    "browser_name" TEXT NOT NULL DEFAULT '',
    "device_vendor" TEXT NOT NULL DEFAULT '',
    "browser_version" TEXT NOT NULL DEFAULT '',
    "browser_major" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Analytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "NanoIds_nano_id_key" ON "NanoIds"("nano_id");

-- AddForeignKey
ALTER TABLE "NanoIds" ADD CONSTRAINT "NanoIds_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analytics" ADD CONSTRAINT "Analytics_nano_id_fkey" FOREIGN KEY ("nano_id") REFERENCES "NanoIds"("nano_id") ON DELETE RESTRICT ON UPDATE CASCADE;
