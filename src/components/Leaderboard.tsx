import styled from "@emotion/styled";
import { useMemo, useState } from "react";
import { brightenColor } from "../lib/colors/brightenColor";

enum TabType {
    BASIC = "basic",
    ORBIT = "orbit",
}

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

    const [leaderboardTab, setLeaderboardTab] = useState<TabType>(TabType.BASIC);

    switch (leaderboardTab) {
        case TabType.BASIC:
            return (
                <LeaderboardStyle>
                    <LeaderboardTabs leaderboardTab={leaderboardTab} setLeaderboardTab={setLeaderboardTab} />
                    <LeaderboardContent>
                        <table>
                            <thead>
                                <tr>
                                    <th>
                                        <button
                                            onClick={() => {
                                                sortBy == "name" ? setSortBy("nameReverse") : setSortBy("name");
                                            }}
                                        >
                                            Name
                                        </button>
                                    </th>
                                    <th>
                                        <button
                                            onClick={() => {
                                                sortBy == "mass" ? setSortBy("massReverse") : setSortBy("mass");
                                            }}
                                        >
                                            Mass
                                        </button>
                                    </th>
                                    <th>
                                        <button
                                            onClick={() => {
                                                sortBy == "dOrigin"
                                                    ? setSortBy("dOriginReverse")
                                                    : setSortBy("dOrigin");
                                            }}
                                        >
                                            dOrigin
                                        </button>
                                    </th>
                                    <th>
                                        <button
                                            onClick={() => {
                                                sortBy == "dTarget"
                                                    ? setSortBy("dTargetReverse")
                                                    : setSortBy("dTarget");
                                            }}
                                        >
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
                                                <BodySelectButton
                                                    selected={bodyFollowed == body.index}
                                                    bodyColor={body.color}
                                                    onClick={() => {
                                                        setBodyFollowed(body.index);
                                                    }}
                                                    disabled={bodyFollowed == body.index}
                                                >
                                                    B-{body.index}
                                                </BodySelectButton>
                                            </td>
                                            <td>{body.mass.toFixed(2)}</td>
                                            <td>{body.dOrigin.toFixed(2)}</td>
                                            <td>{bodyFollowed != -1 ? body.dTarget.toFixed(2) : "--"}</td>
                                        </LeaderboardRowStyle>
                                    );
                                })}
                            </tbody>
                        </table>
                    </LeaderboardContent>
                </LeaderboardStyle>
            );
        case TabType.ORBIT:
            return (
                <LeaderboardStyle>
                    <LeaderboardTabs leaderboardTab={leaderboardTab} setLeaderboardTab={setLeaderboardTab} />
                    <LeaderboardContent>
                        <table>
                            <thead>
                                <tr>
                                    <th>
                                        <button
                                            onClick={() => {
                                                sortBy == "name" ? setSortBy("nameReverse") : setSortBy("name");
                                            }}
                                        >
                                            Name
                                        </button>
                                    </th>
                                    <th>
                                        <button
                                            onClick={() => {
                                                sortBy == "mass" ? setSortBy("massReverse") : setSortBy("mass");
                                            }}
                                        >
                                            Mass
                                        </button>
                                    </th>
                                    <th>
                                        <button
                                            onClick={() => {
                                                sortBy == "orbiting"
                                                    ? setSortBy("orbitingReverse")
                                                    : setSortBy("orbiting");
                                            }}
                                        >
                                            Orbiting
                                        </button>
                                    </th>
                                    <th>
                                        <button
                                            onClick={() => {
                                                sortBy == "dOrbit" ? setSortBy("dOrbitReverse") : setSortBy("dOrbit");
                                            }}
                                        >
                                            dOrbit
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
                                                <BodySelectButton
                                                    selected={bodyFollowed == body.index}
                                                    bodyColor={body.color}
                                                    onClick={() => {
                                                        setBodyFollowed(body.index);
                                                    }}
                                                    disabled={bodyFollowed == body.index}
                                                >
                                                    B-{body.index}
                                                </BodySelectButton>
                                            </td>
                                            <td>{body.mass.toFixed(2)}</td>
                                            <td>
                                                <BodySelectButton
                                                    selected={bodyFollowed == body.index}
                                                    bodyColor={body.orbitColor}
                                                    onClick={() => {
                                                        setBodyFollowed(body.index);
                                                    }}
                                                    disabled={bodyFollowed == body.index}
                                                >
                                                    B-{body.index}
                                                </BodySelectButton>
                                            </td>
                                            <td>{body.dOrbit.toFixed(2)}</td>
                                        </LeaderboardRowStyle>
                                    );
                                })}
                            </tbody>
                        </table>
                    </LeaderboardContent>
                </LeaderboardStyle>
            );
        default:
            <></>;
    }
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
`;

const LeaderboardContent = styled.div`
    overflow-y: auto;
    height: 85%;

    table {
        height: 100%;
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

        color: black;
    }
`;

const BodySelectButton = styled.button<{ selected: boolean; bodyColor: string }>`
    // Remove all styling
    background: none;
    border: none;
    color: inherit;
    font: inherit;
    cursor: pointer;
    outline: inherit;
    width: 100%;
    height: 100%;

    background-color: ${(props) => (props.selected ? "black" : props.bodyColor)};

    border: 3px solid ${(props) => (props.selected ? "black" : brightenColor(props.bodyColor, 0.5))};

    :hover {
        background-color: ${(props) => brightenColor(props.bodyColor, 1.2)};
    }

    :disabled {
        background-color: black;
        color: ${(props) => props.bodyColor};
        cursor: auto;
    }
`;

interface LeaderboardTabsProps {
    leaderboardTab: TabType;
    setLeaderboardTab: React.Dispatch<React.SetStateAction<TabType>>;
}
function LeaderboardTabs(props: LeaderboardTabsProps) {
    const { leaderboardTab, setLeaderboardTab } = props;
    return (
        <LeaderboardTabsStyle>
            <button
                onClick={() => {
                    setLeaderboardTab(TabType.BASIC);
                }}
            >
                Properties
            </button>
            <button
                onClick={() => {
                    setLeaderboardTab(TabType.ORBIT);
                }}
            >
                Orbits
            </button>
        </LeaderboardTabsStyle>
    );
}

const LeaderboardTabsStyle = styled.div`
    height: 15%;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: center;
    gap: 1px;

    button {
        height: 100%;
        background: none;
        border: none;
        background-color: #faff6f;
        cursor: pointer;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
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
