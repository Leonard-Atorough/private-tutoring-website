/**
 * Pricing Component
 * Renders pricing tiers and packages
 */

/**
 * Render pricing cards from data
 * @param {Object} pricingData - Pricing data object
 * @param {string} containerId - ID of container element
 */
export function renderPricing(pricingData, containerId = "pricing-container") {
  const container = document.getElementById(containerId);
  if (!container) return;

  const { tiers, packages, note } = pricingData;

  // Render pricing cards
  const pricingHTML = tiers
    .map(
      (tier) => `
    <div class="pricing-card ${tier.popular ? "popular" : ""}" role="article" aria-label="${
  tier.name
} pricing tier">
      <div class="pricing-card-header">
        <h3 class="pricing-tier-name">${tier.name}</h3>
        <p class="pricing-description">${tier.description}</p>
        <div class="pricing-amount">
          <span class="pricing-currency">$</span>
          <span class="pricing-price">${tier.price}</span>
        </div>
        <p class="pricing-duration">${tier.duration}</p>
      </div>
      <ul class="pricing-features" role="list">
        ${tier.features.map((feature) => `<li class="pricing-feature">${feature}</li>`).join("")}
      </ul>
    </div>
  `,
    )
    .join("");

  container.innerHTML = pricingHTML;

  // Render packages section
  const packagesSection = document.getElementById("pricing-packages");
  if (packagesSection && packages) {
    const packagesHTML = `
      <h3>Package Deals</h3>
      <div class="package-list">
        ${packages
    .map(
      (pkg) => `
          <div class="package-item">
            <div class="package-name">${pkg.name}</div>
            <div class="package-discount">${pkg.discount}% OFF</div>
            <div class="package-description">${pkg.description}</div>
          </div>
        `,
    )
    .join("")}
      </div>
    `;
    packagesSection.innerHTML = packagesHTML;
  }

  // Render note
  const noteElement = document.getElementById("pricing-note");
  if (noteElement && note) {
    noteElement.textContent = note;
  }

  // Attach modal event listeners to all book buttons
  attachBookingButtons();
}

/**
 * Attach event listeners to booking buttons
 */
function attachBookingButtons() {
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
