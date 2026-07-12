export class Evidence {
  /**
   * Represents an observation backing a scanner finding.
   * @param {'DOM'|'Computed Style'|'CSS Variable'|'Inline Style'|'Runtime'|'Network'|'Accessibility'|'JavaScript'|'Canvas'|'SVG'} origin Source of the evidence.
   * @param {any} value Observed value.
   * @param {number} confidence Reliability score of the origin source (0-100).
   * @param {string} relatedNode Unique selector or details of the element observed.
   * @param {object} details Additional properties matching Visuome Part 3 spec.
   */
  constructor(origin, value, confidence = 100, relatedNode = "", details = {}) {
    const validOrigins = [
      "DOM",
      "Computed Style",
      "CSS Variable",
      "Inline Style",
      "Runtime",
      "Network",
      "Accessibility",
      "JavaScript",
      "Canvas",
      "SVG"
    ];

    if (!validOrigins.includes(origin)) {
      console.warn(`Visuome Evidence: Created with non-standard origin "${origin}"`);
    }

    this.id = details.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    this.origin = origin;
    this.value = value;
    this.confidence = Math.max(0, Math.min(100, Number(confidence) || 0));
    this.timestamp = new Date().toISOString();
    this.relatedNode = relatedNode;

    // Part 3 Spec Properties
    this.observedProperty = details.observedProperty || "";
    this.observedValue = value;
    this.source = origin;
    this.observationMethod = details.observationMethod || "Direct Browser Observation";
    this.nodeReference = relatedNode;
    this.registryReference = details.registryReference || "";
    this.reliabilityWeight = details.reliabilityWeight || parseFloat((this.confidence / 100).toFixed(2));
    this.conflictStatus = details.conflictStatus || "none"; // 'none' | 'conflicted'
    this.verificationStatus = details.verificationStatus || "unverified"; // 'unverified' | 'verified'
  }
}
