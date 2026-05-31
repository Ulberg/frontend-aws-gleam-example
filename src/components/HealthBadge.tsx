import { Match, Switch } from "solid-js";

import { useHealth } from "../data/health";

export function HealthBadge() {
  const health = useHealth();

  return (
    <div
      class="health"
      classList={{
        "health--ok": health.isSuccess,
        "health--down": health.isError,
      }}
    >
      <span class="health__dot" />
      <Switch fallback={<span>checking…</span>}>
        <Match when={health.isError}>backend unreachable</Match>
        <Match when={health.data}>{(data) => <span>backend: {data().status}</span>}</Match>
      </Switch>
    </div>
  );
}
