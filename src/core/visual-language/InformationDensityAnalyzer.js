import { VisualLanguageAnalyzerInterface } from "./VisualLanguageAnalyzerInterface.js";

export class InformationDensityAnalyzer extends VisualLanguageAnalyzerInterface {
  name() { return "InformationDensityAnalyzer"; }
  version() { return "1.1.0"; }
  dependencies() { return ["nodeRegistry", "componentRegistry", "spacingRegistry"]; }

  /**
   * Analyze elements, nesting, and whitespace ratios to compute Information Density score.
   * @param {object} scanResult
   * @param {object} rules
   * @param {object} cache
   * @returns {Promise<object>} informationDensity result.
   */
  async analyze(scanResult, rules, cache) {
    const nodes = Array.from(scanResult.nodeRegistry?.values() || []);
    const totalNodes = nodes.length;
    
    if (totalNodes === 0) {
      return {
        informationDensity: {
          score: 0,
          confidence: 0,
          evidence: [],
          contradictions: ["No DOM nodes available to analyze."],
          reasoning: "No elements found.",
          diagnostics: {}
        }
      };
    }

    const totalDepth = nodes.reduce((sum, n) => sum + (n.domDepth || 0), 0);
    const avgDepth = parseFloat((totalDepth / totalNodes).toFixed(2));

    const componentsCount = scanResult.componentRegistry?.components?.length || 0;
    const componentRatio = parseFloat(((componentsCount / totalNodes) * 100).toFixed(1));

    const textNodesCount = nodes.filter(n => n.classes?.some(c => /text|title|desc|label/i.test(c))).length;
    const textDensity = parseFloat(((textNodesCount / totalNodes) * 100).toFixed(1));

    let score = Math.round((totalNodes / 20) + (avgDepth * 8) + (componentRatio * 1.5));
    score = Math.max(0, Math.min(100, score));

    const evidence = [
      `Total elements: ${totalNodes}`,
      `Average nesting depth: ${avgDepth}`,
      `Component ratio: ${componentRatio}%`
    ];

    const contradictions = [];
    if (score > 70 && componentRatio < 5) {
      contradictions.push("High node density but extremely low component count (unstructured content).");
    }

    return {
      informationDensity: {
        score,
        confidence: totalNodes > 50 ? 95 : 60,
        evidence,
        contradictions,
        reasoning: `Information density score of ${score} inferred from nesting depth (${avgDepth}) and element count (${totalNodes}).`,
        diagnostics: {
          totalNodes,
          avgDepth,
          componentRatio,
          textDensity
        }
      }
    };
  }
}
