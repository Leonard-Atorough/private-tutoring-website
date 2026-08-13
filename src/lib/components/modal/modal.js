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

  // Open modal on button click
  Array.from(openModalBtns).forEach((btn) => {
    btn.addEventListener("click", openBookingModal);
  });

  // Close modal on close button click
  closeModalBtn?.addEventListener("click", closeBookingModal);

  // Close modal on backdrop click
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeBookingModal();
    }
  });

  logger.info("Modal initialized successfully");
}
