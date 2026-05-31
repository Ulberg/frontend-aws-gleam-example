import { createSignal } from "solid-js";

// The backend has no "list items" endpoint, so the app keeps a small, local
// record of the ids the user has created or looked up this session. Each id is
// still rendered from the query cache — this is just the set of things to show.
const [ids, setIds] = createSignal<string[]>([]);

export const knownItemIds = ids;

export function rememberItemId(id: string): void {
  const trimmed = id.trim();
  if (!trimmed) return;
  setIds((prev) => (prev.includes(trimmed) ? prev : [trimmed, ...prev]));
}

export function forgetItemId(id: string): void {
  setIds((prev) => prev.filter((existing) => existing !== id));
}
