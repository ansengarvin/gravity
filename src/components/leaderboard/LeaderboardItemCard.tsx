import styled from "@emotion/styled";
import { brightenColor } from "../../lib/colors/brightenColor";
import { LeaderboardBody } from "./LeaderboardBody";
import { TargetIcon } from "../../assets/icons/TargetIcon";
import { useRef, useState } from "react";
import { StopIcon } from "../../assets/icons/StopIcon";

interface LeaderboardHeaderProps {
    sortBy: string;
    updateSortBy: (sortBy: string) => void;
}

interface LeaderboardItemCardProps {
    item: LeaderboardBody;
    followed: boolean;
    updateBodyFollowed: (newBodyFollowed: number) => void;
}

const ButtonWidth = "40px";
const NameWidth = "50px";
const MassWidth = "80px";
const DistanceWidth = "80px";
const OrbitWidth = "60px";
const focusedColor = "rgb(255, 227, 46)";
const cancelColor = "rgb(255, 131, 131)";

export function LeaderboardHeader(props: LeaderboardHeaderProps) {
    const { sortBy, updateSortBy } = props;
    console.log(sortBy)
    return (
        <LeaderboardHeaderStyle color={"black"} followed={false} buttonIsHovered={false}>
            <HeaderCard width={ButtonWidth} current={false} bgcolor={'black'}></HeaderCard>
            <HeaderCard width={NameWidth} current={sortBy === 'name'}  bgcolor={'black'} onClick={() => {updateSortBy('name')}}>Name</HeaderCard>
            <HeaderCard width={MassWidth} current={sortBy === 'mass'} bgcolor={'black'} onClick={() => {updateSortBy('mass')}}>
                Mass
            </HeaderCard>
            <HeaderCard width={DistanceWidth} current={sortBy === 'dOrigin'} bgcolor={'black'} onClick={() => {updateSortBy('dOrigin')}}>
                dOrigin
            </HeaderCard>
            <HeaderCard width={DistanceWidth} current={sortBy === 'dTarget'} bgcolor={'black'} onClick={() => {updateSortBy('dTarget')}}>
                dTarget
            </HeaderCard>
            <HeaderCard width={OrbitWidth} current={sortBy === 'orbiting'} bgcolor={'black'} onClick={() => {updateSortBy('orbiting')}}>
                Orbiting
            </HeaderCard>
            <HeaderCard width={DistanceWidth} current={sortBy === 'dOrbit'} bgcolor={'black'} onClick={() => {updateSortBy('dOrbit')}}>
                dOrbit
            </HeaderCard>
        </LeaderboardHeaderStyle>
    );
}

export function LeaderboardItemCard(props: LeaderboardItemCardProps) {
    const { item, followed, updateBodyFollowed } = props;
    const [buttonIsHovered, setButtonIsHovered] = useState(false);

    return (
        <LeaderboardItemCardStyle color={item.color} followed={followed} buttonIsHovered={buttonIsHovered}>
            <SelectButton
                color={item.color}
                followed={followed}
                onMouseLeave={() => {
                    setButtonIsHovered(false);
                }}
                onMouseEnter={() => {
                    setButtonIsHovered(true);
                }}
                onClick={() => {
                    if (followed) {
                        updateBodyFollowed(-1);
                    } else {
                        updateBodyFollowed(item.index);
                    }
                }}
            >
                {followed ? (
                    <StopIcon
                        filled={false}
                        color={buttonIsHovered ? brightenColor(cancelColor, 1.2) : cancelColor}
                        dim={"30px"}
                    />
                ) : (
                    <TargetIcon
                        filled={true}
                        color={buttonIsHovered ? brightenColor(focusedColor, 3) : focusedColor}
                        dim={"30px"}
                    />
                )}
            </SelectButton>
            <InfoCard width={NameWidth} bgcolor={item.color}>
                B-{item.index.toFixed()}
            </InfoCard>
            <InfoCard width={MassWidth} bgcolor={item.color}>
                {item.mass.toFixed(2)} M<sub>☉</sub>
            </InfoCard>
            <InfoCard width={DistanceWidth} bgcolor={item.color}>
                {item.dOrigin.toFixed(2)} au
            </InfoCard>
            <InfoCard width={DistanceWidth} bgcolor={item.color}>
                {
                    item.dTarget == -1
                    ?
                    <>--</>
                    :
                    <>{item.dTarget.toFixed(2)} au</>
                }
            </InfoCard>
            <InfoCard width={OrbitWidth} bgcolor={(item.orbiting != -1 ? item.orbitColor : item.color)}>
                {
                    item.orbiting == -1 
                    ? 
                    <>--</> 
                    : 
                    <>
                        <TargetIcon 
                            filled={true}
                            color={'black'}
                            dim={"0.75rem"}
                        />
                        B-{item.orbiting.toFixed()}
                    </>
                }
            </InfoCard>
            <InfoCard width={DistanceWidth} bgcolor={item.color}>
                {item.dOrbit == -1 ? <>--</> : <>{item.dOrbit.toFixed(2)} au</>}
            </InfoCard>
        </LeaderboardItemCardStyle>
    );
}

const LeaderboardItemCardStyle = styled.div<{ color: string; followed: boolean; buttonIsHovered: boolean }>`
    display: flex;
    flex-direction: row;
    gap: 5px;
    margin-top: 5px;
    width: min-content;
    height: min-content;

    /* border-bottom: ${(props) => (props.followed ? 'solid 2px white' : 'none')}; */

    button {
        background-color: black;
    }
    /* &:hover >* {
        background-color: ${(props) => brightenColor(props.color, 1.3)};
    }
    button: {
        background-color: ${(props) => brightenColor(props.color, 1.7)};
    } */
`;

const InfoCard = styled.div<{ width: string; bgcolor: string }>`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    width: ${(props) => props.width};
    padding-left: 5px;
    padding-right: 5px;
    color: black;
    background-color: ${(props) => props.bgcolor};
    margin-bottom: 4px;
`;

const LeaderboardHeaderStyle = styled(LeaderboardItemCardStyle)`
    position: sticky;
    top: 0;
    background-color: black;
    border-bottom: 2px solid white;
    margin: 0;
    user-select: none;
    
`;

const HeaderCard = styled(InfoCard)<{current: boolean}>`
    background-color: black;
    color: white;

    border: ${(props) => (props.current ? 'dashed 1px white' : 'none')};
    
    height: 25px;
    margin-top: 4px;
    cursor: pointer;
    sub {
        vertical-align: sub;
        font-size: 0.75em;
    }

    :hover {
        background-color: #3c3c3c;
    }

    :active {
        background-color: #717171;
    }
`;

const SelectButton = styled.button<{ color: string; followed: boolean }>`
    display: flex;
    justify-content: center;
    align-items: center;
    height: ${ButtonWidth};
    width: ${ButtonWidth};
    margin-bottom: 4px;

    // Remove all styling
    border: none;
    padding: none;
    cursor: pointer;

    border: ${(props) => (props.followed ? "2px solid " + cancelColor : "none")};

    :hover {
        border: 2px solid ${(props) => (props.followed ? brightenColor(cancelColor, 1.3) : focusedColor)};
    }

    //background-color: black;
`;
