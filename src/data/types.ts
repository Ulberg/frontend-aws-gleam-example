import type { components } from "../api/schema";

// Domain types re-exported from the generated schema so components never reach
// into `components["schemas"][...]` directly. If the backend contract changes,
// these update automatically on the next `npm run gen:api`.
export type Item = components["schemas"]["Item"];
export type NewItem = components["schemas"]["NewItem"];
export type Health = components["schemas"]["Health"];
