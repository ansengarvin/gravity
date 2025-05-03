import styled from "@emotion/styled";
import { Sim } from "./components/Sim";
import { useRef, useState } from "react";
import { Header } from "./components/Header";
import { ControlButtons } from "./components/ControlButtons";
import { SettingsMenu } from "./components/Settings";
import { DebugStats } from "./components/DebugStats";
import { Leaderboard, LeaderboardBody } from "./components/Leaderboard";

const Backdrop = styled.div`
    display: grid;
    grid-template-areas:
        "top top top"
        "debug settings leaderboard"
        "botleft buttons botright";
    grid-template-rows: min-content 1fr 200px;
    grid-template-columns: 1fr 320px 1fr;
    height: 100%;
    width: 100%;
    z-index: 1;
    position: absolute;
    pointer-events: none;

    & * {
        pointer-events: auto;
    }
`;

const SimScreen = styled.div`
    position: absolute;
    height: 100vh;
    width: 100%;
    z-index: 0;
`;

export function App() {
    /*
        Set Debug States
    */
    const [numActiveBodies, setNumActiveBodies] = useState(0);
    const [numStars, setNumStars] = useState(0);
    const [numActiveUniforms, setNumActiveUniforms] = useState(0);
    const [maxVertexUniformVectors, setMaxVertexUniformVectors] = useState(0);
    const [maxFragmentUniformVectors, setMaxFragmentUniformVectors] = useState(0);
    const [maxUniformBufferBindingPoints, setMaxUniformBufferBindingPoints] = useState(0);
    const [numActiveUniformVectors, setNumActiveUniformVectors] = useState(0);

    // Which orbital body is being followed by the camera
    // Universe class needs the ref, everything else needs the state
    const [bodyFollowed, setBodyFollowed] = useState<number>(-1);
    const bodyFollowedRef = useRef<number>(bodyFollowed);
    const updateBodyFollowed = (newBodyFollowed: number) => {
        setBodyFollowed(newBodyFollowed);
        bodyFollowedRef.current = newBodyFollowed;
    };

    // Whether the app is paused or not
    // State is needed so pause/play button can re-render for icons
    // Ref is needed to be passed into render()
    const [pausedState, setPausedState] = useState<boolean>(true);
    const pausedRef = useRef<boolean>(true);
    const updatePaused = (status: boolean) => {
        setPausedState(status);
        pausedRef.current = status;
    };

    const [starLightState, setStarLightState] = useState<boolean>(false);
    const starLightRef = useRef<boolean>(false);
    const updateStarLight = (starLight: boolean) => {
        setStarLightState(starLight);
        starLightRef.current = starLight;
    };

    // Toggle to reset the simulation
    const resetSim = useRef<boolean>(false);

    // Display the bodies inside of the leaderboard menu. Sorted by order of mass by universe class.
    const [leaderboardBodies, setLeaderboardBodies] = useState<Array<LeaderboardBody>>([]);
    const [leaderboardShown, setLeaderboardShown] = useState<boolean>(false);
    const [settingsMenuShown, setSettingsMenuShown] = useState<boolean>(false);
    return (
        <>
            <SimScreen>
                <Sim
                    width="1920px"
                    height="1080px"
                    setMaxVertexUniformVectors={setMaxVertexUniformVectors}
                    setMaxFragmentUniformVectors={setMaxFragmentUniformVectors}
                    setMaxUniformBufferBindingPoints={setMaxUniformBufferBindingPoints}
                    setNumActiveBodies={setNumActiveBodies}
                    setNumActiveUniforms={setNumActiveUniforms}
                    setNumActiveUniformVectors={setNumActiveUniformVectors}
                    setLeaderboardBodies={setLeaderboardBodies}
                    setNumStars={setNumStars}
                    bodyFollowedRef={bodyFollowedRef}
                    updateBodyFollowed={updateBodyFollowed}
                    resetSim={resetSim}
                    pausedRef={pausedRef}
                    starLightRef={starLightRef}
                />
            </SimScreen>
            <Backdrop>
                <Header />
                <DebugStats
                    numActiveBodies={numActiveBodies}
                    numStars={numStars}
                    maxVertexUniformVectors={maxVertexUniformVectors}
                    maxFragmentUniformVectors={maxFragmentUniformVectors}
                    maxUniformBufferBindingPoints={maxUniformBufferBindingPoints}
                    numActiveUniforms={numActiveUniforms}
                    numActiveUniformVectors={numActiveUniformVectors}
                />
                {leaderboardShown ? (
                    <Leaderboard
                        leaderboardBodies={leaderboardBodies}
                        bodyFollowed={bodyFollowed}
                        updateBodyFollowed={updateBodyFollowed}
                    />
                ) : null}
                <ControlButtons
                    pausedState={pausedState}
                    updatePaused={updatePaused}
                    resetSim={resetSim}
                    leaderboardShown={leaderboardShown}
                    setLeaderboardShown={setLeaderboardShown}
                    settingsMenuShown={settingsMenuShown}
                    setSettingsMenuShown={setSettingsMenuShown}
                    starLightState={starLightState}
                    updateStarLight={updateStarLight}
                />
                {settingsMenuShown ? <SettingsMenu /> : null}
            </Backdrop>
        </>
    );
}
