import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    base: "/webgl-nbody/",
    plugins: [react()],
    build: {
        outDir: "docs"
    }
});
