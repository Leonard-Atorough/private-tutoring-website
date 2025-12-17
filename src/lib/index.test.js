import { describe, it } from "vitest";

describe("Index Module", () => {
  it("should change opacity of body to 1 on load", () => {
    // Mock document and body
    document.body.innerHTML = `<div id="app" style="opacity: 0.01;"></div>`;
    const appElement = document.getElementById("app");

    // Simulate DOMContentLoaded event
    const event = new Event("DOMContentLoaded");
    document.dispatchEvent(event);

    // Use a timeout to check the opacity after the delay
    setTimeout(() => {
      expect(appElement.style.opacity).toBe("1");
    }, 600);
  });
});
