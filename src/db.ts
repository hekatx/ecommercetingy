import * as schema from "./schema";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const sqlite = createClient({ url: "file:./sqlite.db" });
export const db = drizzle(sqlite, { schema });
