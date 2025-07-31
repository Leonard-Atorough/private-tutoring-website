export async function loadHTML(url) {
   let response = await fetch(url);
   if (!response.ok) {
      throw new Error(`Failed to load HTML from ${url}: ${response.statusText}`);
   }
   const wrapper = document.createElement("div");
   wrapper.classList.add("column")
   const text = await response.text();
   wrapper.innerHTML = text;
   return wrapper;
}
