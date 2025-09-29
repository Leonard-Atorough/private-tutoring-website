import { initHeader } from "./components/header/header.js";
import Carousel from "./components/carousel/carousel.js";
import { initModal } from "./components/modal/modal.js";
import { createFormStateManager } from "./formStateManager.js";
import { formHandler } from "./formHandler.js";
import * as stateManager from "./stateManager.js";

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
    stateManager.persistState,
    stateManager.getPersistedState
  );
  formManager.persistFormState("contact-form");

  const handler = formHandler(stateManager);
  handler.handleFormSubmit("contact-form");
});
