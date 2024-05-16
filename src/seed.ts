import { db } from "./db";
import * as schema from "./schema";

await db.insert(schema.products).values([
	{
		name: "The Matrix",
		description: "something??",
		sku: 123,
		type: 1,
	},
	{
		name: "The Matrix Reloaded",
		description: "something??",
		sku: 23,
		type: 1,
	},
	{
		name: "The Matrix Revolutions",
		description: "something??",
		sku: 13,
		type: 1,
	},
]);

console.log(`Seeding complete.`);
