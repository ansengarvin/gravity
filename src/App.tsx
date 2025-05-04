import styled from "@emotion/styled";
import { Sim } from "./components/Sim";
import { useRef, useState } from "react";
import { Header } from "./components/Header";
import { ControlButtons } from "./components/ControlButtons";
import { SettingsMenu } from "./components/Settings";
import { DebugStats } from "./components/DebugStats";
import { Leaderboard, LeaderboardBody } from "./components/Leaderboard";
import { MenuName} from "./lib/defines/MenuName";

const Backdrop = styled.div`
    display: grid;
    grid-template-areas:
        "top"
        "empty"
        "menus"
        "buttons";
    grid-template-rows: 50px 1fr 200px min-content;
    grid-template-columns: 1fr;
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
    width: 100vw;
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
    const [debugStatsShown, setDebugStatsShown] = useState<boolean>(false);
    const [menuShown, setMenuShown] = useState<MenuName>(MenuName.NONE)
    return (
        <>
            <SimScreen>
                <Sim
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
                {debugStatsShown ? (
                    <DebugStats
                        numActiveBodies={numActiveBodies}
                        numStars={numStars}
                        maxVertexUniformVectors={maxVertexUniformVectors}
                        maxFragmentUniformVectors={maxFragmentUniformVectors}
                        maxUniformBufferBindingPoints={maxUniformBufferBindingPoints}
                        numActiveUniforms={numActiveUniforms}
                        numActiveUniformVectors={numActiveUniformVectors}
                    />
                ) : null}

                {menuShown == MenuName.LEADERBOARD ? (
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
                    menuShown={menuShown}
                    setMenuShown={setMenuShown}
                />
                {menuShown == MenuName.SETTINGS ? (
                    <SettingsMenu
                        debugStatsShown={debugStatsShown}
                        setDebugStatsShown={setDebugStatsShown}
                        starLightState={starLightState}
                        updateStarLight={updateStarLight}
                    />
                ) : null}
            </Backdrop>
        </>
    );
}
