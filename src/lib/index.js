import { initHeader } from "./components/header/header.js";
import { initModal } from "./components/modal/modal.js";
import Carousel from "./components/carousel/carousel.js";
import { createFormStateManager } from "./components/state/formStateManager.js";
import { formHandler } from "./components/form/formHandler.js";
import * as storeManager from "./components/store/storeManager.js";

document.addEventListener("DOMContentLoaded", async () => {
  const body = document.getElementById("app");
  setTimeout(() => {
    body.style.opacity = 1;
  }, 500);

  initHeader();
  const carousels = document.querySelectorAll(".carousel-track");
  carousels.forEach((carousel) => {
    new Carousel(carousel);
  });

  initModal();

  const formManager = createFormStateManager(
    storeManager.saveStateToLocalStorage,
    storeManager.fetchStoredState
  );
  formManager.persistFormState("contact-form");

  const handler = formHandler(storeManager);
  handler.mountFormHandler("contact-form");
});
