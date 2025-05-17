import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SolarSystemMassSolar } from "../lib/defines/solarSystem";

export interface UniverseSettings {
    seed: string;
    timeStep: number;
    numBodies: number; // THe number of starting bodies in the universe
    size: number; // The size of the universe in astronomical units
    starInCenter: boolean;
    centerStarMass: number;
    minMass: number;
    maxMass: number;
}

const initialState: UniverseSettings = {
    seed: "irrelevant",
    timeStep: 1.0 / 12.0, // time step in years (1 month)
    numBodies: 1000,
    size: 20, // The size of the universe in astronomical units
    starInCenter: true,
    centerStarMass: 1.0,
    minMass: SolarSystemMassSolar.MARS,
    maxMass: SolarSystemMassSolar.JUPITER,
};

export const universeSettingsSlice = createSlice({
    name: "universeSettings",
    initialState,
    reducers: {
        setAll: (state: UniverseSettings, action: PayloadAction<UniverseSettings>) => {
            state.seed = action.payload.seed;
            state.timeStep = action.payload.timeStep;
            state.numBodies = action.payload.numBodies;
            state.size = action.payload.size;
            state.starInCenter = action.payload.starInCenter;
            state.centerStarMass = action.payload.centerStarMass;
            state.minMass = action.payload.minMass;
            state.maxMass = action.payload.maxMass;
        },
    },
});

export const { setAll } = universeSettingsSlice.actions;

export default universeSettingsSlice.reducer;
