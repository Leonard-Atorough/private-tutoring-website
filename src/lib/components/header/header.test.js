/**
 * @vitest-environment jsdom
 */
import { expect } from "vitest";
import { initHeader } from "./header.js";


describe("Navigation toggle", () => {
   beforeEach(() => {
      document.body.innerHTML = `
        <div class="main-content">
            <button id="menu-toggle" aria-expanded="false"></button>
            <nav id="navigation-menu" class="nav-menu"></nav>
        </div>
    `;

      initHeader();
   });
   it("adds .active to the nav and sets aria-expanded=true on first click", () => {
      const toggle = document.getElementById("menu-toggle");
      const nav = document.getElementById("navigation-menu");

      toggle.click();

      expect(nav.classList.contains("active")).toBe(true);
      expect(toggle.getAttribute("aria-expanded")).toBe("true");
   });

   it("removes .active from the nav and sets aria-expanded=false on second click", () => {
      const toggle = document.getElementById("menu-toggle");
      const nav = document.getElementById("navigation-menu");

      toggle.click();
      toggle.click();

      expect(nav.classList.contains("active")).toBe(false);
      expect(toggle.getAttribute("aria-expanded")).toBe("false");
   });

   it("throws an error if the toggle button is missing", () => {
      document.getElementById("menu-toggle")?.remove();
      expect(() => initHeader()).toThrow("Navigation toggle button not found");
   });
});
