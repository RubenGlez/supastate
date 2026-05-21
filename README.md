![supastate](./supastate.png)

# supastate

Tiny reactive engine for plain HTML and vanilla JavaScript.

No virtual DOM. No components. No build step required.

```html
<script type="module">
  import { reactive, text } from 'https://cdn.jsdelivr.net/npm/supastate/dist/index.mjs'

  const state = reactive({ count: 0 })

  text('#counter', () => state.count)

  document.getElementById('increment').onclick = () => state.count++
</script>
```

---

## Installation

**CDN** — drop it directly into any HTML file:

```html
<script type="module">
  import { reactive, text } from 'https://cdn.jsdelivr.net/npm/supastate/dist/index.mjs'
</script>
```

**npm** — for projects with a build step:

```bash
npm install supastate
```

---

## API

### `reactive(object)`

Makes a plain object deeply reactive. Mutations to any nested property are automatically tracked.

```js
const state = reactive({ count: 0, user: { name: 'Ruben' } })

state.count++          // tracked
state.user.name = 'X'  // also tracked
state.items.push(4)    // also tracked
```

---

### `effect(fn)`

Runs `fn` immediately and re-runs it whenever any reactive value it reads changes.

Returns a cleanup function that stops the effect.

```js
const stop = effect(() => {
  console.log('count is', state.count)
})

stop() // unsubscribe
```

---

### `computed(fn)`

Creates a lazy derived value. `fn` runs only when `.value` is first read, and re-runs only when a dependency has changed since the last read. Intermediate changes between reads are collapsed into one re-run.

Returns a `Computed<T>` object with a `value` getter and a `stop()` method.

```js
const fullName = computed(() => `${state.firstName} ${state.lastName}`)

text('#name', () => fullName.value)
text('#greeting', () => `Hello, ${fullName.value}`)
```

`computed` values are reactive — an `effect` or DOM binding that reads `.value` will re-run when the computed updates.

```js
fullName.stop() // detach from the reactive graph
```

---

### `text(el, fn)`

Keeps an element's `textContent` in sync with a reactive expression.

Accepts a CSS selector string or a DOM element. The expression may return a string, number, or boolean — all are coerced to a string.

```js
text('#counter', () => state.count)
text(myEl, () => `Hello, ${state.user.name}`)
```

---

### `attr(el, name, fn)`

Keeps an attribute in sync with a reactive expression.

- `false` or `null` removes the attribute
- `true` sets the attribute with an empty string value
- any other value sets the attribute as a string

```js
attr('#submit', 'disabled', () => state.loading)
attr('#link', 'href', () => state.url)
```

---

### `classList(el, fn)`

Toggles individual classes reactively without touching any other classes on the element. The function should return an object mapping class names to booleans.

```js
classList('#btn', () => ({
  active: state.active,
  loading: state.loading,
}))
```

Pre-existing classes (e.g. from your HTML or a CSS framework) are left untouched. A class that transitions to `false` or disappears from the return value is removed.

---

### `className(el, fn)`

Replaces the element's entire `className` string with the return value of `fn`. Use this when you need full control over the class list; use `classList` for toggling individual classes.

```js
className(document.body, () => state.dark ? 'dark' : 'light')
```

---

### `style(el, fn)`

Keeps inline styles in sync with a reactive expression. The function should return a style object.

```js
style('#overlay', () => ({ opacity: state.visible ? '1' : '0' }))
```

---

### `resource(fetcher, options?)`

Manages async state with reactive loading and error tracking. Re-fetches automatically when any reactive value read synchronously inside `fetcher` changes.

```js
const post = resource(async () => {
  const res = await fetch(`/api/posts/${state.id}`)
  return res.json()
})

text('#title', () => post.loading ? 'Loading…' : post.data.title)
text('#error', () => post.error?.message ?? '')
```

The returned object exposes `data`, `loading`, `error`, `refresh()`, and `detach()`. All properties are reactive and can be read inside `effect()` or any DOM binding.

```js
// manual re-fetch
post.refresh()

// polling every 30 seconds
const prices = resource(fetchPrices, { poll: 30_000 })

// detach from reactive graph and stop polling; refresh() still works for manual fetches
post.detach()
```

When `state.id` changes in the example above, the resource re-fetches automatically. Stale responses from previous fetches are discarded.

---

### Cleanup

Every DOM binding returns a cleanup function. Call it to stop reactive updates on that element.

```js
const stop = text('#counter', () => state.count)
stop() // element no longer updates
```

---

## Examples

| Example | Description |
|---|---|
| [Counter](examples/counter.html) | Basic reactive state and text binding |
| [Todo list](examples/todo.html) | Array reactivity, attr binding, dynamic lists |
| [Theme toggle](examples/theme-toggle.html) | className and text bindings |
| [Form preview](examples/form-preview.html) | Live preview from form inputs |
| [Widget](examples/widget.html) | Bindings created on mount and cleaned up on unmount |
| [Resource](examples/resource.html) | Async data fetching with loading and error state |

---

## Design goals

- **No build step** — works directly in the browser via `<script type="module">`
- **Tiny** — under 3kb minified
- **Framework agnostic** — works alongside Rails, Laravel, Django, HTMX, Astro, or nothing at all
- **Fine-grained** — only the exact DOM nodes affected by a change are updated
- **Explicit API** — no magic HTML attributes, no template syntax, just JavaScript

---

## License

MIT
