import styled from "@emotion/styled";
import { Sim } from "./components/Sim";
import { useRef, useState } from "react";
import { Leaderboard } from "./components/leaderboard/Leaderboard";
import { LeaderboardBody } from "./components/leaderboard/LeaderboardBody";
import { Header } from "./components/Header";
import { ControlButtons } from "./components/ControlButtons";
import { sortQuery } from "./lib/defines/sortQuery";
import { SettingsMenu } from "./components/Settings";

const Backdrop = styled.div`
    display: grid;
    grid-template-areas:
        "top top top"
        "simulation simulation simulation"
        "settings buttons leaderboard";
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

const StatScreen = styled.div`
    grid-area: settings;
    padding-left: 10px;
`;

const SimScreen = styled.div`
    position: absolute;
    height: 100vh;
    width: 100%;
    z-index: 0;
`;

export function App() {
    const [numActive, setNumActive] = useState(0);
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

    const [sortByState, setSortByState] = useState<sortQuery>(sortQuery.mass);
    const sortByRef = useRef<sortQuery>(sortQuery.mass);
    const updateSortBy = (sortBy: sortQuery) => {
        setSortByState(sortBy);
        sortByRef.current = sortBy;
    };

    // Toggle to reset the simulation
    const resetSim = useRef<boolean>(false);

    // Display the bodies inside of the leaderboard menu. Sorted by order of mass by universe class.
    const [leaderboardBodies, setLeaderboardBodies] = useState<Array<LeaderboardBody>>([]);
    const [leaderboardShown, setLeaderboardShown] = useState<boolean>(false);
    const [settingsMenuShown, setSettingsMenuShown] = useState<boolean>(false);

    return (
        <body>
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
                    sortByRef={sortByRef}
                />
            </SimScreen>
            <Backdrop>
                <Header />
                <StatScreen>
                    <br />
                    Number of Bodies: {numActive}
                </StatScreen>
                {leaderboardShown ? (
                    <Leaderboard
                        leaderboardBodies={leaderboardBodies}
                        bodyFollowed={bodyFollowed}
                        updateBodyFollowed={updateBodyFollowed}
                        sortBy={sortByState}
                        updateSortBy={updateSortBy}
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
                />
                {settingsMenuShown ? (
                    <SettingsMenu/>
                ) : null}
            </Backdrop>
        </body>
    );
}
