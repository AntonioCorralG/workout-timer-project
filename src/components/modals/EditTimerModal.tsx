// components/modals/EditTimerModal.tsx
import type React from 'react';
import { useState } from 'react';
import { useTimers } from '../../context/TimerContext';
import type { Timer, TimerConfig, StopwatchConfig, CountdownConfig, TabataConfig } from '../../types/types';
import Button from '../generic/Button';
import { StyledLabel } from '../generic/FormStyling';
import { FormContainer, StyledButtonContainer } from '../generic/ContainerDisplays';
import { ModalOverlay, ModalContent } from '../generic/ModalStyling';

interface EditTimerModalProps {
    timer: Timer;
    onClose: () => void;
}

// Type guards
const isTabataConfig = (config: TimerConfig): config is TabataConfig => {
    return 'workTime' in config && 'restTime' in config;
};

const isTimeBasedConfig = (config: TimerConfig): config is StopwatchConfig | CountdownConfig => {
    return 'hours' in config && 'minutes' in config && 'seconds' in config;
};

const EditTimerModal: React.FC<EditTimerModalProps> = ({ timer, onClose }) => {
    const { setTimers, savingTimerURLS, timers, resetWorkout } = useTimers();
    const [config, setConfig] = useState<TimerConfig>(timer.config);
    const [description, setDescription] = useState(timer.description);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfig(prev => ({
            ...prev,
            [event.target.name]: Number(event.target.value)
        }));
    };

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
    };

    const calculateTimeLeft = (type: Timer['type'], currentConfig: TimerConfig): number => {
        if (type === 'stopwatch') {
            return 0;
        }

        if (type === 'tabata' && isTabataConfig(currentConfig)) {
            return currentConfig.workTime * 1000;
        }

        if (isTimeBasedConfig(currentConfig)) {
            return currentConfig.hours * 3600000 +
                currentConfig.minutes * 60000 +
                currentConfig.seconds * 1000;
        }

        return 0;
    };

    const handleSaveClick = () => {
        const updatedTimers = timers.map(t =>
            t.id === timer.id
                ? {
                    ...t,
                    config,
                    description,
                    timeLeft: calculateTimeLeft(t.type, config),
                    state: 'notRunning' as const,
                }
                : t
        );

        setTimers(updatedTimers);
        savingTimerURLS();
        resetWorkout();
        onClose();
    };

    const renderTimerInputs = () => {
        switch (timer.type) {
            case 'stopwatch':
            case 'countdown':
                if (isTimeBasedConfig(config)) {
                    return (
                        <>
                            <StyledLabel>
                                Hours:
                                <input
                                    name="hours"
                                    type="number"
                                    value={config.hours}
                                    onChange={handleInputChange}
                                />
                            </StyledLabel>
                            <StyledLabel>
                                Minutes:
                                <input
                                    name="minutes"
                                    type="number"
                                    value={config.minutes}
                                    onChange={handleInputChange}
                                />
                            </StyledLabel>
                            <StyledLabel>
                                Seconds:
                                <input
                                    name="seconds"
                                    type="number"
                                    value={config.seconds}
                                    onChange={handleInputChange}
                                />
                            </StyledLabel>
                        </>
                    );
                }
                break;

            case 'xy':
                if ('minutes' in config && 'seconds' in config && 'numberOfRounds' in config) {
                    return (
                        <>
                            <StyledLabel>
                                Minutes:
                                <input
                                    name="minutes"
                                    type="number"
                                    value={config.minutes}
                                    onChange={handleInputChange}
                                />
                            </StyledLabel>
                            <StyledLabel>
                                Seconds:
                                <input
                                    name="seconds"
                                    type="number"
                                    value={config.seconds}
                                    onChange={handleInputChange}
                                />
                            </StyledLabel>
                            <StyledLabel>
                                Rounds:
                                <input
                                    name="numberOfRounds"
                                    type="number"
                                    value={config.numberOfRounds}
                                    onChange={handleInputChange}
                                />
                            </StyledLabel>
                        </>
                    );
                }
                break;

            case 'tabata':
                if (isTabataConfig(config)) {
                    return (
                        <>
                            <StyledLabel>
                                Work Time (seconds):
                                <input
                                    name="workTime"
                                    type="number"
                                    value={config.workTime}
                                    onChange={handleInputChange}
                                />
                            </StyledLabel>
                            <StyledLabel>
                                Rest Time (seconds):
                                <input
                                    name="restTime"
                                    type="number"
                                    value={config.restTime}
                                    onChange={handleInputChange}
                                />
                            </StyledLabel>
                            <StyledLabel>
                                Rounds:
                                <input
                                    name="numberOfRounds"
                                    type="number"
                                    value={config.numberOfRounds}
                                    onChange={handleInputChange}
                                />
                            </StyledLabel>
                        </>
                    );
                }
                break;
        }
        return null;
    };

    return (
        <ModalOverlay>
            <ModalContent>
                <FormContainer>
                    <h2>Edit Timer</h2>
                    <form>
                        {renderTimerInputs()}
                        <StyledLabel>
                            Description:
                            <input
                                name="description"
                                type="text"
                                value={description}
                                onChange={handleDescriptionChange}
                            />
                        </StyledLabel>
                        <StyledButtonContainer>
                            <Button type="button" height={40} width={100} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="button" height={40} width={100} onClick={handleSaveClick}>
                                Save
                            </Button>
                        </StyledButtonContainer>
                    </form>
                </FormContainer>
            </ModalContent>
        </ModalOverlay>
    );
};

export default EditTimerModal;
