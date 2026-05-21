# Roadmap

## v1.0 — Reactive core (done)

- `reactive()` — proxy-based deep reactivity
- `effect()` — automatic dependency tracking
- `bind()` / `text()` — text content bindings
- `attr()` — attribute bindings
- `className()` — class bindings
- `style()` — inline style bindings
- Cleanup functions on all bindings

---

## v1.1 — Async resources (done)

Introduce `resource()` for managing async state with first-class loading and error handling.

```js
const weather = resource(async () => {
  const res = await fetch('/api/weather')
  return res.json()
})

text('#temp', () => weather.loading ? 'Loading...' : weather.data.temp)
text('#error', () => weather.error?.message ?? '')
```

Shipped:

- `loading`, `data`, `error` reactive state
- automatic re-fetch when reactive dependencies change
- manual `refresh()`
- polling interval
- stale response discarding (version counter)

---

## v1.2 — Persistence

Opt-in persistence for reactive state across page reloads via `localStorage`.

```js
const state = reactive({ theme: 'light' }, { persist: 'app-settings' })
```

Planned features:

- opt-in per reactive object
- configurable storage key
- SSR-safe (no `window` access during init)

---

## v1.3 — Utilities (in progress)

Small ergonomic helpers that stay within the no-framework constraint:

- `computed(fn)` — derived reactive values ✓ (shipped in v3.0.0)
- `classList(el, fn)` — additive class toggling via `Record<string, boolean>` ✓ (shipped in v3.0.0)
- `watch(fn, callback)` — observe a value and run a callback on change
- `batch(fn)` — group multiple mutations into a single update pass

---

## Guardrails

These constraints apply to every version. When in doubt, do less.

**Never introduce:**

- components or a component model
- a virtual DOM
- mount / render / lifecycle APIs
- template syntax or custom HTML attributes
- a router
- a build requirement for consumers

Once any of these appear, supastate becomes another frontend framework. That is not the goal.

---

## Phase 3 — Evaluate

Now that v3.0.0 has shipped:

- collect developer feedback
- audit ergonomics against real projects
- measure bundle size impact of each addition
- decide whether `resource()` warrants a separate package
