import { initHeader } from "./components/header/header.js";
import { initModal } from "./components/modal/modal.js";
import Carousel from "./components/carousel/carousel.js";
import { createFormStateManager } from "./components/state/formStateManager.js";
import { formHandler } from "./components/form/formHandler.js";
import * as storeManager from "./components/store/storeManager.js";
import { initializeFAQ } from "./components/faq/faq.js";
import logger from "./logger.js";
import initSentry from "./sentry-config.js";

initSentry();

document.addEventListener("DOMContentLoaded", async () => {
  async function safeInit(name, initFunc) {
    try {
      logger.debug(`Initializing ${name}`);
      await initFunc();
    } catch (error) {
      logger.error(`Error initializing ${name}`, { error: error.message }, error);
    }
  }
  try {
    logger.info("App initialization started");

    const body = document.getElementById("app");
    setTimeout(() => {
      body.style.opacity = 1;
    }, 500);

    await safeInit("header", initHeader);

    await safeInit("modal", initModal);

    await safeInit("carousel", () => {
      const carousels = document.querySelectorAll(".carousel-track");
      carousels.forEach((carousel) => {
        new Carousel(carousel);
      });
    });

    await safeInit("form state manager", () => {
      const formManager = createFormStateManager(
        storeManager.saveStateToLocalStorage,
        storeManager.fetchStoredState,
      );
      formManager.persistFormState("contact-form");
    });

    await safeInit("form handler", () => {
      const handler = formHandler(storeManager);
      handler.mountFormHandler("contact-form");
    });

    await safeInit("FAQ", initializeFAQ);

    logger.info("App initialization completed successfully");
  } catch (error) {
    logger.error("Error initializing application", { error: error.message }, error);
  }
});
