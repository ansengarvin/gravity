import styled from "@emotion/styled";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { useState } from "react";
import { CircleType } from "../redux/controlsSlice";
import { SolarSystemMassSolar } from "../lib/defines/solarSystem";
import { MassThresholds } from "../lib/defines/physics";
import { Menu, Tab } from "./Menu";

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

    enum SettingsTabType {
        SIMULATION,
        GRAPHICS,
        DEBUG,
    }

    const [activeTab, setActiveTab] = useState(SettingsTabType.SIMULATION);

    const settingsTab: Tab[] = [
        { label: "Sim", value: SettingsTabType.SIMULATION },
        { label: "Graphics", value: SettingsTabType.GRAPHICS },
        { label: "Debug", value: SettingsTabType.DEBUG },
    ];

    return (
        <Menu tabs={settingsTab} activeTab={activeTab} setActiveTab={setActiveTab}>
            <SettingsStyle>
                {activeTab == SettingsTabType.SIMULATION && (
                    <>
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
                                onChange={() =>
                                    dispatch({ type: "controls/setCircleType", payload: CircleType.INCREMENTAL })
                                }
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
                                        if (val < MIN_STAR_MASS) {
                                            setCenterStarMass(MIN_STAR_MASS);
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
                                    if (val > 5000) {
                                        setNumBodies(5000);
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
                    </>
                )}
                {activeTab == SettingsTabType.DEBUG && (
                    <div>
                        <button
                            onClick={() => {
                                dispatch({ type: "controls/toggleDebug" });
                            }}
                        >
                            {showDebug ? "Hide Debug" : "Show Debug"}
                        </button>
                    </div>
                )}
                {activeTab == SettingsTabType.GRAPHICS && (
                    <button
                        onClick={() => {
                            dispatch({ type: "graphicsSettings/toggleStarLight" });
                        }}
                    >
                        {graphicsSettings.starLight ? "Disable Star Light" : "Enable Star Light"}
                    </button>
                )}
            </SettingsStyle>
        </Menu>
    );
}

const SettingsStyle = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5px;

    height: 160px;
    overflow-y: auto;

    color: white;
    background-color: black;
    border: solid white 2px;
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
