import styled from "@emotion/styled";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { useState } from "react";

export function SettingsMenu() {
    const graphicsSettings = useSelector((state: RootState) => state.graphicsSettings);
    const universeSettings = useSelector((state: RootState) => state.universeSettings);
    const showDebug = useSelector((state: RootState) => state.information.showDebug);
    const showCircles = useSelector((state: RootState) => state.information.showCircles);
    const circleType = useSelector((state: RootState) => state.information.circleType);
    const dispatch = useDispatch();

    const [seed, setSeed] = useState(universeSettings.seed);
    const [numBodies, setNumBodies] = useState(universeSettings.numBodies);

    return (
        <SettingsStyle>
            General
            <div>
                <button
                    onClick={() => {
                        dispatch({ type: "information/toggleDebug" });
                    }}
                >
                    {showDebug ? "Hide Debug" : "Show Debug"}
                </button>
                <button
                    onClick={() => {
                        dispatch({ type: "information/toggleCircles" });
                    }}
                >
                    {showCircles ? "Hide Circles" : "Show Circles"}
                </button>
            </div>
            <button
                onClick={() => {
                    dispatch({ type: "information/toggleCircleType" });
                }}
            >
                {circleType === "incremental" ? "Incremental Circles" : "Solar Circles"}
            </button>
            Graphics
            <button
                onClick={() => {
                    dispatch({ type: "graphicsSettings/toggleStarLight" });
                }}
            >
                {graphicsSettings.starLight ? "Disable Star Light" : "Enable Star Light"}
            </button>
            Simulation
            <form>
                <label>Seed</label>
                <input
                    type="text"
                    value={seed}
                    onChange={(e) => {
                        setSeed(e.target.value);
                    }}
                />
                <label>Num. Grav. Bodies</label>
                <input
                    type="number"
                    value={numBodies}
                    onChange={(e) => {
                        const val = e.target.valueAsNumber;
                        if (val > 1000) {
                            setNumBodies(1000);
                            return;
                        }
                        setNumBodies(e.target.valueAsNumber);
                    }}
                    step="1"
                />
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        dispatch({
                            type: "universeSettings/setAll",
                            payload: {
                                seed: seed,
                                timeStep: universeSettings.timeStep,
                                numBodies: numBodies,
                                size: universeSettings.size,
                                starThreshold: universeSettings.starThreshold,
                            },
                        });
                    }}
                >
                    Create New Universe
                </button>
            </form>
        </SettingsStyle>
    );
}

const SettingsStyle = styled.div`
    grid-area: menus;

    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5px;

    height: 100%;
    width: 320px;
    color: white;
    background-color: #202020;
    border: 2px solid white;

    z-index: 3;

    margin-left: auto;
    margin-right: auto;

    form {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        input[type="number"] {
            width: 3rem;
        }
    }
`;
