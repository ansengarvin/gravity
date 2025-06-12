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
    rotationMultiplier: number;
    axialTiltMean: number; // Mean axial tilt of the bodies in degrees
    axialTiltStdev: number; // Standard deviation of axial tilt in degrees
    numFeatureTexels: number; // The number of texels each planet has available to procedurally generate shaders
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
    massBiasExponent: 8.0, // Bias towards smaller masses, 1.0 is linear, > 1.0 is more biased towards smaller masses
    rotationMultiplier: 1, // Multiplier for the rotation speed of bodies, 1.0 means normal speed
    axialTiltMean: Math.PI / 12, // Mean axial tilt of the bodies in degrees
    axialTiltStdev: Math.PI / 9, // Standard deviation of axial tilt in degrees
    numFeatureTexels: 4,
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
