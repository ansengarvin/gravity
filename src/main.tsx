import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx.tsx";
import { css, Global } from "@emotion/react";

const globalStyle = css`
    html,
    body {
        height: 100%;
        width: 100%;
        margin: 0;

        background-color: #17171a;
        color: white;
    }
`;

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Global styles={globalStyle} />
        <App />
    </StrictMode>,
);
