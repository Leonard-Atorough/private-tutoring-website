import { openBookingModal } from "../modal/modalUtils.js";

export function attachBookingButtons() {
  const bookButtons = document.querySelectorAll(".pricing-card .book-btn");
  bookButtons.forEach((button) => {
    button.addEventListener("click", () => {
      openBookingModal();
    });
  });
}
