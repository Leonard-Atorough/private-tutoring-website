import logger from "../../logger.js";
import { openBookingModal, closeBookingModal } from "./modalUtils.js";

const MODAL_ID = "booking-modal";
const MODAL_BUTTON_SELECTOR = ".book-btn";
const MODAL_CLOSE_ID = "modal-close";
const FLOATING_CTA_ID = "floating-book-btn";
const FLOATING_CTA_VISIBLE_CLASS = "is-visible";

export function initModal() {
  const modal = document.getElementById(MODAL_ID);
  const openModalBtns = document.querySelectorAll(MODAL_BUTTON_SELECTOR);
  const closeModalBtn = document.getElementById(MODAL_CLOSE_ID);
  const floatingCta = document.getElementById(FLOATING_CTA_ID);
  const heroSection = document.getElementById("Hero");
  const formSection = document.getElementById("contact-form");

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

  const updateFloatingCtaVisibility = () => {
    if (!floatingCta || !heroSection || !formSection) {
      return;
    }

    const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
    const formTop = formSection.offsetTop;
    const shouldShow = window.scrollY >= heroBottom - 120 && window.scrollY < formTop - 240;

    floatingCta.classList.toggle(FLOATING_CTA_VISIBLE_CLASS, shouldShow);
    floatingCta.setAttribute("aria-hidden", String(!shouldShow));
  };

  if (floatingCta) {
    updateFloatingCtaVisibility();
    window.addEventListener("scroll", updateFloatingCtaVisibility, { passive: true });
  }

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
