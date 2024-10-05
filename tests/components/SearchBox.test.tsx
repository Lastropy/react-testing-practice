import { render, screen } from "@testing-library/react";
import SearchBox from "../../src/components/SearchBox";
import userEvent, { UserEvent } from "@testing-library/user-event";

describe('SearchBox', () => {
    let mockOnChange: (text: string) => void;
    let textBox: HTMLElement;
    let user: UserEvent;
    let typedContent: string;
    beforeEach(() => {
        mockOnChange = vi.fn().mockImplementation((txt) => {txt});
        render(<SearchBox onChange={mockOnChange} />);
        textBox = screen.getByPlaceholderText(/Search/i);
        user = userEvent.setup();
        typedContent = 'My Name is Shivam';
    });

    it('should render the text box on initial render', () => {
        expect(textBox).toBeInTheDocument();
    });

    it('should show the search box content as the text entered', async () => {
        await user.type(textBox, typedContent);
        expect(mockOnChange).not.toHaveBeenCalled();
        expect(textBox).toHaveDisplayValue(typedContent);
    });
    it('should call the onChange prop function, when enter is pressed', async () => {
        await user.type(textBox,`${typedContent}{enter}`);
        expect(mockOnChange).toHaveBeenCalledWith(typedContent);
    });
});