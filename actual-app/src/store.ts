import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { CartProduct, Product } from "./types";
import { configureStore } from "@reduxjs/toolkit";
// Or from '@reduxjs/toolkit/query/react'
import { setupListeners } from "@reduxjs/toolkit/query";

// Define a service using a base URL and expected endpoints
export const api = createApi({
	reducerPath: "api",
	baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
	tagTypes: ["Products", "Cart"],
	endpoints: (_builder) => ({}),
});

type result = {
	id: number;
	payment_method: "credit" | "cash";
	products: Product[];
	total: number;
};

export const productsApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getProducts: builder.query<Product[], void>({
			query: () => "/products",
			keepUnusedDataFor: 0,
		}),
		getCart: builder.query<unknown, void>({
			query: () => "/cart",
			providesTags: ["Cart"],
		}),
		addToCart: builder.mutation<Product, Pick<CartProduct, "id" | "quantity">>({
			query: (body) => ({
				url: "/cart",
				method: "POST",
				body,
			}),
			invalidatesTags: ["Products", "Cart"],
		}),
		deleteFromCart: builder.mutation<Product, Pick<CartProduct, "id">>({
			query: (body) => ({
				url: "/cart",
				method: "DELETE",
				body,
			}),
			invalidatesTags: ["Products", "Cart"],
		}),
		checkout: builder.mutation<
			result,
			Pick<result, "total" | "payment_method"> & {
				id: number;
				quantity: number;
			}
		>({
			query: (body) => ({
				url: "/checkout",
				method: "POST",
				body,
			}),
			invalidatesTags: ["Cart", "Products"],
		}),
	}),
});

export const {
	useGetProductsQuery,
	useAddToCartMutation,
	useDeleteFromCartMutation,
	useCheckoutMutation,
	useGetCartQuery,
} = productsApi;

export const store = configureStore({
	reducer: {
		[api.reducerPath]: api.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch);
