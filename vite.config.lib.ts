import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: "src/index.ts",
        layout: "src/shell/index.ts",
      },
      formats: ["es"],
    },
    outDir: "dist-browser",
    emptyOutDir: true,
    rollupOptions: {
      external: [/^@repo\//],
    },
  },
});
