import { Match, Switch } from "solid-js";

import { ApiError } from "../api/errors";
import { useItem } from "../data/items";
import { forgetItemId } from "../data/known-items";

export function ItemCard(props: { id: string }) {
  const item = useItem(() => props.id);

  return (
    <li class="item-card">
      <div class="item-card__head">
        <code>{props.id}</code>
        <div class="item-card__actions">
          <button
            type="button"
            onClick={() => void item.refetch()}
            disabled={item.isFetching}
            title="Refetch"
          >
            {item.isFetching ? "…" : "↻"}
          </button>
          <button
            type="button"
            onClick={() => forgetItemId(props.id)}
            title="Remove from list"
          >
            ✕
          </button>
        </div>
      </div>

      <div class="item-card__body">
        <Switch>
          <Match when={item.isPending}>
            <span class="muted">loading…</span>
          </Match>
          <Match when={item.isError && (item.error as ApiError).isNotFound}>
            <span class="muted">not found</span>
          </Match>
          <Match when={item.isError}>
            <span class="err">{(item.error as ApiError).message}</span>
          </Match>
          <Match when={item.data}>
            {(data) => <span class="value">{data().value}</span>}
          </Match>
        </Switch>
      </div>
    </li>
  );
}
