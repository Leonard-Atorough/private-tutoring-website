import logger from "../../logger.js";

const MODAL_ID = "booking-modal";
const MODAL_CLOSE_ID = "modal-close";

/**
 * Opens the booking modal with proper focus management and accessibility
 * @param {Element} elementToFocus - Optional element to focus after modal opens (defaults to close button)
 */
export function openBookingModal(elementToFocus) {
  try {
    const modal = document.getElementById(MODAL_ID);
    const closeModalBtn = document.getElementById(MODAL_CLOSE_ID);

    if (!modal) {
      logger.warn("Modal element not found", { id: MODAL_ID });
      return;
    }

    if (!modal._lastActiveElement) {
      modal._lastActiveElement = document.activeElement;
    }

    setTimeout(() => {
      modal.classList.add("-active");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";

      const focusTarget = elementToFocus || closeModalBtn;
      if (focusTarget) {
        setTimeout(() => {
          focusTarget.focus();
        }, 300);
      }
    }, 100);
  } catch (error) {
    logger.error("Error opening booking modal", { error: error.message });
  }
}

export function closeBookingModal() {
  try {
    const modal = document.getElementById(MODAL_ID);

    if (!modal) {
      logger.warn("Modal element not found", { id: MODAL_ID });
      return;
    }

    modal.classList.remove("-active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (modal._lastActiveElement) {
      modal._lastActiveElement.focus();
      modal._lastActiveElement = null;
    }
  } catch (error) {
    logger.error("Error closing booking modal", { error: error.message });
  }
}
