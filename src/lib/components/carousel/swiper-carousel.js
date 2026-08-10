import Swiper from "swiper";
import { Autoplay, Navigation, Keyboard, A11y } from "swiper/modules";
import { logger } from "@sentry/browser";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import "swiper/css/a11y";

export default class SwiperCarousel {
  constructor(container, interval = 3000) {
    if (!container) {
      throw new Error("Carousel container is required");
    }

    this.container = container;
    this.interval = interval;
    this.swiperInstance = null;
    this.observer = null;
    this.isVisible = false;

    this.init();
  }

  init() {
    try {
      // Find the swiper element within the container
      const swiperEl = this.container.querySelector(".swiper");
      if (!swiperEl) {
        logger.warn("Swiper element not found within container", { container: this.container });
        return;
      }

      // Configure navigation elements
      const prevBtn = this.container.querySelector(".swiper-button-prev, .control.-prev");
      const nextBtn = this.container.querySelector(".swiper-button-next, .control.-next");

      // Swiper configuration
      const config = {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        modules: [Autoplay, Navigation, Keyboard, A11y],
        autoplay: {
          delay: this.interval,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        navigation: {
          nextEl: nextBtn || ".swiper-button-next",
          prevEl: prevBtn || ".swiper-button-prev",
        },
        keyboard: {
          enabled: true,
          onlyInViewport: true,
        },
        a11y: {
          enabled: true,
          prevSlideMessage: "Previous testimonial",
          nextSlideMessage: "Next testimonial",
        },
        breakpoints: {
          600: {
            slidesPerView: 2,
            spaceBetween: 16,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 24,
          },
        },
        // Prevent focus stealing
        preventClicks: false,
        preventClicksPropagation: false,
      };

      // Initialize Swiper
      this.swiperInstance = new Swiper(swiperEl, config);

      // Setup visibility observer to pause autoplay when not visible
      this.setupVisibilityObserver();

      // Log successful initialization
      logger.debug("Swiper carousel initialized", {
        container: this.container,
        slidesPerView: config.slidesPerView,
        autoplayDelay: config.autoplay.delay,
      });

    } catch (error) {
      logger.error("Error initializing Swiper carousel", { error: error.message }, error);
    }
  }

  setupVisibilityObserver() {
    if (typeof IntersectionObserver === "undefined") {
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.isVisible = entry.isIntersecting;

          if (this.swiperInstance) {
            if (this.isVisible) {
              this.swiperInstance.autoplay.start();
            } else {
              this.swiperInstance.autoplay.stop();
            }
          }
        });
      },
      { threshold: 0.1 },
    );

    this.observer.observe(this.container);
  }

  destroy() {
    // Clean up Swiper instance
    if (this.swiperInstance && !this.swiperInstance.destroyed) {
      this.swiperInstance.destroy(true, false);
      this.swiperInstance = null;
    }

    // Clean up observer
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    logger.debug("Swiper carousel destroyed", { container: this.container });
  }

  // Static method to initialize all carousels on the page
  static initAll(selector = ".testimonials-carousel", interval = 3000) {
    const containers = document.querySelectorAll(selector);
    const instances = [];

    containers.forEach((container) => {
      try {
        const instance = new SwiperCarousel(container, interval);
        instances.push(instance);
      } catch (error) {
        logger.error("Error creating carousel instance", { error: error.message }, error);
      }
    });

    return instances;
  }
}
