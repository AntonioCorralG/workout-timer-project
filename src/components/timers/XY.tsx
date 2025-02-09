import { useEffect, useRef } from "react";
import { useTimers } from "../../context/TimerContext";
import Button from "../generic/Button";
import {
  StyledButtonContainer,
  TimerDisplay,
  TimerContainer,
  TimerDescription,
  DisplayRounds
} from "../generic/ContainerDisplays";
import { formatTime } from "../../utils/helpers";
import type { TimerComponentProps, Timer, XYConfig } from "../../types/types";

const isXYTimer = (timer: Timer): timer is Timer & { config: XYConfig } => {
  return timer.type === 'xy';
};

const XY = ({ id }: TimerComponentProps) => {
  const { timers, updateTimerTimeLeft, updateTimerState, nextTimer, removeTimer } = useTimers();
  const timer = timers.find((t) => t.id === id);

  if (!timer || !isXYTimer(timer)) return null;

  const { minutes = 0, seconds = 0, numberOfRounds } = timer.config;
  const isRunning = timer.state === "running";
  const initialTime = (minutes * 60 + seconds) * 1000;
  const timeLeft = timer.timeLeft;
  const roundsLeft = timer.currentRound ?? numberOfRounds;

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        updateTimerTimeLeft(id, timeLeft - 1000);
      }, 1000);
    } else if (isRunning && timeLeft <= 0 && roundsLeft > 1) {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
      updateTimerTimeLeft(id, initialTime);
      if (timer.currentRound) {
        timer.currentRound--;
      }
    } else if (isRunning && timeLeft <= 0 && roundsLeft <= 1) {
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
  }, [isRunning, timeLeft, roundsLeft, id, initialTime, updateTimerTimeLeft, updateTimerState, nextTimer]);

  return (
    <TimerContainer>
      <TimerDisplay>{formatTime(timeLeft)}</TimerDisplay>
      <DisplayRounds>Rounds Remaining: {roundsLeft}</DisplayRounds>
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

export default XY;