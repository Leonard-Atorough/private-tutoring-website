/**
 * @vitest-environment jsdom
 */
import { vi, describe, beforeEach, it, expect } from "vitest";
import { createMockLogger } from "../../../__mocks__/logger.js";

vi.mock("../../logger.js", () => ({ default: createMockLogger(vi) }));

import { initHeader } from "./header.js";
import logger from "../../logger.js";

const mockLogger = vi.mocked(logger);

const buildDom = () => {
  document.body.innerHTML = `
      <div class="main-content">
          <button id="hamburger-button" aria-expanded="false"></button>
          <nav id="navigation-menu" class="navigation-menu">
             <a href="#section-one" class="link">Section One</a>
             <a href="#section-two" class="link">Section Two</a>
          </nav>
      </div>
  `;
};

describe("Navigation toggle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    buildDom();
  });

  it("adds .-active to the nav and sets aria-expanded=true on first click", () => {
    initHeader();
    const toggle = document.getElementById("hamburger-button");
    const nav = document.getElementById("navigation-menu");

    toggle.click();

    expect(nav.classList.contains("-active")).toBe(true);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
  });

  it("removes .-active from the nav and sets aria-expanded=false on second click", () => {
    initHeader();
    const toggle = document.getElementById("hamburger-button");
    const nav = document.getElementById("navigation-menu");

    toggle.click();
    toggle.click();

    expect(nav.classList.contains("-active")).toBe(false);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });

  it("logs warning and returns early if the toggle button is missing", () => {
    document.getElementById("hamburger-button")?.remove();
    expect(() => initHeader()).not.toThrow();
    expect(mockLogger.warn).toHaveBeenCalledWith(
      "Header elements not found, navigation functionality disabled",
    );
  });

  it("closes menu when clicking a navigation link", () => {
    initHeader();
    const toggle = document.getElementById("hamburger-button");
    const nav = document.getElementById("navigation-menu");
    const link = document.querySelector('a[href="#section-one"]');

    // Open menu
    toggle.click();
    expect(nav.classList.contains("-active")).toBe(true);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");

    // Click a link
    link.click();

    // Menu should close
    expect(nav.classList.contains("-active")).toBe(false);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });
});
