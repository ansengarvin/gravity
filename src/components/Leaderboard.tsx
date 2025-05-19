import styled from "@emotion/styled";
import { useEffect, useMemo, useState } from "react";
import { brightenColor } from "../lib/colors/brightenColor";
import { RadioButtonCheckedIcon } from "../assets/icons/RadioButtonCheckedIcon";
import { RadioButtonUncheckedIcon } from "../assets/icons/RadioButtonUncheckedIcon";
import { BlankIcon } from "../assets/icons/BlankIcon";
import { ArrowDownwardIcon } from "../assets/icons/ArrowDownwardIcon";
import { ArrowUpwardIcon } from "../assets/icons/ArrowUpwardIcon";
import { Menu, Tab } from "./Menu";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { LeaderboardBody } from "../redux/informationSlice";
import { useVirtualTable } from "../hooks/useVirtualTable";
import { massSolarToEarth, massSolarToKilograms } from "../lib/conversions";

enum LeaderboardTabType {
    MASS,
    MOTION,
    ORBIT,
    TARGET,
}

export function Leaderboard() {
    const [sortCriteria, setSortCriteria] = useState<SortCriteria>({ type: SortType.MASS, ascending: false });
    const leaderboardBodies = useSelector((state: RootState) => state.information.leaderboard);
    const sortedBodies = useMemo(() => {
        const sorted = sortBodies(leaderboardBodies, sortCriteria);
        return sorted;
    }, [sortCriteria, leaderboardBodies]);

    const [activeTab, setActiveTab] = useState<number>(LeaderboardTabType.MASS);

    const rowsToLoad = 10;
    const rowHeight = 35;
    const tableGap = 5;
    const { visibleRange, onScroll, topHeight, bottomHeight } = useVirtualTable(
        sortedBodies.length,
        rowsToLoad,
        rowHeight,
        tableGap,
    );

    const bodyFollowed = useSelector((state: RootState) => state.controls.bodyFollowed);
    const leaderboardTabs: Tab[] =
        bodyFollowed > -1
            ? [
                  { label: "Mass", value: LeaderboardTabType.MASS },
                  { label: "Orbit", value: LeaderboardTabType.ORBIT },
                  { label: "ΔOrig", value: LeaderboardTabType.MOTION },
                  { label: "ΔTgt", value: LeaderboardTabType.TARGET },
              ]
            : [
                  { label: "Mass", value: LeaderboardTabType.MASS },
                  { label: "Orbit", value: LeaderboardTabType.ORBIT },
                  { label: "ΔOrig", value: LeaderboardTabType.MOTION },
              ];
    useEffect(() => {
        if (activeTab == LeaderboardTabType.TARGET && bodyFollowed == -1) {
            setActiveTab(LeaderboardTabType.MASS);
        }
    }, [bodyFollowed]);

    return (
        <Menu tabs={leaderboardTabs} activeTab={activeTab} setActiveTab={setActiveTab}>
            <LeaderboardContent onScroll={onScroll}>
                {activeTab == LeaderboardTabType.MASS && (
                    <MassTabContent
                        sortedBodies={sortedBodies}
                        sortCriteria={sortCriteria}
                        setSortCriteria={setSortCriteria}
                        visibleRange={visibleRange}
                        topHeight={topHeight}
                        bottomHeight={bottomHeight}
                    />
                )}
                {activeTab == LeaderboardTabType.MOTION && (
                    <MotionTabContent
                        sortedBodies={sortedBodies}
                        sortCriteria={sortCriteria}
                        setSortCriteria={setSortCriteria}
                        visibleRange={visibleRange}
                        topHeight={topHeight}
                        bottomHeight={bottomHeight}
                    />
                )}
                {activeTab == LeaderboardTabType.TARGET && (
                    <TargetTabContent
                        sortedBodies={sortedBodies}
                        sortCriteria={sortCriteria}
                        setSortCriteria={setSortCriteria}
                        visibleRange={visibleRange}
                        topHeight={topHeight}
                        bottomHeight={bottomHeight}
                    />
                )}
                {activeTab == LeaderboardTabType.ORBIT && (
                    <OrbitTabContent
                        sortedBodies={sortedBodies}
                        sortCriteria={sortCriteria}
                        setSortCriteria={setSortCriteria}
                        visibleRange={visibleRange}
                        topHeight={topHeight}
                        bottomHeight={bottomHeight}
                    />
                )}
            </LeaderboardContent>
        </Menu>
    );
}

interface TabContentProps {
    sortedBodies: LeaderboardBody[];
    sortCriteria: SortCriteria;
    setSortCriteria: React.Dispatch<React.SetStateAction<SortCriteria>>;
    visibleRange: { start: number; end: number };
    topHeight: number;
    bottomHeight: number;
}

function MassTabContent(props: TabContentProps) {
    const { sortedBodies, sortCriteria, setSortCriteria, visibleRange, topHeight, bottomHeight } = props;
    const bodyFollowed = useSelector((state: RootState) => state.controls.bodyFollowed);

    return (
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
                        title="Solar"
                        type={SortType.MASS}
                        defaultSortAscending={false}
                        sortCriteria={sortCriteria}
                        setSortCriteria={setSortCriteria}
                    />
                    <LeaderboardSortHeader
                        title="Earth"
                        type={SortType.MASS}
                        defaultSortAscending={false}
                        sortCriteria={sortCriteria}
                        setSortCriteria={setSortCriteria}
                    />
                    <LeaderboardSortHeader
                        title="kg"
                        type={SortType.MASS}
                        defaultSortAscending={true}
                        sortCriteria={sortCriteria}
                        setSortCriteria={setSortCriteria}
                    />
                </tr>
            </thead>
            <tbody>
                <tr
                    style={{
                        height: topHeight,
                        width: "100%",
                        backgroundColor: "green",
                    }}
                />
                {sortedBodies.slice(visibleRange.start, visibleRange.end).map((body: LeaderboardBody) => {
                    const isFollowedBody = bodyFollowed == body.index;
                    const earthMass = massSolarToEarth(body.mass);
                    const kgMass = massSolarToKilograms(body.mass);
                    return (
                        <LeaderboardRowStyle key={body.index} bodyColor={body.color} selected={isFollowedBody}>
                            <td className="name">
                                <BodySelectButton
                                    bodyIndex={body.index}
                                    bodyColor={body.color}
                                    selected={isFollowedBody}
                                />
                            </td>
                            <td>{body.mass.toFixed(4)}</td>
                            <td>{earthMass < 100000 ? earthMass.toFixed(2) : earthMass.toExponential(1)}</td>
                            <td>{kgMass.toExponential(1)}</td>
                        </LeaderboardRowStyle>
                    );
                })}
                <tr
                    style={{
                        height: bottomHeight,
                        width: "100%",
                        backgroundColor: "green",
                    }}
                />
            </tbody>
        </table>
    );
}

function MotionTabContent(props: TabContentProps) {
    const { sortedBodies, sortCriteria, setSortCriteria, visibleRange, topHeight, bottomHeight } = props;
    const bodyFollowed = useSelector((state: RootState) => state.controls.bodyFollowed);

    return (
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
                        title="Dist."
                        type={SortType.D_ORIGIN}
                        defaultSortAscending={false}
                        sortCriteria={sortCriteria}
                        setSortCriteria={setSortCriteria}
                    />
                    <LeaderboardSortHeader
                        title="Vel."
                        type={SortType.V_ORIGIN}
                        defaultSortAscending={false}
                        sortCriteria={sortCriteria}
                        setSortCriteria={setSortCriteria}
                    />
                    <LeaderboardSortHeader
                        title="Acc."
                        type={SortType.A_ORIGIN}
                        defaultSortAscending={false}
                        sortCriteria={sortCriteria}
                        setSortCriteria={setSortCriteria}
                    />
                </tr>
            </thead>
            <tbody>
                <tr
                    style={{
                        height: topHeight,
                        width: "100%",
                        backgroundColor: "green",
                    }}
                />
                {sortedBodies.slice(visibleRange.start, visibleRange.end).map((body: LeaderboardBody) => {
                    const isFollowedBody = bodyFollowed == body.index;
                    return (
                        <LeaderboardRowStyle key={body.index} bodyColor={body.color} selected={isFollowedBody}>
                            <td className="name">
                                <BodySelectButton
                                    bodyIndex={body.index}
                                    bodyColor={body.color}
                                    selected={isFollowedBody}
                                />
                            </td>
                            <td>{body.dOrigin.toFixed(1)}</td>
                            <td>{body.vOrigin.toFixed(1)}</td>
                            <td>{body.aOrigin.toFixed(1)}</td>
                        </LeaderboardRowStyle>
                    );
                })}
                <tr
                    style={{
                        height: bottomHeight,
                        width: "100%",
                        backgroundColor: "green",
                    }}
                />
            </tbody>
        </table>
    );
}

function OrbitTabContent(props: TabContentProps) {
    const { sortedBodies, sortCriteria, setSortCriteria, visibleRange, topHeight, bottomHeight } = props;
    const bodyFollowed = useSelector((state: RootState) => state.controls.bodyFollowed);

    return (
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
                <tr
                    style={{
                        height: topHeight,
                        width: "100%",
                        backgroundColor: "green",
                    }}
                />
                {sortedBodies.slice(visibleRange.start, visibleRange.end).map((body: LeaderboardBody) => {
                    const isFollowedBody = bodyFollowed == body.index;
                    return (
                        <LeaderboardRowStyle key={body.index} bodyColor={body.color} selected={isFollowedBody}>
                            <td className="name">
                                <BodySelectButton
                                    bodyIndex={body.index}
                                    bodyColor={body.color}
                                    selected={isFollowedBody}
                                />
                            </td>
                            <td>{body.numSatellites}</td>
                            <td className={body.orbiting != -1 ? "name" : ""}>
                                {body.orbiting != -1 ? (
                                    <BodySelectButton
                                        bodyIndex={body.orbiting}
                                        bodyColor={body.orbitColor}
                                        selected={bodyFollowed == body.orbiting}
                                    />
                                ) : (
                                    <>None</>
                                )}
                            </td>
                            <td>{body.orbiting != -1 ? body.dOrbit.toFixed(2) : <>--</>}</td>
                        </LeaderboardRowStyle>
                    );
                })}
                <tr
                    style={{
                        height: bottomHeight,
                        width: "100%",
                        backgroundColor: "green",
                    }}
                />
            </tbody>
        </table>
    );
}

function TargetTabContent(props: TabContentProps) {
    const { sortedBodies, sortCriteria, setSortCriteria, visibleRange, topHeight, bottomHeight } = props;
    const bodyFollowed = useSelector((state: RootState) => state.controls.bodyFollowed);

    return (
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
                        title="Dist."
                        type={SortType.D_TARGET}
                        defaultSortAscending={false}
                        sortCriteria={sortCriteria}
                        setSortCriteria={setSortCriteria}
                    />
                    <LeaderboardSortHeader
                        title="Vel."
                        type={SortType.V_TARGET}
                        defaultSortAscending={true}
                        sortCriteria={sortCriteria}
                        setSortCriteria={setSortCriteria}
                    />
                    <LeaderboardSortHeader
                        title="Acc."
                        type={SortType.A_TARGET}
                        defaultSortAscending={true}
                        sortCriteria={sortCriteria}
                        setSortCriteria={setSortCriteria}
                    />
                </tr>
            </thead>
            <tbody>
                <tr
                    style={{
                        height: topHeight,
                        width: "100%",
                        backgroundColor: "green",
                    }}
                />
                {sortedBodies.slice(visibleRange.start, visibleRange.end).map((body: LeaderboardBody) => {
                    const isFollowedBody = bodyFollowed == body.index;
                    return (
                        <LeaderboardRowStyle key={body.index} bodyColor={body.color} selected={isFollowedBody}>
                            <td className="name">
                                <BodySelectButton
                                    bodyIndex={body.index}
                                    bodyColor={body.color}
                                    selected={isFollowedBody}
                                />
                            </td>
                            <td>{body.dTarget.toFixed(2)}</td>
                            <td>{body.vTarget.toFixed(2)}</td>
                            <td>{body.aTarget.toFixed(2)}</td>
                        </LeaderboardRowStyle>
                    );
                })}
                <tr
                    style={{
                        height: bottomHeight,
                        width: "100%",
                        backgroundColor: "green",
                    }}
                />
            </tbody>
        </table>
    );
}

/*
    Styled Components
*/

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
        height: 35px;

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
    height: 25px;

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
    selected: boolean;
}

function BodySelectButton(props: BodySelectButtonProps) {
    const { bodyIndex, bodyColor, selected } = props;
    const dispatch = useDispatch();
    return (
        <BodySelectButtonStyle
            onClick={() => {
                dispatch({
                    type: "controls/setBodyFollowed",
                    payload: selected ? -1 : bodyIndex,
                });
            }}
            selected={selected}
            bodyColor={bodyColor}
        >
            {selected ? (
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

/*
    Helper Functions
*/
enum SortType {
    NAME,
    MASS,
    D_ORIGIN,
    V_ORIGIN,
    A_ORIGIN,
    D_TARGET,
    V_TARGET,
    A_TARGET,
    ORBITING,
    D_ORBIT,
    NUM_SAT,
}

interface SortCriteria {
    type: SortType;
    ascending: boolean;
}

function sortBodies(bodies: LeaderboardBody[], criteria: SortCriteria): LeaderboardBody[] {
    return bodies.toSorted((a, b) => {
        if (criteria.type === SortType.NAME) {
            return criteria.ascending ? a.index - b.index : b.index - a.index;
        } else if (criteria.type === SortType.MASS) {
            return criteria.ascending ? a.mass - b.mass || a.index - b.index : b.mass - a.mass || a.index - b.index;
        } else if (criteria.type === SortType.V_ORIGIN) {
            return criteria.ascending
                ? a.vOrigin - b.vOrigin || a.index - b.index
                : b.vOrigin - a.vOrigin || a.index - b.index;
        } else if (criteria.type === SortType.A_ORIGIN) {
            return criteria.ascending
                ? a.aOrigin - b.aOrigin || a.index - b.index
                : b.aOrigin - a.aOrigin || a.index - b.index;
        } else if (criteria.type === SortType.D_ORIGIN) {
            return criteria.ascending
                ? a.dOrigin - b.dOrigin || a.index - b.index
                : b.dOrigin - a.dOrigin || a.index - b.index;
        } else if (criteria.type === SortType.D_TARGET) {
            return criteria.ascending
                ? a.dTarget - b.dTarget || a.index - b.index
                : b.dTarget - a.dTarget || a.index - b.index;
        } else if (criteria.type === SortType.V_TARGET) {
            return criteria.ascending
                ? a.vTarget - b.vTarget || a.index - b.index
                : b.vTarget - a.vTarget || a.index - b.index;
        } else if (criteria.type === SortType.A_TARGET) {
            return criteria.ascending
                ? a.aTarget - b.aTarget || a.index - b.index
                : b.aTarget - a.aTarget || a.index - b.index;
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
                ? a.numSatellites - b.numSatellites || a.index - b.index
                : b.numSatellites - a.numSatellites || a.index - b.index;
        } else {
            // Default case for MASS in descending order
            return b.mass - a.mass;
        }
    });
}
