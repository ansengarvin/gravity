import styled from "@emotion/styled";
import { useMemo, useState } from "react";

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
    const [sortBy, setSortBy] = useState<string>('mass');
    const sortedBodies = useMemo(() => {
        return sortBodies(leaderboardBodies, sortBy);
    }, [sortBy, leaderboardBodies, bodyFollowed])
    return (
        <LeaderboardStyle>
            <table>
                <thead>
                    <th onClick={() => {sortBy == 'name' ? setSortBy('nameReverse') : setSortBy('name')}}>Name</th>
                    <th onClick={() => {sortBy == 'mass' ? setSortBy('massReverse') : setSortBy('mass')}}>Mass</th>
                    <th onClick={() => {sortBy == 'dOrigin' ? setSortBy('dOriginReverse') : setSortBy('dOrigin')}}>dOrigin</th>
                    <th onClick={() => {sortBy == 'dTarget' ? setSortBy('dTargetReverse') : setSortBy('dTarget')}}>dTarget</th>
                </thead>
                <tbody>
                    {sortedBodies.map((body: LeaderboardBody) => {
                        return (
                            <tr>
                                <td
                                    onClick={() => {
                                        updateBodyFollowed(body.index);
                                    }}
                                    style={{
                                        backgroundColor: bodyFollowed === body.index ? "blue" : "black",
                                    }}
                                >B-{body.index}</td>
                                <td>{body.mass.toFixed(2)}</td>
                                <td>{body.dOrigin.toFixed(2)}</td>
                                <td>{body.dTarget.toFixed(2)}</td>
                            </tr>
                        );
                    })}
                </tbody>    
            </table>      
        </LeaderboardStyle>
    )
}

/*
    Styled Components
*/

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
`

/*
    Helper Functions
*/

function sortBodies(bodies: LeaderboardBody[], sortBy: string): LeaderboardBody[] {
    // copy bodies into new body array
    return bodies.sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.index - b.index;
            case 'nameReverse':
                return b.index - a.index;
            case 'mass':
                return b.mass - a.mass;
            case 'massReverse':
                return a.mass - b.mass;
            case 'dOrigin':
                return b.dOrigin - a.dOrigin;
            case 'dOriginReverse':
                return a.dOrigin - b.dOrigin;
            case 'dTarget':
                return a.dTarget - b.dTarget;
            case 'dTargetReverse':
                return b.dTarget - a.dTarget;
            case 'orbiting':
                if (a.orbiting === -1 && b.orbiting === -1) return 0;
                if (a.orbiting === -1) return 1;
                if (b.orbiting === -1) return -1;
                return a.orbiting - b.orbiting;
            case 'orbitingReverse':
                if (a.orbiting === -1 && b.orbiting === -1) return 0;
                if (a.orbiting === -1) return 1;
                if (b.orbiting === -1) return -1;
                return b.orbiting - a.orbiting;
            case 'dOribit':
                return a.dOrbit - b.dOrbit;
            case 'dOrbitReverse':
                return b.dOrbit - a.dOrbit;
            default:
                return b.mass - a.mass;
        }
    });
}