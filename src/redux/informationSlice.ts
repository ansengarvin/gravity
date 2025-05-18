import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface InformationState {
    numActiveBodies: number;
    numStars: number;
    yearsElapsed: number;
    followedBodyRadius: number | null;
}

const initialState: InformationState = {
    numActiveBodies: 0,
    numStars: 0,
    yearsElapsed: 0,
    followedBodyRadius: null,
};

export const informationSlice = createSlice({
    name: "information",
    initialState,
    reducers: {
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
    },
});

export default informationSlice.reducer;
