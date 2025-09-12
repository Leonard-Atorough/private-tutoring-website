export function toggleNavMenu(button) {
   const nav = document.querySelector(".nav-menu");
   nav.classList.toggle("active");
   button.setAttribute("aria-expanded", nav.classList.contains("active"));
}
