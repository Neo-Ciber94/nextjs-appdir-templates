import "dotenv/config";
import { migrate } from "drizzle-orm/mysql2/migrator";
import { db, pool } from "./src/lib/db";

async function main() {
  const connection = await pool.getConnection();

  // This will run migrations on the database, skipping the ones already applied
  await migrate(db, { migrationsFolder: "./drizzle" });
  connection.release();
}

main().catch(console.error);
