import logger from "../../logger.js";
import { attachScrollHandler } from "./scrollUtility.js";

/**
 * Initialize scroll links - handles smooth scrolling to page sections
 * Attaches click handlers to all elements with the 'jump-link' class
 */
export function initScrollLinks() {
  const document_ = document.documentElement;
  attachScrollHandler(document_, "a.jump-link");
  logger.info("Scroll links initialized successfully");
}
