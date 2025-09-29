import { initHeader } from "./components/header/header.js";
import Carousel from "./components/carousel/carousel.js";

document.addEventListener("DOMContentLoaded", async () => {
  initHeader();
  const carousels = document.querySelectorAll(".carousel-track");
  carousels.forEach((carousel) => {
    new Carousel(carousel);
  });
});
