import styled from "@emotion/styled"


// I may just end up making a separate body object.
export interface LeaderboardBody {
    index: number,
    mass: number,
    color: string,
}

interface LeaderboardProps {
    leaderboardBodies: LeaderboardBody[]
}

export function Leaderboard(props: LeaderboardProps) {
    const {leaderboardBodies} = props

    return (
        <LeaderboardStyle>
            {leaderboardBodies.map((item, index) => (
                <LeaderboardItemCard key={index} color={item.color}>
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
