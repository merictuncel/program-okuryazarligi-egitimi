/**
 * Yerel migration SQL dosyalarını Turso veritabanına uygular.
 *
 * Kullanım:
 *   TURSO_DATABASE_URL=libsql://... TURSO_AUTH_TOKEN=... npm run db:turso-migrate
 */
import { createClient } from "@libsql/client";
import { readdir, readFile } from "fs/promises";
import path from "path";

async function main() {
  const url = process.env.TURSO_DATABASE_URL?.trim();
  const authToken = process.env.TURSO_AUTH_TOKEN?.trim();

  if (!url || !url.startsWith("libsql://")) {
    throw new Error("TURSO_DATABASE_URL (libsql://...) gerekli.");
  }

  const client = createClient({ url, authToken });
  const migrationsDir = path.join(process.cwd(), "prisma", "migrations");
  const entries = (await readdir(migrationsDir, { withFileTypes: true }))
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

  console.log(`Turso'ya ${entries.length} migration uygulanacak...`);

  for (const name of entries) {
    const sqlPath = path.join(migrationsDir, name, "migration.sql");
    const sql = await readFile(sqlPath, "utf8");
    const statements = sql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    console.log(`→ ${name} (${statements.length} ifade)`);
    for (const statement of statements) {
      try {
        await client.execute(statement);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        // Tekrar çalıştırmada "already exists" toleransı
        if (/already exists|duplicate/i.test(message)) {
          console.log(`  (atlandı) ${message}`);
          continue;
        }
        throw error;
      }
    }
  }

  console.log("Turso migration tamamlandı.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
