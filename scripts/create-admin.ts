/**
 * Yalnızca admin kullanıcısı oluşturur/günceller (içeriği silmez).
 *
 *   $env:TURSO_DATABASE_URL="libsql://..."
 *   $env:TURSO_AUTH_TOKEN="..."
 *   $env:ADMIN_EMAIL="merictuncel@gmail.com"
 *   $env:ADMIN_PASSWORD="GucluSifre"
 *   npm run db:create-admin
 */
import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { hash } from "bcryptjs";

function createPrisma() {
  const tursoUrl = process.env.TURSO_DATABASE_URL?.trim();
  const tursoToken = process.env.TURSO_AUTH_TOKEN?.trim();
  if (tursoUrl?.startsWith("libsql://")) {
    return new PrismaClient({
      adapter: new PrismaLibSQL({ url: tursoUrl, authToken: tursoToken }),
    });
  }
  return new PrismaClient();
}

const prisma = createPrisma();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD?.trim();
  if (!email || !password) {
    throw new Error("ADMIN_EMAIL ve ADMIN_PASSWORD zorunludur.");
  }
  if (password.length < 8) {
    throw new Error("Şifre en az 8 karakter olmalıdır.");
  }

  const passwordHash = await hash(password, 12);
  await prisma.user.upsert({
    where: { email },
    update: { password: passwordHash, name: "Site Yöneticisi" },
    create: { email, password: passwordHash, name: "Site Yöneticisi" },
  });

  console.log("Admin hazır:", email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
