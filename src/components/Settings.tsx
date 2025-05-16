import styled from "@emotion/styled";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { useState } from "react";
import { CircleType } from "../redux/controlsSlice";

export function SettingsMenu() {
    const graphicsSettings = useSelector((state: RootState) => state.graphicsSettings);
    const universeSettings = useSelector((state: RootState) => state.universeSettings);
    const showDebug = useSelector((state: RootState) => state.controls.showDebug);
    const circleType = useSelector((state: RootState) => state.controls.circleType);
    const dispatch = useDispatch();

    const [seed, setSeed] = useState(universeSettings.seed);
    const [numBodies, setNumBodies] = useState(universeSettings.numBodies);

    return (
        <SettingsStyle>
            General
            <div>
                <button
                    onClick={() => {
                        dispatch({ type: "controls/toggleDebug" });
                    }}
                >
                    {showDebug ? "Hide Debug" : "Show Debug"}
                </button>
            </div>
            <label>Circles:</label>
            <div>
                <input
                    type="radio"
                    id="none"
                    name="circles"
                    checked={circleType === CircleType.NONE}
                    onChange={() => dispatch({ type: "controls/setCircleType", payload: CircleType.NONE })}
                />
                <label htmlFor="none">None</label>
                <input
                    type="radio"
                    id="incremental"
                    name="circles"
                    checked={circleType === CircleType.INCREMENTAL}
                    onChange={() => dispatch({ type: "controls/setCircleType", payload: CircleType.INCREMENTAL })}
                />
                <label htmlFor="incremental">Incremental</label>
                <input
                    type="radio"
                    id="solar"
                    name="circles"
                    checked={circleType === CircleType.SOLAR}
                    onChange={() => dispatch({ type: "controls/setCircleType", payload: CircleType.SOLAR })}
                />
                <label htmlFor="solar">Solar</label>
            </div>
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
