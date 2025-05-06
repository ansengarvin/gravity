import styled from "@emotion/styled";
import { useMemo, useState } from "react";
import { brightenColor } from "../lib/colors/brightenColor";

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
    setBodyFollowed: React.Dispatch<React.SetStateAction<number>>;
}

export function Leaderboard(props: LeaderboardProps) {
    const { leaderboardBodies, bodyFollowed, setBodyFollowed } = props;
    const [sortBy, setSortBy] = useState<string>("mass");
    const sortedBodies = useMemo(() => {
        return sortBodies(leaderboardBodies, sortBy);
    }, [sortBy, leaderboardBodies, bodyFollowed]);
    return (
        <LeaderboardStyle>
            <table>
                <thead>
                <tr>
                    <th>
                        <button onClick={() => {
                            sortBy == "name" ? setSortBy("nameReverse") : setSortBy("name");
                        }}>
                            Name
                        </button>
                    </th>
                    <th>
                        <button onClick={() => {
                            sortBy == "mass" ? setSortBy("massReverse") : setSortBy("mass");
                        }}>
                            Mass
                        </button>
                    </th>
                    <th>
                        <button onClick={() => {
                            sortBy == "dOrigin" ? setSortBy("dOriginReverse") : setSortBy("dOrigin");
                        }}>
                            dOrigin
                        </button>
                    </th>
                    <th>
                        <button onClick={() => {
                            sortBy == "dTarget" ? setSortBy("dTargetReverse") : setSortBy("dTarget");
                        }}>
                            dTarget
                        </button>
                    </th>
                </tr>
                </thead>
                <tbody>
                    {sortedBodies.map((body: LeaderboardBody) => {
                        return (
                            <LeaderboardRowStyle
                                key={body.index}
                                bodyColor={body.color}
                                selected={bodyFollowed == body.index}
                            >
                                <td>
                                    <button
                                        onClick={() => {
                                            setBodyFollowed(body.index);
                                        }}
                                        disabled={bodyFollowed == body.index}
                                    >
                                        B-{body.index}
                                    </button>
                                </td>
                                <td>{body.mass.toFixed(2)}</td>
                                <td>{body.dOrigin.toFixed(2)}</td>
                                <td>{bodyFollowed != -1 ? body.dTarget.toFixed(2) : "--"}</td>
                            </LeaderboardRowStyle>
                        );
                    })}
                </tbody>
            </table>
        </LeaderboardStyle>
    );
}

/*
    Styled Components
*/

const LeaderboardStyle = styled.div`
    grid-area: menus;
    margin-left: auto;
    margin-right: auto;
    width: 320px;
    height: 100%;

    background-color: black;
    overflow-y: auto;

    table {
        width: 100%;
        border-spacing: 5px;

    }

    th {
        position: sticky;
        top: 0px;
        background-color: #010101;
    }

    thead {
        button {
            color: white;
            height: 100%;
            width: 100%;

            // remove all default button styling
            background: none;
            border: none;
            color: inherit;
            font: inherit;
            cursor: pointer;
        }
    }


`;

const LeaderboardRowStyle = styled.tr<{ bodyColor: string; selected: boolean }>`
    td {
        background-color: ${(props) => (props.selected ? "black" : props.bodyColor)};
        color: ${(props) => (props.selected ? props.bodyColor : "white")};
        padding: 0;
        text-align: center;
        height: 40px;

        border: ${(props) => (props.selected ? "3px solid " + props.bodyColor : "none")};

        button {
            // Remove all styling
            background: none;
            border: none;
            color: inherit;
            font: inherit;
            cursor: pointer;
            outline: inherit;
            width: 100%;
            height: 100%;

            border: 3px solid ${(props) => (props.selected ? "black" : brightenColor(props.bodyColor, 0.5))};

            :hover {
                background-color: ${(props) => brightenColor(props.bodyColor, 1.2)};
            }

            :disabled {
                background-color: black;
                color: ${(props) => props.bodyColor};
                cursor: auto;
            }
        }
    }
`;

/*
    Helper Functions
*/

function sortBodies(bodies: LeaderboardBody[], sortBy: string): LeaderboardBody[] {
    // copy bodies into new body array
    return bodies.sort((a, b) => {
        switch (sortBy) {
            case "name":
                return a.index - b.index;
            case "nameReverse":
                return b.index - a.index;
            case "mass":
                return b.mass - a.mass || a.index - b.index;
            case "massReverse":
                return a.mass - b.mass || a.index - b.index;
            case "dOrigin":
                return b.dOrigin - a.dOrigin || a.index - b.index;
            case "dOriginReverse":
                return a.dOrigin - b.dOrigin || a.index - b.index;
            case "dTarget":
                return a.dTarget - b.dTarget || a.index - b.index;
            case "dTargetReverse":
                return b.dTarget - a.dTarget || a.index - b.index;
            case "orbiting":
                if (a.orbiting === -1 && b.orbiting === -1) return 0;
                if (a.orbiting === -1) return 1;
                if (b.orbiting === -1) return -1;
                return a.orbiting - b.orbiting || a.index - b.index;
            case "orbitingReverse":
                if (a.orbiting === -1 && b.orbiting === -1) return 0;
                if (a.orbiting === -1) return 1;
                if (b.orbiting === -1) return -1;
                return b.orbiting - a.orbiting || a.index - b.index;
            case "dOribit":
                return a.dOrbit - b.dOrbit || a.index - b.index;
            case "dOrbitReverse":
                return b.dOrbit - a.dOrbit || a.index - b.index;
            default:
                return b.mass - a.mass;
        }
    });
}
