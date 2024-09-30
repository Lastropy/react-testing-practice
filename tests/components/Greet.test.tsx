import { render, screen } from '@testing-library/react';
import Greet from '../../src/components/Greet';

describe('Greet', () => {
    it('should render name in the heading when name is provided', () => {
        // Renders our Component in the virtual dom (JSDOM)
        render(<Greet name="Shivam" />);
        // See the rendered component on the vitest-ui
        screen.debug();
        // Grab a portion of the rendered component
        const heading = screen.getByRole('heading');
        // Assertion matchers => jest-dom
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveTextContent(/shivam/i);
    });

    it('should render a login button when name is not provided', () => {
        render(<Greet name="" />);
        // Grab a portion of the rendered component
        const button = screen.getByRole('button');
        // Assertion matchers => jest-dom
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent(/login/i);
    })
})

