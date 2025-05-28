import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SolarSystemMassSolar } from "../lib/defines/solarSystem";
import { getRandomSeed } from "../random/seed";

export interface UniverseSettings {
    seed: string;
    timeStep: number;
    numBodies: number; // THe number of starting bodies in the universe
    size: number; // The size of the universe in astronomical units
    starInCenter: boolean;
    centerStarMass: number;
    minMass: number;
    maxMass: number;
    massBiasExponent: number;
}

const initialState: UniverseSettings = {
    seed: getRandomSeed(),
    timeStep: 1.0 / 12.0, // time step in years (1 month)
    numBodies: 500,
    size: 20, // The size of the universe in astronomical units
    starInCenter: true,
    centerStarMass: 1.0,
    minMass: SolarSystemMassSolar.MARS,
    maxMass: SolarSystemMassSolar.JUPITER,
    massBiasExponent: 2.0, // Bias towards smaller masses, 1.0 is linear, < 1.0 is more biased towards smaller masses
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
            state.massBiasExponent = action.payload.massBiasExponent;
        },
    },
});

export const { setAll } = universeSettingsSlice.actions;

export default universeSettingsSlice.reducer;
