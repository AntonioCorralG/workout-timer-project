// utils/storage.ts
import { Timer, WorkoutHistory } from '../types/types';

export class StorageError extends Error {
    constructor(message: string, public cause?: unknown) {
        super(message);
        this.name = 'StorageError';
    }
}

export class StorageQuotaError extends StorageError {
    constructor(message: string) {
        super(message);
        this.name = 'StorageQuotaError';
    }
}

export class StorageParsingError extends StorageError {
    constructor(message: string) {
        super(message);
        this.name = 'StorageParsingError';
    }
}

export const storage = {
    isAvailable(): boolean {
        try {
            const testKey = '__storage_test__';
            localStorage.setItem(testKey, testKey);
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            return false;
        }
    },

    saveTimers: (timers: Timer[]): void => {
        if (!storage.isAvailable()) {
            throw new StorageError('localStorage is not available');
        }

        try {
            const serialized = JSON.stringify(timers);
            localStorage.setItem('workoutTimers', serialized);
        } catch (error) {
            if (error instanceof Error) {
                // Check if it's a quota exceeded error
                if (error.name === 'QuotaExceededError' || 
                    // Safari private mode
                    error.name === 'QUOTA_EXCEEDED_ERR') {
                    throw new StorageQuotaError('Storage quota exceeded');
                }
                throw new StorageError('Failed to save timers', error);
            }
            throw error;
        }
    },

    getTimers: (): Timer[] => {
        if (!storage.isAvailable()) {
            throw new StorageError('localStorage is not available');
        }

        try {
            const timers = localStorage.getItem('workoutTimers');
            if (!timers) return [];

            const parsed = JSON.parse(timers) as Timer[];
            
            // Validate the parsed data
            if (!Array.isArray(parsed)) {
                throw new StorageParsingError('Invalid timer data format');
            }

            return parsed;
        } catch (error) {
            if (error instanceof SyntaxError) {
                throw new StorageParsingError('Failed to parse timer data');
            }
            throw new StorageError('Failed to retrieve timers', error);
        }
    },

    saveWorkoutHistory: (workout: WorkoutHistory): void => {
        if (!storage.isAvailable()) {
            throw new StorageError('localStorage is not available');
        }

        try {
            const history = storage.getWorkoutHistory();
            history.push(workout);
            localStorage.setItem('workoutHistory', JSON.stringify(history));
        } catch (error) {
            if (error instanceof Error) {
                if (error.name === 'QuotaExceededError' || 
                    error.name === 'QUOTA_EXCEEDED_ERR') {
                    throw new StorageQuotaError('Storage quota exceeded while saving workout history');
                }
                throw new StorageError('Failed to save workout history', error);
            }
            throw error;
        }
    },

    getWorkoutHistory: (): WorkoutHistory[] => {
        if (!storage.isAvailable()) {
            throw new StorageError('localStorage is not available');
        }

        try {
            const history = localStorage.getItem('workoutHistory');
            if (!history) return [];

            const parsed = JSON.parse(history) as WorkoutHistory[];
            
            // Validate the parsed data
            if (!Array.isArray(parsed)) {
                throw new StorageParsingError('Invalid workout history format');
            }

            return parsed;
        } catch (error) {
            if (error instanceof SyntaxError) {
                throw new StorageParsingError('Failed to parse workout history');
            }
            throw new StorageError('Failed to retrieve workout history', error);
        }
    },

    clearAll: (): void => {
        if (!storage.isAvailable()) {
            throw new StorageError('localStorage is not available');
        }

        try {
            localStorage.clear();
        } catch (error) {
            throw new StorageError('Failed to clear storage', error);
        }
    }
};
