// An auto advancing carousel for the testimonials section
// in vanilla JS

export default class Carousel {
  constructor(carouselElement, interval = 3000) {
    this.carouselElement = carouselElement;
    this.interval = interval;
    this.currentIndex = 0;
    this.items = carouselElement.querySelectorAll(".testimonial-card");
    this.totalItems = this.items.length;
    this.visibleItems = 1; // default, will be updated in readyCarousel
    this.readyCarousel();
    this.startAutoAdvance();
  }

  // the ready carousel function takes the carousel element, determines how many cards are visible based on screen width and thus what each slide width is
  readyCarousel() {
    this.updateSlideWidth();
    window.addEventListener("resize", () => this.updateSlideWidth());
    this.carouselElement.addEventListener("mouseenter", () => this.stopAutoAdvance());
    this.carouselElement.addEventListener("mouseleave", () => this.startAutoAdvance());
  }
  updateSlideWidth() {
    const screenWidth = window.innerWidth;

    if (screenWidth >= 1024) {
      this.slideWidth = this.carouselElement.clientWidth / 3; // 3 cards per view
      this.visibleItems = 3;
    } else if (screenWidth >= 600) {
      this.slideWidth = this.carouselElement.clientWidth / 2; // 2 cards per view
      this.visibleItems = 2;
    } else {
      this.slideWidth = this.carouselElement.clientWidth; // 1 card per view
    }
  }
  startAutoAdvance() {
    this.intervalId = setInterval(() => this.advanceSlide(), this.interval);
  }
  advanceSlide() {
    this.currentIndex = (this.currentIndex + 1) % (this.totalItems - this.visibleItems + 1);
    this.carouselElement.scrollTo({
      left: this.currentIndex * this.slideWidth,
      behavior: "smooth",
    });
  }
  // stop the carousel when the user hovers over it
  stopAutoAdvance() {
    clearInterval(this.intervalId);
    this.intervalId = null;
  }
}
