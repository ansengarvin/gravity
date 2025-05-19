import styled from "@emotion/styled";

import { PauseIcon } from "../assets/icons/PauseIcon";
import { RestartIcon } from "../assets/icons/RestartIcon";
import { PlayIcon } from "../assets/icons/PlayIcon";
import { SettingsIcon } from "../assets/icons/SettingsIcon";
import { ViewListIcon } from "../assets/icons/ViewListIcon";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { MenuName } from "../redux/controlsSlice";

export function Dashboard() {
    const controls = useSelector((state: RootState) => state.controls);
    const dispatch = useDispatch();
    return (
        <ButtonContainer>
            <ButtonRow>
                <ControlButton
                    onClick={() => {
                        controls.menuShown == MenuName.SETTINGS
                            ? dispatch({ type: "controls/hideMenu" })
                            : dispatch({ type: "controls/setMenuShown", payload: MenuName.SETTINGS });
                    }}
                >
                    <SettingsIcon color={"white"} dim={"50px"} filled={controls.menuShown != MenuName.SETTINGS} />
                </ControlButton>
                {controls.paused ? (
                    <ControlButton
                        onClick={() => {
                            dispatch({ type: "controls/togglePaused" });
                        }}
                    >
                        <PlayIcon color={"white"} dim={"50px"} filled={true} />
                    </ControlButton>
                ) : (
                    <ControlButton
                        onClick={() => {
                            dispatch({ type: "controls/togglePaused" });
                        }}
                    >
                        <PauseIcon color={"white"} dim={"50px"} filled={true} />
                    </ControlButton>
                )}
                <ControlButton onClick={() => dispatch({ type: "controls/resetSim" })}>
                    <RestartIcon color={"white"} dim={"50px"} filled={true} />
                </ControlButton>
                <ControlButton
                    onClick={() => {
                        controls.menuShown == MenuName.LEADERBOARD
                            ? dispatch({ type: "controls/hideMenu" })
                            : dispatch({ type: "controls/setMenuShown", payload: MenuName.LEADERBOARD });
                    }}
                >
                    <ViewListIcon color={"white"} dim={"50px"} filled={controls.menuShown != MenuName.LEADERBOARD} />
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

    @media screen and (max-width: 500px) {
        padding-top: 5px;
        padding-bottom: 5px;
    }

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    width: 320px;
    height: min-content;
`;

const ButtonRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 12px;
`;

const ControlButton = styled.button`
    // Clear all effects
    border: none;
    background: none;
    padding: 0;
    margin: 0;
    font: inherit;
    outline: none;
    cursor: pointer;

    height: 44px;
    width: 44px;

    @media screen and (max-height: 500px) {
        height: 40px;
        width: 40px;
    }

    display: flex;
    justify-content: center;
    align-items: center;

    border-color: white;
    background-color: none;
`;
