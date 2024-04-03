import { renderHook, act, render } from "@testing-library/react";
import { createSupastate } from ".";
import { useEffect } from "react";

describe("supastate hook", () => {
  // Test for setting state directly
  it("should allow setting the state directly", () => {
    const initialState = { count: 0 };
    const useCounter = createSupastate(initialState);
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.set({ count: 10 });
    });

    expect(result.current.state.count).toBe(10);
  });

  // Test for updating state based on the current state
  it("should allow updating the state based on the current state", () => {
    const initialState = { count: 0 };
    const useCounter = createSupastate(initialState);
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.update((prevState) => ({ count: prevState.count + 1 }));
    });

    expect(result.current.state.count).toBe(1);
  });

  // Test for resetting state back to initial value
  it("should allow resetting the state back to its initial value", () => {
    const initialState = { count: 5 };
    const useCounter = createSupastate(initialState);
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.set({ count: 10 });
      result.current.set(initialState); // Reset to initial state
    });

    expect(result.current.state.count).toBe(5);
  });

  // Test for updating nested state
  it("should handle nested state updates correctly", () => {
    const initialState = { user: { name: "John", age: 30 } };
    const useProfile = createSupastate(initialState);
    const { result } = renderHook(() => useProfile());

    act(() => {
      result.current.update((prevState) => ({
        ...prevState,
        user: { ...prevState.user, name: "Jane" },
      }));
    });

    expect(result.current.state.user.name).toBe("Jane");
    expect(result.current.state.user.age).toBe(30); // Unchanged
  });

  // Test for handling arrays
  it("should correctly handle updates to arrays", () => {
    const initialState = { items: ["item1", "item2"] };
    const useList = createSupastate(initialState);
    const { result } = renderHook(() => useList());

    act(() => {
      result.current.update((prevState) => ({
        ...prevState,
        items: [...prevState.items, "item3"],
      }));
    });

    expect(result.current.state.items.length).toBe(3);
    expect(result.current.state.items[2]).toBe("item3");
  });
});
