// views/HistoryView.tsx
import { useEffect, useState } from 'react';
import type { Timer } from '../types/types';
import { formatTime } from '../utils/helpers';
import styled from 'styled-components';

interface CompletedWorkout {
    date: string;
    timers: Timer[];
}

// Styled components for better presentation
const HistoryContainer = styled.div`
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
`;

const WorkoutCard = styled.div`
    background: #2a2a2a;
    border-radius: 8px;
    margin-bottom: 20px;
    padding: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const WorkoutDate = styled.div`
    font-size: 1.2rem;
    color: var(--primary);
    margin-bottom: 10px;
    padding-bottom: 5px;
    border-bottom: 1px solid #444;
`;

const TimerList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

const TimerItem = styled.li`
    background: #333;
    border-radius: 4px;
    margin: 10px 0;
    padding: 10px;

    &:hover {
        background: #3b3b3b;
    }
`;

const TimerDetail = styled.div`
    margin: 5px 0;
    color: var(--text);
`;

const NoWorkouts = styled.p`
    text-align: center;
    color: var(--text);
    font-size: 1.1rem;
    margin-top: 40px;
`;

const isStopwatchOrCountdown = (timer: Timer): timer is Timer & {
    config: { hours: number; minutes: number; seconds: number }
} => {
    return timer.type === 'stopwatch' || timer.type === 'countdown';
};

const isXY = (timer: Timer): timer is Timer & {
    config: { minutes: number; seconds: number; numberOfRounds: number }
} => {
    return timer.type === 'xy';
};

const isTabata = (timer: Timer): timer is Timer & {
    config: { workTime: number; restTime: number; numberOfRounds: number }
} => {
    return timer.type === 'tabata';
};




const HistoryView: React.FC = () => {
    const [workouts, setWorkouts] = useState<CompletedWorkout[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            const historyData = localStorage.getItem('workoutHistory');
            if (historyData) {
                const parsedHistory = JSON.parse(historyData) as CompletedWorkout[];
                setWorkouts(parsedHistory);
            }
        } catch (err) {
            setError('Failed to load workout history');
            console.error('Error loading workout history:', err);
        }
    }, []);

    const formatDateTime = (dateString: string): string => {
        try {
            return new Date(dateString).toLocaleString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (err) {
            console.error('Error formatting date:', err);
            return dateString;
        }
    };

    const getTimerConfigDisplay = (timer: Timer): string => {
        try {
            if (isStopwatchOrCountdown(timer)) {
                return `${timer.config.hours}h ${timer.config.minutes}m ${timer.config.seconds}s`;
            }

            if (isXY(timer)) {
                return `${timer.config.minutes}m ${timer.config.seconds}s × ${timer.config.numberOfRounds} rounds`;
            }

            if (isTabata(timer)) {
                return `Work: ${timer.config.workTime}s, Rest: ${timer.config.restTime}s × ${timer.config.numberOfRounds} rounds`;
            }

            return 'Invalid timer configuration';
        } catch (err) {
            console.error('Error formatting timer config:', err);
            return 'Error displaying configuration';
        }
    };


    if (error) {
        return (
            <HistoryContainer>
                <div role="alert" style={{ color: 'var(--error)' }}>
                    {error}
                </div>
            </HistoryContainer>
        );
    }

    return (
        <HistoryContainer>
            <h2>Workout History</h2>
            {workouts.length === 0 ? (
                <NoWorkouts>No completed workouts yet.</NoWorkouts>
            ) : (
                workouts.map((workout, index) => (
                    <WorkoutCard key={`workout-${index}`}>
                        <WorkoutDate>
                            {formatDateTime(workout.date)}
                        </WorkoutDate>
                        <TimerList>
                            {workout.timers.map((timer, timerIndex) => (
                                <TimerItem key={`timer-${timerIndex}`}>
                                    <TimerDetail>
                                        <strong>Type:</strong> {timer.type}
                                    </TimerDetail>
                                    <TimerDetail>
                                        <strong>Config:</strong> {getTimerConfigDisplay(timer)}
                                    </TimerDetail>
                                    <TimerDetail>
                                        <strong>Time Left:</strong> {formatTime(timer.timeLeft)}
                                    </TimerDetail>
                                    {timer.description && (
                                        <TimerDetail>
                                            <strong>Description:</strong> {timer.description}
                                        </TimerDetail>
                                    )}
                                    <TimerDetail>
                                        <strong>State:</strong> {timer.state}
                                    </TimerDetail>
                                </TimerItem>
                            ))}
                        </TimerList>
                    </WorkoutCard>
                ))
            )}
        </HistoryContainer>
    );
};

export default HistoryView;
