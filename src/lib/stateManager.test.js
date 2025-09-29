/**
 * @vitest-environment jsdom
 */
import { vi, it, expect, beforeEach, afterEach, describe } from "vitest";
import * as state from "./stateManager.js";

const TEST_KEY = "settings";
const TEST_VALUE = { theme: "dark" };
const FIXED_TIMESTAMP = 1690000000000;

const EXPIRATION_MS = 1000 * 60 * 60 * 24;
// define our first test where we just call to persistState

describe("state persistence", () => {
   beforeEach(() => {
      localStorage.clear();
      let mockStore = {};
      vi.stubGlobal("localStorage", {
         setItem: vi.fn((key, value) => (mockStore[key] = value)),
         getItem: vi.fn((key) => mockStore[key]),
         removeItem: vi.fn((key) => delete mockStore[key] ?? null),
         clear: () => (mockStore = {})
      });

      vi.useFakeTimers({ now: FIXED_TIMESTAMP });
   });

   afterEach(() => {
      vi.restoreAllMocks();
      vi.useRealTimers();
   });
   describe("persistState", () => {
      it("should update state and persist to localStorage", () => {
         state.persistState(TEST_KEY, TEST_VALUE);

         const expectedPayload = JSON.stringify({
            data: { settings: { theme: "dark" } },
            timestamp: FIXED_TIMESTAMP
         });

         expect(localStorage.setItem).toHaveBeenCalledWith("appState", expectedPayload);
      });
   });

   describe("getPersistedState", () => {
      it("should get state from local storage and load it into memory", () => {
         state.persistState(TEST_KEY, TEST_VALUE);
         const persisted = state.getPersistedState(TEST_KEY);
         expect(persisted).toEqual(TEST_VALUE);
      });

      it("should remove state from local storage once it has expired and return an empty state object", () => {
         state.persistState(TEST_KEY, TEST_VALUE);

         const fastForwardTime = FIXED_TIMESTAMP + EXPIRATION_MS + 1;
         vi.setSystemTime(fastForwardTime);

         const persisted = state.getPersistedState();

         expect(localStorage.removeItem).toHaveBeenCalledWith("appState");
         expect(localStorage.getItem("appState")).toBeUndefined();
         expect(persisted).toStrictEqual({});
      });
   });
});
