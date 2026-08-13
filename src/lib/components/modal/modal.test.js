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
        <dialog id="booking-modal">
            <iframe src="about:blank"></iframe>
        </dialog>
      `;
      initModal();
      expect(mockLogger.warn).toHaveBeenCalledWith("No modal close button found", {
        id: "modal-close",
      });
    });

    it("should warn if no trigger buttons found", () => {
      document.body.innerHTML = `
        <dialog id="booking-modal">
          <button id="modal-close">Close</button>
        </dialog>
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
        <dialog id="booking-modal">
            <button id="modal-close">Close</button>
            <iframe src="about:blank"></iframe>
        </dialog>
    `;
      // Mock HTMLDialogElement methods since jsdom doesn't implement them
      const modal = document.getElementById("booking-modal");
      modal.showModal = vi.fn();
      modal.close = vi.fn();
    });

    it("should open the modal when button is clicked", () => {
      initModal();
      const modal = document.getElementById("booking-modal");
      const openBtn = document.getElementById("bookBtn");

      openBtn.click();

      expect(modal.showModal).toHaveBeenCalled();
    });

    it("should close modal when close button is clicked", () => {
      initModal();
      const modal = document.getElementById("booking-modal");
      const closeBtn = document.getElementById("modal-close");

      closeBtn.click();

      expect(modal.close).toHaveBeenCalled();
    });

    it("should close modal when clicking outside (on backdrop)", () => {
      initModal();
      const modal = document.getElementById("booking-modal");
      const openBtn = document.getElementById("bookBtn");

      openBtn.click();

      // Click on modal backdrop (the modal element itself)
      const clickEvent = new MouseEvent("click", { bubbles: false });
      Object.defineProperty(clickEvent, "target", { value: modal, enumerable: true });
      modal.dispatchEvent(clickEvent);

      expect(modal.close).toHaveBeenCalled();
    });
  });
});
