import styled from "@emotion/styled";

import { PauseIcon } from "../assets/icons/PauseIcon";
import { RestartIcon } from "../assets/icons/RestartIcon";
import { PlayIcon } from "../assets/icons/PlayIcon";
import { SettingsIcon } from "../assets/icons/SettingsIcon";
import { ViewListIcon } from "../assets/icons/ViewListIcon";
import { SunnyIcon } from "../assets/icons/SunnyIcon";

interface ControlButtonProps {
    pausedState: boolean;
    updatePaused: (shouldPause: boolean) => void;
    resetSim: React.RefObject<boolean>;
    leaderboardShown: boolean;
    setLeaderboardShown: (shouldShow: boolean) => void;
    settingsMenuShown: boolean;
    setSettingsMenuShown: (shouldShow: boolean) => void;
    starLightState: boolean;
    updateStarLight: (starLight: boolean) => void;
}

export function ControlButtons(props: ControlButtonProps) {
    const {
        pausedState,
        updatePaused,
        resetSim,
        leaderboardShown,
        setLeaderboardShown,
        settingsMenuShown,
        setSettingsMenuShown,
    } = props;
    return (
        <ButtonContainer>
            <Dashboard>
                <ButtonRow>
                    <ControlButton
                        dim={"50px"}
                        onClick={() => {
                            setSettingsMenuShown(!settingsMenuShown);
                        }}
                    >
                        <SettingsIcon color={"white"} dim={"50px"} filled={!settingsMenuShown} />
                    </ControlButton>
                    {pausedState ? (
                        <ControlButton
                            dim={"50px"}
                            onClick={() => {
                                updatePaused(false);
                            }}
                        >
                            <PlayIcon color={"white"} dim={"50px"} filled={true} />
                        </ControlButton>
                    ) : (
                        <ControlButton
                            dim={"50px"}
                            onClick={() => {
                                updatePaused(true);
                            }}
                        >
                            <PauseIcon color={"white"} dim={"50px"} filled={true} />
                        </ControlButton>
                    )}
                    <ControlButton
                        dim={"50px"}
                        onClick={() => {
                            resetSim.current = true;
                        }}
                    >
                        <RestartIcon color={"white"} dim={"50px"} filled={true} />
                    </ControlButton>
                    <ControlButton
                        dim={"50px"}
                        onClick={() => {
                            setLeaderboardShown(!leaderboardShown);
                        }}
                    >
                        <ViewListIcon color={"white"} dim={"50px"} filled={!leaderboardShown} />
                    </ControlButton>
                </ButtonRow>
                <ButtonRow>
                    <ControlButton
                        dim={"40px"}
                        onClick={() => {
                            props.updateStarLight(!props.starLightState);
                        }}
                    >
                        <SunnyIcon color={"white"} dim={"40px"} filled={true} />
                    </ControlButton>
                </ButtonRow>
            </Dashboard>
        </ButtonContainer>
    );
}

const ButtonContainer = styled.div`
    grid-area: buttons;
    margin-left: auto;
    margin-right: auto;

    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;

    width: 320px;
    height: 100%;
`;

const Dashboard = styled.div`
    display: flex;
    height: min-content;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
`;

const ButtonRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 25px;
`;

const ControlButton = styled.button<{ dim: string }>`
    // Clear all effects
    border: none;
    background: none;
    padding: 0;
    margin: 0;
    font: inherit;
    outline: none;
    cursor: pointer;

    height: ${(props) => props.dim};
    width: ${(props) => props.dim};

    display: flex;
    justify-content: center;
    align-items: center;

    border-color: white;
    background-color: none;
`;
