import { render, screen } from "@testing-library/react";
import ToastDemo from "../../src/components/ToastDemo";
import userEvent from "@testing-library/user-event";
import { Toaster } from "react-hot-toast";

describe("ToastDemo", () => {
	it("should show a toast component when clicking the show toast button", async () => {
		render(
			<>
				<ToastDemo />
				<Toaster />
			</>
		);
		const btn = screen.getByRole("button");
		expect(btn).toBeInTheDocument();
		expect(btn).toHaveTextContent(/show toast/i);
		const user = userEvent.setup();
		await user.click(btn);
		const toastElement = await screen.findByText(/success/i);
		expect(toastElement).toBeInTheDocument();
	});
});
