import { loadMainLayout, navigateTo } from "./lib/router.js";

window.addEventListener("load", async () => {
   await loadMainLayout();
   await navigateTo(location.pathname);
});

window.addEventListener("popstate", () => {
   navigateTo(location.pathname);
});

document.querySelectorAll("a").forEach((link) => {
   link.addEventListener("click", (e) => {
      if (link.origin === location.origin) {
         e.preventDefault();
      }
      navigateTo(link.getAttribute("href"));
   });
});
