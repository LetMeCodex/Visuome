import { VisualLanguageAnalyzerInterface } from "./VisualLanguageAnalyzerInterface.js";

export class HierarchyAnalyzer extends VisualLanguageAnalyzerInterface {
  name() { return "HierarchyAnalyzer"; }
  version() { return "1.1.0"; }
  dependencies() { return ["typographyRegistry", "componentRegistry", "nodeRegistry"]; }

  /**
   * Assess typographic scale step progressions and button/CTA focal dominance.
   * @param {object} scanResult
   * @param {object} rules
   * @param {object} cache
   * @returns {Promise<object>} hierarchyStrength result.
   */
  async analyze(scanResult, rules, cache) {
    const typoReg = scanResult.typographyRegistry || {};
    const compReg = scanResult.componentRegistry || {};
    
    const headingTypes = Object.keys(typoReg.headingHierarchy || {}).length;
    const fontSizesCount = typoReg.fontSizes?.length || 0;
    
    const buttons = compReg.components?.filter(c => c.type === "Button") || [];
    let ctaDominance = 50;
    if (buttons.length > 0) {
      const heavyButtons = buttons.filter(b => parseInt(b.typographyRef?.fontWeight) >= 600);
      ctaDominance = Math.round(50 + (heavyButtons.length / buttons.length) * 40);
    }

    let score = 40 + (headingTypes * 8) + (fontSizesCount * 3) + (ctaDominance / 5);
    score = Math.max(0, Math.min(100, Math.round(score)));

    const evidence = [
      `Heading hierarchy steps: ${headingTypes}`,
      `Distinct font sizes: ${fontSizesCount}`,
      `Button CTA count: ${buttons.length}`,
      `CTA typography dominance: ${ctaDominance}%`
    ];

    const contradictions = [];
    if (headingTypes === 0 && fontSizesCount > 8) {
      contradictions.push("No explicit heading tags found, but typography sizes suggest custom styling tags.");
    }

    return {
      hierarchyStrength: {
        score,
        confidence: headingTypes > 0 ? 95 : 60,
        evidence,
        contradictions,
        reasoning: `Hierarchy strength of ${score} based on headings density (${headingTypes}) and CTA dominance (${ctaDominance}%).`,
        diagnostics: {
          headingTypes,
          fontSizesCount,
          buttonsCount: buttons.length,
          ctaDominance
        }
      }
    };
  }
}
