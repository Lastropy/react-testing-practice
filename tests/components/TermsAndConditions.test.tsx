import { render, screen } from '@testing-library/react';
import TermsAndConditions from '../../src/components/TermsAndConditions';
import userEvent from '@testing-library/user-event';

describe('TermsAndConditions', () => {
    const renderComponent = () => {
        render(<TermsAndConditions />);
        return {
            heading: screen.getByRole('heading'),
            checkbox: screen.getByRole('checkbox'),
            button: screen.getByRole('button', {'name': /submit/i})
        };
    }
    it('should render with correct text and initial state', () => {
        const {heading, button, checkbox} = renderComponent();
        
        expect(heading).toHaveTextContent(/Terms & Conditions/i);
        expect(checkbox).not.toBeChecked();
        expect(button).toBeDisabled();
    });

    // Checking User Interactions 
    it('should enable the button when user checks the checkbox', async () => {
        const { button, checkbox} = renderComponent();
        // Setup a new user
        const user = userEvent.setup();
        await user.click(checkbox);
        expect(checkbox).toBeChecked();
        expect(button).toBeEnabled();
    });
})