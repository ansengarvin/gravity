import { createSlice } from "@reduxjs/toolkit";

export interface UniverseSettings {
    seed: string;
    timeStep: number;
    numBodies: number; // THe number of starting bodies in the universe
    size: number; // The size of the universe in astronomical units
    starThreshold: number;
}

const initialState: UniverseSettings = {
    seed: "irrelevant",
    timeStep: 1.0 / 12.0, // time step in years (1 month)
    numBodies: 500,
    size: 20, // The size of the universe in astronomical units|
    starThreshold: 0.8,
}

export const universeSettingsSlice = createSlice({
    name: "universeSettings",
    initialState,
    reducers: {
        setAll: (state: UniverseSettings, action) => {
            state.seed = action.payload.seed;
            state.timeStep = action.payload.timeStep;
            state.numBodies = action.payload.numBodies;
            state.size = action.payload.size;
            state.starThreshold = action.payload.starThreshold;
        }
    },
})

export const {setAll} = universeSettingsSlice.actions;

export default universeSettingsSlice.reducer;