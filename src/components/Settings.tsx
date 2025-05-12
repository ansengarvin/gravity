import styled from "@emotion/styled";
import React from "react";
import {useSelector, useDispatch} from 'react-redux'
import { LightingMode } from "../lib/webGL/shaderPrograms";
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
    const { debugStatsShown, setDebugStatsShown, renderToTexture, setRenderToTexture } =
        props;
    
    const graphicsSettings = useSelector((state: RootState) => state.graphicsSettings)
    const dispatch = useDispatch()

    return (
        <SettingsStyle>
            General
            <button
                onClick={() => {
                    setDebugStatsShown(!debugStatsShown);
                }}
            >
                {debugStatsShown ? "Hide Debug Stats" : "Show Debug Stats"}
            </button>
            Graphics
            <button
                onClick={() => {dispatch({type: 'settings/toggleStarLight'})}}
            >
                {graphicsSettings.starLight ? "Disable Star Light" : "Enable Star Light"}
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
