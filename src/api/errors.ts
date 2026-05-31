/**
 * Normalized error for every failed API call.
 *
 * openapi-fetch returns `{ data, error, response }` instead of throwing. The
 * data layer converts a failure into one of these and throws it, so TanStack
 * Query's `isError` / `error` handling works the same for every endpoint.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }
}

/**
 * Build an {@link ApiError} from an openapi-fetch error payload + Response.
 * The backend uses a `{ "error": string }` envelope for 4xx/5xx responses, so
 * we surface that message when present.
 */
export function toApiError(error: unknown, response: Response): ApiError {
  let message = response.statusText || `Request failed with status ${response.status}`;

  if (error && typeof error === "object" && "error" in error) {
    const detail = (error as { error?: unknown }).error;
    if (typeof detail === "string" && detail.length > 0) {
      message = detail;
    }
  }

  return new ApiError(response.status, message, error);
}
