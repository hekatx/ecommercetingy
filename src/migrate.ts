import { migrate } from "drizzle-orm/libsql/migrator";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

const sqlite = createClient({ url: "file:./sqlite.db" });
const db = drizzle(sqlite);

migrate(db, { migrationsFolder: "./drizzle" });
