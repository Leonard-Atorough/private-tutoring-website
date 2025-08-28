/**
 * @vitest-environment jsdom
 */
import { createRouter } from "./router.js";
import * as header from "../layout/header.js";
import { loadHTMLMock, loadHeaderFooterHTMLMock } from "./mocks/loadHTML.mock.js";
import { pageConfigMock } from "./mocks/pageConfig.mock.js";
import { vi, it, expect, beforeEach, afterEach, describe } from "vitest";

// vi.mock("./loader.js", () => ({
//    loadHTML: loadHTMLmock
// }));

afterEach(() => {
   vi.clearAllMocks();
});

describe("loadMianLayout", () => {
   let loadMainLayout;

   beforeEach(() => {
      document.body.innerHTML = `<div id="content"></div>`;
      ({ loadMainLayout } = createRouter(loadHeaderFooterHTMLMock, pageConfigMock));

      vi.spyOn(header, "toggleNavMenu").mockImplementation(() => {});
   });

   it("loads the page header and footer attaches them correctly", async () => {
      await loadMainLayout();

      const header = document.querySelector("#header");
      expect(header.innerHTML).toContain("Hello from header!");

      const toggleSpy = vi.fn();
      document.querySelector("#menu-toggle").addEventListener("click", toggleSpy);
      document.querySelector("#menu-toggle").click();
      expect(toggleSpy).toHaveBeenCalled();

      const footer = document.querySelector("#footer");
      expect(footer.innerHTML).toContain("Hello from footer!");
   });
});

describe("handleRoute", () => {
   let handleRoute;

   beforeEach(() => {
      document.body.innerHTML = `<div class="main-content"></div>`;
      ({ handleRoute } = createRouter(loadHTMLMock, pageConfigMock));
   });

   it("loads a page with no components", async () => {
      await handleRoute("/simple");
      const content = document.querySelector(".main-content");
      expect(content.innerHTML).toContain("Simple page content");
   });

   it("loads a page and injects its components into their placeholders", async () => {
      await handleRoute("/test");
      const content = document.querySelector(".main-content");
      const placeholder = content.querySelector('[data-component="test-component"]');
      expect(placeholder).toBeTruthy();
   });

   it("loads the error page when a broken page is routed to", async () => {
      await handleRoute("/broken");
      const content = document.querySelector(".main-content");
      expect(content.innerHTML).toContain(
         `<p>Error loading page: Failed to load HTML from broken.html: Not Found</p>`
      );
   });
   it("loads the home page when a non-eixstent page is routed to", async () => {
      await handleRoute("/not-found");
      const content = document.querySelector(".main-content");
      expect(content.innerHTML).toContain("Home page loaded as default");
   });

   it("handles missing component template and loads the page regardless", async () => {
      await handleRoute("/no-template");
      const content = document.querySelector(".main-content");
      const placeholder = content.querySelector('[data-component="no-template-component"]');
      expect(placeholder).toBeNull();
   });
});

describe("navigateTo", () => {
   let navigateTo;

   beforeEach(() => {
      document.body.innerHTML = `
       <div class="main-content"></div>
       <div id="section1"></div>
     `;

      const router = createRouter(loadHTMLMock, pageConfigMock);
      navigateTo = router.navigateTo;
      Element.prototype.scrollIntoView = vi.fn();
   });

   it("should push state and scroll to section", async () => {
      await navigateTo("/home", "section1");

      expect(history.pushState).toBeDefined();
      expect(location.pathname).toBe("/home");
      expect(location.hash).toBe("#section1");
      expect(document.getElementById("section1").scrollIntoView).toHaveBeenCalled();
   });

   it("should push state without hash and not scroll", async () => {
      await navigateTo("/home");

      expect(history.pushState).toBeDefined();
      expect(history.hash).toBeNull;
      expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
   });
});
