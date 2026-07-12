export class ScanDiagnosticsModule {
  initialize() {
    this.diagnosticsRegistry = {};
  }

  /**
   * Scan and construct diagnostics summary metrics.
   * @param {import('../ScanSession').ScanSession} session
   * @returns {Promise<object>} Diagnostics Registry dataset.
   */
  async scan(session) {
    const nodesCount = session.data.nodeRegistry?.size || 0;
    const stylesCount = session.data.styleRegistry?.size || 0;
    const evidencesCount = (session.data.evidences || []).length;
    const conflictsCount = (session.data.conflicts || []).length;

    // Approximating memory usage
    const memoryBytes = (nodesCount * 750) + (stylesCount * 1100) + (evidencesCount * 380);
    const memoryEstimateKb = parseFloat((memoryBytes / 1024).toFixed(1));

    // Confidence distribution calculation
    const scores = [];
    const registries = ["typographyRegistry", "colorRegistry", "spacingRegistry", "layoutRegistry", "componentRegistry"];
    for (const reg of registries) {
      if (session.data[reg]?.confidence?.score !== undefined) {
        scores.push(session.data[reg].confidence.score);
      }
    }
    const confidenceDistribution = {
      average: scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
      min: scores.length > 0 ? Math.min(...scores) : 0,
      max: scores.length > 0 ? Math.max(...scores) : 0
    };

    const styleStats = session.data.diagnostics?.styleStats || {};

    // Pipeline timings & slowest stage
    const timings = session.data.pipelineTimings || {};
    let slowestStage = "";
    let maxTime = 0;
    for (const [stg, ms] of Object.entries(timings)) {
      if (ms > maxTime) {
        maxTime = ms;
        slowestStage = stg;
      }
    }

    // Registry sizes
    const registrySizes = {
      nodeRegistry: nodesCount,
      styleRegistry: stylesCount,
      typographyRegistry: Object.keys(session.data.typographyRegistry || {}).length,
      colorRegistry: Object.keys(session.data.colorRegistry || {}).length,
      spacingRegistry: Object.keys(session.data.spacingRegistry || {}).length,
      layoutRegistry: Object.keys(session.data.layoutRegistry || {}).length,
      componentRegistry: session.data.componentRegistry?.components?.length || 0,
      motionRegistry: session.scanResult?.motionRegistry ? 1 : 0,
      visualLanguageRegistry: session.scanResult?.visualLanguageRegistry ? 1 : 0,
      semanticRegistry: session.scanResult?.semanticRegistry ? 1 : 0,
      designPhilosophyRegistry: session.scanResult?.designPhilosophyRegistry ? 1 : 0
    };

    // Calculate duplicate evidence
    const uniqueEvs = new Set();
    let duplicateEvidenceCount = 0;
    for (const ev of (session.data.evidences || [])) {
      const key = `${ev.type}-${ev.value}-${ev.source}`;
      if (uniqueEvs.has(key)) {
        duplicateEvidenceCount++;
      } else {
        uniqueEvs.add(key);
      }
    }

    this.diagnosticsRegistry = {
      executionTimeMs: session.duration || 0,
      domNodes: {
        visited: session.data.diagnostics?.visitedNodes || 0,
        skipped: (session.data.diagnostics?.ignoredNodes || 0) + (session.data.diagnostics?.filteredNodes || 0),
        ignored: session.data.diagnostics?.ignoredNodes || 0,
        hidden: session.data.diagnostics?.filteredNodes || 0,
        visible: session.data.diagnostics?.visibleNodes || 0
      },
      cacheStats: {
        cacheHits: styleStats.cacheHits || 0,
        cacheMisses: styleStats.cacheMisses || 0,
        hitRatio: styleStats.cacheHitRatio || 0,
        computedCount: styleStats.computedStyleCount || 0
      },
      registrySizes,
      memoryEstimateKb,
      pipelineTimings: timings,
      slowestStage,
      repeatedStyleReads: 0,
      repeatedDOMReads: 0,
      duplicateEvidenceCount,
      evidenceCount: evidencesCount,
      conflictCount: conflictsCount,
      errors: session.errors || [],
      warnings: session.data.diagnostics?.warnings || []
    };

    session.data.diagnosticsRegistry = this.diagnosticsRegistry;
    return this.diagnosticsRegistry;
  }

  validate(data) {
    return typeof data === "object";
  }

  cleanup() {}
  destroy() {}
}
