import { Evidence } from "../models/Evidence.js";
import { ConfidenceEngine } from "../engines/ConfidenceEngine.js";

export class LayoutIntelligenceModule {
  initialize() {
    this.layoutRegistry = {
      displayTypes: {},
      flexLayoutCount: 0,
      gridLayoutCount: 0,
      absoluteCount: 0,
      stickyCount: 0,
      fixedCount: 0,
      responsiveContainers: [],
      nestedLayoutCount: 0,
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
   * Scan page structures and compile layout styles.
   * @param {import('../ScanSession').ScanSession} session
   * @returns {Promise<object>} Layout Registry
   */
  async scan(session) {
    const nodeRegistry = session.data.nodeRegistry;
    const styleRegistry = session.data.styleRegistry;
    if (!nodeRegistry || !styleRegistry) {
      return this.layoutRegistry;
    }

    const displays = {};
    let flexCount = 0;
    let gridCount = 0;
    let absCount = 0;
    let stickCount = 0;
    let fixCount = 0;
    let nestedCount = 0;

    const moduleEvidences = [];

    for (const [nodeId, snapshot] of nodeRegistry.entries()) {
      const styles = styleRegistry.get(nodeId);
      if (!styles || !styles.computedStyles) continue;

      const comp = styles.computedStyles;
      const display = comp["display"] || "";
      const position = comp["position"] || "";

      if (display) {
        displays[display] = (displays[display] || 0) + 1;
        if (display === "flex") flexCount++;
        else if (display === "grid") gridCount++;
      }

      if (position) {
        if (position === "absolute") absCount++;
        else if (position === "sticky") stickCount++;
        else if (position === "fixed") fixCount++;
      }

      // Detect nested layout structures
      if ((display === "flex" || display === "grid") && snapshot.parentId) {
        const parentStyles = styleRegistry.get(snapshot.parentId);
        if (parentStyles && parentStyles.computedStyles) {
          const parentDisplay = parentStyles.computedStyles["display"] || "";
          if (parentDisplay === "flex" || parentDisplay === "grid") {
            nestedCount++;
          }
        }
      }
    }

    this.layoutRegistry.displayTypes = displays;
    this.layoutRegistry.flexLayoutCount = flexCount;
    this.layoutRegistry.gridLayoutCount = gridCount;
    this.layoutRegistry.absoluteCount = absCount;
    this.layoutRegistry.stickyCount = stickCount;
    this.layoutRegistry.fixedCount = fixCount;
    this.layoutRegistry.nestedLayoutCount = nestedCount;

    if (flexCount > 0) {
      moduleEvidences.push(new Evidence("Computed Style", `${flexCount} nodes`, 100, "Flexbox elements observed"));
    }
    if (gridCount > 0) {
      moduleEvidences.push(new Evidence("Computed Style", `${gridCount} nodes`, 100, "CSS Grid elements observed"));
    }
    if (stickCount > 0 || fixCount > 0) {
      moduleEvidences.push(new Evidence("Computed Style", `Sticky: ${stickCount}, Fixed: ${fixCount}`, 90, "Absolute layout constraints observed"));
    }

    // Confidence
    const confidenceCalc = ConfidenceEngine.calculate(moduleEvidences);
    this.layoutRegistry.confidence = {
      score: confidenceCalc.score,
      evidenceCount: moduleEvidences.length,
      evidenceSources: Array.from(new Set(moduleEvidences.map(e => e.origin))),
      conflictCount: 0,
      unknownFields: []
    };

    session.data.layoutRegistry = this.layoutRegistry;
    session.data.evidences = (session.data.evidences || []).concat(moduleEvidences);

    return this.layoutRegistry;
  }

  validate(data) {
    return typeof data === "object" && data.displayTypes !== undefined;
  }

  cleanup() {}
  destroy() {}
}
