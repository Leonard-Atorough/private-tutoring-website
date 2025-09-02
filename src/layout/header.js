export function toggleNavMenu(button) {
   const nav = document.querySelector(".nav-menu");
   console.log(nav);
   nav.classList.toggle("active");
   button.setAttribute("aria-expanded", nav.classList.contains("active"));
}
