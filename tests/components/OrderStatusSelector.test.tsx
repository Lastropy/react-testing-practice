import { render, screen } from "@testing-library/react";
import OrderStatusSelector from "../../src/components/OrderStatusSelector";
import { Theme } from "@radix-ui/themes";
import userEvent from "@testing-library/user-event";

describe("OrderStatusSelector", () => {
	const allOptions = ["fulfilled", "processed", "new"];
	const renderDropdown = async () => {
		const mockOnChange = vi.fn().mockImplementation((txt) => {
			txt;
		});

		render(
			<Theme>
				<OrderStatusSelector onChange={mockOnChange} />
			</Theme>
		);

		return {
			button: screen.getByRole("combobox"),
			user: userEvent.setup(),
			mockOnChange,
			getAllOptions: async () => await screen.findAllByRole("option"),
		};
	};

	it("should have 'new' selected as default dropdown option", async () => {
		const { button } = await renderDropdown();
		expect(button).toBeInTheDocument();
		expect(button).toHaveTextContent("New");
	});

	it("should have all the dropdown options in the dropdown component", async () => {
		const { button, user, getAllOptions } = await renderDropdown();
		await user.click(button);
		const dropDownOptions = (await getAllOptions()).map((option) =>
			option.textContent?.toLowerCase()
		);
		expect(dropDownOptions).toHaveLength(3);
		dropDownOptions.forEach((option) => {
			expect(allOptions.includes(option ?? "")).toBe(true);
		});
	});

	it.each([{ Option: "processed" }, { Option: "fulfilled" }])(
		"should call onChange with $Option when $Option is selected",
		async ({ Option }) => {
			const { button, user, mockOnChange } = await renderDropdown();
			await user.click(button);

			const optionDropdown = await screen.findByRole("option", { name: RegExp(Option, "i") });
			await user.click(optionDropdown);
			expect(mockOnChange).toHaveBeenCalledWith(Option);
		}
	);

	it("should call onChange with New when New is selected after some other selection", async () => {
		const { button, user, mockOnChange } = await renderDropdown();
		await user.click(button);

		let optionDropdown = await screen.findByRole("option", { name: RegExp("processed", "i") });
		await user.click(optionDropdown);

		await user.click(button);
		optionDropdown = await screen.findByRole("option", { name: RegExp("new", "i") });
		await user.click(optionDropdown);

		expect(mockOnChange).toHaveBeenCalledWith("new");
	});
});
