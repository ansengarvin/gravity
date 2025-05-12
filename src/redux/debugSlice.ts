import { createSlice } from "@reduxjs/toolkit";

export interface DebugStatsState {
    showDebug: boolean;
}

const initialState: DebugStatsState = {
    showDebug: false,
}

export const debugMenuSlice = createSlice({
    name: "debugMenu",
    initialState,
    reducers: {
        toggleDebug: (state) => {
            state.showDebug = !state.showDebug;
        }
    },
});

export default debugMenuSlice.reducer;