/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createMockLogger } from "../__mocks__/logger.js";

const headerMock = { initHeader: vi.fn() };
const modalMock = { initModal: vi.fn() };
const swiperCarouselMock = {
  default: {
    initAll: vi.fn((selector, interval) => {
      const containers = document.querySelectorAll(selector);
      return Array.from(containers).map(container => ({ container, interval }));
    }),
  },
};
const formStateMock = {
  createFormStateManager: vi.fn(() => ({
    persistFormState: vi.fn(),
  })),
};
const formMock = {
  formHandler: vi.fn(() => ({
    mountFormHandler: vi.fn(),
  })),
};
const storeMock = {
  saveStateToLocalStorage: vi.fn(),
  fetchStoredState: vi.fn(),
};
const faqMock = { initializeFAQ: vi.fn() };
const loggerMock = createMockLogger(vi);
const sentryConfigMock = { default: vi.fn() };

vi.mock("./components/header/header.js", () => headerMock);
vi.mock("./components/modal/modal.js", () => modalMock);
vi.mock("./components/carousel/swiper-carousel.js", () => swiperCarouselMock);
vi.mock("./components/state/formStateManager.js", () => formStateMock);
vi.mock("./components/form/formHandler.js", () => formMock);
vi.mock("./components/store/storeManager.js", () => storeMock);
vi.mock("./components/faq/faq.js", () => faqMock);
vi.mock("./logger.js", () => ({ default: loggerMock }));
vi.mock("./sentry-config.js", () => sentryConfigMock);
// Mock Swiper CSS imports
vi.mock("swiper/css", () => ({}));
vi.mock("swiper/css/navigation", () => ({}));
vi.mock("swiper/css/autoplay", () => ({}));
vi.mock("swiper/css/a11y", () => ({}));

describe("Index Module - Application Initialization", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    headerMock.initHeader.mockClear();
    modalMock.initModal.mockClear();
    formStateMock.createFormStateManager.mockClear();
    formMock.formHandler.mockClear();
    faqMock.initializeFAQ.mockClear();
    loggerMock.info.mockClear();
    loggerMock.debug.mockClear();
    loggerMock.warn.mockClear();
    loggerMock.error.mockClear();

    document.body.innerHTML = `
      <div id="app" style="opacity: 0;"></div>
      <div id="hamburger-button"></div>
      <div id="navigation-menu"></div>
      <div id="booking-modal">
        <button id="modal-close">Close</button>
      </div>
      <button class="book-btn">Book</button>
      <div class="carousel-track">
        <div class="testimonial-card">Card 1</div>
        <div class="testimonial-card">Card 2</div>
      </div>
      <form id="contact-form">
        <input name="email" />
      </form>
    `;
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it("should initialize app opacity animation", async () => {
    const { initializeApp } = await import("./index.js");
    vi.useFakeTimers();

    const appElement = document.getElementById("app");
    expect(appElement.style.opacity).toBe("0");

    await initializeApp();

    // Fast-forward time to after the 500ms delay
    vi.advanceTimersByTime(500);

    expect(appElement.style.opacity).toBe("1");
  });

  it("should initialize all components", async () => {
    const { initializeApp } = await import("./index.js");
    vi.useFakeTimers();

    await initializeApp();

    // Fast-forward timers to complete async operations
    vi.advanceTimersByTime(1000);

    expect(headerMock.initHeader).toHaveBeenCalled();
    expect(modalMock.initModal).toHaveBeenCalled();
    expect(swiperCarouselMock.default.initAll).toHaveBeenCalled();
    expect(formStateMock.createFormStateManager).toHaveBeenCalled();
    expect(formMock.formHandler).toHaveBeenCalled();
    expect(faqMock.initializeFAQ).toHaveBeenCalled();
  });

  it("should initialize swiper carousel for testimonials-carousel elements", async () => {
    const { initializeApp } = await import("./index.js");

    document.body.innerHTML += `
      <div class="testimonials-carousel">
        <div class="swiper"><div class="swiper-wrapper"></div></div>
      </div>
      <div class="testimonials-carousel">
        <div class="swiper"><div class="swiper-wrapper"></div></div>
      </div>
    `;

    await initializeApp();

    // Should be called for testimonials-carousel elements
    const carouselContainers = document.querySelectorAll(".testimonials-carousel");
    expect(carouselContainers.length).toBe(2);
    expect(swiperCarouselMock.default.initAll).toHaveBeenCalledWith(".testimonials-carousel");
  });

  it("should handle missing app element gracefully", async () => {
    const { initializeApp } = await import("./index.js");

    document.getElementById("app")?.remove();

    // Should not throw
    await expect(initializeApp()).resolves.not.toThrow();
    expect(loggerMock.warn).toHaveBeenCalledWith("App root element not found");
  });

  it("should log initialization messages", async () => {
    const { initializeApp } = await import("./index.js");

    await initializeApp();

    expect(loggerMock.info).toHaveBeenCalledWith("App initialization started");
    expect(loggerMock.info).toHaveBeenCalledWith("App initialization completed successfully");
  });

  it("should handle component initialization errors gracefully", async () => {
    const { initializeApp } = await import("./index.js");
    const testError = new Error("Test initialization error");

    // Make header initialization fail
    headerMock.initHeader.mockRejectedValueOnce(testError);

    await initializeApp();

    expect(loggerMock.error).toHaveBeenCalledWith(
      "Error initializing header",
      { error: "Test initialization error" },
      testError,
    );

    // Other components should still initialize
    expect(modalMock.initModal).toHaveBeenCalled();
    expect(swiperCarouselMock.default.initAll).toHaveBeenCalled();
    expect(formStateMock.createFormStateManager).toHaveBeenCalled();
    expect(formMock.formHandler).toHaveBeenCalled();
    expect(loggerMock.info).toHaveBeenCalledWith("App initialization completed successfully");
  });

  it("should skip initialization in non-browser environments", async () => {
    const { initializeApp } = await import("./index.js");
    const originalDocument = global.document;
    // Simulate non-browser environment
    // @ts-ignore
    delete global.document;
    await initializeApp();

    expect(loggerMock.debug).toHaveBeenCalledWith(
      "Skipping app initialization: not in browser environment",
    );
    // Restore original document
    global.document = originalDocument;
  });

  it("should initialize form state manager with correct storage functions", async () => {
    const { initializeApp } = await import("./index.js");

    await initializeApp();
    expect(formStateMock.createFormStateManager).toHaveBeenCalledWith(
      storeMock.saveStateToLocalStorage,
      storeMock.fetchStoredState,
    );
  });
});
