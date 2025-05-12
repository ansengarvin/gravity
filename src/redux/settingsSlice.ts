import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface SettingsState {
    test: number
}

const initialState: SettingsState = {
    test: 0
}

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        set: (state, action: PayloadAction<SettingsState>) => {
            state.test = action.payload.test
        }
    }
})

export const {set} = settingsSlice.actions

export default settingsSlice.reducer