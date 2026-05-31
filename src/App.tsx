import { CreateItemForm } from "./components/CreateItemForm";
import { HealthBadge } from "./components/HealthBadge";
import { ItemLookup } from "./components/ItemLookup";
import { KnownItems } from "./components/KnownItems";

export default function App() {
  return (
    <div class="app">
      <header class="app__header">
        <div>
          <h1>Gleam AWS Example</h1>
          <p class="app__subtitle">SolidJS · TanStack Solid Query · openapi-fetch</p>
        </div>
        <HealthBadge />
      </header>

      <main class="app__grid">
        <section class="card">
          <h2>Create / replace item</h2>
          <CreateItemForm />
        </section>

        <section class="card">
          <h2>Look up item</h2>
          <ItemLookup />
        </section>

        <section class="card card--wide">
          <h2>Known items</h2>
          <p class="muted">
            Items you create or look up are tracked here, each backed by its own
            entry in the query cache.
          </p>
          <KnownItems />
        </section>
      </main>

      <footer class="app__footer">
        Fully typed from <code>/openapi.json</code> via openapi-typescript.
      </footer>
    </div>
  );
}
