import styled from "@emotion/styled";
import { Sim } from "./components/Sim";
import { useState } from "react";
import { Header } from "./components/Header";
import { ControlButtons } from "./components/ControlButtons";
import { SettingsMenu } from "./components/Settings";
import { DebugStats } from "./components/DebugStats";
import { Leaderboard, LeaderboardBody } from "./components/Leaderboard";
import { MenuName } from "./lib/defines/MenuName";
import { LightingMode } from "./lib/webGL/shaderPrograms";

const Backdrop = styled.div`
    display: grid;
    grid-template-areas:
        "top"
        "info"
        "empty"
        "menus"
        "buttons";
    grid-template-rows: 50px 75px 1fr 185px min-content;
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
    const [lightingMode, setLightingMode] = useState<LightingMode>(LightingMode.CAMLIGHT);

    // Toggle to reset the simulation
    const [resetSim, setResetSim] = useState<number>(0);
    const [resetCam, setResetCam] = useState<number>(0);

    // Display the bodies inside of the leaderboard menu. Sorted by order of mass by universe class.
    const [leaderboardBodies, setLeaderboardBodies] = useState<Array<LeaderboardBody>>([]);
    const [debugStatsShown, setDebugStatsShown] = useState<boolean>(false);
    const [menuShown, setMenuShown] = useState<MenuName>(MenuName.NONE);

    const [camAtOrigin, setCamAtOrigin] = useState<boolean>(true);
    if (bodyFollowed != -1 && camAtOrigin) {
        setCamAtOrigin(false);
    }
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
                    lightingMode={lightingMode}
                    bodyFollowed={bodyFollowed}
                    setBodyFollowed={setBodyFollowed}
                    resetSim={resetSim}
                    resetCam={resetCam}
                    paused={paused}
                />
            </SimScreen>
            <Backdrop>
                <InfoBox>
                    <div>Following: {bodyFollowed != -1 ? "B-" + bodyFollowed : "None"}</div>
                    <div className="buttonContainer">
                        {bodyFollowed != -1 ? (
                            <button
                                onClick={() => {
                                    setBodyFollowed(-1);
                                }}
                            >
                                Stop Following
                            </button>
                        ) : (
                            <></>
                        )}
                        {!camAtOrigin && bodyFollowed == -1 ? (
                            <button
                                onClick={() => {
                                    setBodyFollowed(-1);
                                    setResetCam((prev) => prev + 1);
                                    setCamAtOrigin(true);
                                }}
                            >
                                Reset Camera
                            </button>                 
                        ) : (
                            <></>
                        )}
                    </div>
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
                    setResetSim={setResetSim}
                    menuShown={menuShown}
                    setMenuShown={setMenuShown}
                />
                {menuShown == MenuName.SETTINGS ? (
                    <SettingsMenu
                        debugStatsShown={debugStatsShown}
                        setDebugStatsShown={setDebugStatsShown}
                        lightingMode={lightingMode}
                        setLightingMode={setLightingMode}
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
    gap: 5px;
    padding-top: 5px;

    font-size: 1.2rem;

    .buttonContainer {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 10px;
        height: 50px;
    }

    button {
        background: none;
        border: none;
        width: 150px;

        border: 2px solid white;
        color: white;
        height: 35px;
        font-size: 1.1rem;

        border-radius: 5px;

        :hover {
            background-color: white;
            color: black;
        }
    }
`;
