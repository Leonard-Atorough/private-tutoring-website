/** @vitest-environment jsdom */
import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock Swiper and its modules
const mockSwiperInstance = {
  element: null,
  config: null,
  autoplay: {
    start: vi.fn(),
    stop: vi.fn(),
  },
  destroyed: false,
  destroy: vi.fn(function() {
    this.destroyed = true;
  }),
};

const mockSwiper = vi.fn().mockImplementation((element, config) => {
  const instance = {
    ...mockSwiperInstance,
    element,
    config,
  };
  return instance;
});

vi.mock("swiper", () => ({
  Swiper: mockSwiper,
  Autoplay: {},
  Navigation: {},
  Keyboard: {},
  A11y: {},
}));

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
    this.root = null;
    this.rootMargin = "";
    this.thresholds = [];
  }
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
};

// Mock logger
vi.mock("@sentry/browser", () => ({
  logger: {
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

// Import after mocks
import SwiperCarousel from "./swiper-carousel";

beforeEach(() => {
  vi.clearAllMocks();
  mockSwiper.mockClear();
  document.body.innerHTML = `
    <div class="testimonials-carousel">
      <div class="swiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide testimonial-card">Testimonial 1</div>
          <div class="swiper-slide testimonial-card">Testimonial 2</div>
          <div class="swiper-slide testimonial-card">Testimonial 3</div>
        </div>
        <div class="swiper-button-prev control -prev">
          <img src="prev.png" alt="Previous" />
        </div>
        <div class="swiper-button-next control -next">
          <img src="next.png" alt="Next" />
        </div>
      </div>
    </div>
  `;
});

describe("SwiperCarousel Component", () => {
  describe("Initialization", () => {
    it("should throw error when container is not provided", () => {
      expect(() => new SwiperCarousel(null)).toThrow("Carousel container is required");
    });

    it("should initialize Swiper with correct configuration", () => {
      const container = document.querySelector(".testimonials-carousel");
      new SwiperCarousel(container, 3000);

      expect(mockSwiper).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        expect.objectContaining({
          slidesPerView: 1,
          spaceBetween: 20,
          loop: true,
          autoplay: {
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          },
          breakpoints: {
            600: { slidesPerView: 2, spaceBetween: 16 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
          },
        }),
      );
    });

    it("should use default interval when not specified", () => {
      const container = document.querySelector(".testimonials-carousel");
      new SwiperCarousel(container);

      expect(mockSwiper).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        expect.objectContaining({
          autoplay: {
            delay: 3000,
          },
        }),
      );
    });

    it("should use custom interval when specified", () => {
      const container = document.querySelector(".testimonials-carousel");
      new SwiperCarousel(container, 5000);

      expect(mockSwiper).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        expect.objectContaining({
          autoplay: {
            delay: 5000,
          },
        }),
      );
    });

    it("should warn when swiper element is not found", () => {
      document.body.innerHTML = `
        <div class="testimonials-carousel">
          <div class="no-swiper">Content</div>
        </div>
      `;

      const container = document.querySelector(".testimonials-carousel");
      new SwiperCarousel(container);

      // Should not create Swiper instance
      expect(mockSwiper).not.toHaveBeenCalled();
    });
  });

  describe("Visibility Observer", () => {
    it("should setup IntersectionObserver", () => {
      const container = document.querySelector(".testimonials-carousel");
      const carousel = new SwiperCarousel(container);

      expect(carousel.observer).toBeInstanceOf(IntersectionObserver);
    });

    it("should start autoplay when carousel becomes visible", () => {
      const container = document.querySelector(".testimonials-carousel");
      const carousel = new SwiperCarousel(container);

      // Simulate intersection
      const mockObserver = carousel.observer;
      mockObserver.callback([{ isIntersecting: true }]);

      expect(carousel.isVisible).toBe(true);
      expect(carousel.swiperInstance.autoplay.start).toHaveBeenCalled();
    });

    it("should stop autoplay when carousel becomes hidden", () => {
      const container = document.querySelector(".testimonials-carousel");
      const carousel = new SwiperCarousel(container);

      // First make visible
      carousel.observer.callback([{ isIntersecting: true }]);
      // Then hide
      carousel.observer.callback([{ isIntersecting: false }]);

      expect(carousel.isVisible).toBe(false);
      expect(carousel.swiperInstance.autoplay.stop).toHaveBeenCalled();
    });
  });

  describe("Destroy Method", () => {
    it("should destroy Swiper instance", () => {
      const container = document.querySelector(".testimonials-carousel");
      const carousel = new SwiperCarousel(container);

      carousel.destroy();

      expect(carousel.swiperInstance.destroy).toHaveBeenCalledWith(true, false);
      expect(carousel.swiperInstance).toBe(null);
    });

    it("should disconnect observer", () => {
      const container = document.querySelector(".testimonials-carousel");
      const carousel = new SwiperCarousel(container);

      const disconnectSpy = vi.spyOn(carousel.observer, "disconnect");
      carousel.destroy();

      expect(disconnectSpy).toHaveBeenCalled();
    });

    it("should handle destroy when already destroyed", () => {
      const container = document.querySelector(".testimonials-carousel");
      const carousel = new SwiperCarousel(container);

      carousel.swiperInstance.destroyed = true;
      expect(() => carousel.destroy()).not.toThrow();
    });
  });

  describe("Static initAll Method", () => {
    it("should initialize all carousels with default selector", () => {
      document.body.innerHTML = `
        <div class="testimonials-carousel">
          <div class="swiper"><div class="swiper-wrapper"></div></div>
        </div>
        <div class="testimonials-carousel">
          <div class="swiper"><div class="swiper-wrapper"></div></div>
        </div>
      `;

      const instances = SwiperCarousel.initAll();

      expect(instances.length).toBe(2);
      expect(mockSwiper).toHaveBeenCalledTimes(2);
    });

    it("should use custom selector", () => {
      document.body.innerHTML = `
        <div class="custom-carousel">
          <div class="swiper"><div class="swiper-wrapper"></div></div>
        </div>
      `;

      const instances = SwiperCarousel.initAll(".custom-carousel");

      expect(instances.length).toBe(1);
    });

    it("should use custom interval", () => {
      document.body.innerHTML = `
        <div class="testimonials-carousel">
          <div class="swiper"><div class="swiper-wrapper"></div></div>
        </div>
      `;

      SwiperCarousel.initAll(".testimonials-carousel", 5000);

      expect(mockSwiper).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        expect.objectContaining({
          autoplay: {
            delay: 5000,
          },
        }),
      );
    });

    it("should continue on error and return valid instances", () => {
      document.body.innerHTML = `
        <div class="testimonials-carousel">
          <div class="swiper"><div class="swiper-wrapper"></div></div>
        </div>
        <div class="testimonials-carousel">
          <div class="no-swiper"></div>
        </div>
      `;

      const instances = SwiperCarousel.initAll();

      // Should have one valid instance (the second one fails)
      expect(instances.length).toBe(1);
    });
  });

  describe("Accessibility Configuration", () => {
    it("should enable keyboard navigation", () => {
      const container = document.querySelector(".testimonials-carousel");
      new SwiperCarousel(container);

      expect(mockSwiper).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        expect.objectContaining({
          keyboard: {
            enabled: true,
            onlyInViewport: true,
          },
        }),
      );
    });

    it("should enable a11y features", () => {
      const container = document.querySelector(".testimonials-carousel");
      new SwiperCarousel(container);

      expect(mockSwiper).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        expect.objectContaining({
          a11y: {
            enabled: true,
            prevSlideMessage: "Previous testimonial",
            nextSlideMessage: "Next testimonial",
          },
        }),
      );
    });
  });

  describe("Navigation Configuration", () => {
    it("should configure navigation with existing control elements", () => {
      const container = document.querySelector(".testimonials-carousel");
      new SwiperCarousel(container);

      expect(mockSwiper).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        expect.objectContaining({
          navigation: {
            nextEl: expect.any(HTMLElement),
            prevEl: expect.any(HTMLElement),
          },
        }),
      );
    });
  });
});
