import { defineConfig, loadEnv } from "vite";
import solid from "vite-plugin-solid";

// The backend is plain HTTP and does not send CORS headers, so the browser
// cannot call it cross-origin. In dev we proxy `/api/*` to the backend so the
// browser only ever talks to the same origin (the Vite server).
const DEFAULT_PROXY_TARGET =
  "http://backen-loadb-j1ck0azqzxit-200572918.eu-central-1.elb.amazonaws.com";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const target = env.VITE_API_PROXY_TARGET || DEFAULT_PROXY_TARGET;

  return {
    plugins: [solid()],
    server: {
      proxy: {
        "/api": {
          target,
          changeOrigin: true,
          // `/api/items/x` on the frontend -> `/items/x` on the backend.
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
