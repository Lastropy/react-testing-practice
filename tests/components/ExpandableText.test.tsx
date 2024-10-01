import { render, screen } from "@testing-library/react";
import ExpandableText from "../../src/components/ExpandableText";
import userEvent from "@testing-library/user-event";

describe('ExpandableText', () => {
    it('should render the full text, if it is less than equal to limit', () => {
        const txt = 'a'.repeat(255);
        render(<ExpandableText text={txt}/>);
        const txtBlock = screen.getByText(txt);
        expect(txtBlock).toBeInTheDocument();

    });
    
    it('should render text only till the limit (with ellipsis) and Show More button, if it is more than the limit', () => {
        const txt = 'a'.repeat(256);
        render(<ExpandableText text={txt}/>);
        const txtBlock = screen.queryByText(txt);
        expect(txtBlock).not.toBeInTheDocument();

        const txtBlockShown = screen.queryByText(txt.substring(0,255)+"...");
        expect(txtBlockShown).toBeInTheDocument();

        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent(/more/i);
    });

    it('should render the full text and Show More should become Show less, if Show More button is clicked', async () => {
        const txt = 'a'.repeat(256);
        render(<ExpandableText text={txt}/>);
        const button = screen.getByRole('button');

        const user = userEvent.setup();
        await user.click(button);

        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent(/less/i);
        
        const txtShown = screen.queryByText(txt);
        expect(txtShown).toBeInTheDocument();
    });

    it('should collapse the text, if Show Less button is clicked', async () => {
        const txt = 'a'.repeat(256);
        render(<ExpandableText text={txt}/>);
        const showMoreButton = screen.getByRole('button', {name: /more/i});
        expect(showMoreButton).toBeInTheDocument();
        const user = userEvent.setup();
        await user.click(showMoreButton);

        const showLessButton = screen.getByRole('button', {name: /less/i});
        expect(showLessButton).toBeInTheDocument();
        await user.click(showLessButton);
        
        const txtShown = screen.queryByText(txt);
        expect(txtShown).not.toBeInTheDocument();
    });
});