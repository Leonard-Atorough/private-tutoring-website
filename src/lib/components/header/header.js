import logger from "../../logger.js";

const TOGGLE_BUTTON_ID = "hamburger-button";
const NAVIGATION_MENU_ID = "navigation-menu";
const HAMBURGER_VIEW_WIDTH = 1024;

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

function scrollToSection(sectionId) {
  if (sectionId) {
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
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
  const links = nav.querySelectorAll("a.link");
  Array.from(links).forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      scrollToSection(targetId);
    });
  });
}

function attachResizeHandler() {
  window.addEventListener("resize", () => {
    if (window.innerWidth < HAMBURGER_VIEW_WIDTH) {
      toggleNavMenu(true); // force close
      setNavMenuAccessibilityAttributes();
    } else {
      // remove accessibility attributes when not in mobile view
      nav.removeAttribute("aria-hidden");
      button.removeAttribute("aria-expanded");
    }
  });
}

export function initHeader() {
  nav = document.getElementById(NAVIGATION_MENU_ID);
  button = document.getElementById(TOGGLE_BUTTON_ID);

  if (!nav || !button) {
    throw new Error("Header initialization failed: Navigation menu or toggle button not found");
  }

  attachToggleHandler();
  attachScrollHandler();
  attachResizeHandler();
  logger.info("Header initialized successfully");
}
