/**
 * Converts discovered DOM structures into reusable component nodes in the knowledge graph.
 */
export class ComponentGraphBuilder {
  initialize() {}

  /**
   * Scan active page elements to construct Component Graph nodes.
   * @param {import('../ScanSession').ScanSession} session
   * @returns {Promise<Array<object>>} Mapped Component nodes.
   */
  async scan(session) {
    const nodes = [];
    const pageId = window.location.href;

    const queryMap = {
      Hero: "header[class*='hero'], section[class*='hero'], div[class*='hero']",
      Navigation: "nav",
      Sidebar: "aside, .sidebar",
      Footer: "footer",
      Header: "header",
      Section: "section",
      Container: "main, .container, .wrapper",
      Card: ".card, [class*='card']",
      Button: "button, .btn, .button, [role='button']",
      CTA: "[class*='cta'], [class*='call-to-action']",
      Form: "form",
      Input: "input, select, textarea",
      Modal: ".modal, .dialog, [role='dialog']",
      Accordion: ".accordion, details",
      Tabs: "[role='tablist']",
      Table: "table",
      Chart: ".chart, canvas[class*='chart']",
      Carousel: ".carousel, .slider",
      Gallery: ".gallery, [class*='gallery']",
      "Pricing Block": "[class*='pricing']",
      FAQ: "[class*='faq']",
      Testimonial: "[class*='testimonial']",
      "Feature Block": "[class*='feature']",
      "Statistics Block": "[class*='stat']",
      Timeline: "[class*='timeline']"
    };

    let counter = 0;
    for (const [type, selector] of Object.entries(queryMap)) {
      try {
        const elements = document.querySelectorAll(selector);
        for (const el of elements) {
          if (nodes.length >= 100) break;
          const id = `comp-${type.toLowerCase().replace(/\s+/g, '-')}-${counter++}`;
          nodes.push({
            id,
            type,
            selector: selector,
            pageId,
            sectionId: el.closest("section")?.id || null,
            parentId: el.parentElement?.closest("[role]")?.id || null,
            children: Array.from(el.children).map((c, i) => `child-${i}`),
            relationships: [],
            confidence: {
              score: 95,
              factors: ["Selector matching query selector rules"]
            },
            evidence: [el.tagName.toLowerCase()]
          });
        }
      } catch {}
    }

    return nodes;
  }

  validate(data) {
    return Array.isArray(data);
  }

  cleanup() {}
  destroy() {}
}
