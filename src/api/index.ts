// Barrel for the transport layer. The rest of the app imports the typed client
// and error helpers from here (or from the more specific modules).
export { apiClient } from "./client";
export { ApiError, toApiError } from "./errors";
export type { components, paths } from "./schema";
