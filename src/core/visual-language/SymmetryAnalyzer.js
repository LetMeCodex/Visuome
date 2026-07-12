import { VisualLanguageAnalyzerInterface } from "./VisualLanguageAnalyzerInterface.js";

export class SymmetryAnalyzer extends VisualLanguageAnalyzerInterface {
  name() { return "SymmetryAnalyzer"; }
  version() { return "1.1.0"; }
  dependencies() { return ["nodeRegistry", "layoutRegistry"]; }

  /**
   * Evaluate horizontal balances, coordinates, grid distribution and symmetry equilibrium.
   * @param {object} scanResult
   * @param {object} rules
   * @param {object} cache
   * @returns {Promise<object>} symmetryScore result.
   */
  async analyze(scanResult, rules, cache) {
    const nodes = Array.from(scanResult.nodeRegistry?.values() || []);
    const layoutReg = scanResult.layoutRegistry || {};

    const gridCount = layoutReg.gridLayoutCount || 0;
    const flexCount = layoutReg.flexLayoutCount || 0;

    let balancedCount = 0;
    let asymmetricCount = 0;

    for (const node of nodes) {
      if (node.boundingBox) {
        const xCenter = node.boundingBox.x + (node.boundingBox.width / 2);
        if (Math.abs(xCenter - 720) < 150) {
          balancedCount++;
        } else {
          asymmetricCount++;
        }
      }
    }

    let score = 50 + (gridCount * 6) + (balancedCount / Math.max(1, nodes.length) * 30) - (asymmetricCount / Math.max(1, nodes.length) * 10);
    score = Math.max(0, Math.min(100, Math.round(score)));

    const evidence = [
      `CSS Grid alignments: ${gridCount}`,
      `Flexbox alignments: ${flexCount}`,
      `Horizontal balanced center nodes: ${balancedCount}`,
      `Asymmetrical offset nodes: ${asymmetricCount}`
    ];

    const contradictions = [];
    if (gridCount > 5 && asymmetricCount > (nodes.length * 0.7)) {
      contradictions.push("High grid usage but layout items are heavily skewed asymmetrical.");
    }

    return {
      symmetryScore: {
        score,
        confidence: nodes.length > 10 ? 85 : 50,
        evidence,
        contradictions,
        reasoning: `Symmetry rating of ${score} based on grid structures (${gridCount}) and coordinate distribution.`,
        diagnostics: {
          gridCount,
          flexCount,
          balancedCount,
          asymmetricCount
        }
      }
    };
  }
}
