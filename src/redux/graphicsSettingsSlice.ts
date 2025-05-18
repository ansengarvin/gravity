import { createSlice } from "@reduxjs/toolkit";

export interface GraphicsSettingsState {
    starLight: boolean;
    renderEnabled: boolean;
}

const initialState: GraphicsSettingsState = {
    starLight: true,
    renderEnabled: true,
};

export const graphicsSettingsSlice = createSlice({
    name: "graphicsSettings",
    initialState,
    reducers: {
        toggleStarLight: (state) => {
            state.starLight = !state.starLight;
        },
        toggleRender: (state) => {
            state.renderEnabled = !state.renderEnabled;
        },
    },
});

export const { toggleStarLight } = graphicsSettingsSlice.actions;

export default graphicsSettingsSlice.reducer;
