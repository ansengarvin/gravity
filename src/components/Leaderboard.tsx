import styled from "@emotion/styled";

export interface LeaderboardBody {
    index: number;
    mass: number;
    color: string;
    dOrigin: number;
    dTarget: number;
    orbiting: number;
    dOrbit: number;
    orbitColor: string;
}

export interface LeaderboardProps {
    leaderboardBodies: any[];
    bodyFollowed: number;
    updateBodyFollowed: (newBodyFollowed: number) => void;
}

export function Leaderboard(props: LeaderboardProps) {
    const { leaderboardBodies, bodyFollowed, updateBodyFollowed } = props;
    return (
        <LeaderboardStyle>
            <table>
                <thead>
                    <th>Name</th>
                    <th>Mass</th>
                    <th>dOrigin</th>
                    <th>dTarget</th>
                </thead>
                <tbody>
                    {leaderboardBodies.map((body: LeaderboardBody) => {
                        return (
                            <tr>
                                <td
                                    onClick={() => {
                                        updateBodyFollowed(body.index);
                                    }}
                                    style={{
                                        backgroundColor: bodyFollowed === body.index ? "blue" : "black",
                                    }}
                                >
                                    B-{body.index}
                                </td>
                                <td>{body.mass.toFixed(2)}</td>
                                <td>{body.dOrigin.toFixed(2)}</td>
                                <td>{body.dTarget.toFixed(2)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </LeaderboardStyle>
    );
}

const LeaderboardStyle = styled.div`
    grid-area: leaderboard;
    width: 320px;
    height: 200px;

    background-color: green;
    overflow-y: auto;

    table {
        width: 100%;
    }

    tr {
        background-color: black;
    }

    th {
        background-color: black;
        color: white;
        padding: 0;
        text-align: left;
    }

    td {
        background-color: #3b0101;
        color: white;
        padding: 0;
        text-align: left;
    }
`;
