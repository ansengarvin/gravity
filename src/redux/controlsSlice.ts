import { createSlice } from "@reduxjs/toolkit";

export enum MenuName {
    NONE,
    LEADERBOARD,
    SETTINGS,
}

export enum CircleType {
    INCREMENTAL,
    SOLAR,
}

export interface ControlsState {
    paused: boolean;
    resetSim: number;
    resetCam: number;
    menuShown: MenuName;
    bodyFollowed: number;
    showDebug: boolean;
    showCircles: boolean;
    circleType: CircleType;
}

const initialState: ControlsState = {
    paused: true,
    resetSim: 0,
    resetCam: 0,
    bodyFollowed: -1,
    menuShown: MenuName.NONE,
    showDebug: false,
    showCircles: false,
    circleType: CircleType.INCREMENTAL,
};

export const controlSlice = createSlice({
    name: "controls",
    initialState,
    reducers: {
        togglePaused: (state) => {
            state.paused = !state.paused;
        },
        resetSim: (state) => {
            state.resetSim += 1;
        },
        resetCam: (state) => {
            state.bodyFollowed = -1;
            state.resetCam += 1;
        },
        setBodyFollowed: (state, action) => {
            state.bodyFollowed = action.payload;
        },
        unsetBodyFollowed: (state) => {
            state.bodyFollowed = -1;
        },
        setMenuShown: (state, action) => {
            state.menuShown = action.payload;
        },
        hideMenu: (state) => {
            state.menuShown = MenuName.NONE;
        },
        toggleDebug: (state) => {
            state.showDebug = !state.showDebug;
        },
        toggleCircles: (state) => {
            state.showCircles = !state.showCircles;
        },
        toggleCircleType: (state) => {
            state.circleType = state.circleType === CircleType.INCREMENTAL ? CircleType.SOLAR : CircleType.INCREMENTAL;
        },
    },
});

export const { togglePaused, resetSim, resetCam, setBodyFollowed, unsetBodyFollowed, setMenuShown, hideMenu } =
    controlSlice.actions;

export default controlSlice.reducer;
