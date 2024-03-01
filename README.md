# supastate

> :warning: **Work In Progress:** This hook is currently under development and might be subject to breaking changes. Use with caution in production environments.

A lightweight, easy-to-use React hook for managing global state without the complexity of external state management libraries. Designed to be minimal yet powerful, `useSupastate` offers a simple API for state operations like adding, updating, and deleting items, as well as clearing the entire state, making it ideal for small to medium-sized applications that require global state management.

## Features

- **Simple Global State Management**: Easily manage global state across your application without the boilerplate code.
- **CRUD Operations**: Built-in functions to create, read, update, and delete state items.
- **Performance Optimized**: Only re-renders components subscribed to the changed parts of the state.
- **TypeScript Support**: Comes with TypeScript types for better development experience.
- **Middleware Support**: Integrate middleware for handling side effects, logging, and more.
- **Persistence Option**: Optionally persist your state to `localStorage` or other storage mechanisms to retain state between sessions.
- **Easy Integration**: Use alongside existing projects without major refactoring.

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
import { useSupastate } from "supastate";

const App = () => {
  const { state, addItem, deleteItem } = useSupastate();

  return (
    <div>
      <button onClick={() => addItem("itemName", "New Item")}>Add Item</button>
      {Object.keys(state).map((key) => (
        <div key={key}>
          {state[key]}
          <button onClick={() => deleteItem(key)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default App;
```

## API Reference

- `addItem(key: string, value: string | number | boolean)`: Adds a new item to the state.
- `updateItem(key: string, value: string | number | boolean)`: Updates an existing item in the state.
- `deleteItem(key: string)`: Removes an item from the state.
- `deleteAll()`: Clears the entire state.

## Browser Support

supastate is designed to work in most modern browsers. For older browsers, make sure to test and implement necessary polyfills.

## Contributing

Contributions are always welcome! Please read the contributing guide (WIP) for more details on how to contribute to this project.

## License

supastate is MIT licensed.

## Support

If you need help or have any questions, please open an issue in the GitHub repository.

Thank you for using supastate!
