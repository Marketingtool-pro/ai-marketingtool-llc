import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import jsconfigPaths from "vite-jsconfig-paths";
// import tailwindcss from '@tailwindcss/vite'; // enable only if actually used

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const APP_BASE_URL = env.VITE_APP_BASE_URL || "/";
  const PORT = 3000;

  return {
    staged: { "*": "vp check --fix" },
    server: {
      open: true,
      port: PORT,
      host: true,
    },
    preview: {
      open: true,
      host: true,
    },
    define: {
      global: "window",
    },
    base: APP_BASE_URL,
    plugins: [react(), jsconfigPaths()],
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.js",
      css: true,
    },
  };
});
