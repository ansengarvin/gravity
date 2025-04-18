import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Sim } from "./Sim.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Sim />
    </StrictMode>,
);
