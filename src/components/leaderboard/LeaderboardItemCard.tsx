import styled from "@emotion/styled";
import { brightenColor } from "../../lib/colors/brightenColor";
import { LeaderboardBody } from "./LeaderboardBody";

const LeaderboardItemCardStyle = styled.div<{color: string}>`
    display: flex;
    flex-direction: row;
    gap: 5px;
    width: min-content;
    height: min-content;

    margin-bottom: 5px;

    & > * {
        background-color: ${props => props.color};
    };
    &:hover >* {
        background-color: ${props => brightenColor(props.color, 1.3)};
    }
    button: {
        background-color: ${props => brightenColor(props.color, 1.7)};
    }
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

const SelectButton = styled.button`
    width: 50px;

    // Remove all styling
    border: none;
    padding: none;
`

interface LeaderboardItemCardProps {
    item: LeaderboardBody;
    selected: boolean;
}

const ButtonWidth = '50px';
const NameWidth = '50px';
const MassWidth = '100px';
const DistanceWidth = '120px';


export function LeaderboardHeader() {
    return (
        <LeaderboardHeaderStyle color={'black'}>
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
    const { item, selected } = props;

    return (
        <LeaderboardItemCardStyle color={item.color}>
            <SelectButton>
                
            </SelectButton>
            <InfoCard width={NameWidth}>
                {item.index.toFixed()}
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
