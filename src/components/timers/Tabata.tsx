import { useEffect, useRef } from "react";
import { useTimers } from "../../context/TimerContext";
import Button from "../generic/Button";
import {
  StyledButtonContainer,
  TimerDisplay,
  TimerContainer,
  DisplayRounds,
  TimerDescription
} from "../generic/ContainerDisplays";
import { formatTime } from "../../utils/helpers";
import type { TimerComponentProps, Timer, TabataConfig } from "../../types/types";

const isTabataTimer = (timer: Timer): timer is Timer & { config: TabataConfig } => {
  return timer.type === 'tabata';
};

const Tabata = ({ id }: TimerComponentProps) => {
  const { timers, updateTimerTimeLeft, updateTimerState, nextTimer, removeTimer } = useTimers();
  const timer = timers.find((t) => t.id === id);

  if (!timer || !isTabataTimer(timer)) return null;

  const { workTime = 0, restTime = 0, numberOfRounds = 1, isWorkPhase = true } = timer.config;
  const initialWorkTime = workTime * 1000;
  const initialRestTime = restTime * 1000;
  const isRunning = timer.state === "running";
  const timeLeft = timer.timeLeft;
  const roundsLeft = timer.currentRound ?? numberOfRounds;

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

      if (isWorkPhase && roundsLeft > 0) {
        updateTimerTimeLeft(id, initialRestTime);
        timer.config.isWorkPhase = false;
      } else if (!isWorkPhase && roundsLeft > 1) {
        updateTimerTimeLeft(id, initialWorkTime);
        timer.config.isWorkPhase = true;
        if (timer.currentRound) {
          timer.currentRound--;
        }
      } else {
        updateTimerState(id, "completed");
        nextTimer();
      }
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [
    isRunning,
    timeLeft,
    roundsLeft,
    isWorkPhase,
    id,
    initialWorkTime,
    initialRestTime,
    updateTimerTimeLeft,
    updateTimerState,
    nextTimer
  ]);

  return (
    <TimerContainer>
      <TimerDisplay>{formatTime(timeLeft)}</TimerDisplay>
      <div>{timer.config.isWorkPhase ? "Work" : "Rest"}</div>
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

export default Tabata;