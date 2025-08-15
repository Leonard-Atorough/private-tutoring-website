/**
 * @vitest-environment jsdom
 */
import { handleRoute } from "./router.js";
import { pageConfig } from "../config/pageConfig.js";
import { beforeEach, describe, vi, it, expect } from "vitest";

// Mocking out the returns from loader.js function in this instance as we don't want to call real pages for this test.
vi.mock("./loader.js", () => ({
   loadHTML: vi.fn((url) => {
      if (url === "test-page.html") {
         // Simulate the page HTML: a container with data-component placeholder
         const pageWrapper = document.createElement("div");
         pageWrapper.innerHTML = `
        <div data-component="test-component"></div>
      `;
         return Promise.resolve(pageWrapper);
      } else if (url === "test-component.html") {
         // Simulate the component template
         const compWrapper = document.createElement("div");
         compWrapper.innerHTML = `
        <template id="test-component">
          <span id="inner">Hello from component!</span>
        </template>
      `;
         return Promise.resolve(compWrapper);
      }
      return Promise.resolve(document.createElement("div"));
   })
}));

beforeEach(() => {
   //reset dom content
   document.body.innerHTML = `<div class="main-content"></div>`;

   pageConfig["/test"] = {
      page: "test-page.html",
      components: ["test-component.html"]
   };
});

describe("handleRoute", () => {
   it("loads the page and injects the component into its placeholder", async () => {
      await handleRoute("/test");

      const content = document.querySelector(".main-content");

      // The “page” wrapper should have been appended
      const placeholder = content.querySelector('[data-component="test-component"]');
      expect(placeholder).toBeTruthy();

      // The component’s template content should now live inside it
      expect(placeholder.innerHTML).toContain("Hello from component!");
   });
});

// describe("handleRoute", () => {
//    it("loads the error page when a non-existent page is routed to", async () => {
//       await handleRoute("/not-exist");

//       expect(content.innerHTML).toContain(
//          `<p>Error loading page: Failed to load HTML from pages/not-exist.html: Not Found</p>`
//       );
//    });
// });
