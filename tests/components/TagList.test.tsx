import { render, screen, waitFor } from "@testing-library/react";
import TagList from "../../src/components/TagList";

// https://www.bam.tech/article/getby-findby-queryby-whats-the-difference
describe('TagList', () => {
    it('should render the tag list correctly', async () => {
        render(<TagList />);

        ////------------ This will fail as list items are fetched from an async function --------------- 
        // const listItems = screen.getAllByRole('listitem');
        // expect(listItems.length).toBeGreaterThan(0);

        // 2 Solutions:

        // 1st solution - waitFor()
        // https://testing-library.com/docs/dom-testing-library/api-async/#waitfor
        // This keeps retrying every 50ms (default), for a total of 1000ms (default)
        // Keeps retrying until callback throws an error (sync callback) OR 
        // Promise is rejected ( async callback )
        // [IMP] Will not retry if the assertion fails
        waitFor(() => {
            const listItems = screen.getAllByRole('listitem');
            expect(listItems.length).toBeGreaterThan(0);
        })

        // 2nd Solution - findBy / findAllBy
        // https://testing-library.com/docs/dom-testing-library/api-async/#findby-queries
        // a combination of getBy queries and waitFor
        const listItems = await screen.findAllByRole('listitem');
        expect(listItems.length).toBeGreaterThan(0);
    })
})