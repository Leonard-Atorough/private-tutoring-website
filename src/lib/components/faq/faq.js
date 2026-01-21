import { logger } from "@sentry/browser";

export function initializeFAQ() {
  const faqItems = document.querySelectorAll(".faq-item");

  if (faqItems.length === 0) {
    logger.warn("No FAQ items found");
    return;
  }

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove("active");
        }
      });

      item.classList.toggle("active", !isActive);

      const isNowActive = item.classList.contains("active");
      question.setAttribute("aria-expanded", isNowActive);
    });

    question.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        question.click();
      }
    });
  });
}
