import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** ES bundle (React включен) → `public/react-dist/react-main.js` за същия origin като `server.js`. */
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/react/main.jsx"),
      name: "SimaReact",
      formats: ["es"],
      fileName: () => "react-main.js",
    },
    outDir: resolve(__dirname, "public/react-dist"),
    emptyOutDir: true,
    copyPublicDir: false,
  },
});
