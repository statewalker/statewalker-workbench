import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: "src/index.ts",
        init: "src/init-views.ts",
        provider: "src/spectrum-provider.tsx",
        layouts: "src/layouts/index.ts",
      },
      formats: ["es"],
    },
    outDir: "dist-browser",
    emptyOutDir: true,
    rollupOptions: {
      external: [
        /^@repo\//,
        "react",
        "react-dom",
        /^react\//,
        /^react-dom\//,
        /^@adobe\//,
        /^@internationalized\//,
        /^@react-stately\//,
        /^@spectrum-icons\//,
        "react-resizable-panels",
      ],
    },
  },
});
