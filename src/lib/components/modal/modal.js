const MODAL_ID = "booking-modal";
const MODAL_BUTTON_ID = "bookBtn";
const MODAL_CLOSE_ID = "modal-close";

export function initModal() {
  const modal = document.getElementById(MODAL_ID);
  const openButton = document.querySelectorAll(`#${MODAL_BUTTON_ID}`);
  const closeButton = document.getElementById(MODAL_CLOSE_ID);
  const iframe = modal?.querySelector("iframe");
  let lastActiveElement;

  const focusableElements =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  function getFocusableElements() {
    return modal.querySelectorAll(focusableElements);
  }

  function trapFocus(e) {
    if (!modal.classList.contains("active")) return;

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
      modal.classList.add("active");
      document.body.style.overflow = "hidden";

      // Focus the iframe after a brief delay to ensure it's loaded
      if (iframe) {
        setTimeout(() => {
          iframe.focus();
        }, 300);
      }
    }, 100);
  }

  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
    // Return focus to the element that opened the modal
    if (lastActiveElement) {
      lastActiveElement.focus();
    }
  }

  Array.from(openButton).forEach((e) => e.addEventListener("click", openModal));
  closeButton?.addEventListener("click", closeModal);

  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Handle keyboard events
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
    if (e.key === "Tab" && modal.classList.contains("active")) {
      trapFocus(e);
    }
  });

  // Set appropriate ARIA attributes
  modal?.setAttribute("role", "dialog");
  modal?.setAttribute("aria-modal", "true");
  if (iframe) {
    iframe.setAttribute("tabindex", "0");
  }
}
