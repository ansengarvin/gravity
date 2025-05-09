import styled from "@emotion/styled";
import React from "react";
import { LightingMode } from "../lib/webGL/shaderPrograms";

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
                    }}>
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
