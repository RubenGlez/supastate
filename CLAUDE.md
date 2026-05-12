# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm test          # run all tests
pnpm test:w        # watch mode
pnpm test:c        # with coverage
pnpm build         # compile TypeScript → dist/
pnpm typecheck     # type-check without emitting
```

To run a single test file:
```bash
pnpm jest src/reactive.test.ts
```

## Architecture

Supastate is a tiny reactive engine for plain HTML and vanilla JavaScript. No framework, no virtual DOM, no build step for consumers.

### Source layout

- `src/reactive.ts` — the entire reactive core: `reactive()` and `effect()`
- `src/dom.ts` — DOM bindings built on top of `effect()`: `bind`, `text`, `attr`, `className`, `style`
- `src/index.ts` — re-exports everything as the public API

### How reactivity works

`reactive()` wraps a plain object in a `Proxy`. The `get` trap calls `track()`, the `set` trap calls `trigger()`. Nested objects are lazily proxied on access. A `proxyCache` (WeakMap) ensures the same raw object always returns the same proxy.

`effect(fn)` runs `fn` immediately, setting `activeEffect` during execution so `track()` can register the running effect into each property's dependency set. Effects carry a `deps` set pointing back to every dep set they're in — this enables `cleanup()` to remove the effect from all its dependencies before each re-run, which is how stale dependencies are discarded automatically.

Every DOM binding is just an `effect()` that writes to a DOM node. All bindings and effects return a cleanup function that removes them from the dependency graph entirely.

### Key invariants

- `activeEffect` is always reset in a `finally` block — nested effects are not supported
- `trigger()` snapshots the dep set with `[...dep]` before iterating to avoid mutation-during-iteration bugs
- DOM binding functions return a noop `() => {}` when the target element is not found, so callers never need to null-check

### Build output

Rollup produces `dist/index.js` (CJS), `dist/index.mjs` (ESM), and `dist/index.d.ts`. The ESM build is what consumers use via CDN. Target bundle size is under 3kb unminified.

### Scope constraints

Do not introduce: components, lifecycle hooks, virtual DOM, template syntax, custom HTML attributes, or a router. See `ROADMAP.md` for what is planned next (`resource()`, persistence, computed values).
