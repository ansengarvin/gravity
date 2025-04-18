import styled from "@emotion/styled"

// I may just end up making a separate body object.
export interface LeaderboardBody {
    index: number,
    mass: number,
    color: string,
    pos: {x: number, y: number, z: number}
}

interface LeaderboardProps {
    leaderboardBodies: LeaderboardBody[]
    bodyFollowed: number
    updateBodyFollowed: (newBodiesFollowed: number) => void
}

export function Leaderboard(props: LeaderboardProps) {
    const {leaderboardBodies, bodyFollowed, updateBodyFollowed} = props

    const cardClick = (idx: number, x: number, y: number, z: number) => {
        console.log(x, y, z)
        updateBodyFollowed(idx)
    }

    return (
        <LeaderboardStyle>
            {leaderboardBodies.map((item, index) => (
                <LeaderboardItemCard key={index} color={item.color} selected={bodyFollowed===item.index} onClick={() => cardClick(item.index, item.pos.x, item.pos.y, item.pos.z)}>
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

function brightenColor(color: string, factor: number): string {
    // Extract RGB values from the string "rgb(r, g, b)"
    const [r, g, b] = color
        .replace("rgb(", "")
        .replace(")", "")
        .split(",")
        .map((value) => parseInt(value.trim()));

    // Brighten each component by the factor, ensuring it doesn't exceed 255
    const newR = Math.min(255, Math.floor(r * factor));
    const newG = Math.min(255, Math.floor(g * factor));
    const newB = Math.min(255, Math.floor(b * factor));

    // Return the new RGB color string
    return `rgb(${newR}, ${newG}, ${newB})`;
}

const LeaderboardItemCard = styled.div<{color: string, selected: boolean}>`
    padding: 5px;
    border: 1px solid ${({ color }) => color};
    margin: 5px;
    color: black;
    background-color: ${({ color }) => color};
    cursor: pointer;

    :hover {
        background-color: ${({ color }) => brightenColor(color, 1.5)};
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
        transform: translateY(-2px);
    }

`
