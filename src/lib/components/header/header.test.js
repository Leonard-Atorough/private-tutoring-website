/**
 * @vitest-environment jsdom
 */
// import { describe, expect, vi } from "vitest";
import { initHeader } from "./header.js";

const buildDom = () => {
  document.body.innerHTML = `
      <div class="main-content">
          <button id="hamburger-button" aria-expanded="false"></button>
          <nav id="navigation-menu" class="navigation-menu">
             <a href="#section-one" class="link">Section One</a>
             <a href="#section-two" class="link">Section Two</a>
          </nav>

          <section id="section-one" style="height:100vh; background:#f0f0f0;">
             <h2>Section One</h2>
          </section>

          <section id="section-two" style="height:100vh; background:#e0e0e0;">
             <h2>Section Two</h2>
          </section>
      </div>
  `;
};

beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  HTMLElement.prototype.scrollIntoView = function () {};
});

describe("Navigation toggle", () => {
  beforeEach(() => {
    buildDom();
    initHeader();
  });

  it("adds .-active to the nav and sets aria-expanded=true on first click", () => {
    const toggle = document.getElementById("hamburger-button");
    const nav = document.getElementById("navigation-menu");

    toggle.click();

    expect(nav.classList.contains("-active")).toBe(true);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
  });

  it("removes .-active from the nav and sets aria-expanded=false on second click", () => {
    const toggle = document.getElementById("hamburger-button");
    const nav = document.getElementById("navigation-menu");

    toggle.click();
    toggle.click();

    expect(nav.classList.contains("-active")).toBe(false);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });

  it("logs warning and returns early if the toggle button is missing", () => {
    const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {});
    document.getElementById("hamburger-button")?.remove();
    expect(() => initHeader()).not.toThrow();
    expect(consoleWarn).toHaveBeenCalledWith(
      "Header elements not found, navigation functionality disabled"
    );
    consoleWarn.mockRestore();
  });
});

describe("When a navigation link is clicked", () => {
  beforeEach(() => {
    buildDom();
    initHeader();
  });

  it("should scroll to the target section", () => {
    const link = document.querySelector(`a[href="#section-two"]`);

    const target = document.getElementById("section-two");
    const scrollSpy = vi
      .spyOn(target, "scrollIntoView")
      .mockImplementation(() => {
        // Simulate what the browser would do after a smooth scroll
        window.location.hash = "#section-two";
      });
    link.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(scrollSpy).toHaveBeenCalledOnce();
    expect(scrollSpy).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
    });
    expect(window.location.hash).toBe("#section-two");
  });
});
