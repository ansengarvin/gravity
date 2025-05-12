import styled from "@emotion/styled";
import { Sim } from "./components/Sim";
import { useState } from "react";
import { Header } from "./components/Header";
import { Dashboard } from "./components/Dashboard";
import { SettingsMenu } from "./components/Settings";
import { DebugStats } from "./components/DebugStats";
import { Leaderboard, LeaderboardBody } from "./components/Leaderboard";
import { InfoBox } from "./components/InfoBox";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { MenuName } from "./redux/controlsSlice";

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
    // Display the bodies inside of the leaderboard menu. Sorted by order of mass by universe class.
    const [leaderboardBodies, setLeaderboardBodies] = useState<Array<LeaderboardBody>>([]);

    const showDebug = useSelector((state: RootState) => state.debugInfo.showDebug);
    const menuShown = useSelector((state: RootState) => state.controls.menuShown);

    return (
        <>
            <SimScreen>
                <Sim setLeaderboardBodies={setLeaderboardBodies} />
            </SimScreen>
            <Backdrop>
                <InfoBox />
                <Header />
                {showDebug ? <DebugStats /> : null}
                {menuShown == MenuName.LEADERBOARD ? <Leaderboard leaderboardBodies={leaderboardBodies} /> : null}
                <Dashboard />
                {menuShown == MenuName.SETTINGS ? <SettingsMenu /> : null}
            </Backdrop>
        </>
    );
}
