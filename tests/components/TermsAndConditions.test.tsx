import { render, screen } from '@testing-library/react';
import TermsAndConditions from '../../src/components/TermsAndConditions';
import userEvent from '@testing-library/user-event';

describe('TermsAndConditions', () => {
    it('should render with correct text and initial state', () => {
        render(<TermsAndConditions />);

        const heading = screen.getByRole('heading');
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent(/Terms & Conditions/i);

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeInTheDocument();
        expect(checkbox).not.toBeChecked();

        const button = screen.getByRole('button', {'name': /submit/i});
        expect(button).toBeInTheDocument();
        expect(button).toBeDisabled();
    });

    // Checking User Interactions 
    it('should enable the button when user checks the checkbox', async () => {
        render(<TermsAndConditions />);
        // Setup a new user
        const user = userEvent.setup();
        const checkbox = screen.getByRole('checkbox');

        await user.click(checkbox);
        expect(checkbox).toBeInTheDocument();
        expect(checkbox).toBeChecked();

        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(button).toBeEnabled();
    });
})