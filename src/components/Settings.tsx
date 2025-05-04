import styled from "@emotion/styled";
import React from "react";

interface SettingsMenuProps {
    debugStatsShown: boolean;
    setDebugStatsShown: React.Dispatch<React.SetStateAction<boolean>>;
}

export function SettingsMenu(props: SettingsMenuProps) {
    const { debugStatsShown, setDebugStatsShown } = props;
    return (
        <SettingsStyle>
            <button
                onClick={() => {
                    setDebugStatsShown(!debugStatsShown);
                }}
            >
                {debugStatsShown ? "Hide Debug Stats" : "Show Debug Stats"}
            </button>
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
