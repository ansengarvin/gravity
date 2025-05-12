import styled from "@emotion/styled";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";

interface SettingsMenuProps {
    renderToTexture: boolean;
    setRenderToTexture: React.Dispatch<React.SetStateAction<boolean>>;
}

export function SettingsMenu(props: SettingsMenuProps) {
    const { renderToTexture, setRenderToTexture } = props;

    const graphicsSettings = useSelector((state: RootState) => state.graphicsSettings);
    const showDebug = useSelector((state: RootState) => state.debugMenu.showDebug);
    const dispatch = useDispatch();

    return (
        <SettingsStyle>
            General
            <button
                onClick={() => {
                    dispatch({ type: "debugMenu/toggleDebug" });
                }}
            >
                {showDebug ? "Hide Debug" : "Show Debug"}
            </button>
            Graphics
            <button
                onClick={() => {
                    dispatch({ type: "settings/toggleStarLight" });
                }}
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
