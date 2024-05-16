import { CartProduct, Action } from "@/types";
import { toast } from "sonner";
import { Button } from "./ui/button";

interface Props extends Pick<CartProduct, "quantity" | "id"> {
	updateQuantity: (q: number, type: Action, h: (e: Error) => void) => void;
	max: number;
}

export function InputNumberControls({ quantity, updateQuantity, max }: Props) {
	function handleQuantityChange(value: number) {
		const isNegative = value < 0;
		const isAlreadyZero = quantity === 0 && value === 0;
		if (isNegative || isAlreadyZero) return;

		let action: Action = value === 0 ? "delete" : "update";
		const isOverMax = value >= max;
		value = isOverMax ? max : value;

		const handleError = (e: Error) => {
			console.error(e);
			toast.error("An error happened!");
		};

		updateQuantity(value, action, handleError);
	}

	return (
		<fieldset className="flex gap-3 items-center justify-center">
			<Button
				size="sm"
				onClick={() => {
					handleQuantityChange(quantity - 1);
				}}
				variant="destructive"
				disabled={quantity === 0}
			>
				-
			</Button>
			<input
				type="number"
				min="0"
				max={max}
				placeholder="0"
				value={quantity || ""}
				className="w-12 text-center py-1 border rounded-sm"
				onChange={(e) => {
					handleQuantityChange(Number(e.target.value));
				}}
			/>
			<Button
				size="sm"
				onClick={() => handleQuantityChange(quantity + 1)}
				disabled={quantity === max}
			>
				+
			</Button>
		</fieldset>
	);
}
