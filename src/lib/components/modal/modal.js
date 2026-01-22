import logger from "../../logger.js";

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
  let lastActiveElement;

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

  function openModal() {
    lastActiveElement = document.activeElement;
    setTimeout(() => {
      modal.classList.add("-active");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";

      // Focus the close button not the iframe initially
      if (iframe) {
        setTimeout(() => {
          closeModalBtn?.focus();
        }, 300);
      }
    }, 100);
  }

  function closeModal() {
    modal.classList.remove("-active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    // Return focus to the element that opened the modal
    if (lastActiveElement) {
      lastActiveElement.focus();
    }
  }

  Array.from(openModalBtns).forEach((e) => e.addEventListener("click", openModal));
  closeModalBtn?.addEventListener("click", closeModal);

  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("-active")) {
      closeModal();
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
