/**
 * @vitest-environment jsdom
 */
import { vi, it, expect, beforeEach, afterEach, describe } from "vitest";
import * as state from "./state.js";

// we want to save state to local storage
// local storage is a key value store so we will need a key. As its per user a static key
// we also want to define a ttl for local storage, say 3 hrs - this should be in the actual state

const TEST_KEY = "theme";
const TEST_VALUE = "dark";
const FIXED_TIMESTAMP = 1690000000000;

// define our first test where we just call to persistState

describe("persistState", () => {
   beforeEach(() => {
      localStorage.clear();
      //   vi.spyOn(localStorage, 'setItem');
      vi.stubGlobal("localStorage", {
         setItem: vi.fn(),
         clear: vi.fn()
      });
      vi.spyOn(Date, "now").mockReturnValue(FIXED_TIMESTAMP);
   });

   afterEach(() => {
      vi.restoreAllMocks();
   });

   it("should update state and persist to localStorage", () => {
      state.persistState(TEST_KEY, TEST_VALUE);

      const expectedPayload = JSON.stringify({
         data: { theme: "dark" },
         timestamp: FIXED_TIMESTAMP
      });

      expect(localStorage.setItem).toHaveBeenCalledWith("appState", expectedPayload);
   });
});
