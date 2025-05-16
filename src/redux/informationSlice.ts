import { createSlice } from "@reduxjs/toolkit";

export interface InformationState {
    // Universe information variables
    numActiveBodies: number;
    numStars: number;
    yearsElapsed: number;
    // Graphics debug variables
    maxVertexUniformVectors: number | null;
    maxFragmentUniformVectors: number | null;
    maxUniformBufferBindingPoints: number | null;
    maxSamples: number | null;
    rgba32fSupported: boolean | null;
    rgba16fSupported: boolean | null;
    numActiveUniforms: number | null;
    numActiveUniformVectors: number | null;
}

const initialState: InformationState = {
    numActiveBodies: 0,
    numStars: 0,
    yearsElapsed: 0,
    // Debug variables are actually initialized by the program.
    // Set to null here so if these dispatches fail, we can know.
    maxVertexUniformVectors: null,
    maxFragmentUniformVectors: null,
    maxUniformBufferBindingPoints: null,
    maxSamples: null,
    rgba32fSupported: null,
    rgba16fSupported: null,
    numActiveUniforms: null,
    numActiveUniformVectors: null,
};

export const informationSlice = createSlice({
    name: "information",
    initialState,
    reducers: {
        setNumActiveBodies: (state, action) => {
            state.numActiveBodies = action.payload;
        },
        setNumStars: (state, action) => {
            state.numStars = action.payload;
        },
        setMaxVertexUniformVectors: (state, action) => {
            state.maxVertexUniformVectors = action.payload;
        },
        setMaxFragmentUniformVectors: (state, action) => {
            state.maxFragmentUniformVectors = action.payload;
        },
        setMaxUniformBufferBindingPoints: (state, action) => {
            state.maxUniformBufferBindingPoints = action.payload;
        },
        setMaxSamples: (state, action) => {
            state.maxSamples = action.payload;
        },
        setNumActiveUniforms: (state, action) => {
            state.numActiveUniforms = action.payload;
        },
        setNumActiveUniformVectors: (state, action) => {
            state.numActiveUniformVectors = action.payload;
        },
        setYearsElapsed: (state, action) => {
            state.yearsElapsed = action.payload;
        },
        setRgba32fSupported: (state, action) => {
            state.rgba32fSupported = action.payload;
        },
        setRgba16fSupported: (state, action) => {
            state.rgba16fSupported = action.payload;
        },
    },
});

export default informationSlice.reducer;
