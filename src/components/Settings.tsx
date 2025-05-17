import styled from "@emotion/styled";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { useState } from "react";
import { CircleType } from "../redux/controlsSlice";
import { SolarSystemMassSolar } from "../lib/defines/solarSystem";
import { MassThresholds } from "../lib/defines/physics";

export function SettingsMenu() {
    const graphicsSettings = useSelector((state: RootState) => state.graphicsSettings);
    const universeSettings = useSelector((state: RootState) => state.universeSettings);
    const showDebug = useSelector((state: RootState) => state.controls.showDebug);
    const circleType = useSelector((state: RootState) => state.controls.circleType);
    const dispatch = useDispatch();

    const [seed, setSeed] = useState(universeSettings.seed);
    const [numBodies, setNumBodies] = useState(universeSettings.numBodies);
    const [minMass, setMinMass] = useState(universeSettings.minMass);
    const [maxMass, setMaxMass] = useState(universeSettings.maxMass);
    const [starInCenter, setStarInCenter] = useState(universeSettings.starInCenter);
    const [centerStarMass, setCenterStarMass] = useState(universeSettings.centerStarMass);

    const MAX_BODY_MASS = 10.0; // 10 solar masses
    const MIN_BODY_MASS = SolarSystemMassSolar.PLUTO;
    const MIN_STAR_MASS = MassThresholds.STAR;
    const MAX_STAR_MASS = 100.0;

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
                <div>
                    <input
                        type="checkbox"
                        id="setStarInCenter"
                        checked={starInCenter}
                        onChange={(e) => {
                            setStarInCenter(e.target.checked);
                        }}
                    />
                    <label htmlFor="setStarInCenter">Central Star</label>
                </div>
                <div>
                    <label htmlFor="centralStarMass">Mass:</label>
                    <input
                        type="number"
                        value={centerStarMass}
                        onChange={(e) => {
                            const val = e.target.valueAsNumber;
                            if (val < universeSettings.starThreshold) {
                                setCenterStarMass(universeSettings.starThreshold);
                                return;
                            }
                            if (val > MAX_STAR_MASS) {
                                setCenterStarMass(MAX_STAR_MASS);
                                return;
                            }
                            setCenterStarMass(e.target.valueAsNumber);
                        }}
                        disabled={!starInCenter}
                    />
                </div>

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
                <label>Max and Min Mass</label>
                <div>
                    <input
                        className="big"
                        type="number"
                        value={minMass}
                        onChange={(e) => {
                            const val = e.target.valueAsNumber;
                            if (val > maxMass) {
                                setMinMass(maxMass);
                                return;
                            }
                            if (val < MIN_BODY_MASS) {
                                setMinMass(MIN_BODY_MASS);
                                return;
                            }
                            setMinMass(e.target.valueAsNumber);
                        }}
                        step="1"
                    />
                    <input
                        className="big"
                        type="number"
                        value={maxMass}
                        onChange={(e) => {
                            const val = e.target.valueAsNumber;
                            if (val < minMass) {
                                setMaxMass(minMass);
                                return;
                            }
                            if (val > MAX_BODY_MASS) {
                                setMaxMass(MAX_BODY_MASS);
                                return;
                            }
                            setMaxMass(e.target.valueAsNumber);
                        }}
                        step="1"
                    />
                </div>

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
                                starInCenter: starInCenter,
                                centerStarMass: centerStarMass,
                                minMass: minMass,
                                maxMass: maxMass,
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

        input.big {
            width: 5rem;
        }
    }
`;
