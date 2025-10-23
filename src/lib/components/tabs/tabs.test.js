import { initTabs } from "./tabs";

describe("Tabs Component", () => {
  describe("Initialization", () => {
    it("should return if no tab button container", () => {
      document.body.innerHTML = `
            <div></div>
        `;
      expect(() => initTabs()).not.toThrow();
    });

    it("should return if no tabs", () => {
      document.body.innerHTML = `
            <div class="service-tabs"></div>
        `;
      expect(() => initTabs()).not.toThrow();
    });
  });

  describe("Tab button clicks", () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div class="service-tabs">
            <button class="button" id="service-tab-1" aria-controls="panel-1" role="tab"></button>
            <button class="button" id="service-tab-2" aria-controls="panel-2" role="tab"></button>
            <button class="button" id="service-tab-3" aria-controls="panel-3" role="tab"></button>
        </div>
        <div class="service-card" id="panel-1"></div>        
        <div class="service-card" id="panel-2"></div>        
        <div class="service-card" id="panel-3"></div>
    `;
    });
    it("should activate the correct tab and panel", () => {
      initTabs();

      const tabBtn1 = document.getElementById("service-tab-1");
      const tabBtn2 = document.getElementById("service-tab-2");
      const tabBtn3 = document.getElementById("service-tab-3");
      const panel1 = document.getElementById("panel-1");
      const panel2 = document.getElementById("panel-2");
      const panel3 = document.getElementById("panel-3");

      tabBtn2.click();
      expect(tabBtn2.classList.contains("active")).toBe(true);
      expect(panel2.classList.contains("active")).toBe(true);
      expect(tabBtn1.classList.contains("active")).toBe(false);
      expect(panel1.classList.contains("active")).toBe(false);
      expect(tabBtn3.classList.contains("active")).toBe(false);
      expect(panel3.classList.contains("active")).toBe(false);
    });

    it("should return if click is outside a button", () => {
      initTabs();
      const tabBtn1 = document.getElementById("service-tab-1");
      const panel1 = document.getElementById("panel-1");

      const clickEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      });
      tabBtn1.parentElement.dispatchEvent(clickEvent);
      expect(tabBtn1.classList.contains("active")).toBe(false);
      expect(panel1.classList.contains("active")).toBe(false);
    });
  });
});
