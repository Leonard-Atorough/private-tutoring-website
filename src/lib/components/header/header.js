import logger from "../../logger.js";
import { attachScrollHandler as attachScrollHandlerUtil } from "../scroll-links/scrollUtility.js";

const TOGGLE_BUTTON_ID = "hamburger-button";
const NAVIGATION_MENU_ID = "navigation-menu";
const HAMBURGER_VIEW_WIDTH = 1200;

let nav = null;
let button = null;
const scrollHandler = () => toggleNavMenu(true);

function isNavMenuHidden() {
  return !nav.classList.contains("-active");
}

function setNavMenuAccessibilityAttributes() {
  const isHidden = isNavMenuHidden();
  nav.setAttribute("aria-hidden", isHidden ? "true" : "false");
  button.setAttribute("aria-expanded", isHidden ? "false" : "true");
}

function toggleNavMenu(forceClose) {
  const shouldBeActive = forceClose ? false : !nav.classList.contains("-active");

  if (shouldBeActive) {
    nav.classList.add("-active");
    button.classList.add("-active");
  } else {
    nav.classList.remove("-active");
    button.classList.remove("-active");
  }
  setNavMenuAccessibilityAttributes();
}

function attachToggleHandler() {
  if (!button) throw Error("Navigation toggle button not found");
  button.addEventListener("click", () => {
    toggleNavMenu();
    setNavMenuAccessibilityAttributes();
  });
  window.removeEventListener("scroll", scrollHandler);
  window.addEventListener("scroll", scrollHandler);
}

function attachScrollHandler() {
  if (!nav) throw Error("Navigation menu not found");
  attachScrollHandlerUtil(nav, "a.link");
}

function attachResizeHandler() {
  window.addEventListener("resize", () => {
    if (window.innerWidth < HAMBURGER_VIEW_WIDTH) {
      toggleNavMenu(true); // force close
      setNavMenuAccessibilityAttributes();
    } else {
      nav.removeAttribute("aria-hidden");
      button.removeAttribute("aria-expanded");
    }
  });
}

export function initHeader() {
  nav = document.getElementById(NAVIGATION_MENU_ID);
  button = document.getElementById(TOGGLE_BUTTON_ID);

  if (!nav || !button) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initHeader, { once: true });
      return;
    }

    logger.warn("Header elements not found, navigation functionality disabled");
    return;
  }

  if (button.dataset.headerBound === "true" && nav.dataset.headerBound === "true") {
    return;
  }

  attachToggleHandler();
  attachScrollHandler();
  attachResizeHandler();
  button.dataset.headerBound = "true";
  nav.dataset.headerBound = "true";
  logger.info("Header initialized successfully");
}
