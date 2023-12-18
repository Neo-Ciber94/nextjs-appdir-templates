import { drizzle } from "drizzle-orm/mysql2";
import { createPool } from "mysql2/promise";
import * as schema from "./schema";

export const pool = createPool({
  uri: process.env.DATABASE_URL!,
});

export const db = drizzle(pool, { schema, mode: "default" });
