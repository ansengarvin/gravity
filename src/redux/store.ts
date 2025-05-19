// https://redux-toolkit.js.org/tutorials/quick-start

import { configureStore } from "@reduxjs/toolkit";
import graphicsSettingsReducer from "./graphicsSettingsSlice";
import debugReducer from "./debugSlice";
import universeSettingsReducer from "./universeSettingsSlice";
import controlsReducer from "./controlsSlice";
import informationReducer from "./informationSlice";

export const store = configureStore({
    reducer: {
        controls: controlsReducer,
        debug: debugReducer,
        information: informationReducer,
        graphicsSettings: graphicsSettingsReducer,
        universeSettings: universeSettingsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
