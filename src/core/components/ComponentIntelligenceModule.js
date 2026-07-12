import { Evidence } from "../models/Evidence.js";
import { ConfidenceEngine } from "../engines/ConfidenceEngine.js";

export class ComponentIntelligenceModule {
  initialize() {
    this.componentRegistry = {
      components: [],
      confidence: {
        score: 0,
        evidenceCount: 0,
        evidenceSources: [],
        conflictCount: 0,
        unknownFields: []
      }
    };
  }

  /**
   * Scan active page elements and classify their visual component roles.
   * @param {import('../ScanSession').ScanSession} session
   * @returns {Promise<object>} Component Registry
   */
  async scan(session) {
    const nodeRegistry = session.data.nodeRegistry;
    const styleRegistry = session.data.styleRegistry;
    if (!nodeRegistry || !styleRegistry) {
      return this.componentRegistry;
    }

    const moduleEvidences = [];
    const componentsList = [];

    for (const [nodeId, snapshot] of nodeRegistry.entries()) {
      const styles = styleRegistry.get(nodeId);
      if (!styles) continue;

      const role = snapshot.accessibility.role;
      const tag = snapshot.tag.toLowerCase();
      const id = snapshot.id;
      const classes = snapshot.classes;
      const identity = `${tag} ${role} ${id} ${classes.join(" ")}`.toLowerCase();

      let componentType = "Unknown";
      let componentConfidence = 50;

      if (tag === "button" || role === "button" || identity.includes("btn") || identity.includes("button")) {
        componentType = "Button";
        componentConfidence = 95;
      } else if (tag === "input" || tag === "textarea" || tag === "select") {
        componentType = "Input";
        componentConfidence = 95;
      } else if (tag === "nav" || role === "navigation" || identity.includes("navbar")) {
        componentType = "NavigationBar";
        componentConfidence = 90;
      } else if (tag === "footer") {
        componentType = "Footer";
        componentConfidence = 95;
      } else if (identity.includes("sidebar")) {
        componentType = "Sidebar";
        componentConfidence = 85;
      } else if (identity.includes("card") || identity.includes("tile")) {
        componentType = "Card";
        componentConfidence = 80;
      } else if (identity.includes("hero")) {
        componentType = "HeroSection";
        componentConfidence = 85;
      } else if (tag === "dialog" || role === "dialog" || identity.includes("modal")) {
        componentType = "Modal";
        componentConfidence = 90;
      } else if (identity.includes("badge")) {
        componentType = "Badge";
        componentConfidence = 85;
      } else if (identity.includes("chip") || identity.includes("pill") || identity.includes("tag")) {
        componentType = "Chip";
        componentConfidence = 80;
      } else if (identity.includes("avatar")) {
        componentType = "Avatar";
        componentConfidence = 85;
      } else if (tag === "img" || tag === "video" || identity.includes("media")) {
        componentType = "Media";
        componentConfidence = 80;
      }

      if (componentType !== "Unknown") {
        const compRecord = {
          id: `comp-${componentsList.length}`,
          nodeId,
          type: componentType,
          boundingBox: snapshot.boundingBox,
          parentId: snapshot.parentId,
          styleRef: {
            color: styles.computedStyles?.color || "",
            backgroundColor: styles.computedStyles?.["background-color"] || "",
            border: styles.computedStyles?.["border-top-width"] || ""
          },
          typographyRef: {
            fontFamily: styles.computedStyles?.["font-family"] || "",
            fontSize: styles.computedStyles?.["font-size"] || "",
            fontWeight: styles.computedStyles?.["font-weight"] || ""
          },
          spacingRef: {
            padding: styles.computedStyles?.["padding-top"] || "",
            margin: styles.computedStyles?.["margin-top"] || ""
          },
          confidence: componentConfidence
        };

        componentsList.push(compRecord);
        moduleEvidences.push(new Evidence("DOM", componentType, componentConfidence, `Identified component role on node "${nodeId}"`));
      }
    }

    this.componentRegistry.components = componentsList;

    const confidenceCalc = ConfidenceEngine.calculate(moduleEvidences);
    this.componentRegistry.confidence = {
      score: confidenceCalc.score,
      evidenceCount: moduleEvidences.length,
      evidenceSources: Array.from(new Set(moduleEvidences.map(e => e.origin))),
      conflictCount: 0,
      unknownFields: []
    };

    session.data.componentRegistry = this.componentRegistry;
    session.data.evidences = (session.data.evidences || []).concat(moduleEvidences);

    return this.componentRegistry;
  }

  validate(data) {
    return typeof data === "object" && data.components !== undefined;
  }

  cleanup() {}
  destroy() {}
}
