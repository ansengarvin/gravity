import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface GraphicsSettingsState {
    starLight: boolean
}

const initialState: GraphicsSettingsState = {
    starLight: true
}

export const graphicsSettingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        toggleStarLight: (state) => {
            state.starLight = !state.starLight
        }
    }
})

export const {toggleStarLight} = graphicsSettingsSlice.actions

export default graphicsSettingsSlice.reducer