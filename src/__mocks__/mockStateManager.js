export function createMockStateManager() {
  const store = new Map();

  function saveStateToLocalStorage(key, value) {
    store.set(key, value);
  }
  function fetchStoredState(key) {
    return store.get(key);
  }
  return { saveStateToLocalStorage, fetchStoredState };
}
