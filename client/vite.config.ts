/// <reference types="vitest" />
import path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./setupTests.js",
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        port: 3000,
        hmr: {
            host: "localhost",
        },
    },
    preview: {
        port: 3000,
    },
    build: {
        chunkSizeWarningLimit: 2000,
    },
});
