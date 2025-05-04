import styled from "@emotion/styled";

export function SettingsMenu() {
    return <SettingsStyle>Settings coming soon!</SettingsStyle>;
}

const SettingsStyle = styled.div`
    grid-area: menus;

    display: flex;
    flex-direction: column;
    align-items: center;

    height: 150px;
    width: 320px;
    color: white;
    background-color: #202020;
    border: 2px solid white;

    z-index: 3;

    margin-left: auto;
    margin-right: auto;
`;
