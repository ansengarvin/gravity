import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LeaderboardBody {
    index: number;
    mass: number;
    color: string;
    dOrigin: number;
    vOrigin: number;
    aOrigin: number;
    dTarget: number;
    vTarget: number;
    aTarget: number;
    numSatellites: number;
    orbiting: number;
    dOrbit: number;
    orbitColor: string;
}

export interface InformationState {
    leaderboard: Array<LeaderboardBody>;
    numActiveBodies: number;
    numStars: number;
    yearsElapsed: number;
    followedBodyRadius: number | null;
}

const initialState: InformationState = {
    leaderboard: [],
    numActiveBodies: 0,
    numStars: 0,
    yearsElapsed: 0,
    followedBodyRadius: null,
};

export const informationSlice = createSlice({
    name: "information",
    initialState,
    reducers: {
        setLeaderboard: (state, action: PayloadAction<Array<LeaderboardBody>>) => {
            state.leaderboard = action.payload;
        },
        setNumActiveBodies: (state, action: PayloadAction<number>) => {
            state.numActiveBodies = action.payload;
        },
        setNumStars: (state, action: PayloadAction<number>) => {
            state.numStars = action.payload;
        },
        setYearsElapsed: (state, action: PayloadAction<number>) => {
            state.yearsElapsed = action.payload;
            console.log(state.yearsElapsed);
        },
        setFollowedBodyRadius: (state, action: PayloadAction<number | null>) => {
            state.followedBodyRadius = action.payload;
        },
    },
});

export default informationSlice.reducer;
