import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: {
        hooks: "src/hooks/index.ts",
        "component-registry": "src/component-registry/index.ts",
        dock: "src/dock/index.ts",
        "dock-hooks": "src/dock-hooks/index.ts",
        "shell-hooks": "src/shell-hooks/index.ts",
      },
      formats: ["es"],
    },
    outDir: "dist-browser",
    emptyOutDir: true,
    rollupOptions: {
      external: [/^@repo\//, "react", "react-dom", /^react\//, /^react-dom\//],
    },
  },
});
