import { render, screen } from '@testing-library/react';
import ProductImageGallery from '../../src/components/ProductImageGallery';

describe('ProductImageGallery', () => {
    it('should render an empty DOM if imageUrls list is empty', () => {
        const imgUrls: string [] = [];
        const {container} = render(<ProductImageGallery imageUrls={imgUrls}/>);
        expect(container).toBeEmptyDOMElement();
    });

    it('should render a list of images if imageUrls list is not empty', () => {
        const imgUrls: string [] = ['https://www.google.com', 'https://www.yahoo.com'];
        render(<ProductImageGallery imageUrls={imgUrls}/>);
        const images = screen.getAllByRole('img');
        expect(images.length).toBe(imgUrls.length);
        images.forEach((imgComponent, idx) => {
            expect(imgComponent).toHaveAttribute('src', imgUrls[idx]);
        });
    });

});