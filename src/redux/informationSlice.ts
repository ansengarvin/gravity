import { createSlice } from "@reduxjs/toolkit";

export interface InformationState {
    // Universe information variables
    fps: number;
    tps: number; // ticks per second
    numActiveBodies: number;
    numStars: number;
    yearsElapsed: number;
    followedBodyRadius: number | null;
    // Graphics debug variables
    maxVertexUniformVectors: number | null;
    maxFragmentUniformVectors: number | null;
    maxUniformBufferBindingPoints: number | null;
    maxSamples: number | null;
    rgba32fSupported: boolean | null;
    rgba16fSupported: boolean | null;
    oesFloatLinearSupported: boolean | null;
    oesHalfFloatLinearSupported: boolean | null;
    numActiveUniforms: number | null;
    numActiveUniformVectors: number | null;
    internalFormatUsed: string | null;
}

const initialState: InformationState = {
    //
    fps: 0,
    tps: 0,
    // Simulation variables
    numActiveBodies: 0,
    numStars: 0,
    yearsElapsed: 0,
    followedBodyRadius: null,
    // Debug variables are actually initialized by the program.
    // Set to null here so if these dispatches fail, we can know.
    maxVertexUniformVectors: null,
    maxFragmentUniformVectors: null,
    maxUniformBufferBindingPoints: null,
    maxSamples: null,
    rgba32fSupported: null,
    rgba16fSupported: null,
    oesFloatLinearSupported: null,
    oesHalfFloatLinearSupported: null,
    numActiveUniforms: null,
    numActiveUniformVectors: null,
    internalFormatUsed: null,
};

export const informationSlice = createSlice({
    name: "information",
    initialState,
    reducers: {
        setFPS: (state, action) => {
            state.fps = action.payload;
        },
        setTPS: (state, action) => {
            state.tps = action.payload;
        },
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
        setOesFloatLinearSupported: (state, action) => {
            state.oesFloatLinearSupported = action.payload;
        },
        setOesHalfFloatLinearSupported: (state, action) => {
            state.oesHalfFloatLinearSupported = action.payload;
        },
        setInternalFormatUsed: (state, action) => {
            state.internalFormatUsed = action.payload;
        },
        setFollowedBodyRadius: (state, action) => {
            state.followedBodyRadius = action.payload;
        },
    },
});

export default informationSlice.reducer;
