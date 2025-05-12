import { createSlice } from "@reduxjs/toolkit";

export enum MenuName {
    NONE = "none",
    LEADERBOARD = "leaderboard",
    SETTINGS = "settings",
}

export interface ControlsState {
    paused: boolean;
    resetSim: number;
    resetCam: number;
    menuShown: MenuName;
    bodyFollowed: number;
}

const initialState: ControlsState = {
    paused: true,
    resetSim: 0,
    resetCam: 0,
    bodyFollowed: -1,
    menuShown: MenuName.NONE,
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
    },
});

export const { togglePaused, resetSim, resetCam, setBodyFollowed, unsetBodyFollowed, setMenuShown, hideMenu } =
    controlSlice.actions;

export default controlSlice.reducer;
