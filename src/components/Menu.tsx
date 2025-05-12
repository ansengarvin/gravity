import styled from "@emotion/styled";
import React from "react";

export enum TabType {
    BASIC = "basic",
    ORBIT = "orbit",
}

interface MenuProps {
    children: React.ReactNode
    tab: TabType;
    setTab: React.Dispatch<React.SetStateAction<TabType>>;
}

export function Menu(props: MenuProps) {
    const {children, tab, setTab} = props;
    return (
        <MenuStyle>
            <MenuTabs MenuTab={tab} setMenuTab={setTab} />
            {children}
        </MenuStyle>
    )
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

interface MenuTabsProps {
    MenuTab: TabType;
    setMenuTab: React.Dispatch<React.SetStateAction<TabType>>;
}
function MenuTabs(props: MenuTabsProps) {
    const { MenuTab, setMenuTab } = props;
    return (
        <MenuTabsStyle>
            <button
                onClick={() => {
                    setMenuTab(TabType.BASIC);
                }}
                disabled={MenuTab == TabType.BASIC}
            >
                Stats
            </button>
            <button
                onClick={() => {
                    setMenuTab(TabType.ORBIT);
                }}
                disabled={MenuTab == TabType.ORBIT}
            >
                Orbits
            </button>
        </MenuTabsStyle>
    );
}

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
