import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: {
        components: "src/components/index.ts",
        renderers: "src/renderers/index.ts",
        init: "src/init-views.ts",
        layouts: "src/layouts/index.ts",
        "lib/utils": "src/lib/utils.ts",
        routing: "src/routing/hash-routing.ts",
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
        /^radix-ui/,
        "lucide-react",
        "react-resizable-panels",
      ],
    },
  },
});
