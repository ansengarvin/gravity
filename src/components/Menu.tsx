import styled from "@emotion/styled";
import React from "react";

export interface Tab {
    label: string;
    value: string;
}

interface MenuProps {
    children: React.ReactNode;
    tabs: Tab[];
    activeTab: string;
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

export function Menu(props: MenuProps) {
    const { children, tabs, activeTab, setActiveTab } = props;
    return (
        <MenuStyle>
            <MenuTabsStyle>
                {tabs.map((tab) => (
                    <button key={tab.value} onClick={() => setActiveTab(tab.value)} disabled={activeTab === tab.value}>
                        {tab.label}
                    </button>
                ))}
            </MenuTabsStyle>
            {children}
        </MenuStyle>
    );
}

const MenuStyle = styled.div`
    grid-area: menus;
    margin-left: auto;
    margin-right: auto;
    margin-top: auto;
    width: 310px;
    height: min-content;

    background: none;
`;

const MenuTabsStyle = styled.div`
    height: 25px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: center;
    gap: 3px;

    button {
        height: 100%;
        background: none;
        border: none;
        padding-left: 10px;
        padding-right: 10px;

        cursor: pointer;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;

        border: 2px solid white;
        border-bottom: none;
        background-color: black;
        color: white;

        :hover {
            background-color: #9a9a9a;
        }

        :disabled {
            background-color: white;
            color: black;
            cursor: auto;
        }
    }
`;
