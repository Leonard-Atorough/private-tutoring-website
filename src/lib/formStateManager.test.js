/**
 * @vitest-environment jsdom
 */

import { describe, beforeEach, it, vi, expect } from "vitest";
import { createFormStateManager } from "./formStateManager.js";

describe("Given a formStateManager", () => {
  let persistState;
  let getPersistedState;
  let persistFormState;
  beforeEach(() => {
    //setup a mock form in mock DOM
    document.body.innerHTML = `
      <form id="test-form">
        <input type="text" name="username" value="persistedUser" />
        <input type="password" name="password" value="persistedPass" />
        <input type="checkbox" name="subscribe" checked />
        <select name="country">
          <option value="us">United States</option>
          <option value="ca" selected>Canada</option>
        </select>
      </form>`;

    // mock state persistence for stateManager functions using a spyOn
    persistState = vi.fn();
    getPersistedState = vi.fn((key) => {
      if (key === "test-form") {
        return {
          username: "persistedUser",
          password: "persistedPass",
          subscribe: "on",
          country: "ca",
        };
      }
      if (key === "formSubmitted") {
        return false;
      }
      return null;
    });
    ({ persistFormState } = createFormStateManager(persistState, getPersistedState));
  });

  describe("when persistFormState is called", () => {
    it("should persist state with the correct form data after the input event timeout", () => {
      vi.useFakeTimers();
      const form = document.getElementById("test-form");
      const formData = {
        username: "persistedUser",
        password: "persistedPass",
        subscribe: "on",
        country: "ca",
      };
      persistFormState("test-form");
      form.dispatchEvent(new Event("input"));
      vi.advanceTimersByTime(3000);
      expect(persistState).toHaveBeenCalledWith("test-form", formData);
      vi.useRealTimers();
    });

    it("should throw an error if the form does not exist and log to console", () => {
      console.warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      expect(() => persistFormState("non-existent-form")).toThrow("Form not found");
      expect(console.warn).toHaveBeenCalledWith("Form with id non-existent-form not found");
    });

    it("should not persist state if the form has been submitted", () => {
      getPersistedState = vi.fn((key) => {
        if (key === "formSubmitted") {
          return true;
        }
        return null;
      });
      ({ persistFormState } = createFormStateManager(persistState, getPersistedState));
      persistFormState("test-form");
      expect(persistState).toHaveBeenCalledWith("formSubmitted", false);
      expect(persistState).not.toHaveBeenCalledWith("test-form", expect.anything());
    });

    it("should clear idle timer if form is submitted and debounce the saveState call", () => {
      vi.useFakeTimers();
      const form = document.getElementById("test-form");
      persistFormState("test-form");

      form.dispatchEvent(new Event("input"));
      vi.advanceTimersByTime(3000);

      form.dispatchEvent(new Event("submit"));
      vi.advanceTimersByTime(3000);

      expect(persistState).toHaveBeenCalledTimes(1);
      vi.useRealTimers();
    });

    it("throws an error if the form does not exist", () => {
      console.warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      expect(() => persistFormState("non-existent-form")).toThrow("Form not found");
      expect(console.warn).toHaveBeenCalledWith("Form with id non-existent-form not found");
    });
  });
});
