import { VisualLanguageAnalyzerInterface } from "./VisualLanguageAnalyzerInterface.js";

export class ConsistencyAnalyzer extends VisualLanguageAnalyzerInterface {
  name() { return "ConsistencyAnalyzer"; }
  version() { return "1.1.0"; }
  dependencies() { return ["typographyRegistry", "colorRegistry", "spacingRegistry", "componentRegistry"]; }

  /**
   * Compare buttons, spacing variants, font sizes, and borders to compute Consistency.
   * @param {object} scanResult
   * @param {object} rules
   * @param {object} cache
   * @returns {Promise<object>} designConsistency result.
   */
  async analyze(scanResult, rules, cache) {
    const typoReg = scanResult.typographyRegistry || {};
    const colorReg = scanResult.colorRegistry || {};
    const spacingReg = scanResult.spacingRegistry || {};
    const compReg = scanResult.componentRegistry || {};

    const uniqueFonts = typoReg.fontSizes?.length || 0;
    const uniqueColors = colorReg.dominantPalette?.length || 0;
    const uniquePaddings = spacingReg.paddings?.length || 0;
    const buttons = compReg.components?.filter(c => c.type === "Button") || [];

    let buttonRadiusConsistency = 100;
    if (buttons.length > 1) {
      const radii = new Set(buttons.map(b => b.styleRef?.borderRadius || ""));
      if (radii.size > 1) {
        buttonRadiusConsistency = Math.round(100 - (radii.size * 15));
      }
    }

    let score = 100 - (uniqueFonts * 3) - (uniqueColors * 2) - (uniquePaddings * 2);
    if (buttons.length > 1) {
      score = (score + buttonRadiusConsistency) / 2;
    }
    score = Math.max(0, Math.min(100, Math.round(score)));

    const evidence = [
      `Typography sizes: ${uniqueFonts}`,
      `Color palette size: ${uniqueColors}`,
      `Spacing padding levels: ${uniquePaddings}`,
      `Button styling radius consistency: ${buttonRadiusConsistency}%`
    ];

    const contradictions = [];
    if (uniqueFonts > 8 && buttonRadiusConsistency === 100) {
      contradictions.push("Highly consistent button treatments, but typography has massive size variation.");
    }

    return {
      designConsistency: {
        score,
        confidence: uniqueFonts > 0 ? 95 : 60,
        evidence,
        contradictions,
        reasoning: `Consistency rating of ${score} calculated from typography scale (${uniqueFonts}) and spacing scale variance.`,
        diagnostics: {
          uniqueFonts,
          uniqueColors,
          uniquePaddings,
          buttonRadiusConsistency
        }
      }
    };
  }
}
