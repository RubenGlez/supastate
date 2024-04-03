![supastate](/src/supastate.jpg)

# supastate

A lightweight, easy-to-use React hook for managing global state without the complexity of external state management libraries. Designed to be minimal yet powerful, `supastate` enables developers to efficiently manage serializable state with operations that include setting, updating, and effectively reacting to state changes. It's ideal for small to medium-sized applications that require flexible global state management.

## Features

- **Custom Hook Factory**: Generate tailor-made React hooks (`useSupastate`) for efficient state management in applications.
- **Serializable State Only**: Supports states that are serializable, enhancing compatibility with JSON serialization for features like state persistence.
- **In-Memory State**: Maintains state in memory for fast access and updates, with each hook managing its own state.
- **Flexible State Updates**:
  - **Direct Set**: Allows direct replacement of the current state.
  - **Updater Function**: Enables complex state transformations through a functional updater.
- **Automatic Update Propagation**: Uses a listener pattern for automatic re-rendering of components on state updates.
- **Clean-Up Mechanism**: Automatically removes listeners on component unmount, preventing memory leaks.
- **Minimal API**: Simplifies state management with an intuitive and minimalistic API, reducing boilerplate.
- **Immutable Updates**: Promotes state immutability for reliable and predictable updates.
- **Easy Integration**: Designed for seamless integration into existing React projects with minimal setup.
- **State Persistence**: Provides methods to maintain state between sessions using `localStorage`.

Leverage the power of React's ecosystem with this lightweight, intuitive state management solution.

## Installation

```bash
# npm
npm install supastate

# yarn
yarn add supastate
```

## Usage

Here's a quick example to get you started:

```jsx
import React from "react";
import { createSupastate } from "supastate";

// Using createSupastate to create a global state for a user profile
const useUserProfile = createSupastate({ name: "John Doe", age: 30 }); // Initial state is a profile object

// UserProfile Component: Displays the user's name and age
function UserProfile() {
  const { state: userProfile } = useUserProfile();

  return (
    <div>
      <p>Name: {userProfile.name}</p>
      <p>Age: {userProfile.age}</p>
    </div>
  );
}

// UpdateName Component: Has an input field to update the user's name
function UpdateName() {
  const { update } = useUserProfile();

  return (
    <input
      type="text"
      placeholder="Enter new name"
      onChange={(e) =>
        update((currentProfile) => ({
          ...currentProfile,
          name: e.target.value,
        }))
      }
    />
  );
}

// IncrementAge Component: Has a button to increment the user's age
function IncrementAge() {
  const { update } = useUserProfile();

  return (
    <button
      onClick={() =>
        update((currentProfile) => ({
          ...currentProfile,
          age: currentProfile.age + 1,
        }))
      }
    >
      Increment Age
    </button>
  );
}

// Main application that uses the UserProfile, UpdateName, and IncrementAge components
function App() {
  return (
    <div>
      <UserProfile />
      <UpdateName />
      <IncrementAge />
    </div>
  );
}
```

## API Reference

- `set(payload: T)`: Sets the new state.
- `update(updater: (state: T) => T)`: Updates the state based on the previous state.
- `reset()`: Resets the state to the initial state.
- `createSupastate(initialState: T)`: Creates a new instance of the supastate hook with the defined initial state.

## Support & Contributing

If you need help or have any questions about supaclipboard, please don't hesitate to open an issue in the GitHub repository. I'm always here to help and would love to hear your feedback. If you're interested in contributing to the library, whether it's by reporting bugs, suggesting features, or submitting improvements, your contributions are greatly appreciated. Please feel free to open an issue or submit a pull request.

Thank you for using supastate!

---

## Roadmap

### 1. **Functional Enhancements**

- **Async Actions Support**: Makes handling asynchronous operations easier.
- **Middlewares**: Enables adding extra logic for actions, useful for activities like logging and persistence.

### 2. **Performance Optimization**

- **Memoization**: Utilizes memoization to improve efficiency.
- **Updates Batching**: Minimizes re-renders by grouping state updates.

### 3. **Testing and Security**

- **Testing**: Implements unit and integration tests to ensure reliability.
- **Data Sanitization**: Protects against security risks by sanitizing user inputs.

### 4. **Compatibility and Usability**

- **Additional Hooks**: Adds hooks to ease common use cases.
- **Concurrent Mode and TypeScript Support**: Ensures compatibility with the latest React features and enhances experience with TypeScript support.

### 5. **Community**

- **Documentation and Repository**: Provides detailed documentation and manages an accessible repository to encourage collaboration.
- **User Feedback**: Adjusts the roadmap based on user suggestions and needs.
- **Continuous Update**: Stays updated with React advancements.
