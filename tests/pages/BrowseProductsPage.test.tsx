import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import BrowseProducts from "../../src/pages/BrowseProductsPage";
import { Theme } from "@radix-ui/themes";
import { db } from "../mocks/db";
import { CartProvider } from "../../src/providers/CartProvider";
import userEvent from "@testing-library/user-event";
import { Category, Product } from "../../src/entities";
import { simulateDataFetchingFail, simulateDelay } from "../utils";

describe("BrowseProducts", () => {
	const products = [] as Product[];
	const categories = [] as Category[];
	beforeAll(() => {
		db.product.deleteMany({ where: { id: { in: db.product.getAll().map((ele) => ele.id) } } });
		db.category.deleteMany({ where: { id: { in: db.category.getAll().map((ele) => ele.id) } } });
		for (let i = 0; i < 5; i += 1) {
			const product = db.product.create({ name: `Product ${i + 1}` });
			products.push(product);
			if (db.category.findFirst({ where: { id: { equals: product.categoryId } } }) === null) {
				categories.push(
					db.category.create({ id: product.categoryId, name: `Category ${i + 1}` })
				);
			}
		}
	});

	afterAll(() => {
		db.product.deleteMany({ where: { id: { in: products.map((p) => p.id) } } });
		db.category.deleteMany({ where: { id: { in: categories.map((c) => c.id) } } });
	});

	const renderComponent = () => {
		render(
			<Theme>
				<CartProvider>
					<BrowseProducts />
				</CartProvider>
			</Theme>
		);

		return {
			getProductsLoadingBar: () =>
				screen.queryByRole("progressbar", { name: "loading products" }),
			getCategoriesLoadingBar: () =>
				screen.queryByRole("progressbar", { name: "loading categories" }),
			getCategoriesDropdown: () => screen.queryByRole("combobox"),
		};
	};

	it("should show loading indicator when categories data is loading", () => {
		simulateDelay("/categories");
		const { getCategoriesLoadingBar } = renderComponent();
		expect(getCategoriesLoadingBar()).toBeInTheDocument();
	});

	it("should should loading indicator when products data is loading", () => {
		simulateDelay("/products");
		const { getProductsLoadingBar } = renderComponent();
		expect(getProductsLoadingBar()).toBeInTheDocument();
	});

	it("should remove loading indicator when categories data is loaded", async () => {
		const { getCategoriesLoadingBar } = renderComponent();
		await waitForElementToBeRemoved(getCategoriesLoadingBar);
	});

	it("should remove loading indicator when products data is loaded", async () => {
		const { getProductsLoadingBar } = renderComponent();
		await waitForElementToBeRemoved(getProductsLoadingBar);
	});

	it("should not show Error indicator and dropdown when categories data fetch fails", async () => {
		simulateDataFetchingFail("/categories");
		const { getCategoriesLoadingBar, getCategoriesDropdown } = renderComponent();
		await waitForElementToBeRemoved(getCategoriesLoadingBar);
		const err = screen.queryByText(/error/i);
		expect(err).not.toBeInTheDocument();
		const dropdown = getCategoriesDropdown();
		expect(dropdown).not.toBeInTheDocument();
	});

	it("should show Error indicator when products data fetch fails", async () => {
		simulateDataFetchingFail("/products");
		renderComponent();
		const err = await screen.findByText(/error/i);
		expect(err).toBeInTheDocument();
	});

	it("should show Error indicator when categories & products data fetch fails", async () => {
		simulateDataFetchingFail("/categories");
		simulateDataFetchingFail("/products");
		renderComponent();
		const err = await screen.findByText(/error/i);
		expect(err).toBeInTheDocument();
	});

	it("should render categories", async () => {
		const { getCategoriesLoadingBar, getCategoriesDropdown } = renderComponent();
		await waitForElementToBeRemoved(getCategoriesLoadingBar);
		const dropdown = getCategoriesDropdown();
		expect(dropdown).toBeInTheDocument();
		const user = userEvent.setup();
		await user.click(dropdown!);
		const categoriesOptions = await screen.findAllByRole("option");
		expect(categoriesOptions).toHaveLength(categories.length + 1);
		expect(categoriesOptions[0]).toHaveTextContent(/all/i);
		for (let i = 1; i < categoriesOptions.length; i += 1) {
			expect(categoriesOptions[i]).toHaveTextContent(categories[i - 1].name);
		}
	});

	it("should render products", async () => {
		const { getProductsLoadingBar } = renderComponent();
		await waitForElementToBeRemoved(getProductsLoadingBar);
		products.forEach((product) => {
			expect(screen.getByText(product.name)).toBeInTheDocument();
			expect(screen.getByText(new RegExp("" + product.price))).toBeInTheDocument();
		});
	});
});
