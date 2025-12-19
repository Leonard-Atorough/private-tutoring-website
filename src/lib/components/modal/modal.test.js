// no need to import beforeEach, describe, expect in Vitest environment
import { describe } from "vitest";
import { initModal } from "./modal";

describe("Modal Component", () => {
  describe("Initialization", () => {
    it("should return if no modal element", () => {
      document.body.innerHTML = `
            <div></div>
        `;
      expect(() => initModal()).not.toThrow();
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

      // Close modal
      closeBtn.click();
      vi.runAllTimers();
      expect(modal.classList.contains("-active")).toBe(false);
    });
  });
  //   describe("Focus Trapping", () => {
  //     beforeEach(() => {
  //       document.body.innerHTML = `
  //         <button id="bookBtn">Open Modal</button>
  //         <div id="booking-modal" class="modal">
  //             <button id="modal-close">Close</button>
  //             <iframe src="about:blank"></iframe>
  //             <button id="another-btn">Another Button</button>
  //         </div>
  //     `;
  //     });

  //     it("should trap focus within the modal", () => {
  //       vi.useFakeTimers();
  //       initModal();
  //       const modal = document.getElementById("booking-modal");
  //       const openBtn = document.getElementById("bookBtn");
  //       const closeBtn = document.getElementById("modal-close");
  //       const anotherBtn = document.getElementById("another-btn");

  //       // Open modal
  //       openBtn.click();
  //       vi.runAllTimers();
  //       expect(modal.classList.contains("active")).toBe(true);
  //       //   closeBtn.focus();

  //       // Simulate Tab key press on close button
  //       const tabEvent = new KeyboardEvent("keydown", {
  //         key: "Tab",
  //         bubbles: true,
  //       });
  //       closeBtn.dispatchEvent(tabEvent);
  //       expect(document.activeElement).toBe(anotherBtn);
  //       // Simulate Shift+Tab key press on another button
  //       const shiftTabEvent = new KeyboardEvent("keydown", {
  //         key: "Tab",
  //         shiftKey: true,
  //         bubbles: true,
  //       });
  //       anotherBtn.dispatchEvent(shiftTabEvent);
  //       expect(document.activeElement).toBe(closeBtn);
  //     });
  //   });
});
