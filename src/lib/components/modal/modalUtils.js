/* eslint-disable no-undef */
import logger from "../../logger.js";

const MODAL_ID = "booking-modal";

/**
 * Opens the booking modal using native dialog API
 * Dialog handles focus management and keyboard (ESC) automatically
 */
export function openBookingModal() {
  try {
    const modal = document.getElementById(MODAL_ID);

    if (!modal || !(modal instanceof HTMLDialogElement)) {
      logger.warn("Modal dialog element not found", { id: MODAL_ID });
      return;
    }

    modal.showModal();
  } catch (error) {
    logger.error("Error opening booking modal", { error: error.message });
  }
}

/**
 * Closes the booking modal using native dialog API
 */
export function closeBookingModal() {
  try {
    const modal = document.getElementById(MODAL_ID);

    if (!modal || !(modal instanceof HTMLDialogElement)) {
      logger.warn("Modal dialog element not found", { id: MODAL_ID });
      return;
    }

    modal.close();
  } catch (error) {
    logger.error("Error closing booking modal", { error: error.message });
  }
}
