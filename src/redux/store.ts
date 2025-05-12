// https://redux-toolkit.js.org/tutorials/quick-start

import { configureStore } from "@reduxjs/toolkit";
import graphicsSettingsReducer from "./graphicsSettingsSlice";
import debugInfoReducer from "./debugSlice";
import universeSettingsReducer from "./universeSettingsSlice";
import controlsReducer from "./controlsSlice";

export const store = configureStore({
    reducer: {
        controls: controlsReducer,
        debugInfo: debugInfoReducer,
        graphicsSettings: graphicsSettingsReducer,
        universeSettings: universeSettingsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
