import { VisualLanguageAnalyzerInterface } from "./VisualLanguageAnalyzerInterface.js";

export class VisualWeightAnalyzer extends VisualLanguageAnalyzerInterface {
  name() { return "VisualWeightAnalyzer"; }
  version() { return "1.1.0"; }
  dependencies() { return ["colorRegistry", "typographyRegistry", "styleRegistry", "componentRegistry"]; }

  /**
   * Assess borders, shadows, typographic prominence, and colors to compute Visual Weight.
   * @param {object} scanResult
   * @param {object} rules
   * @param {object} cache
   * @returns {Promise<object>} visualWeight result.
   */
  async analyze(scanResult, rules, cache) {
    const colorReg = scanResult.colorRegistry || {};
    const typoReg = scanResult.typographyRegistry || {};
    
    const uniqueColorsCount = colorReg.dominantPalette?.length || 0;
    const fontSizesCount = typoReg.fontSizes?.length || 0;
    
    let shadowCount = 0;
    let borderCount = 0;
    
    if (scanResult.styleRegistry) {
      for (const styles of scanResult.styleRegistry.values()) {
        if (styles.computedStyles?.["box-shadow"] && styles.computedStyles["box-shadow"] !== "none") {
          shadowCount++;
        }
        if (styles.computedStyles?.["border-top-width"] && styles.computedStyles["border-top-width"] !== "0px") {
          borderCount++;
        }
      }
    }

    let score = 30 + (shadowCount * 2) + (fontSizesCount * 4) + Math.min(25, borderCount / 2);
    score = Math.max(0, Math.min(100, Math.round(score)));

    const evidence = [
      `Unique color palette size: ${uniqueColorsCount}`,
      `Font sizes cataloged: ${fontSizesCount}`,
      `Nodes with active shadow styling: ${shadowCount}`,
      `Nodes with active border outlines: ${borderCount}`
    ];

    const contradictions = [];
    if (shadowCount > 20 && borderCount > 20) {
      contradictions.push("High shadow count alongside high border count conflicts with modern flat styles.");
    }

    return {
      visualWeight: {
        score,
        confidence: fontSizesCount > 0 ? 90 : 50,
        evidence,
        contradictions,
        reasoning: `Visual weight score of ${score} derived from shadow styling count (${shadowCount}) and outline occurrences (${borderCount}).`,
        diagnostics: {
          shadowCount,
          borderCount,
          fontSizesCount,
          uniqueColorsCount
        }
      }
    };
  }
}
