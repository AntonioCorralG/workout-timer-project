import { render, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom'
import Button from '../components/generic/Button';

describe('Button', () => {
    it('renders correctly', () => {
        render(
            <Button
                type="button"
                height={40}
                width={100}
                onClick={() => { }}
            >
                Test Button
            </Button>
        );

        expect(screen.getByText('Test Button')).toBeInTheDocument();
    });

    it('handles click events', () => {
        const handleClick = jest.fn();

        render(
            <Button
                type="button"
                height={40}
                width={100}
                onClick={handleClick}
            >
                Test Button
            </Button>
        );

        fireEvent.click(screen.getByText('Test Button'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('is keyboard accessible', () => {
        const handleClick = jest.fn();

        render(
            <Button
                type="button"
                height={40}
                width={100}
                onClick={handleClick}
            >
                Test Button
            </Button>
        );

        const button = screen.getByText('Test Button');
        button.focus();
        fireEvent.keyDown(button, { key: 'Enter' });
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});

