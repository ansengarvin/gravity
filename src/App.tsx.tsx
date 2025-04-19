import styled from "@emotion/styled";
import { Sim } from "./components/Sim";
import { useRef, useState } from "react";
import { Leaderboard, LeaderboardBody } from "./components/Leaderboard";
import { Header } from "./components/header";

const Backdrop = styled.div`
    display: grid;
    grid-template-areas:
        "top top top"
        "stats simulation controls"
        "foot foot foot";
    grid-template-rows: min-content 1fr 25px;
    grid-template-columns: 250px 1fr 250px;
    height: 100%;
    width: 100%;
    z-index: 1;
    position: relative;
    pointer-events: none;

    & * {
        pointer-events: auto;
    }
`;

const StatScreen = styled.div`
    grid-area: stats;
    padding-left: 10px;
`;

const SimScreen = styled.div`
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: 0;
`;

const ButtonSection = styled.div`
    grid-area: buttons;
    background-color: green;
`

export function App() {
    const [numActive, setNumActive] = useState(0);
    const [leaderboardBodies, setLeaderboardBodies] = useState<Array<LeaderboardBody>>([]);

    /*
        Leaderboard wants a state because it needs to be able to re-render every time the followed body is changed.
        Sim wants a ref because the Universe class needs real-time access to the followed body as it's being changed by the user.
        I set both a state and a ref to the same value, and then I can use the ref in the Sim class and the state in the Leaderboard.
    */
    const [bodyFollowed, setBodyFollowed] = useState<number>(-1);
    const bodyFollowedRef = useRef<number>(bodyFollowed);
    const updateBodyFollowed = (newBodyFollowed: number) => {
        setBodyFollowed(newBodyFollowed);
        bodyFollowedRef.current = newBodyFollowed;
    };
    return (
        <>
            <SimScreen>
                <Sim
                    width="1920px"
                    height="1080px"
                    setNumActive={setNumActive}
                    setLeaderboardBodies={setLeaderboardBodies}
                    bodyFollowedRef={bodyFollowedRef}
                    updateBodyFollowed={updateBodyFollowed}
                />
            </SimScreen>
            <Backdrop>
                <Header />
                <StatScreen>Number of Bodies: {numActive}</StatScreen>
                <Leaderboard
                    leaderboardBodies={leaderboardBodies}
                    bodyFollowed={bodyFollowed}
                    updateBodyFollowed={updateBodyFollowed}
                />

            </Backdrop>
        </>
    );
}
