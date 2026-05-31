import { Match, Show, Switch, createSignal } from "solid-js";

import { ApiError } from "../api/errors";
import { useItem } from "../data/items";
import { rememberItemId } from "../data/known-items";

export function ItemLookup() {
  const [input, setInput] = createSignal("");
  const [searchId, setSearchId] = createSignal("");
  const item = useItem(searchId);

  const submit = (event: Event) => {
    event.preventDefault();
    const id = input().trim();
    if (!id) return;
    setSearchId(id);
    rememberItemId(id);
  };

  return (
    <div class="lookup">
      <form class="form form--row" onSubmit={submit}>
        <input
          value={input()}
          onInput={(e) => setInput(e.currentTarget.value)}
          placeholder="item id…"
          autocomplete="off"
        />
        <button type="submit">Fetch</button>
      </form>

      <Show when={searchId()}>
        <div class="result">
          <Switch>
            <Match when={item.isPending}>
              <p class="muted">Loading…</p>
            </Match>
            <Match when={item.isError && (item.error as ApiError).isNotFound}>
              <p class="notice notice--warn">No item with id “{searchId()}”.</p>
            </Match>
            <Match when={item.isError}>
              <p class="notice notice--err">{(item.error as ApiError).message}</p>
            </Match>
            <Match when={item.data}>
              {(data) => (
                <p class="kv">
                  <code>{data().id}</code> → <strong>{data().value}</strong>
                </p>
              )}
            </Match>
          </Switch>
        </div>
      </Show>
    </div>
  );
}
