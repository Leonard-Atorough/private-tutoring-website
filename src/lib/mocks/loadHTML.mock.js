//Mock implementation for loader.js to allow testing router in isolation

export const loadHTMLMock = (url) => {
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
   } else if (url === "home.html") {
      const pageWrapper = document.createElement("div");
      pageWrapper.innerHTML = `<div>Home page loaded as default</div>`;
      return Promise.resolve(pageWrapper);
   } else {
      return Promise.reject(new Error(`Failed to load HTML from ${url}: Not Found`));
   }
};

export const loadHeaderFooterHTMLMock = (url) => {
   if (url === "layout/header.html") {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = `
        <template id="header-template">
            <header>
            <button id="menu-toggle"></button>
            <h1 id="header">Hello from header!</h1>
            </header>
        </template>
        `;
      return Promise.resolve(wrapper);
   } else if (url === "layout/footer.html") {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = `
        <template id="footer-template">
            <footer id="footer">Hello from footer!</footer>
        </template>
        `;
      return Promise.resolve(wrapper);
   }
};
