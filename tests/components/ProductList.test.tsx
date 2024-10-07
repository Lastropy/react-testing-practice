import { render, screen } from "@testing-library/react";
import ProductList from "../../src/components/ProductList";
import { server } from "../mocks/server";
import { http, HttpResponse } from "msw";

describe("ProductList", () => {
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
});
