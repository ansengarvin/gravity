import styled from "@emotion/styled";
import { Sim } from "./components/Sim";
import { useState } from "react";

const Backdrop = styled.div`
    display: grid;
    grid-template-areas: 
        "top top top"
        "stats screen controls"
        "foot foot foot";
    grid-template-rows: 100px 1fr 25px;
    grid-template-columns: auto auto auto;
    height: 100%;
`

export function App() {
    const [numActive, setNumActive] = useState(0)
    return (
        <Backdrop>
            Number of Active Planets: {numActive}
            <Sim width="1000px" height="750px"/>
        </Backdrop> 
    )
}