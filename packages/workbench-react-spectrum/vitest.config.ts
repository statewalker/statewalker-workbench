import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.tsx", "tests/**/*.test.ts"],
    environment: "jsdom",
    globals: false,
    // @adobe/react-spectrum ships CSS imports its components reach for at runtime.
    // Inline the dep so vite handles those imports (otherwise Node ESM rejects ".css").
    server: {
      deps: {
        inline: [/@adobe\/react-spectrum/, /@react-spectrum/, /@spectrum/],
      },
    },
  },
});
