const STATE_KEY = "appState";
const EXPIRY_HOURS = 24; //hours

let state = {};

export function persistState(key, value) {
   //set the state object
   state[key] = value;
   // prepares the payload
   const payload = JSON.stringify({ data: state, timestamp: Date.now() });
   //saves to local storage
   localStorage.setItem(STATE_KEY, payload);
}
