//Mock implementation for loader.js to allow testing router in isolation

export const loadHTMLmock = (url) => {
   if (url === "test-page.html") {
      const pageWrapper = document.createElement("div");
      pageWrapper.innerHTML = `<div data-component="test-component"></div>`;
      return Promise.resolve(pageWrapper);
   } else if (url === "test-component.html") {
      const compWrapper = document.createElement("div");
      compWrapper.innerHTML = `
        <template id="test-component">
            <span id="inner">Hello from component!</span>
        </template>
        `;
      return Promise.resolve(compWrapper);
   } else if (url === "no-template-component.html") {
      const compWrapper = document.createElement("div");
      compWrapper.innerHTML = `<div>No Template Here</div>`;
      return Promise.resolve(compWrapper);
   } else if (url === "simple-page.html") {
      const pageWrapper = document.createElement("div");
      pageWrapper.innerHTML = `<div>Simple page content</div>`;
      return Promise.resolve(pageWrapper);
   } else if (url === "broken.html") {
      return Promise.reject(new Error("Failed to load HTML from broken.html: Not Found"));
   } else {
      return Promise.reject(new Error(`Failed to load HTML from ${url}: Not Found`));
   }
};
