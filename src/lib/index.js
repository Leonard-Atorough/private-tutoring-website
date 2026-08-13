import { initHeader } from "./components/header/header.js";
import { initModal } from "./components/modal/modal.js";
import SwiperCarousel from "./components/carousel/swiper-carousel.js";
import { createFormStateManager } from "./components/state/formStateManager.js";
import { formHandler } from "./components/form/formHandler.js";
import * as storeManager from "./components/store/storeManager.js";
import logger from "./logger.js";

async function safeInit(name, initFunc) {
  try {
    logger.debug(`Initializing ${name}`);
    await initFunc();
  } catch (error) {
    logger.error(`Error initializing ${name}`, { error: error.message }, error);
  }
}

export async function initializeApp() {
  if (typeof document === "undefined") {
    logger.debug("Skipping app initialization: not in browser environment");
    return;
  }

  try {
    logger.info("App initialization started");

    const body = document.getElementById("app");
    if (!body) {
      logger.warn("App root element not found");
      return;
    }

    setTimeout(() => {
      body.style.opacity = 1;
    }, 500);

    await safeInit("header", initHeader);

    await safeInit("modal", initModal);

    await safeInit("swiper carousel", () => {
      SwiperCarousel.initAll(".testimonials-carousel");
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

    logger.info("App initialization completed successfully");
  } catch (error) {
    logger.error("Error initializing application", { error: error.message }, error);
  }
}
