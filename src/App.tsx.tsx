import styled from "@emotion/styled";
import { Sim } from "./components/Sim";
import { useRef, useState } from "react";
import { Leaderboard, LeaderboardBody } from "./components/Leaderboard";
import { Camera } from "./lib/webGL/camera";

const Backdrop = styled.div`
    display: grid;
    grid-template-areas:
        "top top top"
        "stats simulation controls"
        "foot foot foot";
    grid-template-rows: 25px 1fr 25px;
    grid-template-columns: 1fr min-content 1fr;
    height: 100%;
`;

const StatScreen = styled.div`
    grid-area: stats;
`;

const SimScreen = styled.div`
    grid-area: simulation;
`;

export function App() {
    const [numActive, setNumActive] = useState(0);
    const [leaderboardBodies, setLeaderboardBodies] = useState<Array<LeaderboardBody>>([]);
    const cameraRef = useRef<Camera>(new Camera(0, 0, 0, 0, 0, -10));
    return (
        <Backdrop>
            <StatScreen>Number of Bodies: {numActive}</StatScreen>
            <Leaderboard leaderboardBodies={leaderboardBodies} cameraRef={cameraRef} />
            <SimScreen>
                <Sim
                    width="1000px"
                    height="750px"
                    setNumActive={setNumActive}
                    setLeaderboardBodies={setLeaderboardBodies}
                    cameraRef={cameraRef}
                />
            </SimScreen>
        </Backdrop>
    );
}
