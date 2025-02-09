import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { CountdownConfig, StopwatchConfig, TabataConfig, Timer, TimerContextType, TimerState, XYConfig } from '../types/types';
import { decodeTimers, encodeTimers } from '../utils/helpers';

const TimerContext = createContext<TimerContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'workoutTimerState';

interface WorkoutHistory {
    timers: Timer[];
    date: string;
}

interface TimerProviderProps {
    children: ReactNode;
}

const saveWorkoutToHistory = (workout: WorkoutHistory) => {
    const storedData = localStorage.getItem('workoutHistory');

    const history: WorkoutHistory[] = storedData ? JSON.parse(storedData) : [];
    history.push(workout);
    localStorage.setItem('workoutHistory', JSON.stringify(history));
};


// Add type guards to check timer types
const isStopwatchOrCountdown = (timer: Timer): timer is Timer & { config: StopwatchConfig | CountdownConfig } => {
    return timer.type === 'stopwatch' || timer.type === 'countdown';
};

const isXY = (timer: Timer): timer is Timer & { config: XYConfig } => {
    return timer.type === 'xy';
};

const isTabata = (timer: Timer): timer is Timer & { config: TabataConfig } => {
    return timer.type === 'tabata';
};

const totalWorkoutTimeCalc = (timers: Timer[]): number => {
    return timers.reduce((total, timer) => {
        if (timer.state === 'completed') {
            return total;
        }

        if (isStopwatchOrCountdown(timer)) {
            return total + timer.config.hours * 3600000 +
                timer.config.minutes * 60000 +
                timer.config.seconds * 1000;
        }

        if (isXY(timer)) {
            return total + (timer.config.minutes * 60 + timer.config.seconds) *
                timer.config.numberOfRounds * 1000;
        }

        if (isTabata(timer)) {
            return total + (timer.config.workTime + timer.config.restTime) *
                timer.config.numberOfRounds * 1000;
        }

        return total;
    }, 0);
}

export const TimerProvider = ({ children }: TimerProviderProps) => {
    const [timers, setTimersState] = useState<Timer[]>([]);
    const [currentTimerIndex, setCurrentTimerIndex] = useState<number>(0);
    const [isWorkoutRunning, setIsWorkoutRunning] = useState<boolean>(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [totalWorkoutTime, setTotalWorkoutTime] = useState<number>(0);


    useEffect(() => {
        setTotalWorkoutTime(totalWorkoutTimeCalc(timers));
    }, [timers]);

    // check for saved state
    useEffect(() => {
        let didSetTimers = false;
        // Load if params present
        const encodedTimers = searchParams.get('timers');
        if (encodedTimers) {
            setTimersState(decodeTimers(encodedTimers));
            didSetTimers = true;
        }

        if (!didSetTimers) {
            const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (savedState) {
                try {
                    const { timers, currentTimerIndex, isWorkoutRunning, totalWorkoutTime } = JSON.parse(savedState);
                    setTimersState(timers);
                    setCurrentTimerIndex(currentTimerIndex);
                    setIsWorkoutRunning(isWorkoutRunning);
                    setTotalWorkoutTime(totalWorkoutTime);
                } catch (error) {
                    console.error('Unable to retreieve saved state. :-/', error);
                }
            }
        } else {
            // Clear local storage if no timers present
            localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
    }, [searchParams]);


    const saveState = () => {
        const state = {
            timers,
            currentTimerIndex,
            isWorkoutRunning,
            totalWorkoutTime,
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    };

    useEffect(() => {
        const timeoutId = setTimeout(saveState, 1000);
        return () => clearTimeout(timeoutId);
    }, [timers, currentTimerIndex, isWorkoutRunning, totalWorkoutTime]);



    const fastForward = () => {
        setTimersState(prevTimers => {
            const updatedTimers: Timer[] = prevTimers.map((timer, index) => {
                if (index === currentTimerIndex) {
                    return { ...timer, state: 'completed', timeLeft: 0 };
                }
                return timer;
            });

            setTotalWorkoutTime(totalWorkoutTimeCalc(updatedTimers));

            return updatedTimers;
        });
        nextTimer();
    };

    const setTimers = (newTimers: Timer[]) => {
        setTimersState(newTimers);
        savingTimerURLS(newTimers);
    };
    const savingTimerURLS = (updatedTimers: Timer[] = timers) => {
        if (updatedTimers.length > 0) {
            const encodedTimers = encodeTimers(updatedTimers);
            if (encodedTimers !== searchParams.get('timers')) {
                setSearchParams({ timers: encodedTimers });
            }
        }
    };

    const addTimer = (timer: Timer) => {
        setTimersState(prevTimers => {
            const newTimers = [...prevTimers, timer];
            savingTimerURLS(newTimers);
            return newTimers;
        });
    };


    const removeTimer = (id: string) => {
        const updatedTimers = timers.filter(timer => timer.id !== id);
        setTimersState(updatedTimers);
        if (currentTimerIndex >= updatedTimers.length) {
            setCurrentTimerIndex(Math.max(0, currentTimerIndex - 1));
        }
    };

    const startWorkout = () => {
        setIsWorkoutRunning(true);
        if (timers.length > 0) {
            setTimersState(prevTimers => prevTimers.map((timer, index) =>
                (index === currentTimerIndex ? { ...timer, state: 'running' } : timer)));
        }
    };

    const pauseWorkout = () => {
        setIsWorkoutRunning(false);
        setTimersState(prevTimers => prevTimers.map(timer =>
            (timer.state === 'running' ? { ...timer, state: 'notRunning' } : timer)));
    };

    const resetWorkout = () => {
        setCurrentTimerIndex(0);
        setIsWorkoutRunning(false);
        setTimersState(prevTimers =>
            prevTimers.map(timer => {
                // Base reset properties
                const baseReset = {
                    ...timer,
                    state: 'notRunning' as const,
                };

                // Handle timeLeft based on timer type
                if (timer.type === 'stopwatch') {
                    return {
                        ...baseReset,
                        timeLeft: 0
                    };
                }

                // Handle XY timer
                if (isXY(timer)) {
                    return {
                        ...baseReset,
                        timeLeft: timer.config.initialTime,
                        currentRound: timer.config.numberOfRounds
                    };
                }

                // All other timer types
                return {
                    ...baseReset,
                    timeLeft: timer.config.initialTime || 0,
                    currentRound: undefined
                };
            })
        );
        setTotalWorkoutTime(totalWorkoutTimeCalc(timers));
    };

    const updateTimerState = (id: string, state: TimerState): void => {
        setTimersState(prevTimers =>
            prevTimers.map(timer =>
                timer.id === id ? { ...timer, state } : timer
            )
        );
    };


    const updateTimerTimeLeft = (id: string, timeLeft: number) => {
        setTimersState(prevTimers => prevTimers.map(timer => (timer.id === id ? { ...timer, timeLeft } : timer)));
    };

    const nextTimer = () => {
        setTimersState(prevTimers => {
            const nextIndex = currentTimerIndex + 1;
            if (nextIndex < prevTimers.length) {
                setCurrentTimerIndex(nextIndex);
                setIsWorkoutRunning(true);
                updateTimerState(prevTimers[nextIndex].id, 'running');
                return prevTimers;
            } else {
                setIsWorkoutRunning(false);
                saveWorkoutToHistory({
                    timers: prevTimers.map(timer => ({ ...timer, state: 'completed' })),
                    date: new Date().toISOString()
                });
                return prevTimers.map(timer => ({ ...timer, state: 'completed' }));
            }
        });
    };


    const moveTimerUp = (id: string) => {
        setTimersState(prevTimers => {
            const currentIndex = prevTimers.findIndex(timer => timer.id === id);
            if (currentIndex > 0) {
                const updatedTimers = [...prevTimers];
                const temp = updatedTimers[currentIndex - 1];
                updatedTimers[currentIndex - 1] = updatedTimers[currentIndex];
                updatedTimers[currentIndex] = temp;
                savingTimerURLS(updatedTimers);
                return updatedTimers;
            }
            return prevTimers;
        });
    };

    const moveTimerDown = (id: string) => {
        setTimersState(prevTimers => {
            const currentIndex = prevTimers.findIndex(timer => timer.id === id);
            if (currentIndex < prevTimers.length - 1) {
                const updatedTimers = [...prevTimers];
                const temp = updatedTimers[currentIndex + 1];
                updatedTimers[currentIndex + 1] = updatedTimers[currentIndex];
                updatedTimers[currentIndex] = temp;
                savingTimerURLS(updatedTimers);
                return updatedTimers;
            }
            return prevTimers;
        });
    };

    const contextValue: TimerContextType = {
        timers,
        currentTimerIndex,
        isWorkoutRunning,
        totalWorkoutTime,
        addTimer,
        removeTimer,
        startWorkout,
        pauseWorkout,
        resetWorkout,
        fastForward,
        updateTimerState,
        updateTimerTimeLeft,
        nextTimer,
        savingTimerURLS,
        setTimers,
        moveTimerUp,
        moveTimerDown,
    };

    return (
        <TimerContext.Provider value={contextValue}>
            {children}
        </TimerContext.Provider>
    );
};

export const useTimers = (): TimerContextType => {
    const context = useContext(TimerContext);
    if (context === undefined) {
        throw new Error('useTimers must be used within a TimerProvider');
    }
    return context;
};
