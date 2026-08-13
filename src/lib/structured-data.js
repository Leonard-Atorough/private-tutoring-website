/**
 * @typedef {Object} PricingTier
 * @property {number} [price]
 * @property {string} [name]
 * @property {string} [description]
 *
 * @typedef {Object} FAQItem
 * @property {string} [question]
 * @property {string} [answer]
 */
const stripHtml = (value = "") =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export function buildSiteStructuredData(
  /** @type {{
   *   pricingTiers?: PricingTier[],
   *   faqItems?: FAQItem[],
   *   includeFaq?: boolean
   * }} */
  { pricingTiers = [], faqItems = [], includeFaq = false } = {},
) {
  const minPrice = pricingTiers.length
    ? Math.min(...pricingTiers.map((tier) => Number(tier.price) || 0))
    : 0;
  const maxPrice = pricingTiers.length
    ? Math.max(...pricingTiers.map((tier) => Number(tier.price) || 0))
    : 0;

  const graph = [
    {
      "@type": "OnlineBusiness",
      "@id": "https://kailistacey.com/#Services",
      name: "Kaili Stacey Tutoring",
      url: "https://kailistacey.com",
      description:
        "Personalized, online, 1-on-1 math and science tutoring for secondary and university students.",
      ...(pricingTiers.length ? { priceRange: `$${minPrice}-$${maxPrice}` } : {}),
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "5.0",
        reviewCount: "4",
      },
      provider: {
        "@type": "Person",
        "@id": "https://kailistacey.com/#About",
        name: "Kaili Stacey",
        jobTitle: "Private Tutor",
        description: "PhD holder in Nanochemistry with over 8 years of teaching experience",
        hasCredential: {
          "@type": "EducationalOccupationalCredential",
          credentialCategory: "PhD",
          name: "Doctor of Philosophy in Nanochemistry",
        },
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Tutoring Services",
        itemListElement: pricingTiers.map((tier) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: tier.name,
            description: tier.description,
          },
          price: String(tier.price),
          priceCurrency: "AUD",
          areaServed: { "@type": "Country", name: "Australia" },
        })),
      },
      image: "https://kailistacey.com/assets/profile_picture-B-qzfGwM.webp",
      areaServed: {
        "@type": "Country",
        name: "Australia",
      },
    },
    // Uncomment the following block if you want to include contact information in the structured data
    // {
    //   "@type": "ContactPoint",
    //   telephone: "+1-555-555-5555",
    //   contactType: "Customer Service",
    //   areaServed: {
    //     "@type": "Country",
    //     name: "Australia",
    //   },
    //   availableLanguage: ["English"],
    //   email: "kailistacey@gmail.com",
    // },
  ];

  if (includeFaq && faqItems.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: stripHtml(item.answer),
        },
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
