import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

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
	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default AllProviders;
