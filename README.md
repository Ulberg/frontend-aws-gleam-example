# Gleam AWS Example — SolidJS frontend

A small, **data-driven** SolidJS app for the [Gleam AWS Example API]. Every
type and request flows from the backend's OpenAPI document, so the UI cannot
drift from the contract.

```
OpenAPI document  ──►  openapi-typescript  ──►  generated TS types
                                                      │
                                          openapi-fetch (typed client)
                                                      │
                                          TanStack Solid Query (cache/state)
                                                      │
                                              SolidJS components
```

## Tech

| Concern            | Choice                                            |
| ------------------ | ------------------------------------------------- |
| Framework          | [SolidJS] + [Vite]                                |
| Types from backend | [`openapi-typescript`] (generates `schema.d.ts`)  |
| HTTP client        | [`openapi-fetch`] (fully typed against the spec)  |
| Server state       | [`@tanstack/solid-query`]                         |

## Architecture: data-layer separation

The codebase is split so that **components never call the backend directly** —
they only consume hooks from the data layer.

```
src/
  api/                 # transport layer
    schema.d.ts        #   GENERATED from openapi.json (do not edit)
    client.ts          #   the single typed openapi-fetch instance
    errors.ts          #   normalizes failures into one ApiError type
    index.ts           #   barrel
  data/                # domain data layer (the ONLY place that touches the API)
    types.ts           #   Item / NewItem / Health, re-exported from the schema
    query-keys.ts      #   central cache-key registry
    health.ts          #   useHealth()
    items.ts           #   useItem(), useCreateItem()
    known-items.ts     #   local list of ids the user has touched
  lib/
    query-client.ts    # configured QueryClient
  components/          # presentational/container components (import only from data/)
  App.tsx
  index.tsx
```

Why this matters:

- **One transport instance.** `api/client.ts` is the only `createClient` call.
- **Typed end to end.** `useItem` / `useCreateItem` return types derive from the
  OpenAPI schema; a backend change surfaces as a TypeScript error after
  regenerating.
- **Uniform errors.** Every endpoint failure becomes an `ApiError` with a
  `status` and the backend's `{ error }` message, so query/mutation error
  handling is identical everywhere.
- **Swappable UI.** Components depend on `data/*`, not on `openapi-fetch` or
  query keys, so they can be rewritten without touching the data layer.

## Getting started

```bash
npm install
npm run gen:api      # regenerate src/api/schema.d.ts from openapi.json
npm run dev          # http://localhost:5173
```

### CORS / the dev proxy

The backend is plain **HTTP** and does **not** send CORS headers (its `OPTIONS`
preflight returns `404`), so a browser can't call it cross-origin. The client's
base URL is therefore the relative path `/api`, and Vite proxies it to the
backend (see `vite.config.ts`):

```
browser ──/api/items/x──► Vite dev server ──/items/x──► backend
```

This keeps the browser same-origin and avoids both CORS and mixed-content
errors. Override the proxy target with `VITE_API_PROXY_TARGET` (see
`.env.example`).

In **production** point `VITE_API_BASE_URL` at a same-origin reverse proxy, or
at the backend directly once it serves CORS headers.

## Scripts

| Script                   | Description                                            |
| ------------------------ | ------------------------------------------------------ |
| `npm run dev`            | Start the dev server with the API proxy.               |
| `npm run build`          | Typecheck (`tsc --noEmit`) then build with Vite.       |
| `npm run preview`        | Preview the production build.                           |
| `npm run typecheck`      | Type-check only.                                        |
| `npm run gen:api`        | Generate `src/api/schema.d.ts` from local `openapi.json`. |
| `npm run gen:api:remote` | Regenerate types from the live `/openapi.json`.        |

## Regenerating the API contract

`openapi.json` is a committed snapshot of the backend spec. To refresh it and
the generated types:

```bash
curl -s http://backen-loadb-j1ck0azqzxit-200572918.eu-central-1.elb.amazonaws.com/openapi.json -o openapi.json
npm run gen:api
```

[Gleam AWS Example API]: http://backen-loadb-j1ck0azqzxit-200572918.eu-central-1.elb.amazonaws.com/docs
[SolidJS]: https://www.solidjs.com/
[Vite]: https://vite.dev/
[`openapi-typescript`]: https://openapi-ts.dev/
[`openapi-fetch`]: https://openapi-ts.dev/openapi-fetch/
[`@tanstack/solid-query`]: https://tanstack.com/query/latest/docs/framework/solid/overview
