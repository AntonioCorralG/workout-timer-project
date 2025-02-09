import { useEffect, useRef, useState } from 'react';
import { useTimers } from '../context/TimerContext';
import Stopwatch from '../components/timers/Stopwatch';
import Countdown from '../components/timers/Countdown';
import XY from '../components/timers/XY';
import Tabata from '../components/timers/Tabata';
import type { Timer } from '../types/types';
import { TimerContainer } from '../components/generic/ContainerDisplays';
import Button from '../components/generic/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPause,
    faPlay,
    faEdit,
    faArrowUp,
    faArrowDown
} from '@fortawesome/free-solid-svg-icons';
import { TimerStyle, TotalTimeDisplay } from '../components/generic/FormStyling';
import {
    ButtonContainer,
    StyledButtonContainer
} from '../components/generic/ContainerDisplays';
import EditTimerModal from '../components/modals/EditTimerModal';
import { formatTime } from '../utils/helpers';


interface TimerComponentMap {
    stopwatch: React.FC<{ id: string }>;
    countdown: React.FC<{ id: string }>;
    xy: React.FC<{ id: string }>;
    tabata: React.FC<{ id: string }>;
}

const timerComponents: TimerComponentMap = {
    stopwatch: Stopwatch,
    countdown: Countdown,
    xy: XY,
    tabata: Tabata
};

const TimersView: React.FC = () => {
    const {
        timers,
        currentTimerIndex,
        isWorkoutRunning,
        startWorkout,
        pauseWorkout,
        resetWorkout,
        fastForward,
        savingTimerURLS,
        totalWorkoutTime,
        moveTimerDown,
        moveTimerUp,
        nextTimer
    } = useTimers();

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingTimer, setEditingTimer] = useState<Timer | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(totalWorkoutTime);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        setTimeLeft(totalWorkoutTime);
    }, [totalWorkoutTime]);

    useEffect(() => {
        if (isWorkoutRunning) {
            intervalRef.current = window.setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime <= 1000) {
                        if (intervalRef.current !== null) {
                            clearInterval(intervalRef.current);
                        }
                        nextTimer();
                        return 0;
                    }
                    return prevTime - 1000;
                });
            }, 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        return () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isWorkoutRunning, nextTimer]);

    const renderTimer = (timer: Timer): React.ReactNode => {
        const TimerComponent = timerComponents[timer.type as keyof TimerComponentMap];
        return TimerComponent ? <TimerComponent id={timer.id} /> : null;
    };

    const handleMoveUpClick = (id: string): void => {
        moveTimerUp(id);
    };

    const handleMoveDownClick = (id: string): void => {
        moveTimerDown(id);
    };

    const handleEditClick = (timer: Timer): void => {
        setEditingTimer(timer);
        setIsModalOpen(true);
    };

    const handleCloseModal = (): void => {
        setIsModalOpen(false);
        setEditingTimer(null);
    };

    const handleWorkoutReset = (): void => {
        resetWorkout();
        setTimeLeft(totalWorkoutTime);
    };

    return (
        <>
            <h2>Timers</h2>
            <TotalTimeDisplay>
                Total Workout Time: {formatTime(timeLeft)}
            </TotalTimeDisplay>
            <ButtonContainer>
                <Button
                    type={isWorkoutRunning ? 'pause' : 'start'}
                    height={75}
                    width={200}
                    onClick={isWorkoutRunning ? pauseWorkout : startWorkout}
                    aria-label={isWorkoutRunning ? 'Pause workout' : 'Start workout'}
                >
                    <FontAwesomeIcon
                        icon={isWorkoutRunning ? faPause : faPlay}
                        size="3x"
                        color={isWorkoutRunning ? '#3E535C' : '#b8bebf'}
                    />
                </Button>
                <Button
                    type="reset"
                    height={60}
                    width={70}
                    onClick={handleWorkoutReset}
                    aria-label="Reset workout"
                >
                    Reset
                </Button>
                <Button
                    type="submit"
                    height={60}
                    width={70}
                    onClick={fastForward}
                    aria-label="Fast forward"
                >
                    Fast Forward
                </Button>
                <Button
                    type="edit"
                    height={60}
                    width={70}
                    onClick={() => (location.href = '/add')}
                    aria-label="Add new timer"
                >
                    Add Timer
                </Button>
                <Button
                    type="button"
                    height={60}
                    width={120}
                    onClick={savingTimerURLS}
                    aria-label="Save workout"
                >
                    Save Workout
                </Button>
            </ButtonContainer>
            <TimerContainer>
                {timers.map((timer, index) => (
                    <TimerStyle
                        key={`timer-${timer.id}`}
                        style={{ opacity: index === currentTimerIndex ? 1 : 0.5 }}
                    >
                        <div>{timer.type}</div>
                        {renderTimer(timer)}
                        <StyledButtonContainer>
                            <Button
                                type="button"
                                height={60}
                                width={70}
                                onClick={() => handleEditClick(timer)}
                                aria-label="Edit timer"
                            >
                                <FontAwesomeIcon icon={faEdit} size="2x" />
                            </Button>
                            <Button
                                type="button"
                                height={40}
                                width={40}
                                onClick={() => handleMoveUpClick(timer.id)}
                                aria-label="Move timer up"
                            >
                                <FontAwesomeIcon icon={faArrowUp} />
                            </Button>
                            <Button
                                type="button"
                                height={40}
                                width={40}
                                onClick={() => handleMoveDownClick(timer.id)}
                                aria-label="Move timer down"
                            >
                                <FontAwesomeIcon icon={faArrowDown} />
                            </Button>
                        </StyledButtonContainer>
                    </TimerStyle>
                ))}
            </TimerContainer>
            {isModalOpen && editingTimer && (
                <EditTimerModal
                    timer={editingTimer}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
};

export default TimersView;