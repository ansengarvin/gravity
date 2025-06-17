import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum MenuName {
    NONE,
    LEADERBOARD,
    SETTINGS,
}

export enum CircleType {
    NONE,
    INCREMENTAL,
    SOLAR,
}

export interface ControlsState {
    paused: boolean;
    resetSim: number;
    resetCam: number;
    menuShown: MenuName;
    bodyFollowed: number;
    bodyHovered: number;
    showDebug: boolean;
    circleType: CircleType;
}

const initialState: ControlsState = {
    paused: true,
    resetSim: 0,
    resetCam: 0,
    bodyFollowed: -1,
    bodyHovered: -1,
    menuShown: MenuName.NONE,
    showDebug: false,
    circleType: CircleType.NONE,
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
        setBodyFollowed: (state, action: PayloadAction<number>) => {
            state.bodyFollowed = action.payload;
        },
        setBodyHovered: (state, action: PayloadAction<number>) => {
            state.bodyHovered = action.payload;
            console.log("setBodyHovered", action.payload);
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
        setCircleType: (state, action: PayloadAction<CircleType>) => {
            state.circleType = action.payload;
        },
    },
});

export const { togglePaused, resetSim, resetCam, setBodyFollowed, unsetBodyFollowed, setMenuShown, hideMenu } =
    controlSlice.actions;

export default controlSlice.reducer;
