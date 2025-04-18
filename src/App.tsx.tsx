import styled from "@emotion/styled";
import { Sim } from "./components/Sim";
import { useState } from "react";
import { Leaderboard, LeaderboardBody } from "./components/Leaderboard";

const Backdrop = styled.div`
    display: grid;
    grid-template-areas: 
        "top top top"
        "stats simulation controls"
        "foot foot foot";
    grid-template-rows: 25px 1fr 25px;
    grid-template-columns: 1fr min-content 1fr;
    height: 100%;
`

const StatScreen = styled.div`
    grid-area: stats;
`

const SimScreen = styled.div`
    grid-area: simulation;
`

export function App() {
    const [numActive, setNumActive] = useState(0)
    const [leaderboardBodies, setLeaderboardBodies] = useState<Array<LeaderboardBody>>([])
    return (
        <Backdrop>
            <StatScreen>
                Number of Bodies: {numActive}
            </StatScreen>
            <Leaderboard leaderboardBodies={leaderboardBodies}/>
            <SimScreen>
                <Sim width="1000px" height="750px" setNumActive={setNumActive} setLeaderboardBodies={setLeaderboardBodies}/>
            </SimScreen>
            
            
            
        </Backdrop> 
    )
}