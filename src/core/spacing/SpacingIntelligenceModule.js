import { Evidence } from "../models/Evidence.js";
import { ConfidenceEngine } from "../engines/ConfidenceEngine.js";

export class SpacingIntelligenceModule {
  initialize() {
    this.spacingRegistry = {
      margins: [],
      paddings: [],
      gaps: [],
      containerWidths: [],
      spacingScale: [],
      repeatedValues: {},
      buttonPadding: null,
      inputPadding: null,
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
   * Scan active spacing structures and compile tokens.
   * @param {import('../ScanSession').ScanSession} session
   * @returns {Promise<object>} Spacing Registry
   */
  async scan(session) {
    const nodeRegistry = session.data.nodeRegistry;
    const styleRegistry = session.data.styleRegistry;
    if (!nodeRegistry || !styleRegistry) {
      return this.spacingRegistry;
    }

    const valueFrequencies = new Map();
    const uniqueMargins = new Set();
    const uniquePaddings = new Set();
    const uniqueGaps = new Set();
    const uniqueWidths = new Set();

    const moduleEvidences = [];

    const addFreq = (val) => {
      if (!val || val === "0px" || val === "auto" || val === "normal") return;
      valueFrequencies.set(val, (valueFrequencies.get(val) || 0) + 1);
    };

    for (const [nodeId, snapshot] of nodeRegistry.entries()) {
      const styles = styleRegistry.get(nodeId);
      if (!styles || !styles.computedStyles) continue;

      const comp = styles.computedStyles;
      const mt = comp["margin-top"] || "";
      const mr = comp["margin-right"] || "";
      const mb = comp["margin-bottom"] || "";
      const ml = comp["margin-left"] || "";

      const pt = comp["padding-top"] || "";
      const pr = comp["padding-right"] || "";
      const pb = comp["padding-bottom"] || "";
      const pl = comp["padding-left"] || "";

      const gap = comp["gap"] || "";
      const width = comp["width"] || "";

      addFreq(mt); addFreq(mr); addFreq(mb); addFreq(ml);
      addFreq(pt); addFreq(pr); addFreq(pb); addFreq(pl);
      addFreq(gap);

      if (mt && mt !== "0px" && mt !== "auto") uniqueMargins.add(mt);
      if (pt && pt !== "0px") uniquePaddings.add(pt);
      if (gap && gap !== "normal" && gap !== "0px") uniqueGaps.add(gap);
      if (width && width.endsWith("px") && parseFloat(width) > 200) uniqueWidths.add(width);

      // Button / Input specific padding detection
      const tag = snapshot.tag.toLowerCase();
      if (tag === "button" || snapshot.accessibility.role === "button") {
        this.spacingRegistry.buttonPadding = `${pt} ${pr} ${pb} ${pl}`;
      } else if (tag === "input" || tag === "textarea") {
        this.spacingRegistry.inputPadding = `${pt} ${pr} ${pb} ${pl}`;
      }
    }

    const sortedFreqs = Array.from(valueFrequencies.entries()).sort((a, b) => b[1] - a[1]);

    this.spacingRegistry.spacingScale = sortedFreqs.slice(0, 10).map(e => e[0]);
    this.spacingRegistry.margins = Array.from(uniqueMargins).slice(0, 8);
    this.spacingRegistry.paddings = Array.from(uniquePaddings).slice(0, 8);
    this.spacingRegistry.gaps = Array.from(uniqueGaps).slice(0, 8);
    this.spacingRegistry.containerWidths = Array.from(uniqueWidths).slice(0, 4);

    for (const [val, count] of sortedFreqs.slice(0, 5)) {
      this.spacingRegistry.repeatedValues[val] = count;
      moduleEvidences.push(new Evidence("Computed Style", val, 90, `Spacing size used ${count} times`));
    }

    // Confidence
    const confidenceCalc = ConfidenceEngine.calculate(moduleEvidences);
    this.spacingRegistry.confidence = {
      score: confidenceCalc.score,
      evidenceCount: moduleEvidences.length,
      evidenceSources: Array.from(new Set(moduleEvidences.map(e => e.origin))),
      conflictCount: 0,
      unknownFields: []
    };

    session.data.spacingRegistry = this.spacingRegistry;
    session.data.evidences = (session.data.evidences || []).concat(moduleEvidences);

    return this.spacingRegistry;
  }

  validate(data) {
    return typeof data === "object" && data.spacingScale !== undefined;
  }

  cleanup() {}
  destroy() {}
}
