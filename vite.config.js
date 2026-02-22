import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const fallbackViteEnvPlugin = {
  name: "fallback-vite-env",
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (!req.url) {
        next();
        return;
      }

      // Some stale/dev-cache clients request raw env.mjs directly.
      // Rewrite to Vite's injected endpoint so __DEFINES__ is always populated.
      if (req.url.startsWith("/node_modules/vite/dist/client/env.mjs")) {
        req.url = "/@vite/env";
      }

      next();
    });
  },
};

export default defineConfig({
  plugins: [react(), fallbackViteEnvPlugin],
  base: "/"
});
