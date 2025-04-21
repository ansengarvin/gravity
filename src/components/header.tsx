import styled from "@emotion/styled";

import { color_offwhite } from "../lib/defines/colors.tsx";
import { tablet, phone } from "../lib/defines/screenWidths.tsx";

const Headerbar = styled.div`
    grid-area: top;
    height: 50px;
    margin-bottom: 5px;

    display: grid;
    grid-template-areas: "left center right";
    grid-template-columns: 200px 1fr 200px;
    grid-template-rows: 1fr;

    border-bottom: 0.25rem solid ${color_offwhite};

    @media (max-width: ${phone}) {
        height: 30px;
    }

    a {
        //Remove default styling
        text-decoration: none;
        color: inherit;
        background: none;
        border: none;
        padding: 0;
        margin: 0;
        font: inherit;
        outline: none;

        // My styling
        color: ${color_offwhite};
        font-size: 1rem;

        display: flex;
        align-items: center;
        justify-content: center;
        height: 2rem;
        margin-left: 10px;
        @media (max-width: ${tablet}) {
            margin-left: 5px;
        }

        @media (max-width: ${phone}) {
            margin-left: 0px;
            font-size: 0.95rem;
        }
    }
`;

const Left = styled.div`
    grid-area: left;
    display: flex;
    justify-content: flex-start;
    align-items: center;
`;

const Center = styled.div`
    grid-area: center;
    display: flex;
    justify-content: center;
    align-items: center;

    h1 {
        // Remove all formatting
        text-decoration: none;
        color: inherit;
        background: none;
        border: none;
        padding: 0;
        margin: 0;
    }
`;

export function Header() {
    return (
        <Headerbar>
            <Left>
                <a href="https://ansengarvin.com/projects">See Other Projects</a>
            </Left>
            <Center>
                <h1>Gravity</h1>
            </Center>
        </Headerbar>
    );
}
