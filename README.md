# supastate

> :warning: **Work In Progress:** This hook is currently under development and might be subject to breaking changes. Use with caution in production environments.

A lightweight, easy-to-use React hook for managing global state without the complexity of external state management libraries. Designed to be minimal yet powerful, `supastate` offers a customizable API for state operations like adding, updating, and deleting items, as well as clearing the entire state. It's ideal for small to medium-sized applications that require flexible global state management.

## Features

- **Flexible Global State Management**: Manage global state with a flexible structure, supporting objects, arrays, Maps, Sets, and more.
- **Customizable State Initialization**: Define the initial state structure and types for your application state.
- **CRUD Operations**: Built-in functions to create, read, update, and delete state items, with type safety.
- **Performance Optimized**: Only re-renders components subscribed to the changed parts of the state.
- **TypeScript Support**: Enhanced TypeScript types for an improved development experience, ensuring type safety across your state management.
- **Middleware Support**: Easily integrate middleware for handling side effects, logging, and more.
- **Persistence Option**: Optionally persist your state to `localStorage` or other storage mechanisms to retain state between sessions.
- **Easy Integration**: Seamlessly use alongside existing projects without major refactoring.

## Installation

```bash
npm install supastate
```

Or using yarn:

```bash
yarn add supastate
```

## Usage

Here's a quick example to get you started:

```jsx
import React from "react";
import { createSupastate } from "supastate";

// Define your initial state
const initialState = {
  count: 0,
  items: ["Item 1", "Item 2"],
};

// Create a custom hook instance
const useSupastate = createSupastate(initialState);

const App = () => {
  const { state, set, update } = useSupastate();

  // Use set, update to modify the state
  return (
    <div>
      <p>Count: {state.count}</p>
      {/* Further usage */}
    </div>
  );
};

export default App;
```

## API Reference

- `set(payload: T)`: Sets the new state.
- `update(updater: (state: T) => T)`: Updates the state based on the previous state.
- `createSupastate(initialState: T)`: Creates a new instance of the supastate hook with the defined initial state.

## Browser Support

supastate is designed to work in most modern browsers. For older browsers, make sure to test and implement necessary polyfills.

## Contributing

Contributions are always welcome! Please read the contributing guide (WIP) for more details on how to contribute to this project.

## License

supastate is MIT licensed.

## Support

If you need help or have any questions, please open an issue in the GitHub repository.

Thank you for using supastate!

## Roadmap

### 1. Middleware and Enhancers

- **Middleware:** Introduces support for middleware, enabling developers to intercept actions before they reach the reducer. This is beneficial for handling asynchronous logic, logging, and more.
- **Enhancers:** Enhancers allow for the modification of the store or the extension of its functionality, such as state persistence in localStorage.

### 2. Development and Debugging Tools

- **Redux DevTools Integration:** Even if not using Redux directly, integration with Redux DevTools is provided. This offers developers powerful debugging tools.
- **Logging:** A built-in logging system is implemented to facilitate debugging, recording dispatched actions and state changes.

### 3. Performance Optimizations

- **Selectors:** The use of selectors to derive data from the state is introduced, allowing for optimizations such as memoization to prevent unnecessary recalculations.
- **Batching of Updates:** Strategies for grouping state updates are implemented to minimize the number of re-renders, enhancing application performance.

### 4. Asynchronous Handling API

- **Asynchronous Actions:** An integrated solution for handling asynchronous actions is offered, easing the management of side effects like API calls.

### 5. Compatibility and Flexibility

- **Additional Hooks:** Additional custom hooks for common use cases, such as `useSelect` for accessing specific parts of the state, are considered.
- **TypeScript Support:** Full TypeScript support is ensured, improving the development experience with strong typing and auto-completion.
