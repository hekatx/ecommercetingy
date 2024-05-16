import { Card } from "@/components/ui/card";
import { currencyFormatter } from "@/helpers/currency";
import { ChildrenProp } from "@/types";

export function Checkout({ children }: ChildrenProp) {
	return <Card className="grid grid-cols-[75%_1fr]">{children}</Card>;
}

type Field = { name: string; value: string };

function Summary({
	fields,
}: {
	fields: Field[];
}) {
	return (
		<Card>
			<table>
				{fields.map((field) => (
					<Field key={field.name} {...field} />
				))}
			</table>
		</Card>
	);
}

function Field({ name, value }: Field) {
	return (
		<tr>
			<th>{name}</th>
			<td>{value}</td>
		</tr>
	);
}

function Total({ total }: { total: number }) {
	return (
		<Card>
			<h1>Total</h1>
			<span>{currencyFormatter.format(total)}</span>
		</Card>
	);
}
