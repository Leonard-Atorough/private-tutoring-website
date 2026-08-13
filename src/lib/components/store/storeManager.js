import logger from "../../logger.js";

const STATE_KEY = "appState";
const EXPIRY_HOURS = 24; // hours

let state = {};

function getStorage() {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage ?? null;
  } catch (error) {
    logger.error("Error accessing localStorage", { errorMessage: error.message }, error);
    return null;
  }
}

export function saveStateToLocalStorage(key, value) {
  try {
    state[key] = value;

    const storage = getStorage();
    if (!storage) return value;

    const payload = JSON.stringify({ data: state, timestamp: Date.now() });
    storage.setItem(STATE_KEY, payload);
    return value;
  } catch (error) {
    logger.error("Error saving state to localStorage", { key, errorMessage: error.message }, error);
    return undefined;
  }
}

export function fetchStoredState(key) {
  const storage = getStorage();
  if (!storage) return {};

  try {
    const persisted = storage.getItem(STATE_KEY);
    if (!persisted) return {};

    const { data, timestamp } = JSON.parse(persisted);
    if (Date.now() - timestamp > EXPIRY_HOURS * 60 * 60 * 1000) {
      storage.removeItem(STATE_KEY);
      return {};
    }

    state = data || {};
    return key === undefined ? state : state[key] ?? null;
  } catch (error) {
    logger.error("Error fetching state from localStorage", { key, errorMessage: error.message }, error);
    return null;
  }
}
