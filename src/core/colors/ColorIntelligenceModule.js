import { parseCssColor, rgbToHex, relativeLuminance, contrastRatio } from "../../utils/colorUtils.js";
import { Evidence } from "../models/Evidence.js";
import { ConfidenceEngine } from "../engines/ConfidenceEngine.js";

export class ColorIntelligenceModule {
  initialize() {
    this.colorRegistry = {
      primaryColors: [],
      secondaryColors: [],
      accentColors: [],
      surfaceColors: [],
      backgroundColors: [],
      textColors: [],
      borderColors: [],
      dominantPalette: [],
      contrastRatios: [],
      theme: "Light", // Dark / Light
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
   * Scan active page context and collect background, foreground, and border colors.
   * @param {import('../ScanSession').ScanSession} session
   * @returns {Promise<object>} Color Registry
   */
  async scan(session) {
    const nodeRegistry = session.data.nodeRegistry;
    const styleRegistry = session.data.styleRegistry;
    if (!nodeRegistry || !styleRegistry) {
      return this.colorRegistry;
    }

    const bgFrequencies = new Map();
    const textFrequencies = new Map();
    const borderFrequencies = new Map();

    const moduleEvidences = [];

    for (const [nodeId, snapshot] of nodeRegistry.entries()) {
      const styles = styleRegistry.get(nodeId);
      if (!styles || !styles.computedStyles) continue;

      const comp = styles.computedStyles;
      const bg = comp["background-color"] || "";
      const fg = comp["color"] || "";
      const border = comp["border-top-color"] || "";

      // Backgrounds
      const parsedBg = parseCssColor(bg);
      if (parsedBg && parsedBg.a > 0.04) {
        const hex = rgbToHex(parsedBg);
        bgFrequencies.set(hex, (bgFrequencies.get(hex) || 0) + 1);
      }

      // Text
      const parsedFg = parseCssColor(fg);
      if (parsedFg && parsedFg.a > 0.04) {
        const hex = rgbToHex(parsedFg);
        textFrequencies.set(hex, (textFrequencies.get(hex) || 0) + 1);
      }

      // Borders
      const parsedBorder = parseCssColor(border);
      if (parsedBorder && parsedBorder.a > 0.04 && comp["border-top-style"] !== "none") {
        const hex = rgbToHex(parsedBorder);
        borderFrequencies.set(hex, (borderFrequencies.get(hex) || 0) + 1);
      }
    }

    const sortedBgs = Array.from(bgFrequencies.entries()).sort((a, b) => b[1] - a[1]);
    const sortedFgs = Array.from(textFrequencies.entries()).sort((a, b) => b[1] - a[1]);
    const sortedBorders = Array.from(borderFrequencies.entries()).sort((a, b) => b[1] - a[1]);

    this.colorRegistry.backgroundColors = sortedBgs.slice(0, 5).map(e => e[0]);
    this.colorRegistry.textColors = sortedFgs.slice(0, 5).map(e => e[0]);
    this.colorRegistry.borderColors = sortedBorders.slice(0, 5).map(e => e[0]);

    const dominantColors = sortedBgs.slice(0, 8).map(e => e[0]);
    this.colorRegistry.dominantPalette = dominantColors;

    if (dominantColors.length > 0) {
      this.colorRegistry.primaryColors = [dominantColors[0]];
      moduleEvidences.push(new Evidence("Computed Style", dominantColors[0], 100, "Dominant background color"));
    }
    if (dominantColors.length > 1) {
      this.colorRegistry.secondaryColors = [dominantColors[1]];
      moduleEvidences.push(new Evidence("Computed Style", dominantColors[1], 95, "Secondary background color"));
    }

    // Determine Theme
    if (dominantColors.length > 0) {
      const parsedBg = parseCssColor(dominantColors[0]);
      if (parsedBg) {
        const lum = relativeLuminance(parsedBg);
        this.colorRegistry.theme = lum < 0.24 ? "Dark" : "Light";
        moduleEvidences.push(new Evidence("Computed Style", this.colorRegistry.theme, 100, `Luminance of dominant background is ${lum.toFixed(3)}`));
      }
    }

    // Calculate main text to main background contrast
    if (this.colorRegistry.backgroundColors.length > 0 && this.colorRegistry.textColors.length > 0) {
      const mainBg = this.colorRegistry.backgroundColors[0];
      const mainFg = this.colorRegistry.textColors[0];
      try {
        const ratio = contrastRatio(mainBg, mainFg);
        this.colorRegistry.contrastRatios.push({
          background: mainBg,
          foreground: mainFg,
          ratio: parseFloat(ratio.toFixed(2))
        });
        moduleEvidences.push(new Evidence("Accessibility", `${ratio.toFixed(1)}:1`, 90, `Contrast ratio between main BG (${mainBg}) and main text (${mainFg})`));
      } catch (err) {
        console.warn("Visuome ColorIntelligenceModule: Contrast calculation skipped", err);
      }
    }

    // Confidence
    const confidenceCalc = ConfidenceEngine.calculate(moduleEvidences);
    this.colorRegistry.confidence = {
      score: confidenceCalc.score,
      evidenceCount: moduleEvidences.length,
      evidenceSources: Array.from(new Set(moduleEvidences.map(e => e.origin))),
      conflictCount: 0,
      unknownFields: []
    };

    session.data.colorRegistry = this.colorRegistry;
    session.data.evidences = (session.data.evidences || []).concat(moduleEvidences);

    return this.colorRegistry;
  }

  validate(data) {
    return typeof data === "object" && data.dominantPalette !== undefined;
  }

  cleanup() {}
  destroy() {}
}
