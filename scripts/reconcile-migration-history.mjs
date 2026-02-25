import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { Client } from "pg";

const MIGRATION_NAME = "20260219000002_cart_item_unique_cart_product";

const client = new Client({ connectionString: process.env.DATABASE_URL });

try {
  await client.connect();

  const rowRes = await client.query(
    'SELECT * FROM "_prisma_migrations" WHERE migration_name = $1',
    [MIGRATION_NAME],
  );

  if (rowRes.rowCount === 0) {
    console.log("No matching migration row found. Nothing changed.");
    process.exit(0);
  }

  const backupPath = path.resolve("prisma", "migrations", "_backup_db_only_migration_row.json");
  fs.writeFileSync(backupPath, JSON.stringify(rowRes.rows, null, 2));
  console.log(`Backed up ${rowRes.rowCount} row(s) to: ${backupPath}`);

  const deleteRes = await client.query(
    'DELETE FROM "_prisma_migrations" WHERE migration_name = $1',
    [MIGRATION_NAME],
  );

  console.log(`Deleted ${deleteRes.rowCount} row(s) from _prisma_migrations for ${MIGRATION_NAME}.`);
} catch (error) {
  console.error(error);
  process.exit(1);
} finally {
  await client.end();
}
