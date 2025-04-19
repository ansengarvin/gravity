import styled from "@emotion/styled";

import { color_offwhite } from "../lib/defines/colors.tsx";
import { tablet, phone } from "../lib/defines/screenWidths.tsx";

const Headerbar = styled.div`
    grid-area: top;
    height: 20px;
    padding: 15px;
    margin-bottom: 5px;

    display: flex;
    align-items: center;

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

    h1 {
        margin-left: auto;
        margin-right: auto;
    }
`;

export function Header() {
    return (
        <Headerbar>
            <a href="https://ansengarvin.com/projects">See Other Projects</a>
            <h1>N-Body Gravity Simulation</h1>
        </Headerbar>
    );
}
