import { For, Show } from "solid-js";

import { knownItemIds } from "../data/known-items";
import { ItemCard } from "./ItemCard";

export function KnownItems() {
  return (
    <Show
      when={knownItemIds().length > 0}
      fallback={<p class="muted">Nothing yet — create or look up an item.</p>}
    >
      <ul class="item-list">
        <For each={knownItemIds()}>{(id) => <ItemCard id={id} />}</For>
      </ul>
    </Show>
  );
}
