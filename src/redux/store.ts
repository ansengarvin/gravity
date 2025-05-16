// https://redux-toolkit.js.org/tutorials/quick-start

import { configureStore } from "@reduxjs/toolkit";
import graphicsSettingsReducer from "./graphicsSettingsSlice";
import informationReducer from "./informationSlice";
import universeSettingsReducer from "./universeSettingsSlice";
import controlsReducer from "./controlsSlice";

export const store = configureStore({
    reducer: {
        controls: controlsReducer,
        information: informationReducer,
        graphicsSettings: graphicsSettingsReducer,
        universeSettings: universeSettingsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
