import styled from "@emotion/styled";
import { useMemo, useState } from "react";
import { brightenColor } from "../lib/colors/brightenColor";
import { RadioButtonCheckedIcon } from "../assets/icons/RadioButtonCheckedIcon";
import { RadioButtonUncheckedIcon } from "../assets/icons/RadioButtonUncheckedIcon";
import { BlankIcon } from "../assets/icons/BlankIcon";
import { ArrowDownwardIcon } from "../assets/icons/ArrowDownwardIcon";
import { ArrowUpwardIcon } from "../assets/icons/ArrowUpwardIcon";

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
    const [sortCriteria, setSortCriteria] = useState<SortCriteria>({ type: SortType.MASS, ascending: false });
    const sortedBodies = useMemo(() => {
        return sortBodies(leaderboardBodies, sortCriteria);
    }, [sortCriteria, leaderboardBodies, bodyFollowed]);

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
                                    <LeaderboardSortHeader
                                        title="Name"
                                        type={SortType.NAME}
                                        defaultSortAscending={true}
                                        sortCriteria={sortCriteria}
                                        setSortCriteria={setSortCriteria}
                                    />
                                    <LeaderboardSortHeader
                                        title="Mass"
                                        type={SortType.MASS}
                                        defaultSortAscending={false}
                                        sortCriteria={sortCriteria}
                                        setSortCriteria={setSortCriteria}
                                    />
                                    <LeaderboardSortHeader
                                        title="dOrig"
                                        type={SortType.D_ORIGIN}
                                        defaultSortAscending={false}
                                        sortCriteria={sortCriteria}
                                        setSortCriteria={setSortCriteria}
                                    />
                                    <LeaderboardSortHeader
                                        title="dTarg"
                                        type={SortType.D_TARGET}
                                        defaultSortAscending={true}
                                        sortCriteria={sortCriteria}
                                        setSortCriteria={setSortCriteria}
                                    />
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
                                    <LeaderboardSortHeader
                                        title="Name"
                                        type={SortType.NAME}
                                        defaultSortAscending={true}
                                        sortCriteria={sortCriteria}
                                        setSortCriteria={setSortCriteria}
                                    />
                                    <LeaderboardSortHeader
                                        title="nSat"
                                        type={SortType.NUM_SAT}
                                        defaultSortAscending={false}
                                        sortCriteria={sortCriteria}
                                        setSortCriteria={setSortCriteria}
                                    />
                                    <LeaderboardSortHeader
                                        title="Orbit"
                                        type={SortType.ORBITING}
                                        defaultSortAscending={true}
                                        sortCriteria={sortCriteria}
                                        setSortCriteria={setSortCriteria}
                                    />
                                    <LeaderboardSortHeader
                                        title="dOrbit"
                                        type={SortType.D_ORBIT}
                                        defaultSortAscending={true}
                                        sortCriteria={sortCriteria}
                                        setSortCriteria={setSortCriteria}
                                    />
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
    margin-top: auto;
    width: 310px;
    height: min-content;

    background: none;
`;

const LeaderboardContent = styled.div`
    overflow-y: auto;
    height: 160px;

    @media screen and (max-height: 500px) {
        height: 120px;
    }

    border: 2px solid white;

    font-size: 0.9rem;

    background-color: black;

    table {
        height: 100%;
        width: 100%;
        border-spacing: 5px;
    }
`;

const LeaderboardRowStyle = styled.tr<{ bodyColor: string; selected: boolean }>`
    td {
        background-color: ${(props) => props.bodyColor};
        color: ${(props) => (props.selected ? props.bodyColor : "white")};
        padding: 0;
        text-align: center;
        height: 30px;

        color: black;
    }

    td.name {
        width: 70px;
        background: none;
    }
`;

/*
    Local Components
*/

interface LeaderboardSortHeaderProps {
    title: string;
    type: SortType;
    defaultSortAscending: boolean;
    sortCriteria: SortCriteria;
    setSortCriteria: React.Dispatch<React.SetStateAction<SortCriteria>>;
}

function LeaderboardSortHeader(props: LeaderboardSortHeaderProps) {
    const { title, type, defaultSortAscending, sortCriteria, setSortCriteria } = props;
    props;
    return (
        <LeaderboardSortHeaderStyle selected={sortCriteria.type === type}>
            <button
                onClick={() => {
                    setSortCriteria({
                        type: type,
                        ascending: sortCriteria.type === type ? !sortCriteria.ascending : defaultSortAscending,
                    });
                }}
            >
                {title}
                <div>
                    {sortCriteria.type === type ? (
                        sortCriteria.ascending ? (
                            <ArrowUpwardIcon dim={"100%"} filled={false} color={"white"} />
                        ) : (
                            <ArrowDownwardIcon dim={"100%"} filled={false} color={"white"} />
                        )
                    ) : (
                        <BlankIcon />
                    )}
                </div>
            </button>
        </LeaderboardSortHeaderStyle>
    );
}

const LeaderboardSortHeaderStyle = styled.th<{ selected: boolean }>`
    position: sticky;
    top: 0px;
    background-color: #010101;

    font-weight: normal;

    text-decoration: ${(props) => (props.selected ? "underline" : "none")};

    margin: 0;

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

        position: relative;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;

        div {
            position: absolute;
            bottom: 0;
            right: 0;
            height: 1rem;
            width: 1rem;
        }
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

    width: 70px;
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
    height: 20px;
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
    MASS,
    D_ORIGIN,
    D_TARGET,
    ORBITING,
    D_ORBIT,
    NUM_SAT,
}

interface SortCriteria {
    type: SortType;
    ascending: boolean;
}

function sortBodies(bodies: LeaderboardBody[], criteria: SortCriteria): LeaderboardBody[] {
    return bodies.sort((a, b) => {
        if (criteria.type === SortType.NAME) {
            return criteria.ascending ? a.index - b.index : b.index - a.index;
        } else if (criteria.type === SortType.MASS) {
            return criteria.ascending ? a.mass - b.mass || a.index - b.index : b.mass - a.mass || a.index - b.index;
        } else if (criteria.type === SortType.D_ORIGIN) {
            return criteria.ascending
                ? a.dOrigin - b.dOrigin || a.index - b.index
                : b.dOrigin - a.dOrigin || a.index - b.index;
        } else if (criteria.type === SortType.D_TARGET) {
            return criteria.ascending
                ? a.dTarget - b.dTarget || a.index - b.index
                : b.dTarget - a.dTarget || a.index - b.index;
        } else if (criteria.type === SortType.ORBITING) {
            if (criteria.ascending) {
                if (a.orbiting === -1 && b.orbiting === -1) return 0;
                if (a.orbiting === -1) return 1;
                if (b.orbiting === -1) return -1;
                return a.orbiting - b.orbiting || a.index - b.index;
            } else {
                if (a.orbiting === -1 && b.orbiting === -1) return 0;
                if (a.orbiting === -1) return 1;
                if (b.orbiting === -1) return -1;
                return b.orbiting - a.orbiting || a.index - b.index;
            }
        } else if (criteria.type === SortType.D_ORBIT) {
            return criteria.ascending
                ? a.dOrbit - b.dOrbit || a.index - b.index
                : b.dOrbit - a.dOrbit || a.index - b.index;
        } else if (criteria.type === SortType.NUM_SAT) {
            return criteria.ascending
                ? a.numSattelites - b.numSattelites || a.index - b.index
                : b.numSattelites - a.numSattelites || a.index - b.index;
        } else {
            // Default case for MASS in descending order
            return b.mass - a.mass;
        }
    });
}
