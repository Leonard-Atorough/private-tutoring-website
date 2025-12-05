const TOGGLE_BUTTON_ID = "menu-toggle";
const NAVIGATION_MENU_ID = "navigation-menu";

function toggleNavMenu(forceClose) {
  const nav = document.getElementById(NAVIGATION_MENU_ID);
  const button = document.getElementById(TOGGLE_BUTTON_ID);

  const shouldBeActive = forceClose ? false : !nav.classList.contains("active");

  if (shouldBeActive) {
    nav.classList.add("active");
    nav.setAttribute("aria-hidden", "false");
  } else {
    nav.classList.remove("active");
    nav.setAttribute("aria-hidden", "true");
  }
  button.setAttribute("aria-expanded", nav.classList.contains("active"));
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

  toggleButton.addEventListener("click", () => toggleNavMenu());

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

export function initHeader() {
  attachToggleHandler();
  attachScrollHandler();
}
