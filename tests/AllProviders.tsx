import { Theme } from "@radix-ui/themes";
import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { CartProvider } from "../src/providers/CartProvider";

const AllProviders = ({ children }: PropsWithChildren) => {
	// Since we don't want retries during testing
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});

	// wrapping in query client provider, for access to react query
	return (
		<QueryClientProvider client={queryClient}>
			<Theme>
				<CartProvider>{children} </CartProvider>
			</Theme>
		</QueryClientProvider>
	);
};

export default AllProviders;
