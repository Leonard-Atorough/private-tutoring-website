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

    it("should reveal the floating CTA between hero and contact form scroll thresholds", () => {
      document.body.innerHTML = `
        <section id="Hero" aria-label="Hero section"></section>
        <button id="floating-book-btn" class="book-btn floating-book-btn" type="button">Book a Session</button>
        <form id="contact-form"></form>
        <dialog id="booking-modal">
          <button id="modal-close">Close</button>
          <iframe src="about:blank"></iframe>
        </dialog>
      `;

      const hero = document.getElementById("Hero");
      const floatingBtn = document.getElementById("floating-book-btn");
      const form = document.getElementById("contact-form");
      const modal = document.getElementById("booking-modal");

      Object.defineProperty(hero, "offsetTop", { value: 0, configurable: true });
      Object.defineProperty(hero, "offsetHeight", { value: 600, configurable: true });
      Object.defineProperty(form, "offsetTop", { value: 1200, configurable: true });
      modal.showModal = vi.fn();

      initModal();

      // Test: Button should be visible when scrolled past hero but before form
      Object.defineProperty(window, "scrollY", { value: 700, writable: true, configurable: true });
      window.dispatchEvent(new Event("scroll", { bubbles: false }));
      expect(floatingBtn.classList.contains("is-visible")).toBe(true);

      // Test: Button should be hidden when scrolled to form section
      Object.defineProperty(window, "scrollY", { value: 1200, writable: true, configurable: true });
      window.dispatchEvent(new Event("scroll", { bubbles: false }));
      expect(floatingBtn.classList.contains("is-visible")).toBe(false);

      // Test: Button click opens modal
      Object.defineProperty(window, "scrollY", { value: 700, writable: true, configurable: true });
      window.dispatchEvent(new Event("scroll", { bubbles: false }));
      floatingBtn.click();
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
