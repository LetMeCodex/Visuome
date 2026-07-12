import { VisualLanguageAnalyzerInterface } from "./VisualLanguageAnalyzerInterface.js";

export class RhythmAnalyzer extends VisualLanguageAnalyzerInterface {
  name() { return "RhythmAnalyzer"; }
  version() { return "1.1.0"; }
  dependencies() { return ["spacingRegistry", "layoutRegistry"]; }

  /**
   * Measure layout margins, paddings, and grid alignments to determine visual rhythm.
   * @param {object} scanResult
   * @param {object} rules
   * @param {object} cache
   * @returns {Promise<object>} visualRhythm result.
   */
  async analyze(scanResult, rules, cache) {
    const spacingReg = scanResult.spacingRegistry || {};
    const layoutReg = scanResult.layoutRegistry || {};
    
    const uniquePaddings = spacingReg.paddings?.length || 0;
    const uniqueMargins = spacingReg.margins?.length || 0;
    const uniqueGaps = spacingReg.gaps?.length || 0;
    const spacingScale = spacingReg.spacingScale?.length || 0;

    const repeats = Object.keys(spacingReg.repeatedValues || {}).length;
    const gridCount = layoutReg.gridLayoutCount || 0;

    let score = 40 + (repeats * 8) + (gridCount * 5) - (uniquePaddings * 2);
    score = Math.max(0, Math.min(100, Math.round(score)));

    const evidence = [
      `Repeating spacing units: ${repeats}`,
      `Unique paddings count: ${uniquePaddings}`,
      `Unique margins count: ${uniqueMargins}`,
      `Unique layout gaps count: ${uniqueGaps}`,
      `Structured CSS Grid count: ${gridCount}`
    ];

    const contradictions = [];
    if (repeats === 0 && spacingScale > 5) {
      contradictions.push("Large spacing scale cataloged, but zero repeating values found (no unified grid).");
    }

    return {
      visualRhythm: {
        score,
        confidence: repeats > 0 ? 90 : 50,
        evidence,
        contradictions,
        reasoning: `Visual rhythm of ${score} inferred from repeating space patterns (${repeats}) and layout grids (${gridCount}).`,
        diagnostics: {
          repeats,
          uniquePaddings,
          uniqueMargins,
          uniqueGaps,
          gridCount
        }
      }
    };
  }
}
