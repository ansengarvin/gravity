import styled from "@emotion/styled";
import { Sim } from "./components/Sim";
import { useRef, useState } from "react";
import { Header } from "./components/Header";
import { ControlButtons } from "./components/ControlButtons";
import { SettingsMenu } from "./components/Settings";
import { DebugStats } from "./components/DebugStats";
import { Leaderboard, LeaderboardBody } from "./components/Leaderboard";
import { MenuName } from "./lib/defines/MenuName";

const Backdrop = styled.div`
    display: grid;
    grid-template-areas:
        "top"
        "info"
        "empty"
        "menus"
        "buttons";
    grid-template-rows: 50px 50px 1fr 200px min-content;
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
    height: 100%;
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
    const [bodyFollowed, setBodyFollowed] = useState<number>(-1);

    const [paused, setPaused] = useState<boolean>(true); // Simulation pause control

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
    const [menuShown, setMenuShown] = useState<MenuName>(MenuName.NONE);
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
                    bodyFollowed={bodyFollowed}
                    setBodyFollowed={setBodyFollowed}
                    resetSim={resetSim}
                    paused={paused}
                    starLightRef={starLightRef}
                />
            </SimScreen>
            <Backdrop>
                <InfoBox>
                    <div>Following: {bodyFollowed != -1 ? "B-" + bodyFollowed : "None"}</div>
                    {bodyFollowed != -1 ? (
                        <div>
                            <button>Stop Following</button>
                            <button>Reset Camera</button>
                        </div>
                    ) : (
                        <></>
                    )}
                </InfoBox>
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
                        setBodyFollowed={setBodyFollowed}
                    />
                ) : null}
                <ControlButtons
                    paused={paused}
                    setPaused={setPaused}
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

const InfoBox = styled.div`
    grid-area: info;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    font-size: 1.2rem;
`;
