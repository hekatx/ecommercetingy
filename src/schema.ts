import {
	InferInsertModel,
	InferSelectModel,
	relations,
	sql,
} from "drizzle-orm";
import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

const common_fields = {
	created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
	updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
};

export const products = sqliteTable("products", {
	id: integer("id").primaryKey(),
	name: text("name"),
	description: text("description"),
	sku: integer("sku"),
	type: integer("type"),
	...common_fields,
});

export const cart = sqliteTable("cart", {
	id: integer("id").primaryKey(),
	total: integer("total").default(0),
	...common_fields,
});

export const cart_product = sqliteTable(
	"cart_product",
	{
		id: integer("id").primaryKey(),
		cart_id: integer("cart_id")
			.notNull()
			.references(() => cart.id),
		product_id: integer("product_id")
			.notNull()
			.references(() => products.id),
		quantity: integer("quantity").notNull().default(1),
		...common_fields,
	},
	(t) => ({
		cartProductUnq: unique().on(t.cart_id, t.product_id),
	}),
);

export const order_product = sqliteTable("order_product", {
	id: integer("id").primaryKey(),
	order_id: integer("order_id")
		.notNull()
		.references(() => order_detail.id),
	product_id: integer("product_id")
		.notNull()
		.references(() => products.id),
	quantity: integer("quantity").default(1),
	...common_fields,
});

export const order_detail = sqliteTable("order_detail", {
	id: integer("id").primaryKey(),
	total: integer("total"),
	payment_method: text("payment_method").notNull(),
	...common_fields,
});

export const cart_product_relations = relations(cart_product, ({ one }) => ({
	product: one(products, {
		fields: [cart_product.product_id],
		references: [products.id],
	}),
}));

export const order_product_relations = relations(order_product, ({ one }) => ({
	product: one(products, {
		fields: [order_product.product_id],
		references: [products.id],
	}),
}));

export const cart_relations = relations(cart, ({ many }) => ({
	cart_products: many(cart_product),
}));

export const cart_products_relations = relations(cart_product, ({ one }) => ({
	cart: one(cart, { fields: [cart_product.cart_id], references: [cart.id] }),
}));

export const product_cart_product_relations = relations(
	products,
	({ one }) => ({
		cart_product: one(cart_product),
	}),
);

export type SelectProduct = InferSelectModel<typeof products>;
export type InsertProduct = InferInsertModel<typeof products>;

export type SelectCart = InferSelectModel<typeof cart>;
export type InsertCart = InferInsertModel<typeof cart>;

export type SelectCartProduct = InferSelectModel<typeof cart_product>;
export type InsertCartProduct = InferInsertModel<typeof cart_product>;

export type SelectOrderDetail = InferSelectModel<typeof order_detail>;
export type InsertOrderDetail = InferInsertModel<typeof order_detail>;

export type SelectOrderProduct = InferSelectModel<typeof order_product>;
export type InsertOrderProduct = InferInsertModel<typeof order_product>;
