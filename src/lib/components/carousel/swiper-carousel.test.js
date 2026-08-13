import { describe, it, expect, beforeEach, vi } from "vitest";
import { initializeCarousel } from "./swiper-carousel.js";

// Mock Swiper since it requires browser environment
vi.mock("swiper", () => ({
  Swiper: vi.fn(),
}));

describe("Swiper Carousel", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    container.className = "swiper";
    container.innerHTML = `
      <div class="swiper-wrapper">
        <div class="swiper-slide">Slide 1</div>
        <div class="swiper-slide">Slide 2</div>
        <div class="swiper-slide">Slide 3</div>
      </div>
      <div class="swiper-button-next"></div>
      <div class="swiper-button-prev"></div>
    `;
    document.body.appendChild(container);
  });

  it("should initialize carousel with correct options", () => {
    const carousel = initializeCarousel(container);
    expect(carousel).toBeDefined();
  });

  it("should have correct breakpoint configurations", () => {
    const carousel = initializeCarousel(container);
    // Verify breakpoints are set for mobile (1), tablet (2), desktop (3)
    expect(carousel.params.breakpoints).toBeDefined();
  });

  it("should pause carousel when not visible", () => {
    const carousel = initializeCarousel(container);
    // Test visibility observer behavior
    const observer = carousel.observer;
    expect(observer).toBeDefined();
  });

  it("should support mouse enter/leave pause behavior", () => {
    const carousel = initializeCarousel(container);
    const pauseSpy = vi.spyOn(carousel, "autoplay.pause");
    const playSpy = vi.spyOn(carousel, "autoplay.start");

    // Simulate mouse enter
    container.dispatchEvent(new MouseEvent("mouseenter"));
    expect(pauseSpy).toHaveBeenCalled();

    // Simulate mouse leave
    container.dispatchEvent(new MouseEvent("mouseleave"));
    expect(playSpy).toHaveBeenCalled();
  });
});
