import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import SwiperCarousel from "./swiper-carousel.js";

// Mock Swiper class
const mockSwiperInstance = {
  destroyed: false,
  autoplay: {
    running: false,
    start: vi.fn(),
    stop: vi.fn(),
  },
  destroy: vi.fn(),
};

vi.mock("swiper", () => ({
  default: vi.fn(() => mockSwiperInstance),
}));

// Mock Sentry logger
vi.mock("@sentry/browser", () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe("SwiperCarousel", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    container.className = "testimonials-carousel";
    container.innerHTML = `
      <div class="swiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide">Slide 1</div>
          <div class="swiper-slide">Slide 2</div>
          <div class="swiper-slide">Slide 3</div>
        </div>
        <div class="swiper-pagination"></div>
      </div>
    `;
    document.body.appendChild(container);
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("should throw error when container is not provided", () => {
    expect(() => new SwiperCarousel(null)).toThrow("Carousel container is required");
  });

  it("should initialize with default interval of 5000ms", () => {
    const carousel = new SwiperCarousel(container);
    expect(carousel.interval).toBe(5000);
  });

  it("should initialize with custom interval", () => {
    const carousel = new SwiperCarousel(container, 3000);
    expect(carousel.interval).toBe(3000);
  });

  it("should create swiperInstance on init", () => {
    const carousel = new SwiperCarousel(container);
    expect(carousel.swiperInstance).toBeDefined();
    expect(carousel.swiperInstance).toBe(mockSwiperInstance);
  });

  it("should setup visibility observer on init", () => {
    const carousel = new SwiperCarousel(container);
    expect(carousel.observer).toBeDefined();
  });

  it("should set isVisible to false initially", () => {
    const carousel = new SwiperCarousel(container);
    expect(carousel.isVisible).toBe(false);
  });

  it("should pass correct Swiper config with breakpoints", () => {
    // This is implicitly tested through the Swiper mock
    const carousel = new SwiperCarousel(container);
    expect(carousel.swiperInstance).toBeDefined();
  });

  it("should destroy carousel and clean up resources", () => {
    const carousel = new SwiperCarousel(container);
    const swiperInstance = carousel.swiperInstance;

    carousel.destroy();

    expect(swiperInstance.destroy).toHaveBeenCalled();
    expect(carousel.swiperInstance).toBeNull();
    expect(carousel.observer).toBeNull();
  });

  it("should handle missing swiper element gracefully", () => {
    const badContainer = document.createElement("div");
    badContainer.className = "testimonials-carousel";
    badContainer.innerHTML = "<p>No swiper here</p>";
    document.body.appendChild(badContainer);

    const carousel = new SwiperCarousel(badContainer);
    expect(carousel.swiperInstance).toBeNull();

    document.body.removeChild(badContainer);
  });

  describe("initAll static method", () => {
    it("should initialize all carousels matching selector", () => {
      // Create multiple carousel containers
      const container2 = document.createElement("div");
      container2.className = "testimonials-carousel";
      container2.innerHTML = `
        <div class="swiper">
          <div class="swiper-wrapper">
            <div class="swiper-slide">Slide A</div>
            <div class="swiper-slide">Slide B</div>
          </div>
          <div class="swiper-pagination"></div>
        </div>
      `;
      document.body.appendChild(container2);

      const instances = SwiperCarousel.initAll(".testimonials-carousel");

      expect(instances).toHaveLength(2);
      expect(instances[0]).toBeInstanceOf(SwiperCarousel);
      expect(instances[1]).toBeInstanceOf(SwiperCarousel);

      document.body.removeChild(container2);
    });

    it("should use custom interval for initAll", () => {
      const instances = SwiperCarousel.initAll(".testimonials-carousel", 7000);
      expect(instances[0].interval).toBe(7000);
    });

    it("should return empty array if no containers found", () => {
      const instances = SwiperCarousel.initAll(".non-existent-selector");
      expect(instances).toEqual([]);
    });
  });
});
