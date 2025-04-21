import styled from "@emotion/styled";
import { brightenColor } from "../../lib/colors/brightenColor";
import { LeaderboardBody } from "./LeaderboardBody";
import { TargetIcon } from "../../assets/icons/TargetIcon";

interface LeaderboardItemCardProps {
    item: LeaderboardBody;
    followed: boolean;
    updateBodyFollowed: (newBodyFollowed: number) => void;
}

const ButtonWidth = '50px';
const NameWidth = '50px';
const MassWidth = '100px';
const DistanceWidth = '120px';


export function LeaderboardHeader() {
    return (
        <LeaderboardHeaderStyle color={'black'} followed={false}>
            <HeaderCard width={ButtonWidth}>
               
            </HeaderCard>
            <HeaderCard width={NameWidth}>
                Name
            </HeaderCard>
            <HeaderCard width={MassWidth}>
                Mass (M<sub>☉</sub>)
            </HeaderCard>
            <HeaderCard width={DistanceWidth}>
                Dist. (Origin, AU)
            </HeaderCard>
            <HeaderCard width={DistanceWidth}>
                Dist. (Target, AU)
            </HeaderCard>
        </LeaderboardHeaderStyle>
    )
}

export function LeaderboardItemCard(props: LeaderboardItemCardProps) {
    const { item, followed, updateBodyFollowed} = props;

    return (
        <LeaderboardItemCardStyle color={item.color} followed={followed}>
            <SelectButton color={item.color} onClick={() => {
                updateBodyFollowed(item.index);
            }}>
                <TargetIcon filled={true} color={item.color} dim={'35px'}/>
            </SelectButton>
            <InfoCard width={NameWidth}>
                B-{item.index.toFixed()}
            </InfoCard>
            <InfoCard width={MassWidth}>
                {item.mass.toFixed(2)}
            </InfoCard>
            <InfoCard width={DistanceWidth}>
                {
                    Math.sqrt(item.pos.x**2 + item.pos.y**2 + item.pos.z**2).toFixed(2)
                }
            </InfoCard>
            <InfoCard width={DistanceWidth}>
                --
            </InfoCard>
        </LeaderboardItemCardStyle>
    )
}

const LeaderboardItemCardStyle = styled.div<{color: string, followed: boolean}>`
    display: flex;
    flex-direction: row;
    gap: 5px;
    margin-top: 5px;
    width: min-content;
    height: min-content;


    border-top: ${props => props.followed ? '3px solid red' : 'none'};
    border-bottom: ${props => props.followed ? '3px solid red' : 'none'};

    margin-bottom: 5px;

    & > * {
        background-color: ${props => props.color};
    };

    button {
        background-color: black;
    }
    /* &:hover >* {
        background-color: ${props => brightenColor(props.color, 1.3)};
    }
    button: {
        background-color: ${props => brightenColor(props.color, 1.7)};
    } */
`;

const InfoCard = styled.div<{width: string}>`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    width: ${props => props.width};
    padding-left: 5px;
    padding-right: 5px;
    color: black;

`

const LeaderboardHeaderStyle = styled(LeaderboardItemCardStyle)`
    position: sticky;
    top: 0;
    background-color: black;
    border-bottom: 4px solid white;
    margin: 0;
`

const HeaderCard = styled(InfoCard)`
    background-color: black;
    color: white;
    height: 25px;

    sub {
        vertical-align: sub;
        font-size: 0.75em;
    }
`

const SelectButton = styled.button<{color: string}>`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;

    // Remove all styling
    border: none;
    padding: none;

    //background-color: black;
`
