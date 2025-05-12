// https://redux-toolkit.js.org/tutorials/quick-start

import { configureStore } from "@reduxjs/toolkit";
import graphicsSettingsReducer from "./graphicsSettingsSlice";
import debugMenuReducer from "./debugSlice";

export const store = configureStore({
    reducer: {
        graphicsSettings: graphicsSettingsReducer,
        debugMenu: debugMenuReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
