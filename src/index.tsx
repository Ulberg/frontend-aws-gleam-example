import { Show, lazy } from "solid-js";
import { render } from "solid-js/web";
import { QueryClientProvider } from "@tanstack/solid-query";

import App from "./App";
import { queryClient } from "./lib/query-client";
import "./index.css";

// Devtools are dev-only; the dynamic import keeps them out of the prod bundle.
const Devtools = lazy(async () => {
  const mod = await import("@tanstack/solid-query-devtools");
  return { default: mod.SolidQueryDevtools };
});

const root = document.getElementById("root");
if (!root) throw new Error('Root element "#root" not found');

render(
  () => (
    <QueryClientProvider client={queryClient}>
      <App />
      <Show when={import.meta.env.DEV}>
        <Devtools />
      </Show>
    </QueryClientProvider>
  ),
  root,
);
