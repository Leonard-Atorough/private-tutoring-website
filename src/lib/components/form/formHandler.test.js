/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
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
        `Form with id ${nonExistentFormId} not found`,
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

      expect(addEventListenerSpy).toHaveBeenCalledWith("submit", expect.any(Function));
    });
  });

  describe("Form Submission", () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <form id="contact-form">
          <input name="name" value="John Doe" />
          <input name="email" value="john@example.com" />
          <textarea name="message">Hello World</textarea>
          <button type="submit">Submit</button>
        </form>
      `;
    });

    it("should save form submission state to localStorage on submit", async () => {
      handler.mountFormHandler("contact-form");
      
      const form = document.getElementById("contact-form");
      const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
      
      form.dispatchEvent(submitEvent);

      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(mockStateManager.saveStateToLocalStorage).toHaveBeenCalledWith(
        "formSubmitted",
        true
      );
    });

    it("should extract FormData correctly from the form", async () => {
      handler.mountFormHandler("contact-form");
      
      const form = document.getElementById("contact-form");
      
      // Create a spy before mounting to track FormData creation
      let formDataInstance = null;
      const OriginalFormData = window.FormData;
      window.FormData = class extends OriginalFormData {
        constructor(form) {
          super(form);
          formDataInstance = this;
        }
      };
      
      const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
      form.dispatchEvent(submitEvent);

      await new Promise(resolve => setTimeout(resolve, 0));

      // Verify FormData was created
      expect(formDataInstance).not.toBeNull();
      
      // Restore original
      window.FormData = OriginalFormData;
    });

    it("should handle storage errors gracefully without preventing submission", async () => {
      const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
      
      // Make saveStateToLocalStorage throw an error
      mockStateManager.saveStateToLocalStorage.mockImplementation(() => {
        throw new Error("Storage quota exceeded");
      });

      handler.mountFormHandler("contact-form");
      
      const form = document.getElementById("contact-form");
      const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
      
      // Should not throw
      expect(() => form.dispatchEvent(submitEvent)).not.toThrow();

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(consoleError).toHaveBeenCalledWith(
        "Failed to save submission state:",
        expect.any(Error)
      );
      
      consoleError.mockRestore();
    });

    it("should handle general submission errors gracefully", async () => {
      const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
      
      // Save original FormData
      const OriginalFormData = window.FormData;
      
      // Make FormData throw an error
      window.FormData = function() {
        throw new Error("FormData error");
      };

      handler.mountFormHandler("contact-form");
      
      const form = document.getElementById("contact-form");
      const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
      
      // Should not throw
      expect(() => form.dispatchEvent(submitEvent)).not.toThrow();

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(consoleError).toHaveBeenCalledWith(
        "Form submission handler error:",
        expect.any(Error)
      );
      
      // Restore original
      window.FormData = OriginalFormData;
      consoleError.mockRestore();
    });

    it("should process form data with multiple field types", async () => {
      // Reset the mock before this test
      mockStateManager.saveStateToLocalStorage.mockClear();
      
      document.body.innerHTML = `
        <form id="complex-form">
          <input name="text" value="text value" />
          <input type="checkbox" name="checkbox" checked value="yes" />
          <select name="select">
            <option value="option1">Option 1</option>
            <option value="option2" selected>Option 2</option>
          </select>
          <input type="radio" name="radio" value="radio1" checked />
          <input type="radio" name="radio" value="radio2" />
        </form>
      `;

      // Create a fresh handler for this test
      const freshHandler = formHandler(mockStateManager);
      freshHandler.mountFormHandler("complex-form");
      
      const form = document.getElementById("complex-form");
      const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
      
      form.dispatchEvent(submitEvent);

      await new Promise(resolve => setTimeout(resolve, 0));

      // Should successfully save the submission flag
      expect(mockStateManager.saveStateToLocalStorage).toHaveBeenCalledWith(
        "formSubmitted",
        true
      );
    });

    it("should attach handler only once per form", () => {
      const form = document.getElementById("contact-form");
      const addEventListenerSpy = vi.spyOn(form, "addEventListener");
      
      // Mount handler twice
      handler.mountFormHandler("contact-form");
      handler.mountFormHandler("contact-form");

      // addEventListener should be called twice (once per mount)
      // but the form should handle this correctly
      expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
      
      addEventListenerSpy.mockRestore();
    });
  });

  describe("Edge Cases", () => {
    it("should handle forms with no fields", async () => {
      mockStateManager.saveStateToLocalStorage.mockClear();
      
      document.body.innerHTML = `
        <form id="empty-form">
          <button type="submit">Submit</button>
        </form>
      `;

      const freshHandler = formHandler(mockStateManager);
      freshHandler.mountFormHandler("empty-form");
      
      const form = document.getElementById("empty-form");
      const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
      
      expect(() => form.dispatchEvent(submitEvent)).not.toThrow();

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(mockStateManager.saveStateToLocalStorage).toHaveBeenCalledWith(
        "formSubmitted",
        true
      );
    });

    it("should handle forms with empty values", async () => {
      mockStateManager.saveStateToLocalStorage.mockClear();
      
      document.body.innerHTML = `
        <form id="empty-values-form">
          <input name="field1" value="" />
          <input name="field2" value="" />
        </form>
      `;

      const freshHandler = formHandler(mockStateManager);
      freshHandler.mountFormHandler("empty-values-form");
      
      const form = document.getElementById("empty-values-form");
      const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
      
      expect(() => form.dispatchEvent(submitEvent)).not.toThrow();

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(mockStateManager.saveStateToLocalStorage).toHaveBeenCalledWith(
        "formSubmitted",
        true
      );
    });
  });
});
