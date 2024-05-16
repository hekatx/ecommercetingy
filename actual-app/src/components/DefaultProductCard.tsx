import { Action, CartProduct, Product } from "@/types";
import {
	productsApi,
	store,
	useAddToCartMutation,
	useDeleteFromCartMutation,
} from "@/store";
import { InputNumberControls } from "./InputNumberControls";
import { Card } from "./ui/card";
import { useCallback } from "react";

type ErrorHandler = (e: Error) => void;

export function DefaultProductCard({ name, id, type, ...props }: Product) {
	const { updateQuantity } = useProductCardHandlers(id);
	const quantity = props.cart_product?.quantity ?? 0;

	return (
		<Card className="relative h-64 flex flex-col justify-between gap-3 p-3 overflow-hidden text-center">
			<img
				src="https://picsum.photos/200"
				className="h-20 object-cover w-auto"
			/>
			<p>{name}</p>
			<InputNumberControls
				id={id}
				quantity={quantity}
				updateQuantity={updateQuantity}
				max={999}
			/>
		</Card>
	);
}

function updateProductQuantityCache(id: number, quantity: number) {
	const updateProductQuantityAction = productsApi.util.updateQueryData(
		"getProducts",
		undefined,
		(draft) => {
			const index = draft.findIndex((product) => product.id === id);
			if (index === -1) return;
			const product = draft[index];
			if (!product.cart_product) {
				product.cart_product = {} as CartProduct;
			}

			product.cart_product.quantity = quantity;
		},
	);

	const patches = store.dispatch(updateProductQuantityAction);

	return patches;
}

function useProductCardHandlers(id: number) {
	const [updateProduct] = useAddToCartMutation();
	const [deleteProduct] = useDeleteFromCartMutation();

	function handleUpdate(newQuantity: number, handleError: ErrorHandler) {
		const patches = updateProductQuantityCache(id, newQuantity);
		updateProduct({ id, quantity: newQuantity })
			.unwrap()
			.catch((e) => {
				handleError(e);
				patches.undo();
			});
	}

	function handleDelete(handleError: ErrorHandler) {
		const patches = updateProductQuantityCache(id, 0);
		deleteProduct({ id })
			.unwrap()
			.catch((e) => {
				handleError(e);
				patches.undo();
			});
	}

	const updateQuantity = useCallback((
    newQuantity: number,
    action: Action,
    handleError: ErrorHandler,
  ) => {
    if (action === "delete") {
      handleDelete(handleError);
    }

    if (action === "update") {
      handleUpdate(newQuantity, handleError);
    }
  }, []);

	return { updateQuantity };
}
