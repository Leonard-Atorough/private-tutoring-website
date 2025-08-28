import { loadHTML } from "./lib/loader.js";
import { pageConfig } from "./config/pageConfig.js";
import { createRouter } from "./lib/router.js";
import { toggleNavMenu } from "./layout/header.js";
import { createFormStateManager } from "./lib/formStateManager.js";
import { formHandler } from "./lib/formHandler.js";
import * as stateManager from "./lib/stateManager.js";

const { loadMainLayout, navigateTo } = createRouter(loadHTML, pageConfig);

window.addEventListener("load", async () => {
   await loadMainLayout();
   await navigateTo(location.pathname);

   const formManager = createFormStateManager(
      stateManager.persistState,
      stateManager.getPersistedState
   );
   formManager.persistFormState("contact-form");

   const handler = formHandler(stateManager);
   handler.handleFormSubmit("contact-form");
});

window.addEventListener("popstate", () => {
   const path = location.pathname;
   const sectionId = location.hash.replace("#", "");
   navigateTo(path).then(() => {
      if (sectionId) {
         const target = document.getElementById(sectionId);
         if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            toggleNavMenu();
         }
      }
   });
});

document.querySelectorAll("a").forEach((link) => {
   link.addEventListener("click", (e) => {
      // const href = link.getAttribute("href");
      // console.log(href);
      // const [path, sectionid] = href.split("#");
      const path = link.pathname;
      const hash = link.hash ? link.hash.slice(1) : null;
      if (link.origin === location.origin && path.startsWith("/")) {
         e.preventDefault();
      }
      navigateTo(path, hash);
   });
});
