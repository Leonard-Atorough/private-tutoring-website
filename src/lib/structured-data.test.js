import { describe, expect, it } from "vitest";
import { buildSiteStructuredData } from "./structured-data.js";

describe("buildSiteStructuredData", () => {
  it("omits FAQPage when not explicitly included", () => {
    const data = buildSiteStructuredData({
      pricingTiers: [{ price: 70 }, { price: 100 }],
      faqItems: [{ question: "Question?", answer: "<p>Answer</p>" }],
      includeFaq: false,
    });

    expect(data["@graph"].some((node) => node["@type"] === "FAQPage")).toBe(false);
  });

  it("includes FAQPage data only when the FAQ is rendered on the page", () => {
    const data = buildSiteStructuredData({
      pricingTiers: [{ price: 70 }, { price: 100 }],
      faqItems: [{ question: "Question?", answer: "<p>Answer</p>" }],
      includeFaq: true,
    });

    const faqNode = data["@graph"].find((node) => node["@type"] === "FAQPage");

    expect(faqNode).toBeDefined();
    expect(faqNode.mainEntity[0].name).toBe("Question?");
    expect(faqNode.mainEntity[0].acceptedAnswer.text).toBe("Answer");
  });
});
