import { RelationshipEdge } from "./RelationshipEdge.js";

/**
 * Maps relationships between discovered URL paths (parent, child, navigation, pagination, sibling, reference).
 */
export class RelationshipDiscoveryModule {
  initialize() {}

  /**
   * Generates graph edges based on site links.
   * @param {import('../ScanSession').ScanSession} session
   * @returns {Promise<Array<RelationshipEdge>>} List of relationship edges.
   */
  async scan(session) {
    const edges = [];
    const currentUrl = window.location.href;

    const websiteDiscovery = session.data.WebsiteDiscovery || {};
    const navigationDiscovery = session.data.NavigationDiscovery || {};

    const internalLinks = websiteDiscovery.internalLinks || [];

    for (const link of internalLinks) {
      let relType = "Reference";

      if (link.context === "navigation") {
        relType = "Navigation";
      } else if (navigationDiscovery.pagination?.some(p => p.url === link.url)) {
        relType = "Pagination";
      } else {
        try {
          const currentPath = new URL(currentUrl).pathname.split("/").filter(Boolean);
          const linkPath = new URL(link.url).pathname.split("/").filter(Boolean);

          if (linkPath.length === currentPath.length + 1 && link.url.startsWith(currentUrl)) {
            relType = "Child";
          } else if (linkPath.length === currentPath.length && linkPath.slice(0, -1).join("/") === currentPath.slice(0, -1).join("/")) {
            relType = "Sibling";
          } else if (currentPath.length === linkPath.length + 1 && currentUrl.startsWith(link.url)) {
            relType = "Parent";
          }
        } catch {}
      }

      edges.push(new RelationshipEdge({
        source: currentUrl,
        target: link.url,
        relationshipType: relType,
        confidence: {
          score: 95,
          factors: ["Url pattern heuristics matching"]
        },
        evidence: [link.text || "href reference link anchor text"]
      }));
    }

    return edges;
  }

  validate(data) {
    return Array.isArray(data);
  }

  cleanup() {}
  destroy() {}
}
