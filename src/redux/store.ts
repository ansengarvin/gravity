// https://redux-toolkit.js.org/tutorials/quick-start

import { configureStore } from "@reduxjs/toolkit";
import graphicsSettingsReducer from "./graphicsSettingsSlice";
import debugMenuReducer from "./debugSlice";
import universeSettingsReducer from "./universeSettingsSlice";

export const store = configureStore({
    reducer: {
        debugMenu: debugMenuReducer,
        graphicsSettings: graphicsSettingsReducer,
        universeSettings: universeSettingsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
