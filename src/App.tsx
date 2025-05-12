import styled from "@emotion/styled";
import { Sim } from "./components/Sim";
import { Profiler, useState } from "react";
import { Header } from "./components/Header";
import { Dashboard } from "./components/Dashboard";
import { SettingsMenu } from "./components/Settings";
import { DebugStats } from "./components/DebugStats";
import { Leaderboard, LeaderboardBody } from "./components/Leaderboard";
import { MenuName } from "./lib/defines/MenuName";
import { InfoBox } from "./components/InfoBox";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";

const Backdrop = styled.div`
    display: grid;
    grid-template-areas:
        "top"
        "info"
        "empty"
        "menus"
        "buttons";
    grid-template-rows: 50px 50px 1fr min-content min-content;
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
    const [maxSamples, setMaxSamples] = useState(0);

    // Which orbital body is being followed by the camera
    const [bodyFollowed, setBodyFollowed] = useState<number>(-1);
    const [paused, setPaused] = useState<boolean>(true); // Simulation pause control

    // Toggle to reset the simulation
    const [resetSim, setResetSim] = useState<number>(0);
    const [resetCam, setResetCam] = useState<number>(0);

    // Display the bodies inside of the leaderboard menu. Sorted by order of mass by universe class.
    const [leaderboardBodies, setLeaderboardBodies] = useState<Array<LeaderboardBody>>([]);
    const [menuShown, setMenuShown] = useState<MenuName>(MenuName.NONE);

    const [camAtOrigin, setCamAtOrigin] = useState<boolean>(true);
    if (bodyFollowed != -1 && camAtOrigin) {
        setCamAtOrigin(false);
    }

    const showDebug = useSelector((state: RootState) => state.debugMenu.showDebug);

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
                    setMaxSamples={setMaxSamples}
                    setNumStars={setNumStars}
                    bodyFollowed={bodyFollowed}
                    setBodyFollowed={setBodyFollowed}
                    resetSim={resetSim}
                    resetCam={resetCam}
                    paused={paused}
                />
            </SimScreen>
            <Backdrop>
                <InfoBox
                    bodyFollowed={bodyFollowed}
                    setBodyFollowed={setBodyFollowed}
                    setResetCam={setResetCam}
                    camAtOrigin={camAtOrigin}
                    setCamAtOrigin={setCamAtOrigin}
                />
                <Header />
                {showDebug ? (
                    <DebugStats
                        numActiveBodies={numActiveBodies}
                        numStars={numStars}
                        maxVertexUniformVectors={maxVertexUniformVectors}
                        maxFragmentUniformVectors={maxFragmentUniformVectors}
                        maxUniformBufferBindingPoints={maxUniformBufferBindingPoints}
                        numActiveUniforms={numActiveUniforms}
                        numActiveUniformVectors={numActiveUniformVectors}
                        maxSamples={maxSamples}
                    />
                ) : null}
                <Profiler id="app" onRender={() => {}}>
                    {menuShown == MenuName.LEADERBOARD ? (
                        <Leaderboard
                            leaderboardBodies={leaderboardBodies}
                            bodyFollowed={bodyFollowed}
                            setBodyFollowed={setBodyFollowed}
                        />
                    ) : null}
                </Profiler>
                <Dashboard
                    paused={paused}
                    setPaused={setPaused}
                    setResetSim={setResetSim}
                    menuShown={menuShown}
                    setMenuShown={setMenuShown}
                />
                {menuShown == MenuName.SETTINGS ? <SettingsMenu /> : null}
            </Backdrop>
        </>
    );
}
