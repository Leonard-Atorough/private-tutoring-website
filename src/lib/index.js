import { initHeader } from "./components/header/header.js";
import { initModal } from "./components/modal/modal.js";
import Carousel from "./components/carousel/carousel.js";
import { createFormStateManager } from "./components/state/formStateManager.js";
import { formHandler } from "./components/form/formHandler.js";
import * as storeManager from "./components/store/storeManager.js";
import { initializeFAQ } from "./components/faq/faq.js";
import logger from "./logger.js";
import { initSentry } from "./sentry-config.js";

initSentry();

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const body = document.getElementById("app");
    setTimeout(() => {
      body.style.opacity = 1;
    }, 500);

    try {
      initHeader();
    } catch (headerError) {
      logger.error("Error initializing header", { error: headerError.message });
    }

    try {
      const carousels = document.querySelectorAll(".carousel-track");
      carousels.forEach((carousel) => {
        new Carousel(carousel);
      });
    } catch (carouselError) {
      logger.error("Error initializing carousel", { error: carouselError.message });
    }

    try {
      initModal();
    } catch (modalError) {
      logger.error("Error initializing modal", { error: modalError.message });
    }

    try {
      const formManager = createFormStateManager(
        storeManager.saveStateToLocalStorage,
        storeManager.fetchStoredState,
      );
      formManager.persistFormState("contact-form");
    } catch (formStateError) {
      logger.error("Error initializing form state manager", {
        error: formStateError.message,
      });
    }

    try {
      const handler = formHandler(storeManager);
      handler.mountFormHandler("contact-form");
    } catch (formHandlerError) {
      logger.error("Error initializing form handler", { error: formHandlerError.message });
    }

    try {
      initializeFAQ();
    } catch (faqError) {
      logger.error("Error initializing FAQ", { error: faqError.message });
    }
  } catch (error) {
    logger.error("Error initializing application", { error: error.message });
  }
});
