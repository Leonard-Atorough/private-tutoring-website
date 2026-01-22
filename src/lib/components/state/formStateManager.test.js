/**
 * @vitest-environment jsdom
 */

import { describe, beforeEach, it, vi, expect } from "vitest";
import { createMockLogger } from "../../../__mocks__/logger.js";

vi.mock("../../logger.js", () => ({ default: createMockLogger(vi) }));

import { createFormStateManager } from "./formStateManager.js";

describe("Given a formStateManager", () => {
  let saveStateToLocalStorage;
  let fetchStoredState;
  let persistFormState;
  beforeEach(() => {
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

    saveStateToLocalStorage = vi.fn();
    fetchStoredState = vi.fn((key) => {
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
    ({ persistFormState } = createFormStateManager(saveStateToLocalStorage, fetchStoredState));
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
      expect(saveStateToLocalStorage).toHaveBeenCalledWith("test-form", formData);
      vi.useRealTimers();
    });

    it("should throw an error if the form does not exist and log to console", () => {
      expect(() => persistFormState("non-existent-form")).toThrow("Form not found");
    });

    it("should not persist state if the form has been submitted", () => {
      fetchStoredState = vi.fn((key) => {
        if (key === "formSubmitted") {
          return true;
        }
        return null;
      });
      ({ persistFormState } = createFormStateManager(saveStateToLocalStorage, fetchStoredState));
      persistFormState("test-form");
      expect(saveStateToLocalStorage).toHaveBeenCalledWith("formSubmitted", false);
      expect(saveStateToLocalStorage).not.toHaveBeenCalledWith("test-form", expect.anything());
    });

    it("should clear idle timer if form is submitted and debounce the saveState call", () => {
      vi.useFakeTimers();
      const form = document.getElementById("test-form");
      persistFormState("test-form");

      form.dispatchEvent(new Event("input"));
      vi.advanceTimersByTime(3000);

      form.dispatchEvent(new Event("submit"));
      vi.advanceTimersByTime(3000);

      expect(saveStateToLocalStorage).toHaveBeenCalledTimes(1);
      vi.useRealTimers();
    });

    it("throws an error if the form does not exist", () => {
      expect(() => persistFormState("non-existent-form")).toThrow("Form not found");
    });
  });
});
