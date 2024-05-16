import "./App.css";
import { useGetProductsQuery } from "./store";
import { Toaster } from "sonner";
import { DefaultProductCard } from "./components/DefaultProductCard";
import {
	Link,
	Outlet,
	RouterProvider,
	createBrowserRouter,
} from "react-router-dom";
import {
	NavigationMenu,
	NavigationMenuList,
	NavigationMenuItem,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Card } from "./components/ui/card";
import { Cart } from "./features/Cart/Cart";

const router = createBrowserRouter([
	{
		element: <Layout />,
		children: [
			{
				path: "/",
				element: <Home />,
			},
			{
				path: "/cart",
				element: <Cart />,
			},
			{
				path: "/checkout",
				element: <Home />,
			},
		],
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

function Home() {
	const productsQuery = useGetProductsQuery();
	const products = productsQuery.data ?? [];

	return (
		<Card className="grid gap-2 grid-cols-5 h-screen w-full bg-slate-50 p-6">
			{products.map((product) => (
				<DefaultProductCard {...product} key={product.id} />
			))}
		</Card>
	);
}

function Layout() {
	return (
		<section className="space-y-3">
			<Card className="p-1">
				<NavigationMenu>
					<NavigationMenuList>
						<NavigationMenuItem
							className={navigationMenuTriggerStyle()}
							asChild
						>
							<Link to="/">Home</Link>
						</NavigationMenuItem>
						<NavigationMenuItem
							className={navigationMenuTriggerStyle()}
							asChild
						>
							<Link to="/cart">Cart</Link>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>
			</Card>
			<Toaster />
			<Outlet />
		</section>
	);
}

export default App;
