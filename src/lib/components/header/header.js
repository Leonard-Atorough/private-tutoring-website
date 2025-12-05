const TOGGLE_BUTTON_ID = "menu-toggle";
const NAVIGATION_MENU_ID = "navigation-menu";

function isNavMenuHidden() {
  const nav = document.getElementById(NAVIGATION_MENU_ID);
  return nav.classList.contains("active") === false;
}

function setNavMenuAccessibilityAttributes() {
  const nav = document.getElementById(NAVIGATION_MENU_ID);
  const button = document.getElementById(TOGGLE_BUTTON_ID);
  nav.setAttribute("aria-hidden", isNavMenuHidden() ? "true" : "false");
  button.setAttribute("aria-expanded", isNavMenuHidden() ? "false" : "true");
}

function toggleNavMenu(forceClose) {
  const nav = document.getElementById(NAVIGATION_MENU_ID);
  const button = document.getElementById(TOGGLE_BUTTON_ID);

  const shouldBeActive = forceClose ? false : !nav.classList.contains("active");

  if (shouldBeActive) {
    nav.classList.add("active");
  } else {
    nav.classList.remove("active");
  }
  setNavMenuAccessibilityAttributes();
}

let scrollRafId = null;
function closeOnScroll() {
  if (scrollRafId !== null) return; // already scheduled

  scrollRafId = requestAnimationFrame(() => {
    toggleNavMenu(true); // force close
    scrollRafId = null;
  });
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
  const toggleButton = document.getElementById(TOGGLE_BUTTON_ID);
  if (!toggleButton) throw Error("Navigation toggle button not found");
  toggleButton.addEventListener("click", () => {
    toggleNavMenu();
    setNavMenuAccessibilityAttributes();
  });
  window.removeEventListener("scroll", () => toggleNavMenu(true));
  window.addEventListener("scroll", () => toggleNavMenu(true));
}

function attachScrollHandler() {
  const nav = document.getElementById(NAVIGATION_MENU_ID);
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
    const nav = document.getElementById(NAVIGATION_MENU_ID);
    if (window.innerWidth < 768) {
      toggleNavMenu(true); // force close
      setNavMenuAccessibilityAttributes();
    } else {
      // remove accessibility attributes when not in mobile view
      nav.removeAttribute("aria-hidden");
      const button = document.getElementById(TOGGLE_BUTTON_ID);
      button.removeAttribute("aria-expanded");
    }
  });
}

export function initHeader() {
  attachToggleHandler();
  attachScrollHandler();
  attachResizeHandler();
}
