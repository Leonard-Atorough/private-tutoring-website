import { vi } from "vitest";

export function createMockStateManager() {
  const store = new Map();

  const saveStateToLocalStorage = vi.fn((key, value) => {
    store.set(key, value);
  });
  
  const fetchStoredState = vi.fn((key) => {
    return store.get(key);
  });
  
  return { saveStateToLocalStorage, fetchStoredState, store };
}
