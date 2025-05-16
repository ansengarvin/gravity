import { createSlice } from "@reduxjs/toolkit";

export interface InformationState {
    // Universe debug variables
    numActiveBodies: number;
    numStars: number;
    // Graphics debug variables
    maxVertexUniformVectors: number;
    maxFragmentUniformVectors: number;
    maxUniformBufferBindingPoints: number;
    maxSamples: number;
    maxBufferBitDepth: string;
    numActiveUniforms: number;
    numActiveUniformVectors: number;
}

const initialState: InformationState = {
    numActiveBodies: 0,
    numStars: 0,
    maxVertexUniformVectors: 0,
    maxFragmentUniformVectors: 0,
    maxUniformBufferBindingPoints: 0,
    maxSamples: 0,
    maxBufferBitDepth: "",
    numActiveUniforms: 0,
    numActiveUniformVectors: 0,
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
        setMaxVertexUniforms: (state, action) => {
            state.maxVertexUniformVectors = action.payload;
        },
        setMaxFragmentUniforms: (state, action) => {
            state.maxFragmentUniformVectors = action.payload;
        },
        setMaxUniformBufferBindingPoints: (state, action) => {
            state.maxUniformBufferBindingPoints = action.payload;
        },
        setMaxSamples: (state, action) => {
            state.maxSamples = action.payload;
        },
        setMaxBufferBitDepth: (state, action) => {
            state.maxBufferBitDepth = action.payload;
        },
        setNumActiveUniforms: (state, action) => {
            state.numActiveUniforms = action.payload;
        },
        setNumActiveUniformVectors: (state, action) => {
            state.numActiveUniformVectors = action.payload;
        },
    },
});

export default informationSlice.reducer;
