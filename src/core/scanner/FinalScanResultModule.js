import { ScanResult } from "../models/ScanResult.js";

export class FinalScanResultModule {
  initialize() {}

  /**
   * Aggregate all registry pipelines into a final ScanResult payload.
   * @param {import('../ScanSession').ScanSession} session
   * @returns {Promise<ScanResult>} Final populated ScanResult object.
   */
  async scan(session) {
    const result = new ScanResult(session.url);
    
    session.endSession(true);
    result.complete(session.startTime);

    if (session.data.DOCUMENT_DISCOVERY) {
      const doc = session.data.DOCUMENT_DISCOVERY;
      result.metadata.pageTitle = doc.title || result.metadata.pageTitle;
      result.metadata.pageLanguage = doc.language || result.metadata.pageLanguage;
      result.metadata.direction = doc.direction || result.metadata.direction;
      result.metadata.theme = doc.theme || result.metadata.theme;
      if (doc.viewport) {
        result.metadata.viewport = doc.viewport;
      }
      result.metadata.devicePixelRatio = doc.devicePixelRatio || result.metadata.devicePixelRatio;
    }

    result.nodeRegistry = session.data.nodeRegistry || new Map();
    result.styleRegistry = session.data.styleRegistry || new Map();
    result.typographyRegistry = session.data.typographyRegistry || {};
    result.colorRegistry = session.data.colorRegistry || {};
    result.spacingRegistry = session.data.spacingRegistry || {};
    result.layoutRegistry = session.data.layoutRegistry || {};
    result.componentRegistry = session.data.componentRegistry || {};
    result.evidenceRegistry = session.data.evidences || [];
    result.diagnosticsRegistry = session.data.diagnosticsRegistry || {};
    result.confidenceSummary = session.data.confidenceSummary || {};
    result.conflictSummary = session.data.conflictSummary || {};

    const unknownValues = [];
    const collectUnknowns = (obj, path = "") => {
      if (!obj || typeof obj !== "object") return;
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key;
        if (value === "UNKNOWN" || value === "Unknown") {
          unknownValues.push(currentPath);
        } else if (typeof value === "object" && !(value instanceof Map)) {
          collectUnknowns(value, currentPath);
        }
      }
    };
    
    collectUnknowns(result.typographyRegistry, "typography");
    collectUnknowns(result.colorRegistry, "color");
    collectUnknowns(result.spacingRegistry, "spacing");
    collectUnknowns(result.layoutRegistry, "layout");
    collectUnknowns(result.componentRegistry, "component");

    result.unknownValues = unknownValues;

    session.scanResult = result;
    return result;
  }

  validate(data) {
    return data instanceof ScanResult;
  }

  cleanup() {}
  destroy() {}
}
