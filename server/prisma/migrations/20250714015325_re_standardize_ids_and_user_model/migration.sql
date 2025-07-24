/*
  Warnings:

  - The primary key for the `Apoio` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Criterio` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Empresa` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ONG` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Prefeitura` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Selo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Apoio" DROP CONSTRAINT "Apoio_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "Apoio" DROP CONSTRAINT "Apoio_ongId_fkey";

-- DropForeignKey
ALTER TABLE "Apoio" DROP CONSTRAINT "Apoio_prefeituraId_fkey";

-- DropForeignKey
ALTER TABLE "Criterio" DROP CONSTRAINT "Criterio_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "Criterio" DROP CONSTRAINT "Criterio_seloId_fkey";

-- DropForeignKey
ALTER TABLE "Empresa" DROP CONSTRAINT "Empresa_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "ONG" DROP CONSTRAINT "ONG_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "Prefeitura" DROP CONSTRAINT "Prefeitura_usuarioId_fkey";

-- AlterTable
ALTER TABLE "Apoio" DROP CONSTRAINT "Apoio_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "empresaId" SET DATA TYPE TEXT,
ALTER COLUMN "ongId" SET DATA TYPE TEXT,
ALTER COLUMN "prefeituraId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Apoio_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Apoio_id_seq";

-- AlterTable
ALTER TABLE "Criterio" DROP CONSTRAINT "Criterio_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "empresaId" SET DATA TYPE TEXT,
ALTER COLUMN "seloId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Criterio_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Criterio_id_seq";

-- AlterTable
ALTER TABLE "Empresa" DROP CONSTRAINT "Empresa_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "usuarioId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Empresa_id_seq";

-- AlterTable
ALTER TABLE "ONG" DROP CONSTRAINT "ONG_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "usuarioId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ONG_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ONG_id_seq";

-- AlterTable
ALTER TABLE "Prefeitura" DROP CONSTRAINT "Prefeitura_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "usuarioId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Prefeitura_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Prefeitura_id_seq";

-- AlterTable
ALTER TABLE "Selo" DROP CONSTRAINT "Selo_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Selo_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Selo_id_seq";

-- DropTable
DROP TABLE "Usuario";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "telefone" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_cnpj_key" ON "User"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "ONG" ADD CONSTRAINT "ONG_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Empresa" ADD CONSTRAINT "Empresa_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prefeitura" ADD CONSTRAINT "Prefeitura_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Apoio" ADD CONSTRAINT "Apoio_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Apoio" ADD CONSTRAINT "Apoio_ongId_fkey" FOREIGN KEY ("ongId") REFERENCES "ONG"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Apoio" ADD CONSTRAINT "Apoio_prefeituraId_fkey" FOREIGN KEY ("prefeituraId") REFERENCES "Prefeitura"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Criterio" ADD CONSTRAINT "Criterio_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Criterio" ADD CONSTRAINT "Criterio_seloId_fkey" FOREIGN KEY ("seloId") REFERENCES "Selo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
