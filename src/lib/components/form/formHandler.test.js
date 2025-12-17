// Tests
import { describe } from "vitest";
import { formHandler } from "./formHandler.js";
import { createMockStateManager } from "../../../__mocks__/mockStateManager.js";

describe("formHandler", () => {
  let mockStateManager;
  let handler;
  beforeEach(() => {
    mockStateManager = createMockStateManager();
    handler = formHandler(mockStateManager);
  });

  describe("mountFormHandler", () => {
    it("should throw an error if form is not found", () => {
      const nonExistentFormId = "non-existent-form";
      expect(() => handler.mountFormHandler(nonExistentFormId)).toThrow(
        `Form with id ${nonExistentFormId} not found`
      );
    });

    it("should attach submit event listener to the form", () => {
      document.body.innerHTML = `
        <form id="test-form">
          <input name="name" value="Test User" />
          <button type="submit">Submit</button>
        </form>
      `;
      const formId = "test-form";

      const form = document.getElementById(formId);
      const addEventListenerSpy = vi.spyOn(form, "addEventListener");
      handler.mountFormHandler(formId);

      const submitEvent = new Event("submit");
      form.dispatchEvent(submitEvent);
      expect(addEventListenerSpy).toHaveBeenCalledWith("submit", expect.any(Function));
    });
  });
});
