import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx.tsx";
import { css, Global } from "@emotion/react";

const globalStyle = css`
    html,
    body {
        min-height: 100vh;
        width: 100%;
        margin: 0;
        padding: 0;

        background-color: #17171a;
        color: white;
        overflow: hidden;

        font-family: "Roboto", sans-serif;
    }
`;

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Global styles={globalStyle} />
        <App />
    </StrictMode>,
);
