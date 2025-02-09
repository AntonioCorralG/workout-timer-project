import { useEffect, useRef } from "react";
import { useTimers } from "../../context/TimerContext";
import Button from "../generic/Button";
import { StyledButtonContainer, TimerDisplay, TimerContainer, TimerDescription } from "../generic/ContainerDisplays";
import { formatTime } from "../../utils/helpers";
import type { TimerComponentProps, Timer, CountdownConfig } from "../../types/types";


const isCountdownTimer = (timer: Timer): timer is Timer & { config: CountdownConfig } => {
  return timer.type === 'countdown';
};

const Countdown = ({ id }: TimerComponentProps) => {
  const { timers, updateTimerTimeLeft, updateTimerState, nextTimer, removeTimer } = useTimers();
  const timer = timers.find((t) => t.id === id);

  if (!timer || !isCountdownTimer(timer)) return null;

  const isRunning = timer.state === "running";
  const timeLeft = timer.timeLeft;

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        updateTimerTimeLeft(id, timeLeft - 1000);
      }, 1000);
    } else if (isRunning && timeLeft <= 0) {
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
  }, [isRunning, timeLeft, id, updateTimerTimeLeft, updateTimerState, nextTimer]);

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

export default Countdown;