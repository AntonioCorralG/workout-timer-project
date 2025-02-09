import type { Timer, TimerConfig, StopwatchConfig, CountdownConfig, XYConfig, TabataConfig } from "../types/types";

const isTimeBasedConfig = (config: TimerConfig): config is StopwatchConfig | CountdownConfig => {
    return 'hours' in config && 'minutes' in config && 'seconds' in config;
};

const isXYConfig = (config: TimerConfig): config is XYConfig => {
    return 'minutes' in config && 'seconds' in config && 'numberOfRounds' in config;
};

const isTabataConfig = (config: TimerConfig): config is TabataConfig => {
    return 'workTime' in config && 'restTime' in config;
};

export const formatTime = (milliseconds: number): string => {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const centiseconds = Math.floor((milliseconds % 1000) / 10);

    return `${hours > 0 ? `${hours.toString().padStart(2, '0')}:` : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
};

export const encodeTimers = (timers: Timer[]): string => {
    return encodeURIComponent(JSON.stringify(timers));
};

export const decodeTimers = (encoded: string): Timer[] => {
    try {
        return JSON.parse(decodeURIComponent(encoded));
    } catch (error) {
        console.error('Failed to decode timers:', error);
        return [];
    }
};

export const calculateTotalTime = (timers: Timer[]): number => {
    return timers.reduce((total, timer) => {
        if (timer.state === 'completed') {
            return total;
        }

        let timeToAdd = 0;

        switch (timer.type) {
            case "countdown":
            case "stopwatch":
                if (isTimeBasedConfig(timer.config)) {
                    timeToAdd = timer.config.hours * 3600000 + 
                               timer.config.minutes * 60000 + 
                               timer.config.seconds * 1000;
                }
                break;
            case "xy":
                if (isXYConfig(timer.config)) {
                    timeToAdd = (timer.config.minutes * 60 + timer.config.seconds) * 
                               timer.config.numberOfRounds * 1000;
                }
                break;
            case "tabata":
                if (isTabataConfig(timer.config)) {
                    timeToAdd = (timer.config.workTime + timer.config.restTime) * 
                               timer.config.numberOfRounds * 1000;
                }
                break;
        }

        return total + Math.max(0, timeToAdd - (timer.config.initialTime || 0));
    }, 0);
};
