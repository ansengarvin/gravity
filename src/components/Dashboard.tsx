import styled from "@emotion/styled";

import { PauseIcon } from "../assets/icons/PauseIcon";
import { RestartIcon } from "../assets/icons/RestartIcon";
import { PlayIcon } from "../assets/icons/PlayIcon";
import { SettingsIcon } from "../assets/icons/SettingsIcon";
import { ViewListIcon } from "../assets/icons/ViewListIcon";
import { MenuName } from "../lib/defines/MenuName";

interface ControlButtonProps {
    paused: boolean;
    setPaused: React.Dispatch<React.SetStateAction<boolean>>;
    setResetSim: React.Dispatch<React.SetStateAction<number>>;
    menuShown: MenuName;
    setMenuShown: React.Dispatch<React.SetStateAction<MenuName>>;
}

export function Dashboard(props: ControlButtonProps) {
    const { paused, setPaused, setResetSim, menuShown, setMenuShown } = props;
    return (
        <ButtonContainer>
            <ButtonRow>
                <ControlButton
                    dim={"50px"}
                    onClick={() => {
                        setMenuShown(menuShown == MenuName.SETTINGS ? MenuName.NONE : MenuName.SETTINGS);
                    }}
                >
                    <SettingsIcon color={"white"} dim={"50px"} filled={menuShown != MenuName.SETTINGS} />
                </ControlButton>
                {paused ? (
                    <ControlButton
                        dim={"50px"}
                        onClick={() => {
                            setPaused(false);
                        }}
                    >
                        <PlayIcon color={"white"} dim={"50px"} filled={true} />
                    </ControlButton>
                ) : (
                    <ControlButton
                        dim={"50px"}
                        onClick={() => {
                            setPaused(true);
                        }}
                    >
                        <PauseIcon color={"white"} dim={"50px"} filled={true} />
                    </ControlButton>
                )}
                <ControlButton dim={"50px"} onClick={() => setResetSim((prev) => prev + 1)}>
                    <RestartIcon color={"white"} dim={"50px"} filled={true} />
                </ControlButton>
                <ControlButton
                    dim={"50px"}
                    onClick={() => {
                        setMenuShown(menuShown == MenuName.LEADERBOARD ? MenuName.NONE : MenuName.LEADERBOARD);
                    }}
                >
                    <ViewListIcon color={"white"} dim={"50px"} filled={menuShown != MenuName.LEADERBOARD} />
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
