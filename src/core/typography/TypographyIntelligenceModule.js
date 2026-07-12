import { Evidence } from "../models/Evidence.js";
import { ConfidenceEngine } from "../engines/ConfidenceEngine.js";

export class TypographyIntelligenceModule {
  initialize() {
    this.typographyRegistry = {
      primaryFontFamily: "Unknown",
      secondaryFontFamily: "Unknown",
      monospaceFont: "Unknown",
      fallbackFonts: [],
      fontSizes: [],
      fontWeights: [],
      lineHeights: [],
      letterSpacings: [],
      headingHierarchy: {},
      bodyHierarchy: {},
      buttonTypography: null,
      navigationTypography: null,
      confidence: {
        score: 0,
        evidenceCount: 0,
        evidenceSources: [],
        conflictCount: 0,
        unknownFields: ["primaryFontFamily", "secondaryFontFamily"]
      }
    };
  }

  /**
   * Scan active typography details.
   * @param {import('../ScanSession').ScanSession} session
   * @returns {Promise<object>}
   */
  async scan(session) {
    const nodeRegistry = session.data.nodeRegistry;
    const styleRegistry = session.data.styleRegistry;
    if (!nodeRegistry || !styleRegistry) {
      return this.typographyRegistry;
    }

    const fontFrequencies = new Map();
    const sizes = new Set();
    const weights = new Set();
    const heights = new Set();
    const spacings = new Set();
    
    const headingSizes = {};
    const bodySizes = {};

    let totalNodes = 0;
    const moduleEvidences = [];

    for (const [nodeId, snapshot] of nodeRegistry.entries()) {
      const styles = styleRegistry.get(nodeId);
      if (!styles || !styles.computedStyles) continue;

      totalNodes++;
      const comp = styles.computedStyles;
      const font = comp["font-family"] || "";
      const size = comp["font-size"] || "";
      const weight = comp["font-weight"] || "";
      const height = comp["line-height"] || "";
      const spacing = comp["letter-spacing"] || "";

      // Frequency calculation
      if (font && font !== "initial" && font !== "inherit") {
        // Clean font names
        const family = font.split(",")[0].replace(/['"]/g, "").trim();
        fontFrequencies.set(family, (fontFrequencies.get(family) || 0) + 1);
      }

      if (size) sizes.add(size);
      if (weight) weights.add(weight);
      if (height) heights.add(height);
      if (spacing) spacings.add(spacing);

      // Hierarchy details
      const tag = snapshot.tag.toLowerCase();
      if (/^h[1-6]$/.test(tag)) {
        headingSizes[tag] = headingSizes[tag] || new Set();
        headingSizes[tag].add(size);
      } else if (tag === "p") {
        bodySizes["p"] = bodySizes["p"] || new Set();
        bodySizes["p"].add(size);
      }
    }

    // Sort fonts by frequency
    const sortedFonts = Array.from(fontFrequencies.entries()).sort((a, b) => b[1] - a[1]);
    
    if (sortedFonts.length > 0) {
      this.typographyRegistry.primaryFontFamily = sortedFonts[0][0];
      moduleEvidences.push(new Evidence("Computed Style", this.typographyRegistry.primaryFontFamily, 100, `Dominant font family (used in ${sortedFonts[0][1]} nodes)`));
    }
    if (sortedFonts.length > 1) {
      this.typographyRegistry.secondaryFontFamily = sortedFonts[1][0];
      moduleEvidences.push(new Evidence("Computed Style", this.typographyRegistry.secondaryFontFamily, 95, `Secondary font family (used in ${sortedFonts[1][1]} nodes)`));
    }

    // Monospace detection
    const monoFont = sortedFonts.find(([font]) => /mono|courier|consolas|code/i.test(font));
    if (monoFont) {
      this.typographyRegistry.monospaceFont = monoFont[0];
      moduleEvidences.push(new Evidence("Computed Style", monoFont[0], 100, `Monospace font detected: "${monoFont[0]}"`));
    }

    this.typographyRegistry.fontSizes = Array.from(sizes).sort((a, b) => parseFloat(a) - parseFloat(b));
    this.typographyRegistry.fontWeights = Array.from(weights).sort((a, b) => parseFloat(a) - parseFloat(b));
    this.typographyRegistry.lineHeights = Array.from(heights);
    this.typographyRegistry.letterSpacings = Array.from(spacings);

    // Populate hierarchies
    for (const [tag, set] of Object.entries(headingSizes)) {
      this.typographyRegistry.headingHierarchy[tag] = Array.from(set)[0] || "";
    }
    this.typographyRegistry.bodyHierarchy["p"] = Array.from(bodySizes["p"] || [])[0] || "";

    // Generate confidence
    const confidenceCalc = ConfidenceEngine.calculate(moduleEvidences);
    
    const unknownFields = [];
    if (this.typographyRegistry.primaryFontFamily === "Unknown") unknownFields.push("primaryFontFamily");
    if (this.typographyRegistry.secondaryFontFamily === "Unknown") unknownFields.push("secondaryFontFamily");

    this.typographyRegistry.confidence = {
      score: confidenceCalc.score,
      evidenceCount: moduleEvidences.length,
      evidenceSources: Array.from(new Set(moduleEvidences.map(e => e.origin))),
      conflictCount: sortedFonts.length > 3 ? 1 : 0,
      unknownFields
    };

    // Save output
    session.data.typographyRegistry = this.typographyRegistry;
    session.data.evidences = (session.data.evidences || []).concat(moduleEvidences);

    return this.typographyRegistry;
  }

  validate(data) {
    return typeof data === "object" && data.primaryFontFamily !== undefined;
  }

  cleanup() {}
  destroy() {}
}
