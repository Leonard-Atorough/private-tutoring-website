export function attachBookingButtons() {
  const bookButtons = document.querySelectorAll(".pricing-card .book-btn");
  bookButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const modal = document.getElementById("booking-modal");
      if (modal) {
        modal.setAttribute("aria-hidden", "false");
        modal.style.display = "flex";
        document.body.style.overflow = "hidden";
      }
    });
  });
}
