import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTimers } from "../context/TimerContext";
import { nanoid } from "nanoid";
import type { Timer, TimerType } from "../types/types";
import { StyledButtonContainer } from "../components/generic/ContainerDisplays";
import Button from "../components/generic/Button";
import { StyledLabel } from '../components/generic/FormStyling';
import { FormContainer } from '../components/generic/ContainerDisplays';

interface FormConfig {
    hours: number;
    minutes: number;
    seconds: number;
    numberOfRounds: number;
    workTime?: number;
    restTime?: number;
    initialTime?: number;
    isWorkPhase?: boolean;
}


const AddTimer: React.FC = () => {
    const { addTimer } = useTimers();
    const navigate = useNavigate();

    const [type, setType] = useState<TimerType>("stopwatch");
    const [config, setConfig] = useState<FormConfig>({
        hours: 0,
        minutes: 0,
        seconds: 0,
        numberOfRounds: 1,
    });
    const [description, setDescription] = useState<string>("");

    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        setType(event.target.value as TimerType);
        setConfig({
            hours: 0,
            minutes: 0,
            seconds: 0,
            numberOfRounds: 1,
        });
    };

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = event.target;
        setConfig(prev => ({
            ...prev,
            [name]: Number(value),
        }));
    };

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setDescription(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent): void => {
        event.preventDefault();
        const totalTime = (config.hours * 3600 + config.minutes * 60 + config.seconds) * 1000;

        const newTimer: Timer = {
            id: nanoid(),
            type,
            config: type === "tabata"
                ? {
                    ...config,
                    initialTime: config.workTime ? config.workTime * 1000 : 0,
                    isWorkPhase: true,
                }
                : {
                    ...config,
                    initialTime: type === "stopwatch" ? 0 : totalTime,
                },
            state: "notRunning",
            timeLeft: type === "stopwatch" ? 0 : type === "tabata" ? (config.workTime || 0) * 1000 : totalTime,
            description,
        };

        addTimer(newTimer);
        navigate("/");
    };

    return (
        <FormContainer>
            <h2>Add New Timer</h2>
            <form onSubmit={handleSubmit}>
                <StyledLabel>
                    Type:
                    <select
                        value={type}
                        onChange={handleTypeChange}
                        aria-label="Timer type"
                    >
                        <option value="stopwatch">Stopwatch</option>
                        <option value="countdown">Countdown</option>
                        <option value="xy">XY</option>
                        <option value="tabata">Tabata</option>
                    </select>
                </StyledLabel>

                {(type === "countdown" || type === "stopwatch") && (
                    <>
                        <StyledLabel>
                            Hours:
                            <input
                                name="hours"
                                type="number"
                                min="0"
                                value={config.hours}
                                onChange={handleInput}
                                aria-label="Hours"
                            />
                        </StyledLabel>
                        <StyledLabel>
                            Minutes:
                            <input
                                name="minutes"
                                type="number"
                                min="0"
                                max="59"
                                value={config.minutes}
                                onChange={handleInput}
                                aria-label="Minutes"
                            />
                        </StyledLabel>
                        <StyledLabel>
                            Seconds:
                            <input
                                name="seconds"
                                type="number"
                                min="0"
                                max="59"
                                value={config.seconds}
                                onChange={handleInput}
                                aria-label="Seconds"
                            />
                        </StyledLabel>
                    </>
                )}

                {type === "xy" && (
                    <>
                        <StyledLabel>
                            Minutes:
                            <input
                                name="minutes"
                                type="number"
                                min="0"
                                value={config.minutes}
                                onChange={handleInput}
                                aria-label="Minutes"
                            />
                        </StyledLabel>
                        <StyledLabel>
                            Seconds:
                            <input
                                name="seconds"
                                type="number"
                                min="0"
                                max="59"
                                value={config.seconds}
                                onChange={handleInput}
                                aria-label="Seconds"
                            />
                        </StyledLabel>
                        <StyledLabel>
                            Rounds:
                            <input
                                name="numberOfRounds"
                                type="number"
                                min="1"
                                value={config.numberOfRounds}
                                onChange={handleInput}
                                aria-label="Number of rounds"
                            />
                        </StyledLabel>
                    </>
                )}

                {type === "tabata" && (
                    <>
                        <StyledLabel>
                            Work Time (seconds):
                            <input
                                name="workTime"
                                type="number"
                                min="0"
                                value={config.workTime || 0}
                                onChange={handleInput}
                                aria-label="Work time in seconds"
                            />
                        </StyledLabel>
                        <StyledLabel>
                            Rest Time (seconds):
                            <input
                                name="restTime"
                                type="number"
                                min="0"
                                value={config.restTime || 0}
                                onChange={handleInput}
                                aria-label="Rest time in seconds"
                            />
                        </StyledLabel>
                        <StyledLabel>
                            Rounds:
                            <input
                                name="numberOfRounds"
                                type="number"
                                min="1"
                                value={config.numberOfRounds}
                                onChange={handleInput}
                                aria-label="Number of rounds"
                            />
                        </StyledLabel>
                    </>
                )}

                <StyledLabel>
                    Description:
                    <input
                        name="description"
                        type="text"
                        value={description}
                        onChange={handleDescriptionChange}
                        aria-label="Timer description"
                    />
                </StyledLabel>

                <StyledButtonContainer>
                    <Button
                        type="button"
                        height={40}
                        width={100}
                        onClick={() => navigate("/")}
                        aria-label="Back to timers"
                    >
                        Back
                    </Button>
                    <Button
                        type="submit"
                        height={40}
                        width={100}
                        onClick={(e) => {
                            e?.preventDefault();
                            handleSubmit(e as React.FormEvent);
                        }}
                        aria-label="Add timer"
                    >
                        Add Timer
                    </Button>
                </StyledButtonContainer>
            </form>
        </FormContainer>
    );
};

export default AddTimer;
