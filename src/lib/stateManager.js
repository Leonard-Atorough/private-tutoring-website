const STATE_KEY = "appState";
const EXPIRY_HOURS = 24; //hours

let state = {};

export function persistState(key, value) {
  state[key] = value;
  console.log(value);
  const payload = JSON.stringify({ data: state, timestamp: Date.now() });
  localStorage.setItem(STATE_KEY, payload);
}

export function getPersistedState(key) {
  let persisted = localStorage.getItem(STATE_KEY);
  if (!persisted) return {};
  try {
    const { data, timestamp } = JSON.parse(persisted);
    if (Date.now() - timestamp > EXPIRY_HOURS * 60 * 60 * 1000) {
      localStorage.removeItem(STATE_KEY);
      return {};
    }
    state = data;
    return data[key] || null;
  } catch {
    return null;
  }
}
