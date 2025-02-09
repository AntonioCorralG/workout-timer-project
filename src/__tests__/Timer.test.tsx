import { render, screen } from '@testing-library/react';
import { TimerProvider } from '../context/TimerContext';
import Stopwatch from '../components/timers/Stopwatch';

describe('Stopwatch', () => {
    it('renders correctly', () => {
        render(
            <TimerProvider>
                <Stopwatch id="test-id" />
            </TimerProvider>
        );

        expect(screen.getByRole('timer')).toBeInTheDocument();
    });
});
