import styled from "@emotion/styled"

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
    const { pausedState, updatePaused, resetSim, leaderboardShown, setLeaderboardShown, settingsMenuShown, setSettingsMenuShown } = props;
    return (
        <ButtonSection>
            <button onClick={() => {
                setSettingsMenuShown(!settingsMenuShown)
            }}>
                <SettingsIcon color={'white'} dim={'50px'} filled={!settingsMenuShown}/>
            </button>
            {
                pausedState
                ?
                <button onClick={() => {updatePaused(false)}}><PlayIcon color={'white'} dim={'50px'} filled={true}/></button>
                :
                <button onClick={() => {updatePaused(true)}}><PauseIcon color={'white'} dim={'50px'} filled={true}/></button>
            }
            <button onClick={() => {
                resetSim.current=true
            }}><RestartIcon color={'white'} dim={'50px'} filled={true}/></button>
            <button onClick={() => {
                setLeaderboardShown(!leaderboardShown)
            }}><ViewListIcon color={'white'} dim={'50px'} filled={!leaderboardShown}/></button>
        </ButtonSection>
    )
}

const ButtonSection = styled.div`
    grid-area: buttons;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 50px;

    button {
        // Clear all effects
        border: none;
        background: none;
        padding: 0;
        margin: 0;
        font: inherit;
        outline: none;
        cursor: pointer;
        
        height: 50px;
        width: 50px;

        display: flex;
        justify-content: center;
        align-items: center;

        border-color: white;
        background-color: none;
    }
`