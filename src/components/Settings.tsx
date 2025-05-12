import styled from "@emotion/styled";
import React from "react";
import {useSelector, useDispatch} from 'react-redux'
import { LightingMode } from "../lib/webGL/shaderPrograms";
import { SettingsState } from "../redux/settingsSlice";
import { RootState } from "../redux/store";

interface SettingsMenuProps {
    debugStatsShown: boolean;
    setDebugStatsShown: React.Dispatch<React.SetStateAction<boolean>>;
    lightingMode: LightingMode;
    setLightingMode: React.Dispatch<React.SetStateAction<LightingMode>>;
    renderToTexture: boolean;
    setRenderToTexture: React.Dispatch<React.SetStateAction<boolean>>;
}

export function SettingsMenu(props: SettingsMenuProps) {
    const { debugStatsShown, setDebugStatsShown, lightingMode, setLightingMode, renderToTexture, setRenderToTexture } =
        props;
    
    const settingsTest = useSelector((state: RootState) => state.settings.test)
    const dispatch = useDispatch()

    console.log(settingsTest)

    return (
        <SettingsStyle>
            <button
                onClick={() => {
                    setLightingMode((prev) =>
                        prev == LightingMode.CAMLIGHT ? LightingMode.STARLIGHT : LightingMode.CAMLIGHT,
                    );
                }}
            >
                {lightingMode == LightingMode.STARLIGHT ? "Disable Star Light" : "Enable Star Light"}
            </button>
            <button
                onClick={() => {
                    setDebugStatsShown(!debugStatsShown);
                }}
            >
                {debugStatsShown ? "Hide Debug Stats" : "Show Debug Stats"}
            </button>
            <div>
                Render to Texture
                <button
                    onClick={() => {
                        setRenderToTexture(!renderToTexture);
                    }}
                >
                    {renderToTexture ? "DISABLE" : "ENABLE"}
                </button>
            </div>
            <div>
                Test Settings: {settingsTest}
                <button
                    onClick={() => {
                        dispatch({type: "settings/set", payload: {test: settingsTest + 1}})
                    }}
                >
                    {settingsTest}
                </button>
            </div>
        </SettingsStyle>
    );
}

const SettingsStyle = styled.div`
    grid-area: menus;

    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5px;

    height: 100%;
    width: 320px;
    color: white;
    background-color: #202020;
    border: 2px solid white;

    z-index: 3;

    margin-left: auto;
    margin-right: auto;
`;
