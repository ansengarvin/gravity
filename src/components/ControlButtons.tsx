import styled from "@emotion/styled";

import { PauseIcon } from "../assets/icons/PauseIcon";
import { RestartIcon } from "../assets/icons/RestartIcon";
import { PlayIcon } from "../assets/icons/PlayIcon";
import { SettingsIcon } from "../assets/icons/SettingsIcon";
import { ViewListIcon } from "../assets/icons/ViewListIcon";

interface ControlButtonProps {
    pausedState: boolean;
    updatePaused: (shouldPause: boolean) => void;
    resetSim: React.RefObject<boolean>;
    leaderboardShown: boolean;
    setLeaderboardShown: (shouldShow: boolean) => void;
    settingsMenuShown: boolean;
    setSettingsMenuShown: (shouldShow: boolean) => void;
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
        </ButtonContainer>
    );
}

const ButtonContainer = styled.div`
    grid-area: buttons;
    margin-left: auto;
    margin-right: auto;
    padding-top: 10px;
    padding-bottom: 10px;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    width: 320px;
    height: 100%;
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
