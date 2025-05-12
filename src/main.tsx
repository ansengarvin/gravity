import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import { css, Global } from "@emotion/react";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";

const globalStyle = css`
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }
    html,
    body {
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;

        background-color: #17171a;
        color: white;
        //overflow: hidden;

        font-family: "Roboto", sans-serif;
    }

    canvas {
        margin: 0;
    }
`;

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Global styles={globalStyle} />
        <Provider store={store}>
            <App />
        </Provider>
    </StrictMode>,
);
