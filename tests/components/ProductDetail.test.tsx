import { render, screen } from "@testing-library/react";
import ProductDetail from "../../src/components/ProductDetail";
import { server } from "../mocks/server";
import { http, HttpResponse } from "msw";
import { productsList } from "../mocks/data";

describe("ProductDetail", () => {
	it("should render Product if fetched successfully", async () => {
		const product = productsList.find((p) => p.id === 1)!;
		expect(product).toBeDefined();
		render(<ProductDetail productId={1} />);
		const name = await screen.findByText(new RegExp(product.name));
		expect(name).toBeInTheDocument();
		const price = await screen.findByText(new RegExp(product.price));
		expect(price).toBeInTheDocument();
	});

	it("should render Product not found if product id is not found", async () => {
		server.use(
			http.get("/products/7", () => {
				return HttpResponse.json();
			})
		);
		render(<ProductDetail productId={7} />);
		const error = await screen.findByText(/error/i);
		expect(error).toBeInTheDocument();
	});

	it("should render Error if parsing error on response from backend", async () => {
		render(<ProductDetail productId={7} />);
		const notFound = await screen.findByText(/not found/i);
		expect(notFound).toBeInTheDocument();
	});
});
