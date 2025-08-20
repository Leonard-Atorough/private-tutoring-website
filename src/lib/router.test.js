/**
 * @vitest-environment jsdom
 */
import { createRouter } from "./router.js";
import { loadHTMLmock } from "./mocks/loadHTML.mock.js";
import { pageConfig } from "../config/pageConfig.js";
import { vi, it, expect, beforeEach, afterEach, describe } from "vitest";

// vi.mock("./loader.js", () => ({
//    loadHTML: loadHTMLmock
// }));

beforeEach(() => {
   document.body.innerHTML = `<div class="main-content"></div>`;

   pageConfig["/test"] = {
      page: "test-page.html",
      components: ["test-component.html"]
   };
   pageConfig["/simple"] = {
      page: "simple-page.html"
   };
   pageConfig["/not-found"] = {
      page: "not-found.html"
   };
   pageConfig["/no-template"] = {
      page: "test-page.html",
      components: ["no-template-component.html"]
   };
});

afterEach(() => {
   vi.clearAllMocks();
});

const { loadMainLayout, handleRoute, navigateTo } = createRouter(loadHTMLmock);

describe("handleRoute", () => {
   it("loads a page with no components", async () => {
      await handleRoute("/simple");
      const content = document.querySelector(".main-content");
      console.log(content);
      expect(content.innerHTML).toContain("Simple page content");
   });

   it("loads a page and injects its components into their placeholders", async () => {
      await handleRoute("/test");
      const content = document.querySelector(".main-content");
      const placeholder = content.querySelector('[data-component="test-component"]');
      expect(placeholder).toBeTruthy();
   });

   it("loads the error page when a non-eixstent page is routed to", async () => {
      await handleRoute("/not-found");
      const content = document.querySelector(".main-content");
      expect(content.innerHTML).toContain(
         `<p>Error loading page: Failed to load HTML from not-found.html: Not Found</p>`
      );
   });

   it("handles missing component template and loads the page regardless", async () => {
      await handleRoute("/no-template");
      const content = document.querySelector(".main-content");
      const placeholder = content.querySelector('[data-component="no-template-component"]');
      expect(placeholder).toBeNull();
   });
});
