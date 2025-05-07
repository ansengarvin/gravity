import styled from "@emotion/styled";
import { useMemo, useState } from "react";
import { brightenColor } from "../lib/colors/brightenColor";
import { RadioButtonCheckedIcon } from "../assets/icons/RadioButtonCheckedIcon";
import { RadioButtonUncheckedIcon } from "../assets/icons/RadioButtonUncheckedIcon";

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
    numSattelites: number;
}

export interface LeaderboardProps {
    leaderboardBodies: any[];
    bodyFollowed: number;
    setBodyFollowed: React.Dispatch<React.SetStateAction<number>>;
}

export function Leaderboard(props: LeaderboardProps) {
    const { leaderboardBodies, bodyFollowed, setBodyFollowed } = props;
    const [sortBy, setSortBy] = useState<SortType>(SortType.MASS);
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
                                                sortBy == SortType.NAME
                                                    ? setSortBy(SortType.NAME_REVERSE)
                                                    : setSortBy(SortType.NAME);
                                            }}
                                        >
                                            Name
                                        </button>
                                    </th>
                                    <th>
                                        <button
                                            onClick={() => {
                                                sortBy == SortType.MASS
                                                    ? setSortBy(SortType.MASS_REVERSE)
                                                    : setSortBy(SortType.MASS);
                                            }}
                                        >
                                            Mass
                                        </button>
                                    </th>
                                    <th>
                                        <button
                                            onClick={() => {
                                                sortBy == SortType.D_ORIGIN
                                                    ? setSortBy(SortType.D_ORIGIN_REVERSE)
                                                    : setSortBy(SortType.D_ORIGIN);
                                            }}
                                        >
                                            dOrigin
                                        </button>
                                    </th>
                                    <th>
                                        <button
                                            onClick={() => {
                                                sortBy == SortType.D_TARGET
                                                    ? setSortBy(SortType.D_TARGET_REVERSE)
                                                    : setSortBy(SortType.D_TARGET);
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
                                            <td className="name">
                                                <BodySelectButton
                                                    bodyIndex={body.index}
                                                    bodyColor={body.color}
                                                    bodyFollowed={bodyFollowed}
                                                    setBodyFollowed={setBodyFollowed}
                                                />
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
                                                sortBy == SortType.NAME
                                                    ? setSortBy(SortType.NAME_REVERSE)
                                                    : setSortBy(SortType.NAME);
                                            }}
                                        >
                                            Name
                                        </button>
                                    </th>
                                    <th>
                                        <button
                                            onClick={() => {
                                                sortBy == SortType.NUM_SAT
                                                    ? setSortBy(SortType.NUM_SAT_REVERSE)
                                                    : setSortBy(SortType.NUM_SAT);
                                            }}
                                        >
                                            nSats
                                        </button>
                                    </th>
                                    <th>
                                        <button
                                            onClick={() => {
                                                sortBy == SortType.ORBITING
                                                    ? setSortBy(SortType.ORBITING_REVERSE)
                                                    : setSortBy(SortType.ORBITING);
                                            }}
                                        >
                                            Orbiting
                                        </button>
                                    </th>
                                    <th>
                                        <button
                                            onClick={() => {
                                                sortBy == SortType.D_ORBIT
                                                    ? setSortBy(SortType.D_ORBIT_REVERSE)
                                                    : setSortBy(SortType.D_ORBIT);
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
                                            <td className="name">
                                                <BodySelectButton
                                                    bodyIndex={body.index}
                                                    bodyColor={body.color}
                                                    bodyFollowed={bodyFollowed}
                                                    setBodyFollowed={setBodyFollowed}
                                                />
                                            </td>
                                            <td>{body.numSattelites}</td>
                                            <td className={body.orbiting != -1 ? "name" : ""}>
                                                {body.orbiting != -1 ? (
                                                    <BodySelectButton
                                                        bodyIndex={body.orbiting}
                                                        bodyColor={body.orbitColor}
                                                        bodyFollowed={bodyFollowed}
                                                        setBodyFollowed={setBodyFollowed}
                                                    />
                                                ) : (
                                                    <>None</>
                                                )}
                                            </td>
                                            <td>{body.orbiting != -1 ? body.dOrbit.toFixed(2) : <>--</>}</td>
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
    width: 310px;
    height: 100%;

    background-color: black;
`;

const LeaderboardContent = styled.div`
    overflow-y: auto;
    height: 85%;

    border: 2px solid white;

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
        background-color: ${(props) => props.bodyColor};
        color: ${(props) => (props.selected ? props.bodyColor : "white")};
        padding: 0;
        text-align: center;
        height: 40px;

        color: black;
    }

    td.name {
        background: none;
    }
`;

interface BodySelectButtonProps {
    bodyIndex: number;
    bodyColor: string;
    bodyFollowed: number;
    setBodyFollowed: React.Dispatch<React.SetStateAction<number>>;
}

function BodySelectButton(props: BodySelectButtonProps) {
    const { bodyIndex, bodyColor, bodyFollowed, setBodyFollowed } = props;
    return (
        <BodySelectButtonStyle
            onClick={() => {
                setBodyFollowed(bodyIndex);
            }}
            selected={bodyIndex == bodyFollowed}
            bodyColor={bodyColor}
        >
            {bodyIndex == bodyFollowed ? (
                <RadioButtonCheckedIcon filled={false} color={"black"} dim={"1rem"} />
            ) : (
                <RadioButtonUncheckedIcon filled={false} color={"black"} dim={"1rem"} />
            )}
            B-{bodyIndex}
        </BodySelectButtonStyle>
    );
}

const BodySelectButtonStyle = styled.button<{ selected: boolean; bodyColor: string }>`
    // Remove all styling
    background: none;
    border: none;
    color: inherit;
    font: inherit;
    cursor: pointer;
    outline: inherit;

    width: 100%;
    min-width: 70px;
    height: 100%;

    background-color: ${(props) => props.bodyColor};

    display: flex;
    align-items: center;

    border-radius: 5px;

    box-shadow: 0px -5px 2px 1px ${(props) => brightenColor(props.bodyColor, 0.5)} inset;

    :active {
        box-shadow: 0px -2px 2px 1px ${(props) => brightenColor(props.bodyColor, 0.3)} inset;
        transform: translateY(2px);
    }

    :hover {
        background-color: ${(props) => brightenColor(props.bodyColor, 1.2)};
    }

    :disabled {
        background-color: white;
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
                disabled={leaderboardTab == TabType.BASIC}
            >
                Stats
            </button>
            <button
                onClick={() => {
                    setLeaderboardTab(TabType.ORBIT);
                }}
                disabled={leaderboardTab == TabType.ORBIT}
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
    gap: 3px;

    button {
        height: 100%;
        background: none;
        border: none;
        padding-left: 10px;
        padding-right: 10px;

        cursor: pointer;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;

        border: 2px solid white;
        border-bottom: none;
        background-color: black;
        color: white;

        :hover {
            background-color: #9a9a9a;
        }

        :disabled {
            background-color: white;
            color: black;
            cursor: auto;
        }
    }
`;

/*
    Helper Functions
*/
enum SortType {
    NAME,
    NAME_REVERSE,
    MASS,
    MASS_REVERSE,
    D_ORIGIN,
    D_ORIGIN_REVERSE,
    D_TARGET,
    D_TARGET_REVERSE,
    ORBITING,
    ORBITING_REVERSE,
    D_ORBIT,
    D_ORBIT_REVERSE,
    NUM_SAT,
    NUM_SAT_REVERSE,
}

function sortBodies(bodies: LeaderboardBody[], sortBy: SortType): LeaderboardBody[] {
    // copy bodies into new body array
    return bodies.sort((a, b) => {
        switch (sortBy) {
            case SortType.NAME:
                return a.index - b.index;
            case SortType.NAME_REVERSE:
                return b.index - a.index;
            case SortType.MASS:
                return b.mass - a.mass || a.index - b.index;
            case SortType.MASS_REVERSE:
                return a.mass - b.mass || a.index - b.index;
            case SortType.D_ORIGIN:
                return b.dOrigin - a.dOrigin || a.index - b.index;
            case SortType.D_ORIGIN_REVERSE:
                return a.dOrigin - b.dOrigin || a.index - b.index;
            case SortType.D_TARGET:
                return a.dTarget - b.dTarget || a.index - b.index;
            case SortType.D_TARGET_REVERSE:
                return b.dTarget - a.dTarget || a.index - b.index;
            case SortType.ORBITING:
                if (a.orbiting === -1 && b.orbiting === -1) return 0;
                if (a.orbiting === -1) return 1;
                if (b.orbiting === -1) return -1;
                return a.orbiting - b.orbiting || a.index - b.index;
            case SortType.ORBITING_REVERSE:
                if (a.orbiting === -1 && b.orbiting === -1) return 0;
                if (a.orbiting === -1) return 1;
                if (b.orbiting === -1) return -1;
                return b.orbiting - a.orbiting || a.index - b.index;
            case SortType.D_ORBIT:
                return a.dOrbit - b.dOrbit || a.index - b.index;
            case SortType.D_ORBIT_REVERSE:
                return b.dOrbit - a.dOrbit || a.index - b.index;
            case SortType.NUM_SAT:
                return b.numSattelites - a.numSattelites || a.index - b.index;
            case SortType.NUM_SAT_REVERSE:
                return a.numSattelites - b.numSattelites || a.index - b.index;
            default:
                return b.mass - a.mass;
        }
    });
}
