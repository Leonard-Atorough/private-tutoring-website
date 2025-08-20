/**
 * @vitest-environment jsdom
 */
import { vi, it, expect, beforeEach, afterEach, describe } from "vitest";
import { toggleNavMenu } from "./header.js"

document.body.innerHTML = `
    <div class="main-content">
        <nav class="nav-menu"><nav>
    </div>`;

describe("toggleNavMenu", () => {
    it("adds the class 'active' to the class list of the first element with a class name of 'nav-menu'", () => {
        toggleNavMenu();
        const nav = document.querySelector("nav");
        expect(nav.classList).toContain("active")
    })
})