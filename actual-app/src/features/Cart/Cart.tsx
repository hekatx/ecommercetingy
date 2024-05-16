import { Card } from "@/components/ui/card";
import { useGetCartQuery } from "@/store";

export function Cart() {
	const cartQuery = useGetCartQuery();

	return (
		<div className="p-6 grid auto-rows-[192px] grid-cols-[1fr_minmax(0%,_392px)] gap-4">
			<Card></Card>
			<Card></Card>
			<Card></Card>
			<Card></Card>
		</div>
	);
}
