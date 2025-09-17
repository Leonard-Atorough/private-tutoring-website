const TOGGLE_BUTTON_ID = "menu-toggle";

function toggleNavMenu(forceClose) {
   const nav = document.querySelector(".nav-menu");
   const button = document.getElementById(TOGGLE_BUTTON_ID);

   if (forceClose && nav.classList.contains("active")) {
      nav.classList.remove("active");
   } else {
      nav.classList.toggle("active");
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

function attachToggleHandler() {
   const toggleButton = document.getElementById(TOGGLE_BUTTON_ID);
   if (!toggleButton) throw Error("Navigation toggle button not found");

   toggleButton.addEventListener("click", () => toggleNavMenu());
   window.addEventListener("scrollend", () => toggleNavMenu(true));
}

export function initHeader() {
   attachToggleHandler();
}
