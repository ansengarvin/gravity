import styled from "@emotion/styled";
import { LeaderboardHeader, LeaderboardItemCard } from "./LeaderboardItemCard.tsx";
import { LeaderboardBody } from "./LeaderboardBody.tsx";

// I may just end up making a separate body object.


interface LeaderboardProps {
    leaderboardBodies: LeaderboardBody[];
    bodyFollowed: number;
    updateBodyFollowed: (newBodiesFollowed: number) => void;
}

export function Leaderboard(props: LeaderboardProps) {
    const { leaderboardBodies, bodyFollowed, updateBodyFollowed } = props;

    const cardClick = (idx: number, x: number, y: number, z: number) => {
        console.log(x, y, z);
        updateBodyFollowed(idx);
    };

    return (
        <LeaderboardStyle>
            <LeaderboardHeader/>
            {leaderboardBodies.map((item, index) => (
                <LeaderboardItemCard
                    key={index}
                    item={item}
                    selected={bodyFollowed === item.index}
                />
            ))}
        </LeaderboardStyle> 
    );
}

const LeaderboardStyle = styled.div`
    grid-area: leaderboard;

    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    height: 200px;
    width: min-content;
    overflow-y: scroll;
    background-color: #050505;
    margin-left: auto;
    margin-right: auto;
    border: 4px solid white;

    font-size: 0.8rem;
`;