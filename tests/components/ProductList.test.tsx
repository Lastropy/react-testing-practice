import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import ProductList from "../../src/components/ProductList";
import { server } from "../mocks/server";
import { delay, http, HttpResponse } from "msw";
import { db } from "../mocks/db";
import { QueryClient, QueryClientProvider } from "react-query";

// mock stderr during these tests, to keep console clean
vi.spyOn(console, "error").mockImplementation(() => {});

describe("ProductList", () => {
	const productIds = [] as number[];
	beforeAll(() => {
		// Create 3 dummy products in our mock db, for testing
		for (let i = 0; i < 3; i += 1) {
			const product = db.product.create();
			productIds.push(product.id);
		}
	});

	const renderComponent = () => {
		// Since we don't want retries during testing
		const queryClient = new QueryClient({
			defaultOptions: {
				queries: {
					retry: false,
				},
			},
		});

		// wrapping in query client provider, for access to react query
		render(
			<QueryClientProvider client={queryClient}>
				<ProductList />
			</QueryClientProvider>
		);
	};

	afterAll(() => {
		for (let i = 0; i < productIds.length; i += 1) {
			db.product.deleteMany({ where: { id: { in: productIds } } });
		}
	});

	it("should render the list of items once fetched", async () => {
		renderComponent();
		const listItems = await screen.findAllByRole("listitem");
		expect(listItems.length).toBeGreaterThan(0);
	});

	it("should render No Products found if list of Items is empty", async () => {
		server.use(
			http.get("/products", () => {
				return HttpResponse.json([]);
			})
		);
		renderComponent();
		const noItemsMessage = await screen.findByText(/no products/i);
		expect(noItemsMessage).toBeInTheDocument();
	});

	it("should render an error message when there is an error", async () => {
		server.use(
			http.get("/products", () => {
				return HttpResponse.error();
			})
		);
		renderComponent();
		const error = await screen.findByText(/error/i);
		expect(error).toBeInTheDocument();
	});

	it("should show loading indicator when data is being fetched", async () => {
		server.use(
			http.get("/products", async () => {
				await delay();
				return HttpResponse.json([]);
			})
		);

		renderComponent();
		const loadingIndicator = await screen.findByText(/loading/i);
		expect(loadingIndicator).toBeInTheDocument();
	});

	it("should remove loading indicator when data is fetched", async () => {
		renderComponent();
		await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
	});

	it("should remove loading indicator when data fetching fails", async () => {
		server.use(
			http.get("/products", () => {
				return HttpResponse.error();
			})
		);
		renderComponent();
		await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
	});
});
