import { render, screen } from "@testing-library/react";
import ProductDetail from "../../src/components/ProductDetail";
import { server } from "../mocks/server";
import { http, HttpResponse } from "msw";
import { db } from "../mocks/db";

describe("ProductDetail", () => {
	let productId: number;
	beforeAll(() => {
		// Create a dummy product in our mock db, for testing
		const { id } = db.product.create();
		productId = id;
	});

	afterAll(() => {
		// Delete the mock product created
		db.product.delete({ where: { id: { equals: productId } } });
	});

	it("should render Product if fetched successfully", async () => {
		const product = db.product.findFirst({ where: { id: { equals: productId } } });
		render(<ProductDetail productId={product!.id} />);
		const name = await screen.findByText(new RegExp(product!.name));
		const price = await screen.findByText(new RegExp(`${product!.price}`));
		expect(name).toBeInTheDocument();
		expect(price).toBeInTheDocument();
	});

	it("should render Error if parsing error on response from backend", async () => {
		server.use(http.get("/product/999", () => HttpResponse.error()));
		render(<ProductDetail productId={0} />);
		const error = await screen.findByText(/error/i);
		expect(error).toBeInTheDocument();
	});

	it("should render Product not found if product id is not found", async () => {
		server.use(
			http.get("/products/999", () => {
				return HttpResponse.json(null);
			})
		);
		render(<ProductDetail productId={999} />);
		const notFound = await screen.findByText(/not found/i);
		expect(notFound).toBeInTheDocument();
	});
});
