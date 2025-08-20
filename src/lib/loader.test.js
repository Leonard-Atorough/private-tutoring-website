/**
 * @vitest-environment jsdom
 */
import { vi, it, expect, beforeEach, afterEach, describe } from "vitest";
import { loadHTML } from "./loader.js";

describe("loadHTML", () => {
   beforeEach(() => {
      document.body.innerHTML = "";
   });

   const html = "<div id='test'>Hello</div>";

   it("fetches HTML and returns its content in a wrapper div", async () => {
      global.fetch = mockFetch(html, true);
      const wrapper = await loadHTML("/test.html");
      expect(wrapper).toBeInstanceOf(HTMLDivElement);
      expect(wrapper.innerHTML).toContain("Hello");
      expect(wrapper.querySelector("#test")).not.toBeNull();
   });

   it("applies the column clas to the wrapper div", async () => {
      global.fetch = mockFetch(html, true);
      const wrapper = await loadHTML("/any.html");
      expect(wrapper.classList).toContain("column");
   });

   it("throws an undefined error if the html being loaded is not found", async () => {
      global.fetch = mockFetch(html, false);
      await expect(loadHTML("/bad.html")).rejects.toThrow(
         "Failed to load HTML from /bad.html: Not Found"
      );
   });
});

function mockFetch(html, ok) {
   return vi.fn().mockResolvedValue({
      ok: ok,
      text: () => Promise.resolve(html),
      statusText: ok ? "" : "Not Found"
   });
}
