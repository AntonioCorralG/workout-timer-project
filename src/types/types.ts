


export type TimerType = 'stopwatch' | 'countdown' | 'xy' | 'tabata';
export type TimerState = 'running' | 'notRunning' | 'completed';

export interface Timer {
  id: string;
  type: TimerType;
  config: TimerConfig;
  state: TimerState;
  timeLeft: number;
  currentRound?: number;
  description: string;
}

export interface TimerContextType {
  timers: Timer[];
  currentTimerIndex: number;
  isWorkoutRunning: boolean;
  totalWorkoutTime: number;
  addTimer: (timer: Timer) => void;
  removeTimer: (id: string) => void;
  startWorkout: () => void;
  pauseWorkout: () => void;
  resetWorkout: () => void;
  fastForward: () => void;
  updateTimerState: (id: string, state: TimerState) => void;
  updateTimerTimeLeft: (id: string, timeLeft: number) => void;
  nextTimer: () => void;
  savingTimerURLS: () => void;
  setTimers: (newTimers: Timer[]) => void;
  moveTimerUp: (id: string) => void;
  moveTimerDown: (id: string) => void;
}


export interface BaseTimerConfig {
  description?: string;
}

export interface StopwatchConfig extends BaseTimerConfig {
  hours: number;
  minutes: number;
  seconds: number;
  initialTime: number;
}

export interface CountdownConfig extends BaseTimerConfig {
  hours: number;
  minutes: number;
  seconds: number;
  initialTime: number;
}

export interface XYConfig extends BaseTimerConfig {
  minutes: number;
  seconds: number;
  numberOfRounds: number;
  initialTime: number;
}

export interface TabataConfig extends BaseTimerConfig {
  workTime: number;
  restTime: number;
  numberOfRounds: number;
  initialTime: number;
  isWorkPhase: boolean;
}

export type TimerConfig = StopwatchConfig | CountdownConfig | XYConfig | TabataConfig;

export interface Timer {
  id: string;
  type: 'stopwatch' | 'countdown' | 'xy' | 'tabata';
  config: TimerConfig;
  state: 'running' | 'notRunning' | 'completed';
  timeLeft: number;
  currentRound?: number;
  description: string;
}

export interface TimerComponentProps {
  id: string;
}

export interface WorkoutHistory {
  id: string;
  date: string;
  timers: Timer[];
  totalDuration: number;
}