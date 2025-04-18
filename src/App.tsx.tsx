import styled from "@emotion/styled";
import { Sim } from "./components/Sim";
import { useState } from "react";
import { MassRankingItem } from "./lib/universe/universe";

const Backdrop = styled.div`
    display: grid;
    grid-template-areas: 
        "top top top"
        "stats screen controls"
        "foot foot foot";
    grid-template-rows: 25px 1fr 25px;
    grid-template-columns: 1fr min-content 1fr;
    height: 100%;
`

const StatScreen = styled.div`
    grid-area: stats;
`

const SimScreen = styled.div`
    grid-area: screen;
`

const Leaderboard = styled.div`
    grid-area: controls;
    height: 500px;
    width: 80%;
    overflow-y: scroll;
    background-color: #050505;
    margin-left: auto;
    margin-right: auto;
`

const LeaderboardItem = styled.div<{color: string}>`
    padding: 5px;
    border: 1px solid ${({ color }) => color};
    margin: 5px;
`

export function App() {
    const [numActive, setNumActive] = useState(0)
    const [leaderboard, setLeaderboard] = useState<Array<MassRankingItem>>([])
    return (
        <Backdrop>
            <StatScreen>
                Number of Bodies: {numActive}
            </StatScreen>
            
            <SimScreen>
                <Sim width="1000px" height="750px" setNumActive={setNumActive} setLeaderboard={setLeaderboard}/>
            </SimScreen>
            
            <Leaderboard>
                {leaderboard.map((item, index) => (
                    <LeaderboardItem key={index} color={item.color}>
                        Planet {item.index} <br/>
                        Mass: {item.mass} solar masses
                    </LeaderboardItem>
                ))}
            </Leaderboard>
            
        </Backdrop> 
    )
}