import { initHeader } from "./components/header/header.js";
import { initModal } from "./components/modal/modal.js";
import Carousel from "./components/carousel/carousel.js";
import { createFormStateManager } from "./components/state/formStateManager.js";
import { formHandler } from "./components/form/formHandler.js";
import * as storeManager from "./components/store/storeManager.js";
import { initializeFAQ } from "./components/faq/faq.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const body = document.getElementById("app");
    setTimeout(() => {
      body.style.opacity = 1;
    }, 500);

    try {
      initHeader();
    } catch (headerError) {
      console.error("Error initializing header:", headerError);
    }

    try {
      const carousels = document.querySelectorAll(".carousel-track");
      carousels.forEach((carousel) => {
        new Carousel(carousel);
      });
    } catch (carouselError) {
      console.error("Error initializing carousel:", carouselError);
    }

    try {
      initModal();
    } catch (modalError) {
      console.error("Error initializing modal:", modalError);
    }

    try {
      const formManager = createFormStateManager(
        storeManager.saveStateToLocalStorage,
        storeManager.fetchStoredState,
      );
      formManager.persistFormState("contact-form");
    } catch (formStateError) {
      console.error("Error initializing form state manager:", formStateError);
    }

    try {
      const handler = formHandler(storeManager);
      handler.mountFormHandler("contact-form");
    } catch (formHandlerError) {
      console.error("Error initializing form handler:", formHandlerError);
    }

    try {
      initializeFAQ();
    } catch (faqError) {
      console.error("Error initializing FAQ:", faqError);
    }
  } catch (error) {
    console.error("Error initializing application:", error);
  }
});
