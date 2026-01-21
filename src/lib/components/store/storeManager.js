import logger from "../../logger.js";

const STATE_KEY = "appState";
const EXPIRY_HOURS = 24; //hours

let state = {};

export function saveStateToLocalStorage(key, value) {
  try {
    state[key] = value;
    const payload = JSON.stringify({ data: state, timestamp: Date.now() });
    localStorage.setItem(STATE_KEY, payload);
  } catch (error) {
    logger.error("Error saving state to localStorage", { key, errorMessage: error.message }, error);
  }
}

export function fetchStoredState(key) {
  const persisted = localStorage.getItem(STATE_KEY);
  if (!persisted) return {};
  try {
    const { data, timestamp } = JSON.parse(persisted);
    if (Date.now() - timestamp > EXPIRY_HOURS * 60 * 60 * 1000) {
      localStorage.removeItem(STATE_KEY);
      return {};
    }
    state = data;
    return data[key] || null;
  } catch (error) {
    logger.error("Error fetching state from localStorage", { key, errorMessage: error.message }, error);
    return null;
  }
}
