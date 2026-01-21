/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createMockLogger } from "../__mocks__/logger.js";

// Mock all component modules at file level
const headerMock = { initHeader: vi.fn() };
const modalMock = { initModal: vi.fn() };
const carouselMock = { default: vi.fn() };
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
const loggerMock = createMockLogger(vi);

vi.mock("./components/header/header.js", () => headerMock);
vi.mock("./components/modal/modal.js", () => modalMock);
vi.mock("./components/carousel/carousel.js", () => carouselMock);
vi.mock("./components/state/formStateManager.js", () => formStateMock);
vi.mock("./components/form/formHandler.js", () => formMock);
vi.mock("./components/store/storeManager.js", () => storeMock);
vi.mock("./logger.js", () => ({ default: loggerMock }));

describe("Index Module - Application Initialization", () => {
  beforeEach(async () => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    headerMock.initHeader.mockClear();
    modalMock.initModal.mockClear();
    carouselMock.default.mockClear();
    formStateMock.createFormStateManager.mockClear();
    formMock.formHandler.mockClear();
    loggerMock.info.mockClear();
    loggerMock.debug.mockClear();
    loggerMock.warn.mockClear();
    loggerMock.error.mockClear();

    // Reset DOM
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
    expect(carouselMock.default).toHaveBeenCalled();
    expect(formStateMock.createFormStateManager).toHaveBeenCalled();
    expect(formMock.formHandler).toHaveBeenCalled();
  });

  it("should initialize carousel for each carousel-track element", async () => {
    const { initializeApp } = await import("./index.js");

    // Add multiple carousels
    document.body.innerHTML += `
      <div class="carousel-track">
        <div class="testimonial-card">Card A</div>
      </div>
      <div class="carousel-track">
        <div class="testimonial-card">Card B</div>
      </div>
    `;

    await initializeApp();

    // Should be called for each carousel track (3 total)
    const carouselTracks = document.querySelectorAll(".carousel-track");
    expect(carouselTracks.length).toBe(3);
    expect(carouselMock.default).toHaveBeenCalledTimes(3);
  });

  it("should handle missing app element gracefully", async () => {
    const { initializeApp } = await import("./index.js");

    // Remove app element
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
    expect(carouselMock.default).toHaveBeenCalled();
  });
});
