import Swiper from "swiper";
import { Autoplay, Pagination, Keyboard, A11y } from "swiper/modules";
import { logger } from "@sentry/browser";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/a11y";

export default class SwiperCarousel {
  constructor(container, interval = 5000) {
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

      // Swiper configuration with pagination
      const config = {
        modules: [Autoplay, Pagination, Keyboard, A11y],
        keyboard: {
          enabled: true,
          onlyInViewport: true,
        },
        a11y: {
          enabled: true,
          prevSlideMessage: "Previous testimonial",
          nextSlideMessage: "Next testimonial",
          paginationBulletMessage: "Go to testimonial {{index}}",
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          dynamicBullets: false,
        },
        breakpoints: {
          // Mobile: Simple 1 card with peek edges, no autoplay, no loop
          0: {
            slidesPerView: 1.15,
            spaceBetween: 16,
            centeredSlides: true,
            loop: false,
          },
          // Tablet: 2 cards with autoplay and loop
          600: {
            slidesPerView: 2,
            spaceBetween: 24,
            centeredSlides: false,
            loop: true,
            autoplay: {
              delay: this.interval,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            },
          },
          // Desktop: 3 cards with autoplay and loop
          1024: {
            slidesPerView: 3,
            spaceBetween: 32,
            centeredSlides: false,
            loop: true,
            autoplay: {
              delay: this.interval,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            },
          },
        },
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
        autoplayDelay: this.interval,
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

          if (this.swiperInstance && this.swiperInstance.autoplay) {
            if (this.isVisible && this.swiperInstance.autoplay.running === false) {
              this.swiperInstance.autoplay.start();
            } else if (!this.isVisible && this.swiperInstance.autoplay.running === true) {
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
  static initAll(selector = ".testimonials-carousel", interval = 5000) {
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
