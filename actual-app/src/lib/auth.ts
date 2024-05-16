export function getCurrentCountry(
	defaultCountry: "mx" | "pa" | "col" | "gm" | "br",
) {
	return defaultCountry ?? "mx";
}
