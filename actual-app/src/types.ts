import { ReactNode } from "react";

export type Product = {
	id: number;
	type: number | null;
	name: string | null;
	description: string | null;
	sku: number | null;
	created_at: string | null;
	updated_at: string | null;
	cart_product: CartProduct | null;
};

export type CartProduct = {
	id: number;
	created_at: string | null;
	updated_at: string | null;
	cart_id: number;
	product_id: number;
	quantity: number;
};

export interface ChildrenProp {
	children: ReactNode;
}

export type Action = "delete" | "update";
