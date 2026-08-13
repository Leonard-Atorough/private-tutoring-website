import logger from "../../logger.js";

const TOGGLE_BUTTON_ID = "hamburger-button";
const NAVIGATION_MENU_ID = "navigation-menu";

let nav = null;
let button = null;

export function initHeader() {
  nav = document.getElementById(NAVIGATION_MENU_ID);
  button = document.getElementById(TOGGLE_BUTTON_ID);

  if (!nav || !button) {
    logger.warn("Header elements not found, navigation functionality disabled");
    return;
  }

  if (button.dataset.headerBound === "true") {
    return;
  }

  // Simple toggle on button click
  button.addEventListener("click", () => {
    const isExpanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isExpanded));
    nav.classList.toggle("-active");
  });

  // Close menu when clicking a link
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      button.setAttribute("aria-expanded", "false");
      nav.classList.remove("-active");
    });
  });

  button.dataset.headerBound = "true";
  logger.info("Header initialized successfully");
}
