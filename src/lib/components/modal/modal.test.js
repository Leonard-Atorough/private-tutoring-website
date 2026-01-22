/* eslint-disable no-undef */
/**
 * @vitest-environment jsdom
 */
import { describe, beforeEach, it, expect, vi } from "vitest";
import { createMockLogger } from "../../../__mocks__/logger.js";

vi.mock("../../logger.js", () => ({ default: createMockLogger(vi) }));

import { initModal } from "./modal";
import logger from "../../logger.js";

const mockLogger = vi.mocked(logger);

describe("Modal Component", () => {
  describe("Initialization", () => {
    it("should return if no modal element", () => {
      document.body.innerHTML = `
            <div></div>
        `;
      expect(() => initModal()).not.toThrow();
    });

    it("should warn if no close button found", () => {
      document.body.innerHTML = `
        <button id="bookBtn" class="book-btn">Open Modal</button>
        <div id="booking-modal" class="modal">
            <iframe src="about:blank"></iframe>
        </div>
      `;
      initModal();
      expect(mockLogger.warn).toHaveBeenCalledWith("No modal close button found", {
        id: "modal-close",
      });
    });

    it("should warn if no trigger buttons found", () => {
      document.body.innerHTML = `
        <div id="booking-modal" class="modal">
          <button id="modal-close">Close</button>
        </div>
      `;
      initModal();
      expect(mockLogger.warn).toHaveBeenCalledWith("No modal trigger buttons found", {
        selector: ".book-btn",
      });
    });
  });

  describe("Open and Close Modal", () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <button id="bookBtn" class="book-btn">Open Modal</button>
        <div id="booking-modal" class="modal">
            <button id="modal-close">Close</button>
            <iframe src="about:blank"></iframe>
        </div>
    `;
    });

    it("should open and close the modal correctly", () => {
      vi.useFakeTimers();

      initModal();
      const modal = document.getElementById("booking-modal");
      const openBtn = document.getElementById("bookBtn");
      const closeBtn = document.getElementById("modal-close");

      // Open modal
      openBtn.click();
      vi.runAllTimers();
      expect(modal.classList.contains("-active")).toBe(true);
      expect(modal.getAttribute("aria-hidden")).toBe("false");
      expect(document.body.style.overflow).toBe("hidden");

      // Close modal
      closeBtn.click();
      vi.runAllTimers();
      expect(modal.classList.contains("-active")).toBe(false);
      expect(modal.getAttribute("aria-hidden")).toBe("true");
      expect(document.body.style.overflow).toBe("");

      vi.useRealTimers();
    });

    it("should close modal when clicking outside", () => {
      vi.useFakeTimers();

      initModal();
      const modal = document.getElementById("booking-modal");
      const openBtn = document.getElementById("bookBtn");

      // Open modal
      openBtn.click();
      vi.runAllTimers();
      expect(modal.classList.contains("-active")).toBe(true);

      // Click on modal backdrop (the modal element itself)
      modal.click();
      expect(modal.classList.contains("-active")).toBe(false);

      vi.useRealTimers();
    });

    it("should close modal on Escape key", () => {
      vi.useFakeTimers();

      initModal();
      const modal = document.getElementById("booking-modal");
      const openBtn = document.getElementById("bookBtn");

      // Open modal
      openBtn.click();
      vi.runAllTimers();
      expect(modal.classList.contains("-active")).toBe(true);

      // Press Escape
      const escapeEvent = new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
      });
      document.dispatchEvent(escapeEvent);

      expect(modal.classList.contains("-active")).toBe(false);

      vi.useRealTimers();
    });

    it("should not close modal when clicking inside modal content", () => {
      vi.useFakeTimers();

      initModal();
      const modal = document.getElementById("booking-modal");
      const openBtn = document.getElementById("bookBtn");
      const closeBtn = document.getElementById("modal-close");

      // Open modal
      openBtn.click();
      vi.runAllTimers();
      expect(modal.classList.contains("-active")).toBe(true);

      // Click on close button (inside modal)
      const clickEvent = new MouseEvent("click", { bubbles: true });
      Object.defineProperty(clickEvent, "target", { value: closeBtn, enumerable: true });
      modal.dispatchEvent(clickEvent);

      // Modal should still be open because we clicked inside, not on backdrop
      // The closeModal() would only be called if e.target === modal
      expect(modal.classList.contains("-active")).toBe(true);

      vi.useRealTimers();
    });
  });

  describe("Focus Management", () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <button id="outside-btn">Outside Button</button>
        <button id="bookBtn" class="book-btn">Open Modal</button>
        <div id="booking-modal" class="modal">
            <button id="modal-close">Close</button>
            <input id="modal-input" type="text" />
            <button id="modal-submit">Submit</button>
            <iframe src="about:blank"></iframe>
        </div>
      `;
    });

    it("should focus close button when modal opens", () => {
      vi.useFakeTimers();

      initModal();
      const openBtn = document.getElementById("bookBtn");
      const closeBtn = document.getElementById("modal-close");

      openBtn.click();
      vi.runAllTimers();

      expect(document.activeElement).toBe(closeBtn);

      vi.useRealTimers();
    });

    it("should restore focus to trigger button when modal closes", () => {
      vi.useFakeTimers();

      initModal();
      const openBtn = document.getElementById("bookBtn");
      const closeBtn = document.getElementById("modal-close");

      openBtn.focus();
      openBtn.click();
      vi.runAllTimers();

      closeBtn.click();

      expect(document.activeElement).toBe(openBtn);

      vi.useRealTimers();
    });

    it("should trap focus forward with Tab key", () => {
      vi.useFakeTimers();

      initModal();
      const modal = document.getElementById("booking-modal");
      const openBtn = document.getElementById("bookBtn");
      const closeBtn = document.getElementById("modal-close");
      const modalInput = document.getElementById("modal-input");
      const modalSubmit = document.getElementById("modal-submit");
      const iframe = modal.querySelector("iframe");

      openBtn.click();
      vi.runAllTimers();

      // Focus is on close button, tab to next element
      closeBtn.focus();
      const tabEvent1 = new KeyboardEvent("keydown", {
        key: "Tab",
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(tabEvent1);

      // Manually simulate what would happen (focus moves in real browser)
      if (!tabEvent1.defaultPrevented) {
        modalInput.focus();
      }
      expect(document.activeElement).toBe(modalInput);

      // Tab to next element
      const tabEvent2 = new KeyboardEvent("keydown", {
        key: "Tab",
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(tabEvent2);

      if (!tabEvent2.defaultPrevented) {
        modalSubmit.focus();
      }
      expect(document.activeElement).toBe(modalSubmit);

      // Tab to next (iframe)
      const tabEvent3 = new KeyboardEvent("keydown", {
        key: "Tab",
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(tabEvent3);

      if (!tabEvent3.defaultPrevented) {
        iframe.focus();
      }
      expect(document.activeElement).toBe(iframe);

      // Tab from last element should wrap to first
      iframe.focus();
      const tabEvent4 = new KeyboardEvent("keydown", {
        key: "Tab",
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(tabEvent4);

      // Should wrap to first focusable element
      expect(tabEvent4.defaultPrevented).toBe(true);

      vi.useRealTimers();
    });

    it("should trap focus backward with Shift+Tab key", () => {
      vi.useFakeTimers();

      initModal();
      const modal = document.getElementById("booking-modal");
      const openBtn = document.getElementById("bookBtn");
      const closeBtn = document.getElementById("modal-close");
      const iframe = modal.querySelector("iframe");

      openBtn.click();
      vi.runAllTimers();

      // Focus is on close button (first element), Shift+Tab should wrap to last
      closeBtn.focus();
      const shiftTabEvent = new KeyboardEvent("keydown", {
        key: "Tab",
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(shiftTabEvent);

      // Should wrap to last focusable element and prevent default
      expect(shiftTabEvent.defaultPrevented).toBe(true);
      expect(document.activeElement).toBe(iframe);

      vi.useRealTimers();
    });

    it("should only trap focus when modal is active", () => {
      vi.useFakeTimers();

      initModal();
      const modal = document.getElementById("booking-modal");
      const outsideBtn = document.getElementById("outside-btn");

      // Modal is not open
      outsideBtn.focus();
      const tabEvent = new KeyboardEvent("keydown", {
        key: "Tab",
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(tabEvent);

      // Tab should not be prevented when modal is closed
      expect(tabEvent.defaultPrevented).toBe(false);
      expect(document.activeElement).toBe(outsideBtn);
      expect(modal.classList.contains("-active")).toBe(false);

      vi.useRealTimers();
    });
  });
});
