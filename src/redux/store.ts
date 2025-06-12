// https://redux-toolkit.js.org/tutorials/quick-start

import { configureStore } from "@reduxjs/toolkit";
import graphicsSettingsReducer from "./graphicsSettingsSlice";
import debugReducer from "./debugSlice";
import universeSettingsReducer from "./universeSettingsSlice";
import controlsReducer from "./controlsSlice";
import informationReducer from "./informationSlice";
import binaryDataReducer from "./binaryDataSlice";
import { useDispatch } from "react-redux";

export const store = configureStore({
    reducer: {
        controls: controlsReducer,
        debug: debugReducer,
        information: informationReducer,
        graphicsSettings: graphicsSettingsReducer,
        universeSettings: universeSettingsReducer,
        binaryData: binaryDataReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredPaths: [
                    "binaryData.noiseTex", // Ignore the noise texture as it is not serializable
                ],
                ignoredActions: [
                    "binaryData/fetchNoiseTex/pending", // Ignore pending action for noise texture fetch
                    "binaryData/fetchNoiseTex/fulfilled", // Ignore fulfilled action for noise texture fetch
                    "binaryData/fetchNoiseTex/rejected", // Ignore rejected action for noise texture fetch
                ],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
