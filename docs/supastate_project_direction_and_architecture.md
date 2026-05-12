# Supastate

## Vision

Supastate is not a frontend framework.

It is a tiny reactive engine for plain HTML and vanilla JavaScript.

The goal is to provide fine‑grained reactivity and async state primitives without introducing:

- a virtual DOM
- components
- JSX
- templates
- routing
- build steps
- framework lock‑in

Core philosophy:

> Make existing HTML reactive with the minimum possible JavaScript.

---

# Positioning

## Tagline ideas

- Reactive state for plain HTML.
- Tiny reactive primitives for vanilla JavaScript.
- Fine‑grained reactivity without a framework.
- Progressive enhancement with reactive state.

---

# Problem Space

Supastate is intended for developers who:

- want interactivity without React/Vue/Svelte
- work with server-rendered applications
- want progressive enhancement
- prefer minimal JavaScript
- want to avoid complex frontend toolchains
- need lightweight reactive widgets

Potential environments:

- Rails
- Laravel
- Django
- Astro
- static sites
- HTMX projects
- browser extensions
- embedded widgets
- internal tools
- microsites
- prototypes

---

# Non-Goals

These are strict boundaries.

## Supastate is NOT:

- a SPA framework
- a component framework
- a router
- a templating engine
- a virtual DOM implementation
- a full rendering engine
- a compiler
- a build tool
- a replacement for React/Vue/Svelte

---

# Core Principles

## 1. HTML First

Developers should be able to use normal HTML.

Example:

```html
<h1 id="counter"></h1>
<button id="increment">+</button>
```

No custom templating syntax.

No JSX.

No compilation.

---

## 2. JavaScript First API

Avoid custom HTML DSLs.

Avoid things like:

```html
<div x-data="">
<div s-if="">
{{ count }}
```

Prefer explicit JavaScript APIs.

Example:

```js
const state = reactive({
  count: 0
})

bind("#counter", () => state.count)
```

---

## 3. Fine-Grained Reactivity

Only update the exact DOM nodes affected by state changes.

No full rerenders.

No virtual DOM diffing.

---

## 4. Progressive Enhancement

HTML should work before JavaScript.

Supastate should enhance existing DOM rather than replace it.

---

## 5. Tiny by Default

Bundle size should remain extremely small.

Target:

- under 5kb
- ideally 2–3kb core

---

## 6. No Build Step

Should work directly in the browser.

Example:

```html
<script type="module">
  import { reactive } from "./supastate.js"
</script>
```

---

# Proposed Architecture

The project should remain split into very small focused primitives.

---

# Layer 1 — Reactive Core

The most important part of the project.

Example:

```js
const state = reactive({
  count: 0
})
```

Responsibilities:

- reactive state tracking
- dependency collection
- subscriptions
- nested reactivity
- batching updates
- framework agnostic implementation

Potential implementation strategies:

- Proxy-based
- signals-based
- hybrid approach

Questions to explore:

- Should state be mutable or immutable?
- Should batching be automatic?
- How should cleanup work?
- How should nested arrays behave?

---

# Layer 2 — Effects

Effects connect reactive dependencies with side effects.

Example:

```js
effect(() => {
  console.log(state.count)
})
```

Responsibilities:

- automatic dependency tracking
- re-running effects on updates
- cleanup handling
- batching integration

Questions to explore:

- sync vs async scheduling
- microtask batching
- nested effects
- effect disposal

---

# Layer 3 — DOM Bindings

This layer connects reactive state with the DOM.

Example:

```js
bind("#counter", () => state.count)
```

Possible APIs:

```js
text(el, () => state.count)
attr(el, "disabled", () => state.loading)
className(el, () => state.active ? "active" : "")
style(el, () => ({ opacity: state.loading ? 0.5 : 1 }))
```

Responsibilities:

- text updates
- attribute updates
- class updates
- style updates
- event helpers

Important constraint:

Avoid building a rendering abstraction.

DOM APIs remain the rendering layer.

---

# Layer 4 — Async Resources (Optional but Interesting)

This could become one of the most differentiating features.

Example:

```js
const weather = resource(async () => {
  const response = await fetch("/weather")
  return response.json()
})
```

Then:

```js
text(tempEl, () => weather.data.temp)
```

Potential features:

- loading state
- error state
- retries
- stale cache
- promise deduplication
- invalidation
- refresh
- polling
- persistence

This area connects naturally with the original hook idea.

---

# Design Constraints

These constraints should remain strict.

## Avoid:

- components
- mount/render APIs
- routers
- templating languages
- virtual DOM
- framework lifecycle abstractions
- magical HTML syntax
- heavy plugin systems

Once these appear, Supastate risks becoming another frontend framework.

---

# Developer Experience Goals

A developer should understand the core library in under 5 minutes.

Ideal learning curve:

1. create reactive state
2. bind state to DOM
3. react to updates
4. optionally use async resources

The API should feel obvious.

---

# Competitive Landscape

Relevant comparisons:

- Alpine.js
- Petite Vue
- HTMX
- Preact Signals
- Solid signals
- vanilla JavaScript

Supastate should not try to outperform full frameworks.

Instead, differentiation should come from:

- simplicity
- tiny size
- framework agnosticism
- explicit APIs
- progressive enhancement
- fine-grained updates

---

# Risks

## 1. Becoming another framework

The largest architectural risk.

Scope creep could introduce:

- components
- routing
- rendering abstractions
- template syntax

This should be resisted aggressively.

---

## 2. Becoming a toy project

The project must solve real problems, not just demonstrate reactivity.

Good real-world use cases are critical.

---

## 3. DOM synchronization complexity

The complexity of DOM updates grows quickly.

Potential issues:

- list rendering
- cleanup
- memory leaks
- async race conditions
- nested updates
- batching

The project should stay intentionally minimal.

---

# Validation Strategy

Do not build a full framework first.

Instead:

## Phase 1

Build only:

- reactive()
- effect()
- bind()

Then create:

- demos
- examples
- benchmarks
- tiny interactive apps

---

## Phase 2

Experiment with:

- async resources
- persistence
- optimistic updates
- lightweight utilities

---

## Phase 3

Evaluate:

- developer feedback
- ergonomics
- bundle size
- adoption patterns

---

# Success Criteria

Supastate succeeds if:

- developers can understand it immediately
- it works without a build step
- it integrates into existing HTML easily
- it remains extremely small
- it avoids framework complexity
- it enables reactive experiences with minimal code

---

# Initial API Exploration

## Reactive state

```js
const state = reactive({
  count: 0
})
```

---

## Effects

```js
effect(() => {
  console.log(state.count)
})
```

---

## Text binding

```js
text(counterEl, () => state.count)
```

---

## Attribute binding

```js
attr(buttonEl, "disabled", () => state.loading)
```

---

## Async resource

```js
const user = resource(async () => {
  const response = await fetch("/api/user")
  return response.json()
})
```

---

# Open Questions

- Should the core use signals or proxies?
- Should DOM bindings be included in core or separate?
- Should async resources live in a separate package?
- How should cleanup/disposal work?
- How should arrays and lists be handled?
- Should SSR integration exist at all?
- How opinionated should async caching be?
- Should there be persistence utilities?
- What is the absolute minimum viable API?

---

# Final Direction

Supastate should aim to become:

> A tiny reactive runtime for plain HTML and vanilla JavaScript.

Not a framework.

Not a React alternative.

A minimal reactive layer focused on: