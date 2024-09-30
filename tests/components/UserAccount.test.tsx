import { render, screen } from "@testing-library/react";
import UserAccount from "../../src/components/UserAccount";
import { User } from "../../src/entities";

describe('UserAccount', () => {
    it('should return User Profile in the header and User Name', () => {
        const demoUser: User = {id: 1, name: 'Shivam'};
        render(<UserAccount user={demoUser}/>);
        expect(screen.getByText(demoUser.name)).toBeInTheDocument();
    });

    it('should not render Edit Button, if not admin', async () => {
        const demoUser: User = {id: 1, name: 'Shivam'};
        render(<UserAccount user={demoUser}/>);
        // getByRole with throw an error, so we use queryByRole => returns null if element not found
        const button = await screen.queryByRole('button');
        expect(button).not.toBeInTheDocument();
    });

    it('should render Edit Button, if admin', () => {
        const demoUser: User = {id: 1, name: 'Shivam', isAdmin: true};
        render(<UserAccount user={demoUser}/>);
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent(/edit/i);
    });
});