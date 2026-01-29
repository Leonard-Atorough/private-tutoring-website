import { logger } from "@sentry/browser";

export default class Carousel {
  constructor(carouselElement, interval = 3000) {
    if (!carouselElement) {
      throw new Error("Carousel element is required");
    }

    this.carouselElement = carouselElement;
    this.interval = interval;
    this.currentIndex = 0;
    this.items = carouselElement.querySelectorAll(".testimonial-card");
    this.totalItems = this.items.length;

    if (this.totalItems === 0) {
      logger.warn("Carousel initialized with no items", { carouselElement });
      return;
    }

    this.visibleItems = 1; // default, will be updated in readyCarousel
    this.restartTimeout = null;
    this.isCarouselVisible = false;

    this.readyCarousel();
    this.attachControls();
    this.updateAriaForSlides();
    this.setupVisibilityObserver();
    this.startAutoAdvance();
  }

  // the ready carousel function takes the carousel element, determines how many cards are visible based on screen width and thus what each slide width is
  readyCarousel() {
    this.updateSlideWidth();
    window.addEventListener("resize", () => this.updateSlideWidth());
    this.carouselElement.addEventListener("mouseenter", () => this.stopAutoAdvance());
    this.carouselElement.addEventListener("mouseleave", () => this.startAutoAdvance());
  }

  setupVisibilityObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.isCarouselVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(this.carouselElement);
  }
  updateSlideWidth() {
    const screenWidth = window.innerWidth;
    if (screenWidth > 1024) {
      this.slideWidth = this.carouselElement.clientWidth / 3; // 3 cards per view
      this.visibleItems = 3;
    } else if (screenWidth >= 600) {
      this.slideWidth = this.carouselElement.clientWidth / 2; // 2 cards per view
      this.visibleItems = 2;
    } else {
      this.slideWidth = this.carouselElement.clientWidth; // 1 card per view
      this.visibleItems = 1;
    }

    this.carouselElement.scrollTo({ left: this.currentIndex * this.slideWidth });
    this.updateAriaForSlides();
  }
  startAutoAdvance() {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => this.advanceSlide(), this.interval);
  }

  advanceSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.totalItems;
    this.goTo(this.currentIndex);
  }

  stopAutoAdvance() {
    clearInterval(this.intervalId);
    this.intervalId = null;
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
      this.restartTimeout = null;
    }
  }

  attachControls() {
    // controls are expected to be siblings of the track inside the carousel container
    const container = this.carouselElement.parentElement || document;
    this.prevBtn = container.querySelector(".carousel-prev");
    this.nextBtn = container.querySelector(".carousel-next");

    if (this.prevBtn) {
      // apply existing button styles if not already present
      this.prevBtn.classList.add("button", "-secondary");
      this.prevBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.userInteracted();
        this.prev();
      });
    }
    if (this.nextBtn) {
      this.nextBtn.classList.add("button", "-secondary");
      this.nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.userInteracted();
        this.next();
      });
    }
  }

  userInteracted() {
    this.stopAutoAdvance();
    this.restartTimeout = setTimeout(() => {
      this.startAutoAdvance();
      this.restartTimeout = null;
    }, 5000);
  }

  goTo(index) {
    this.currentIndex = index % this.totalItems;
    this.carouselElement.scrollTo({
      left: this.currentIndex * this.slideWidth,
      behavior: "smooth",
    });
    this.updateAriaForSlides();

    // Only manage focus if carousel is visible on screen and no modal is overlaying it
    // This prevents the carousel from stealing focus when user is interacting with other parts of the page
    const isModalOpen = document.querySelector("[aria-modal='true'].active") !== null;

    if (this.isCarouselVisible && !isModalOpen) {
      const active = this.items[this.currentIndex];
      const activeElement = document.activeElement;
      const isUserTyping =
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.isContentEditable);

      if (active && !isUserTyping) {
        active.setAttribute("tabindex", "0");
        active.focus({ preventScroll: true });
      } else if (active) {
        active.setAttribute("tabindex", "0");
      }
    }
  }

  next() {
    this.goTo(this.currentIndex + 1);
  }

  prev() {
    this.goTo(this.currentIndex - 1 < 0 ? this.totalItems - 1 : this.currentIndex - 1);
  }

  updateAriaForSlides() {
    // mark slides within the visible window as exposed, others hidden
    const start = this.currentIndex;
    const end = this.currentIndex + this.visibleItems - 1;
    this.items.forEach((item, idx) => {
      if (idx >= start && idx <= end) {
        item.setAttribute("aria-hidden", "false");
        item.removeAttribute("tabindex");
      } else {
        item.setAttribute("aria-hidden", "true");
        item.setAttribute("tabindex", "-1");
      }
    });
  }
}
