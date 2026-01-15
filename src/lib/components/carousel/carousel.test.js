/* eslint-disable no-unused-vars */
/** @vitest-environment jsdom */
import { describe, it, expect, beforeEach, vi } from "vitest";
import Carousel from "./carousel";

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  disconnect() {}
  triggerIntersection(isIntersecting) {
    this.callback([{ isIntersecting }]);
  }
};

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

  describe("Navigation Controls", () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div class="carousel-container">
          <button class="carousel-prev">Previous</button>
          <div class="carousel-track" style="width: 600px; overflow: hidden;">
            <div class="testimonial-card" style="width: 200px; display: inline-block;">Testimonial 1</div>
            <div class="testimonial-card" style="width: 200px; display: inline-block;">Testimonial 2</div>
            <div class="testimonial-card" style="width: 200px; display: inline-block;">Testimonial 3</div>
            <div class="testimonial-card" style="width: 200px; display: inline-block;">Testimonial 4</div>
            <div class="testimonial-card" style="width: 200px; display: inline-block;">Testimonial 5</div>
          </div>
          <button class="carousel-next">Next</button>
        </div>
      `;
      const carousel = document.querySelector(".carousel-track");
      Object.defineProperty(carousel, "clientWidth", { value: 600, writable: true });
      carousel.scrollLeft = 0;
      carousel.scrollTo = function ({ left }) {
        this.scrollLeft = left;
      };
      Object.defineProperty(window, "innerWidth", { value: 1200, writable: true });
    });

    it("should navigate to next slide when next button is clicked", () => {
      const carousel = document.querySelector(".carousel-track");
      const carouselInstance = new Carousel(carousel);
      const nextBtn = document.querySelector(".carousel-next");
      const initialIndex = carouselInstance.currentIndex;

      nextBtn.click();

      expect(carouselInstance.currentIndex).toBeGreaterThan(initialIndex);
    });

    it("should navigate to previous slide when prev button is clicked", () => {
      const carousel = document.querySelector(".carousel-track");
      const carouselInstance = new Carousel(carousel);
      const nextBtn = document.querySelector(".carousel-next");
      const prevBtn = document.querySelector(".carousel-prev");

      // Move forward first
      nextBtn.click();
      const indexAfterNext = carouselInstance.currentIndex;

      // Then move back
      prevBtn.click();

      expect(carouselInstance.currentIndex).toBeLessThan(indexAfterNext);
    });

    it("should wrap to start when next is clicked at the end", () => {
      const carousel = document.querySelector(".carousel-track");
      const carouselInstance = new Carousel(carousel);
      const nextBtn = document.querySelector(".carousel-next");
      const maxIndex = Math.max(0, carouselInstance.totalItems - carouselInstance.visibleItems);

      // Navigate to the last slide
      carouselInstance.currentIndex = maxIndex;

      // Click next to wrap around
      nextBtn.click();

      expect(carouselInstance.currentIndex).toBe(0);
    });

    it("should wrap to end when prev is clicked at the start", () => {
      const carousel = document.querySelector(".carousel-track");
      const carouselInstance = new Carousel(carousel);
      const prevBtn = document.querySelector(".carousel-prev");
      const maxIndex = Math.max(0, carouselInstance.totalItems - carouselInstance.visibleItems);

      // Start at index 0
      carouselInstance.currentIndex = 0;

      // Click prev to wrap to end
      prevBtn.click();

      expect(carouselInstance.currentIndex).toBe(maxIndex);
    });
  });

  describe("User Interaction Behavior", () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div class="carousel-container">
          <button class="carousel-prev">Previous</button>
          <div class="carousel-track" style="width: 600px; overflow: hidden;">
            <div class="testimonial-card" style="width: 200px; display: inline-block;">Testimonial 1</div>
            <div class="testimonial-card" style="width: 200px; display: inline-block;">Testimonial 2</div>
            <div class="testimonial-card" style="width: 200px; display: inline-block;">Testimonial 3</div>
            <div class="testimonial-card" style="width: 200px; display: inline-block;">Testimonial 4</div>
            <div class="testimonial-card" style="width: 200px; display: inline-block;">Testimonial 5</div>
          </div>
          <button class="carousel-next">Next</button>
        </div>
      `;
      const carousel = document.querySelector(".carousel-track");
      Object.defineProperty(carousel, "clientWidth", { value: 600, writable: true });
      carousel.scrollLeft = 0;
      carousel.scrollTo = function ({ left }) {
        this.scrollLeft = left;
      };
      Object.defineProperty(window, "innerWidth", { value: 1200, writable: true });
    });

    it("should pause auto-advance when button is clicked and restart after delay", () => {
      vi.useFakeTimers();
      const carousel = document.querySelector(".carousel-track");
      const carouselInstance = new Carousel(carousel, 1000);
      const nextBtn = document.querySelector(".carousel-next");
      const initialScrollLeft = carousel.scrollLeft;

      // Click button to trigger user interaction
      nextBtn.click();

      // Should not auto-advance during pause (even after normal interval)
      vi.advanceTimersByTime(2000);
      const scrollAfterPause = carousel.scrollLeft;

      // Should restart after 5 second delay
      vi.advanceTimersByTime(3000); // Total 5 seconds
      vi.advanceTimersByTime(1000); // One more interval

      expect(carousel.scrollLeft).toBeGreaterThan(scrollAfterPause);
      vi.useRealTimers();
    });

    it("should resume auto-advance when mouse leaves", () => {
      vi.useFakeTimers();
      const carousel = document.querySelector(".carousel-track");
      const carouselInstance = new Carousel(carousel, 1000);
      const initialScrollLeft = carousel.scrollLeft;

      // Simulate mouse enter to pause
      carousel.dispatchEvent(new Event("mouseenter"));

      // Verify paused - advance time but carousel shouldn't move
      vi.advanceTimersByTime(2000);
      expect(carousel.scrollLeft).toBe(initialScrollLeft);

      // Simulate mouse leave to resume
      carousel.dispatchEvent(new Event("mouseleave"));

      // Should now auto-advance after one interval
      vi.advanceTimersByTime(1000);
      expect(carousel.scrollLeft).toBeGreaterThan(initialScrollLeft);

      vi.useRealTimers();
    });
  });

  describe("ARIA and Accessibility", () => {
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
      Object.defineProperty(window, "innerWidth", { value: 1200, writable: true });
    });

    it("should set aria-hidden=false for visible slides", () => {
      const carousel = document.querySelector(".carousel-track");
      const carouselInstance = new Carousel(carousel);
      const cards = carousel.querySelectorAll(".testimonial-card");

      // First 3 cards should be visible (visibleItems = 3)
      expect(cards[0].getAttribute("aria-hidden")).toBe("false");
      expect(cards[1].getAttribute("aria-hidden")).toBe("false");
      expect(cards[2].getAttribute("aria-hidden")).toBe("false");
    });

    it("should set aria-hidden=true for hidden slides", () => {
      const carousel = document.querySelector(".carousel-track");
      const carouselInstance = new Carousel(carousel);
      const cards = carousel.querySelectorAll(".testimonial-card");

      // Cards 4 and 5 should be hidden
      expect(cards[3].getAttribute("aria-hidden")).toBe("true");
      expect(cards[4].getAttribute("aria-hidden")).toBe("true");
    });

    it("should update ARIA attributes when navigating", () => {
      const carousel = document.querySelector(".carousel-track");
      const carouselInstance = new Carousel(carousel);
      const cards = carousel.querySelectorAll(".testimonial-card");

      // Navigate forward
      carouselInstance.next();

      // Cards 1-3 should now be visible (index 1, 2, 3)
      expect(cards[0].getAttribute("aria-hidden")).toBe("true");
      expect(cards[1].getAttribute("aria-hidden")).toBe("false");
      expect(cards[2].getAttribute("aria-hidden")).toBe("false");
      expect(cards[3].getAttribute("aria-hidden")).toBe("false");
      expect(cards[4].getAttribute("aria-hidden")).toBe("true");
    });

    it("should set tabindex=-1 for hidden slides", () => {
      const carousel = document.querySelector(".carousel-track");
      const carouselInstance = new Carousel(carousel);
      const cards = carousel.querySelectorAll(".testimonial-card");

      // Hidden cards should have tabindex="-1"
      expect(cards[3].getAttribute("tabindex")).toBe("-1");
      expect(cards[4].getAttribute("tabindex")).toBe("-1");
    });
  });

  describe("Resize Handling", () => {
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

    it("should update visible items when window is resized", () => {
      Object.defineProperty(window, "innerWidth", { value: 1200, writable: true, configurable: true });
      const carousel = document.querySelector(".carousel-track");
      const carouselInstance = new Carousel(carousel);

      expect(carouselInstance.visibleItems).toBe(3);

      // Simulate resize to mobile
      Object.defineProperty(window, "innerWidth", { value: 500, writable: true, configurable: true });
      window.dispatchEvent(new Event("resize"));

      expect(carouselInstance.visibleItems).toBe(1);
    });

    it("should clamp currentIndex when resizing reduces visible items", () => {
      Object.defineProperty(window, "innerWidth", { value: 1200, writable: true, configurable: true });
      const carousel = document.querySelector(".carousel-track");
      const carouselInstance = new Carousel(carousel);

      // Navigate to last possible position for 3 visible items
      carouselInstance.currentIndex = 2; // Max index for 3 visible items is 2 (5 - 3 = 2)

      // Resize to show only 1 item at a time
      Object.defineProperty(window, "innerWidth", { value: 500, writable: true, configurable: true });
      window.dispatchEvent(new Event("resize"));

      // Max index for 1 visible item is 4 (5 - 1 = 4)
      // Current index should remain valid
      expect(carouselInstance.currentIndex).toBeLessThanOrEqual(4);
    });
  });

  describe("Visibility-Based Focus Management", () => {
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
      Object.defineProperty(window, "innerWidth", { value: 1200, writable: true });
    });

    it("should initialize with isCarouselVisible set to false", () => {
      const carousel = document.querySelector(".carousel-track");
      const carouselInstance = new Carousel(carousel);

      expect(carouselInstance.isCarouselVisible).toBe(false);
    });

    it("should not focus slides when carousel is not visible", () => {
      const carousel = document.querySelector(".carousel-track");
      const carouselInstance = new Carousel(carousel);
      const cards = carousel.querySelectorAll(".testimonial-card");

      // Carousel is not visible, so focus should not be applied
      carouselInstance.goTo(1);

      // Card should not have focus even though it was navigated to
      expect(document.activeElement).not.toBe(cards[1]);
    });

    it("should focus slides when carousel becomes visible", () => {
      const carousel = document.querySelector(".carousel-track");
      const carouselInstance = new Carousel(carousel);
      const cards = carousel.querySelectorAll(".testimonial-card");

      // Simulate carousel becoming visible
      carouselInstance.isCarouselVisible = true;

      carouselInstance.goTo(1);

      // Card should now be focused since carousel is visible
      expect(cards[1].getAttribute("tabindex")).toBe("0");
    });

    it("should stop focusing slides when carousel becomes hidden", () => {
      const carousel = document.querySelector(".carousel-track");
      const carouselInstance = new Carousel(carousel);
      const cards = carousel.querySelectorAll(".testimonial-card");

      // Carousel is visible
      carouselInstance.isCarouselVisible = true;
      carouselInstance.goTo(0);

      // Now carousel becomes hidden
      carouselInstance.isCarouselVisible = false;
      carouselInstance.goTo(2);

      // Card should not be focused since carousel is hidden
      expect(document.activeElement).not.toBe(cards[2]);
    });

    it("should respect focus management when user is typing", () => {
      const carousel = document.querySelector(".carousel-track");
      const carouselInstance = new Carousel(carousel);

      // Create an input element and focus it
      const input = document.createElement("input");
      document.body.appendChild(input);
      input.focus();

      // Make carousel visible
      carouselInstance.isCarouselVisible = true;

      // Try to focus carousel slide
      carouselInstance.goTo(1);

      // Should not steal focus from input
      expect(document.activeElement).toBe(input);
    });

    it("should not focus slides when a modal is open", () => {
      const carousel = document.querySelector(".carousel-track");
      const carouselInstance = new Carousel(carousel);
      const cards = carousel.querySelectorAll(".testimonial-card");

      // Carousel is visible
      carouselInstance.isCarouselVisible = true;

      // Create and open a modal
      const modal = document.createElement("div");
      modal.setAttribute("aria-modal", "true");
      modal.classList.add("active");
      document.body.appendChild(modal);

      carouselInstance.goTo(1);

      // Card should not be focused since modal is open
      expect(document.activeElement).not.toBe(cards[1]);
    });

    it("should resume focusing slides when modal closes", () => {
      const carousel = document.querySelector(".carousel-track");
      const carouselInstance = new Carousel(carousel);
      const cards = carousel.querySelectorAll(".testimonial-card");

      carouselInstance.isCarouselVisible = true;

      // Open a modal
      const modal = document.createElement("div");
      modal.setAttribute("aria-modal", "true");
      modal.classList.add("active");
      document.body.appendChild(modal);

      carouselInstance.goTo(1);

      // Modal is open, card should not have focus
      expect(cards[1]).not.toBe(document.activeElement);

      // Close the modal
      modal.classList.remove("active");

      carouselInstance.goTo(2);

      // Modal is closed, card should now be focused
      expect(cards[2].getAttribute("tabindex")).toBe("0");
    });

    it("should not steal focus from modal when carousel auto-advances", () => {
      vi.useFakeTimers();
      const carousel = document.querySelector(".carousel-track");
      const carouselInstance = new Carousel(carousel, 1000);
      const cards = carousel.querySelectorAll(".testimonial-card");

      carouselInstance.isCarouselVisible = true;

      // Create and open a modal with a button
      const modal = document.createElement("div");
      modal.setAttribute("aria-modal", "true");
      modal.classList.add("active");
      const modalBtn = document.createElement("button");
      modal.appendChild(modalBtn);
      document.body.appendChild(modal);
      modalBtn.focus();

      expect(document.activeElement).toBe(modalBtn);

      // Auto-advance carousel
      vi.advanceTimersByTime(1000);

      // Focus should remain on modal button, not move to carousel
      expect(document.activeElement).toBe(modalBtn);

      vi.useRealTimers();
    });
  });
});
