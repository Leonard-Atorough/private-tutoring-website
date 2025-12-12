/** @vitest-environment jsdom */
import { describe } from "vitest";
import Carousel from "./carousel";

// testing the carousel requires mock dom elements and simulating time for the auto-advance feature

beforeEach(() => {
  document.body.innerHTML = `
    <div class="carousel-track" style="width: 600px; overflow: hidden;">
      <div class="testimonial-card" style="width: 200px; display: inline-block;">Testimonial 1</div>
      <div class="testimonial-card" style="width: 200px; display: inline-block;">Testimonial 2</div>
      <div class="testimonial-card" style="width: 200px; display: inline-block;">Testimonial 3</div>
      <div class="testimonial-card" style="width: 200px; display: inline-block;">Testimonial 4</div>
      <div class="testimonial-card" style="width: 200px; display: inline-block;">Testimonial 5</div>
    </div>
  `;

  const carousel = document.querySelector(".carousel-track");
  Object.defineProperty(carousel, "clientWidth", { value: 600, writable: true });
  carousel.scrollLeft = 0;
  carousel.scrollTo = function ({ left }) {
    this.scrollLeft = left;
  };
});

describe("Carousel Component", () => {
  describe("On large screens (>=1024px)", () => {
    beforeEach(() => {
      // use a value greater than 1024 to trigger the "large" breakpoint in the implementation
      Object.defineProperty(window, "innerWidth", { value: 1200, writable: true });
    });
    it("should initialize correctly", () => {
      const carousel = document.querySelector(".carousel-track");
      const carouselInstance = new Carousel(carousel);
      expect(carouselInstance.totalItems).toBe(5);
      expect(carouselInstance.visibleItems).toBe(3); // assuming default screen width in test env
    });
    it("should auto-advance slides", () => {
      vi.useFakeTimers();
      const carousel = document.querySelector(".carousel-track");
      const carouselInstance = new Carousel(carousel, 1000); // 1 second interval for test
      const initialScrollLeft = carousel.scrollLeft;

      vi.advanceTimersByTime(1000);
      expect(carousel.scrollLeft).toBeGreaterThan(initialScrollLeft);

      vi.advanceTimersByTime(1000);
      expect(carousel.scrollLeft).toBeGreaterThan(initialScrollLeft);

      vi.useRealTimers();
    });
    it("should pause auto-advance on hover", () => {
      vi.useFakeTimers();
      const carousel = document.querySelector(".carousel-track");
      const carouselInstance = new Carousel(carousel, 1000); // 1 second interval for test
      const initialScrollLeft = carousel.scrollLeft;
      // Simulate mouse enter
      const mouseEnterEvent = new Event("mouseenter");
      carousel.dispatchEvent(mouseEnterEvent);
      vi.advanceTimersByTime(3000); // advance time while hovered
      expect(carousel.scrollLeft).toBe(initialScrollLeft); // should not have advanced
    });
  });
  describe("On medium screens (600px - 1023px)", () => {
    beforeEach(() => {
      Object.defineProperty(window, "innerWidth", { value: 800, writable: true });
    });
    it("should adjust visible items and slide width", () => {
      const carousel = document.querySelector(".carousel-track");
      const carouselInstance = new Carousel(carousel);
      expect(carouselInstance.visibleItems).toBe(2);
      expect(carouselInstance.slideWidth).toBe(300); // 600px / 2 items
    });
  });
  describe("On small screens (<600px)", () => {
    beforeEach(() => {
      Object.defineProperty(window, "innerWidth", { value: 500, writable: true });
    });
    it("should adjust visible items and slide width", () => {
      const carousel = document.querySelector(".carousel-track");
      const carouselInstance = new Carousel(carousel);
      expect(carouselInstance.visibleItems).toBe(1);
      expect(carouselInstance.slideWidth).toBe(600); // full width
    });
  });
});
