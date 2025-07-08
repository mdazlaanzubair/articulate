import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        background: "./src/background-script.ts",
        content: "./src/content-script.ts",
      },
      output: {
        entryFileNames: `[name].js`,
      },
    },
    outDir: "dist",
  },
});
