import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
        setFPS: (state, action: PayloadAction<number>) => {
            state.fps = action.payload;
        },
        setTPS: (state, action: PayloadAction<number>) => {
            state.tps = action.payload;
        },
        setNumActiveBodies: (state, action: PayloadAction<number>) => {
            state.numActiveBodies = action.payload;
        },
        setNumStars: (state, action: PayloadAction<number>) => {
            state.numStars = action.payload;
        },
        setYearsElapsed: (state, action: PayloadAction<number>) => {
            state.yearsElapsed = action.payload;
        },
        setFollowedBodyRadius: (state, action: PayloadAction<number | null>) => {
            state.followedBodyRadius = action.payload;
        },
        setMaxVertexUniformVectors: (state, action: PayloadAction<number | null>) => {
            state.maxVertexUniformVectors = action.payload;
        },
        setMaxFragmentUniformVectors: (state, action: PayloadAction<number | null>) => {
            state.maxFragmentUniformVectors = action.payload;
        },
        setMaxUniformBufferBindingPoints: (state, action: PayloadAction<number | null>) => {
            state.maxUniformBufferBindingPoints = action.payload;
        },
        setMaxSamples: (state, action: PayloadAction<number | null>) => {
            state.maxSamples = action.payload;
        },
        setRgba32fSupported: (state, action: PayloadAction<boolean | null>) => {
            state.rgba32fSupported = action.payload;
        },
        setRgba16fSupported: (state, action: PayloadAction<boolean | null>) => {
            state.rgba16fSupported = action.payload;
        },
        setOesFloatLinearSupported: (state, action: PayloadAction<boolean | null>) => {
            state.oesFloatLinearSupported = action.payload;
        },
        setOesHalfFloatLinearSupported: (state, action: PayloadAction<boolean | null>) => {
            state.oesHalfFloatLinearSupported = action.payload;
        },
        setNumActiveUniforms: (state, action: PayloadAction<number | null>) => {
            state.numActiveUniforms = action.payload;
        },
        setNumActiveUniformVectors: (state, action: PayloadAction<number | null>) => {
            state.numActiveUniformVectors = action.payload;
        },
        setInternalFormatUsed: (state, action: PayloadAction<string | null>) => {
            state.internalFormatUsed = action.payload;
        },
    },
});

export default informationSlice.reducer;
