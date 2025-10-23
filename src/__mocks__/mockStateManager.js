export function createMockStateManager() {
  const store = new Map();

  function persistState(key, value) {
    store.set(key, value);
  }
  function getPersistedState(key) {
    return store.get(key);
  }
  return { persistState, getPersistedState };
}
