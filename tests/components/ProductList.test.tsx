import { render, screen } from "@testing-library/react";
import ProductList from "../../src/components/ProductList";
import { server } from "../mocks/server";
import { http, HttpResponse } from "msw";
import { db } from "../mocks/db";

describe("ProductList", () => {
	const productIds = [] as number[];
	beforeAll(() => {
		// Create 3 dummy products in our mock db, for testing
		for (let i = 0; i < 3; i += 1) {
			const product = db.product.create();
			productIds.push(product.id);
		}
	});

	afterAll(() => {
		for (let i = 0; i < productIds.length; i += 1) {
			db.product.deleteMany({ where: { id: { in: productIds } } });
		}
	});

	it("should render the list of items once fetched", async () => {
		render(<ProductList />);
		const listItems = await screen.findAllByRole("listitem");
		expect(listItems.length).toBeGreaterThan(0);
	});

	it("should render No Products found if list of Items is empty", async () => {
		server.use(
			http.get("/products", () => {
				return HttpResponse.json([]);
			})
		);
		render(<ProductList />);
		const noItemsMessage = await screen.findByText(/no products/i);
		expect(noItemsMessage).toBeInTheDocument();
	});

	it("should render an error message when there is an error", async () => {
		server.use(
			http.get("/products", () => {
				return HttpResponse.error();
			})
		);
		render(<ProductList />);
		const error = await screen.findByText(/error/i);
		expect(error).toBeInTheDocument();
	});
});
