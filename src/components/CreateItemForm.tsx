import { Show, createSignal } from "solid-js";

import { ApiError } from "../api/errors";
import { useCreateItem } from "../data/items";
import { rememberItemId } from "../data/known-items";

export function CreateItemForm() {
  const [id, setId] = createSignal("");
  const [value, setValue] = createSignal("");
  const create = useCreateItem();

  const submit = (event: Event) => {
    event.preventDefault();
    const payload = { id: id().trim(), value: value().trim() };
    if (!payload.id || !payload.value) return;

    create.mutate(payload, {
      onSuccess: (item) => {
        rememberItemId(item.id);
        setValue("");
      },
    });
  };

  return (
    <form class="form" onSubmit={submit}>
      <label class="field">
        <span>ID</span>
        <input
          value={id()}
          onInput={(e) => setId(e.currentTarget.value)}
          placeholder="e.g. greeting"
          autocomplete="off"
          required
        />
      </label>

      <label class="field">
        <span>Value</span>
        <input
          value={value()}
          onInput={(e) => setValue(e.currentTarget.value)}
          placeholder="e.g. hello world"
          autocomplete="off"
          required
        />
      </label>

      <button type="submit" disabled={create.isPending}>
        {create.isPending ? "Saving…" : "Save item"}
      </button>

      <Show when={create.isSuccess && create.data}>
        {(item) => (
          <p class="notice notice--ok">
            Saved <code>{item().id}</code> = “{item().value}”.
          </p>
        )}
      </Show>

      <Show when={create.isError}>
        <p class="notice notice--err">
          {(create.error as ApiError | null)?.message ?? "Failed to save item."}
        </p>
      </Show>
    </form>
  );
}
