export function initializeFAQ() {
  const faqItems = document.querySelectorAll(".faq-item");

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

/**
 * Render FAQ items from data
 * @param {Array} faqData - Array of FAQ objects
 * @param {string} containerId - ID of container element
 */
export function renderFAQ(faqData, containerId = "faq-container") {
  const container = document.getElementById(containerId);
  if (!container) return;

  const faqHTML = faqData
    .map(
      (faq, index) => `
    <div class="faq-item" role="region" aria-labelledby="faq-question-${index}">
      <button
        class="faq-question"
        id="faq-question-${index}"
        aria-expanded="false"
        aria-controls="faq-answer-${index}"
      >
        <span class="faq-question-text">${faq.question}</span>
        <span class="faq-icon" aria-hidden="true">+</span>
      </button>
      <div class="faq-answer" id="faq-answer-${index}" role="region" aria-labelledby="faq-question-${index}">
        <p>${faq.answer}</p>
      </div>
    </div>
  `,
    )
    .join("");

  container.innerHTML = faqHTML;
  initializeFAQ();
}
