import styled from "@emotion/styled";
import { Sim } from "./components/Sim";
import { useRef, useState } from "react";
import { Leaderboard, LeaderboardBody } from "./components/Leaderboard";
import { Header } from "./components/header";
import { PauseIcon } from "./assets/icons/PauseIcon";
import { RestartIcon } from "./assets/icons/RestartIcon";
import { PlayIcon } from "./assets/icons/PlayIcon";

const Backdrop = styled.div`
    display: grid;
    grid-template-areas:
        "top top top"
        "stats simulation controls"
        "footleft buttons footright";
    grid-template-rows: min-content 1fr 200px;
    grid-template-columns: 250px 1fr 250px;
    height: 100%;
    width: 100%;
    z-index: 1;
    position: absolute;
    pointer-events: none;

    & * {
        pointer-events: auto;
    }
`;

const StatScreen = styled.div`
    grid-area: stats;
    padding-left: 10px;
`;

const SimScreen = styled.div`
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: 0;
`;

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

export function App() {
    const [numActive, setNumActive] = useState(0);
    const [leaderboardBodies, setLeaderboardBodies] = useState<Array<LeaderboardBody>>([]);

    /*
        Leaderboard wants a state because it needs to be able to re-render every time the followed body is changed.
        Sim wants a ref because the Universe class needs real-time access to the followed body as it's being changed by the user.
        I set both a state and a ref to the same value, and then I can use the ref in the Sim class and the state in the Leaderboard.
    */
    const [bodyFollowed, setBodyFollowed] = useState<number>(-1);
    const bodyFollowedRef = useRef<number>(bodyFollowed);
    const updateBodyFollowed = (newBodyFollowed: number) => {
        setBodyFollowed(newBodyFollowed);
        bodyFollowedRef.current = newBodyFollowed;
    };
    const resetSim = useRef<boolean>(false);

    const [pausedState, setPausedState] = useState<boolean>(true);
    const pausedRef = useRef<boolean>(true);
    const updatePaused = (status: boolean) => {
        setPausedState(status);
        pausedRef.current = status;
    }
    return (
        <>
            <SimScreen>
                <Sim
                    width="1920px"
                    height="1080px"
                    setNumActive={setNumActive}
                    setLeaderboardBodies={setLeaderboardBodies}
                    bodyFollowedRef={bodyFollowedRef}
                    updateBodyFollowed={updateBodyFollowed}
                    resetSim={resetSim}
                    pausedRef={pausedRef}
                />
            </SimScreen>
            <Backdrop>
                <Header />
                <StatScreen>
                    {resetSim && <div>Resetting simulation...</div>}
                    {!resetSim && <br/>}
                    Number of Bodies: {numActive}
                </StatScreen>
                <Leaderboard
                    leaderboardBodies={leaderboardBodies}
                    bodyFollowed={bodyFollowed}
                    updateBodyFollowed={updateBodyFollowed}
                />
                <ButtonSection>
                    {
                        pausedState
                        ?
                        <button onClick={() => {updatePaused(false)}}><PlayIcon color={'white'} dim={'50px'} filled={true}/></button>
                        :
                        <button onClick={() => {updatePaused(true)}}><PauseIcon color={'white'} dim={'50px'} filled={true}/></button>
                    }
                    <button onClick={() => {
                        resetSim.current=true
                        updatePaused(true)
                    }}><RestartIcon color={'white'} dim={'50px'} filled={true}/></button>
                </ButtonSection>
            </Backdrop>
        </>
    );
}
