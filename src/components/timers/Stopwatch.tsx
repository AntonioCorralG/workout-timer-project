import { useEffect, useRef } from "react";
import { useTimers } from "../../context/TimerContext";
import Button from "../generic/Button";
import { StyledButtonContainer, TimerDisplay, TimerContainer, TimerDescription } from "../generic/ContainerDisplays";
import { formatTime } from "../../utils/helpers";
import type { TimerComponentProps, Timer, StopwatchConfig } from "../../types/types";


const isStopwatchTimer = (timer: Timer): timer is Timer & { config: StopwatchConfig } => {
  return timer.type === 'stopwatch';
};



const Stopwatch = ({ id }: TimerComponentProps) => {
  const { timers, updateTimerTimeLeft, updateTimerState, nextTimer, removeTimer } = useTimers();
  const timer = timers.find((t) => t.id === id);

  if (!timer || !isStopwatchTimer(timer)) return null;

  const isRunning = timer.state === "running";
  const timeLeft = timer.timeLeft;
  const { hours = 0, minutes = 0, seconds = 0 } = timer.config;
  const targetTime = (hours * 3600 + minutes * 60 + seconds) * 1000;

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft < targetTime) {
      intervalRef.current = window.setInterval(() => {
        updateTimerTimeLeft(id, timeLeft + 1000);
      }, 1000);
    } else if (isRunning && timeLeft >= targetTime) {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
      updateTimerState(id, "completed");
      nextTimer();
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, targetTime, id, updateTimerTimeLeft, updateTimerState, nextTimer]);

  return (
    <TimerContainer>
      <TimerDisplay>{formatTime(timeLeft)}</TimerDisplay>
      <TimerDescription>{timer.description}</TimerDescription>
      <StyledButtonContainer>
        <Button
          type="remove"
          height={60}
          width={70}
          onClick={() => removeTimer(id)}
          aria-label="Remove timer"
        >
          Remove
        </Button>
      </StyledButtonContainer>
    </TimerContainer>
  );
};

export default Stopwatch;

