const MODAL_ID = "booking-modal";
const MODAL_BUTTON_ID = "bookBtn";
const MODAL_CLOSE_ID = "modal-close";

export function initModal() {
  const modal = document.getElementById(MODAL_ID);
  const openButton = document.querySelectorAll(`#${MODAL_BUTTON_ID}`);
  const closeButton = document.getElementById(MODAL_CLOSE_ID);

  function openModal() {
    setTimeout(() => {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    }, 100);
  }

  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  Array.from(openButton).forEach((e) => e.addEventListener("click", openModal));
  closeButton?.addEventListener("click", closeModal);


  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-active")) {
      closeModal();
    }
  });
}
