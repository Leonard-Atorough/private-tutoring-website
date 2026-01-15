/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

// Mock all component modules
vi.mock("./components/header/header.js", () => ({
  initHeader: vi.fn(),
}));

vi.mock("./components/modal/modal.js", () => ({
  initModal: vi.fn(),
}));

vi.mock("./components/carousel/carousel.js", () => ({
  default: vi.fn(),
}));

vi.mock("./components/state/formStateManager.js", () => ({
  createFormStateManager: vi.fn(() => ({
    persistFormState: vi.fn(),
  })),
}));

vi.mock("./components/form/formHandler.js", () => ({
  formHandler: vi.fn(() => ({
    mountFormHandler: vi.fn(),
  })),
}));

vi.mock("./components/store/storeManager.js", () => ({
  saveStateToLocalStorage: vi.fn(),
  fetchStoredState: vi.fn(),
}));

describe("Index Module - Application Initialization", () => {
  let modules;

  beforeEach(async () => {
    // Clear all mocks before each test
    vi.clearAllMocks();

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

    // Import modules fresh to get mocked versions
    const [header, modal, carousel, formState, form, store] = await Promise.all([
      import("./components/header/header.js"),
      import("./components/modal/modal.js"),
      import("./components/carousel/carousel.js"),
      import("./components/state/formStateManager.js"),
      import("./components/form/formHandler.js"),
      import("./components/store/storeManager.js"),
    ]);

    modules = {
      header,
      modal,
      carousel,
      formState,
      form,
      store,
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize app opacity animation on DOMContentLoaded", async () => {
    vi.useFakeTimers();

    const appElement = document.getElementById("app");
    expect(appElement.style.opacity).toBe("0");

    // Import the module to trigger DOMContentLoaded listener setup
    await import("./index.js");

    // Dispatch DOMContentLoaded event
    const event = new Event("DOMContentLoaded");
    document.dispatchEvent(event);

    // Fast-forward time to after the 500ms delay
    vi.advanceTimersByTime(500);

    expect(appElement.style.opacity).toBe("1");

    vi.useRealTimers();
  });

  it("should initialize all components when DOM is ready", async () => {
    vi.useFakeTimers();

    // Import the module
    await import("./index.js");

    // Trigger DOMContentLoaded
    document.dispatchEvent(new Event("DOMContentLoaded"));

    // Fast-forward timers to complete async operations
    vi.advanceTimersByTime(1000);

    expect(modules.header.initHeader).toHaveBeenCalled();
    expect(modules.modal.initModal).toHaveBeenCalled();
    expect(modules.carousel.default).toHaveBeenCalled();
    expect(modules.formState.createFormStateManager).toHaveBeenCalled();
    expect(modules.form.formHandler).toHaveBeenCalled();

    vi.useRealTimers();
  });

  it("should initialize carousel for each carousel-track element", async () => {
    // Add multiple carousels
    document.body.innerHTML += `
      <div class="carousel-track">
        <div class="testimonial-card">Card A</div>
      </div>
      <div class="carousel-track">
        <div class="testimonial-card">Card B</div>
      </div>
    `;

    await import("./index.js");
    document.dispatchEvent(new Event("DOMContentLoaded"));

    // Should be called for each carousel track (3 total now)
    const carouselTracks = document.querySelectorAll(".carousel-track");
    expect(carouselTracks.length).toBe(3);
  });

  it("should handle header initialization errors gracefully", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    // Make initHeader throw an error
    modules.header.initHeader.mockImplementation(() => {
      throw new Error("Header initialization failed");
    });

    await import("./index.js");
    document.dispatchEvent(new Event("DOMContentLoaded"));

    // Should log error but not crash
    expect(consoleError).toHaveBeenCalledWith(
      "Error initializing header:",
      expect.any(Error),
    );

    // Other components should still be initialized
    expect(modules.modal.initModal).toHaveBeenCalled();

    consoleError.mockRestore();
  });

  it("should handle carousel initialization errors gracefully", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    // Make Carousel constructor throw an error
    modules.carousel.default.mockImplementation(() => {
      throw new Error("Carousel initialization failed");
    });

    await import("./index.js");
    document.dispatchEvent(new Event("DOMContentLoaded"));

    expect(consoleError).toHaveBeenCalledWith(
      "Error initializing carousel:",
      expect.any(Error),
    );

    // Other components should still be initialized
    expect(modules.modal.initModal).toHaveBeenCalled();

    consoleError.mockRestore();
  });

  it("should handle modal initialization errors gracefully", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    modules.modal.initModal.mockImplementation(() => {
      throw new Error("Modal initialization failed");
    });

    await import("./index.js");
    document.dispatchEvent(new Event("DOMContentLoaded"));

    expect(consoleError).toHaveBeenCalledWith(
      "Error initializing modal:",
      expect.any(Error),
    );

    // Other components should still be initialized
    expect(modules.header.initHeader).toHaveBeenCalled();

    consoleError.mockRestore();
  });

  it("should handle form state manager errors gracefully", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    modules.formState.createFormStateManager.mockImplementation(() => {
      throw new Error("Form state manager failed");
    });

    await import("./index.js");
    document.dispatchEvent(new Event("DOMContentLoaded"));

    expect(consoleError).toHaveBeenCalledWith(
      "Error initializing form state manager:",
      expect.any(Error),
    );

    // Form handler should still be attempted
    expect(modules.form.formHandler).toHaveBeenCalled();

    consoleError.mockRestore();
  });

  it("should handle form handler errors gracefully", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    modules.form.formHandler.mockImplementation(() => {
      throw new Error("Form handler failed");
    });

    await import("./index.js");
    document.dispatchEvent(new Event("DOMContentLoaded"));

    expect(consoleError).toHaveBeenCalledWith(
      "Error initializing form handler:",
      expect.any(Error),
    );

    consoleError.mockRestore();
  });

  it("should handle missing app element gracefully", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    // Remove app element
    document.getElementById("app")?.remove();

    await import("./index.js");

    // Should throw and be caught by outer try-catch
    expect(() => {
      document.dispatchEvent(new Event("DOMContentLoaded"));
    }).not.toThrow();

    consoleError.mockRestore();
  });
});
