import logger from "../../logger.js";

/**
 * Scroll to a specific section by ID
 * @param {string} sectionId - The ID of the target section
 */
export function scrollToSection(sectionId) {
  if (sectionId) {
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      logger.warn(`Target section not found: ${sectionId}`);
    }
  }
}

/**
 * Attach scroll handlers to links within a container
 * @param {Element} container - The container element with links
 * @param {string} linkSelector - CSS selector for the links (default: 'a.link')
 */
export function attachScrollHandler(container, linkSelector = "a.link") {
  if (!container) {
    logger.warn("Container not found for scroll handler attachment");
    return;
  }

  const links = container.querySelectorAll(linkSelector);

  Array.from(links).forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      // Only handle links that are internal anchors
      if (href && href.startsWith("#")) {
        event.preventDefault();
        const targetId = href.substring(1);
        scrollToSection(targetId);
      }
    });
  });

  logger.debug(`Attached scroll handlers to ${links.length} links`);
}
