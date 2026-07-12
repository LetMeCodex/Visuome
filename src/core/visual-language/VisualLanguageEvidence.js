/**
 * Groups and aggregates low-level observations into higher-level visual language evidence buckets.
 * Never creates new observations.
 */
export class VisualLanguageEvidence {
  /**
   * Aggregate low-level evidences from Volume 2 into high-level Visual Language evidence groups.
   * @param {Array<object>} lowLevelEvidences
   * @returns {object} High-level visual evidence groups
   */
  static aggregate(lowLevelEvidences = []) {
    const typographyEv = [];
    const colorEv = [];
    const spacingEv = [];
    const layoutEv = [];
    const componentEv = [];

    for (const ev of lowLevelEvidences) {
      const desc = `${ev.relatedNode || ""} ${ev.observedProperty || ""}`.toLowerCase();
      if (desc.includes("font") || desc.includes("typography") || ev.origin === "Typography") {
        typographyEv.push(ev);
      } else if (desc.includes("color") || desc.includes("background") || desc.includes("theme") || ev.origin === "Color") {
        colorEv.push(ev);
      } else if (desc.includes("padding") || desc.includes("margin") || desc.includes("gap") || desc.includes("spacing") || ev.origin === "Spacing") {
        spacingEv.push(ev);
      } else if (desc.includes("display") || desc.includes("layout") || desc.includes("position") || ev.origin === "Layout") {
        layoutEv.push(ev);
      } else {
        componentEv.push(ev);
      }
    }

    return {
      hierarchyEvidence: {
        score: typographyEv.length > 0 ? 80 : 0,
        lowLevelCount: typographyEv.length,
        sources: Array.from(new Set(typographyEv.map(e => e.source || e.origin))),
        summary: `Aggregated typography and hierarchy evidence containing ${typographyEv.length} items.`
      },
      colorSystemEvidence: {
        score: colorEv.length > 0 ? 85 : 0,
        lowLevelCount: colorEv.length,
        sources: Array.from(new Set(colorEv.map(e => e.source || e.origin))),
        summary: `Aggregated color system and tone evidence containing ${colorEv.length} items.`
      },
      spatialEvidence: {
        score: spacingEv.length > 0 ? 90 : 0,
        lowLevelCount: spacingEv.length,
        sources: Array.from(new Set(spacingEv.map(e => e.source || e.origin))),
        summary: `Aggregated layout spacing and grid evidence containing ${spacingEv.length} items.`
      },
      layoutEvidence: {
        score: layoutEv.length > 0 ? 80 : 0,
        lowLevelCount: layoutEv.length,
        sources: Array.from(new Set(layoutEv.map(e => e.source || e.origin))),
        summary: `Aggregated composition and flow evidence containing ${layoutEv.length} items.`
      },
      componentEvidence: {
        score: componentEv.length > 0 ? 75 : 0,
        lowLevelCount: componentEv.length,
        sources: Array.from(new Set(componentEv.map(e => e.source || e.origin))),
        summary: `Aggregated functional component classification evidence containing ${componentEv.length} items.`
      }
    };
  }
}
