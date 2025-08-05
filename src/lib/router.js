import { loadHTML } from "./loader.js";
import { pageConfig } from "../config/pageConfig.js";
import { toggleNavMenu } from "../layout/header.js";

async function loadMainLayout() {
   const layoutContainer = document.getElementById("content");

   const [headerHTML, footerHTML] = await Promise.all([
      loadHTML("layout/header.html"),
      loadHTML("layout/footer.html")
   ]);

   const headerTemplate = headerHTML.querySelector("div #header-template");
   const footerTemplate = footerHTML.querySelector("div #footer-template");

   const headerElement = headerTemplate.content.firstElementChild.cloneNode(true);
   const footerElement = footerTemplate.content.firstElementChild.cloneNode(true);

   layoutContainer.insertAdjacentElement("afterbegin", headerElement);
   layoutContainer.insertAdjacentElement("beforeend", footerElement);

   const navToggle = document.querySelector("#menu-toggle");
   if (navToggle) {
      navToggle.addEventListener("click", toggleNavMenu);
   }
}

async function handleRoute(path) {
   const content = document.querySelector(".main-content");
   content.innerHTML = "";

   const config = pageConfig[path] || pageConfig["/home"];

   let page = "";
   try {
      page = await loadHTML(config.page);
   } catch (error) {
      console.error("Error loading page:", error);
      content.innerHTML = `<p>Error loading page: ${error.message}</p>`;
      return;
   }

   for (const componentUrl of config.components) {
      const componentWrapper = await loadHTML(componentUrl);
      const componentTemplate = componentWrapper.querySelector("template");
      if (componentTemplate && page.querySelector(`[data-component="${componentTemplate.id}"]`)) {
         page
            .querySelector(`[data-component="${componentTemplate.id}"]`)
            .appendChild(componentTemplate.content.cloneNode(true));
      }
   }

   content.appendChild(page);
}

async function navigateTo(path) {
   console.log(path);
   history.pushState({}, "", path);
   await handleRoute(path);
}

export { loadMainLayout, handleRoute, navigateTo };
