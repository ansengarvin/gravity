import styled from "@emotion/styled"
import { Camera } from "../lib/webGL/camera"


// I may just end up making a separate body object.
export interface LeaderboardBody {
    index: number,
    mass: number,
    color: string,
    pos: {x: number, y: number, z: number}
}

interface LeaderboardProps {
    leaderboardBodies: LeaderboardBody[]
    cameraRef: React.RefObject<Camera>
}

export function Leaderboard(props: LeaderboardProps) {
    const {leaderboardBodies, cameraRef} = props

    const cardClick = (x: number, y: number, z: number) => {
        console.log(x, y, z)
        if (cameraRef.current) {
            cameraRef.current.setTarget(x, y , z);
        }
    }

    return (
        <LeaderboardStyle>
            {leaderboardBodies.map((item, index) => (
                <LeaderboardItemCard key={index} color={item.color} onClick={() => cardClick(item.pos.x, item.pos.y, item.pos.z)}>
                    Planet {item.index} <br/>
                    Mass: {item.mass} solar masses
                </LeaderboardItemCard>
            ))}
        </LeaderboardStyle>
    )  
}

const LeaderboardStyle = styled.div`
    grid-area: controls;
    height: 500px;
    width: 80%;
    overflow-y: scroll;
    background-color: #050505;
    margin-left: auto;
    margin-right: auto;
`

const LeaderboardItemCard = styled.div<{color: string}>`
    padding: 5px;
    border: 1px solid ${({ color }) => color};
    margin: 5px;
`
