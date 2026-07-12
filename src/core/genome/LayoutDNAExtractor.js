import { GenomeAnalyzerInterface } from "./GenomeAnalyzerInterface.js";

/**
 * Normalizes layout properties including grids, flex containers, alignments, flows, and structural densities.
 */
export class LayoutDNAExtractor extends GenomeAnalyzerInterface {
  async extract(scanResult) {
    const layout = scanResult.layoutRegistry || {};
    return {
      containers: layout.containers || [],
      sections: layout.sections || [],
      grid: layout.gridSystem || {},
      flex: layout.flexProperties || [],
      columns: layout.columnConfig || {},
      alignment: layout.alignmentUsage || {},
      flow: layout.documentFlow || "vertical",
      density: layout.elementDensity || "medium",
      symmetry: layout.layoutSymmetry || "balanced"
    };
  }

  name() {
    return "LayoutDNAExtractor";
  }

  version() {
    return "1.0.0";
  }

  dependencies() {
    return ["layoutRegistry"];
  }
}
