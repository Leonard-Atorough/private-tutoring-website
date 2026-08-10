import logger from "../../logger.js";
import { openBookingModal, closeBookingModal } from "./modalUtils.js";

const MODAL_ID = "booking-modal";
const MODAL_BUTTON_SELECTOR = ".book-btn";
const MODAL_CLOSE_ID = "modal-close";

export function initModal() {
  const modal = document.getElementById(MODAL_ID);
  const openModalBtns = document.querySelectorAll(MODAL_BUTTON_SELECTOR);
  const closeModalBtn = document.getElementById(MODAL_CLOSE_ID);

  if (!modal) {
    logger.warn("Modal elements not found, modal functionality disabled");
    return;
  }

  if (openModalBtns.length === 0) {
    logger.warn("No modal trigger buttons found", { selector: MODAL_BUTTON_SELECTOR });
  }

  if (!closeModalBtn) {
    logger.warn("No modal close button found", { id: MODAL_CLOSE_ID });
  }

  const iframe = modal?.querySelector("iframe");

  const focusableElements =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  function getFocusableElements() {
    return modal.querySelectorAll(focusableElements);
  }

  function trapFocus(e) {
    if (!modal.classList.contains("-active")) return;

    const focusable = Array.from(getFocusableElements());
    const firstFocusable = focusable[0];
    const lastFocusable = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
        e.preventDefault();
      }
    }
  }

  Array.from(openModalBtns).forEach((e) => e.addEventListener("click", () => {
    // Focus close button after opening if iframe exists
    const focusTarget = iframe ? closeModalBtn : undefined;
    openBookingModal(focusTarget);
  }));
  closeModalBtn?.addEventListener("click", closeBookingModal);

  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeBookingModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("-active")) {
      closeBookingModal();
    }
    if (e.key === "Tab" && modal.classList.contains("-active")) {
      trapFocus(e);
    }
  });

  modal?.setAttribute("role", "dialog");
  modal?.setAttribute("aria-modal", "true");
  if (iframe) {
    iframe.setAttribute("tabindex", "0");
  }
  logger.info("Modal initialized successfully");
}
