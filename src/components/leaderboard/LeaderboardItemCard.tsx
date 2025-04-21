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

const ButtonWidth = "50px";
const NameWidth = "50px";
const MassWidth = "100px";
const DistanceWidth = "120px";
const focusedColor = "rgb(255, 227, 46)";
const cancelColor = "rgb(255, 131, 131)";

export function LeaderboardHeader(props: LeaderboardHeaderProps) {
    const { sortBy, updateSortBy } = props;
    console.log(sortBy)
    return (
        <LeaderboardHeaderStyle color={"black"} followed={false} buttonIsHovered={false}>
            <HeaderCard width={ButtonWidth} current={false}></HeaderCard>
            <HeaderCard width={NameWidth} current={sortBy === 'name'} onClick={() => {updateSortBy('name')}}>Name</HeaderCard>
            <HeaderCard width={MassWidth} current={sortBy === 'mass'} onClick={() => {updateSortBy('mass')}}>
                Mass (M<sub>☉</sub>)
            </HeaderCard>
            <HeaderCard width={DistanceWidth} current={sortBy === 'dOrigin'} onClick={() => {updateSortBy('dOrigin')}}>
                Dist. (Origin, AU)
            </HeaderCard>
            <HeaderCard width={DistanceWidth} current={sortBy === 'dTarget'} onClick={() => {updateSortBy('dTarget')}}>
                Dist. (Target, AU)
            </HeaderCard>
            <HeaderCard width={DistanceWidth} current={sortBy === 'orbiting'} onClick={() => {updateSortBy('orbiting')}}>
                Orbiting
            </HeaderCard>
            <HeaderCard width={DistanceWidth} current={sortBy === 'dOrbit'} onClick={() => {updateSortBy('dOrbit')}}>
                Dist. (Orbit, AU)
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
                        dim={"35px"}
                    />
                ) : (
                    <TargetIcon
                        filled={true}
                        color={buttonIsHovered ? brightenColor(focusedColor, 3) : focusedColor}
                        dim={"35px"}
                    />
                )}
            </SelectButton>
            <InfoCard width={NameWidth}>B-{item.index.toFixed()}</InfoCard>
            <InfoCard width={MassWidth}>{item.mass.toFixed(2)}</InfoCard>
            <InfoCard width={DistanceWidth}>{item.dOrigin.toFixed(2)}</InfoCard>
            <InfoCard width={DistanceWidth}>
                {
                    item.dTarget == -1
                    ?
                    <>--</>
                    :
                    item.dTarget.toFixed(2)
                }
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

    margin-bottom: 5px;

    & > * {
        background-color: ${(props) => props.color};
    }

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

const InfoCard = styled.div<{ width: string }>`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    width: ${(props) => props.width};
    padding-left: 5px;
    padding-right: 5px;
    color: black;
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
    width: 50px;
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
