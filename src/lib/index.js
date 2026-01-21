import { initHeader } from "./components/header/header.js";
import { initModal } from "./components/modal/modal.js";
import Carousel from "./components/carousel/carousel.js";
import { createFormStateManager } from "./components/state/formStateManager.js";
import { formHandler } from "./components/form/formHandler.js";
import * as storeManager from "./components/store/storeManager.js";
import { initializeFAQ } from "./components/faq/faq.js";
import logger from "./logger.js";
import initSentry from "./sentry-config.js";
import * as Sentry from "@sentry/browser";

initSentry();

// Test function for Sentry - call window.testError() from browser console
window.testError = () => {
  const error = new Error("Test error sent to Sentry");
  Sentry.captureException(error);
  console.log("Test error captured:", error);
};

document.addEventListener("DOMContentLoaded", async () => {
  try {
    logger.info("App initialization started");

    const body = document.getElementById("app");
    setTimeout(() => {
      body.style.opacity = 1;
    }, 500);

    try {
      logger.debug("Initializing header");
      initHeader();
    } catch (headerError) {
      logger.error("Error initializing header", { error: headerError.message });
    }

    try {
      logger.debug("Initializing carousel");
      const carousels = document.querySelectorAll(".carousel-track");
      carousels.forEach((carousel) => {
        new Carousel(carousel);
      });
    } catch (carouselError) {
      logger.error("Error initializing carousel", { error: carouselError.message });
    }

    try {
      logger.debug("Initializing modal");
      initModal();
    } catch (modalError) {
      logger.error("Error initializing modal", { error: modalError.message });
    }

    try {
      logger.debug("Initializing form state manager");
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
      logger.debug("Initializing form handler");
      const handler = formHandler(storeManager);
      handler.mountFormHandler("contact-form");
    } catch (formHandlerError) {
      logger.error("Error initializing form handler", { error: formHandlerError.message });
    }

    try {
      logger.debug("Initializing FAQ");
      initializeFAQ();
    } catch (faqError) {
      logger.error("Error initializing FAQ", { error: faqError.message });
    }

    logger.info("App initialization completed successfully");
  } catch (error) {
    logger.error("Error initializing application", { error: error.message });
  }
});
