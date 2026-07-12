export class ScanResult {
  constructor(url = "") {
    this.metadata = {
      scanId: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      timestamp: new Date().toISOString(),
      duration: 0,
      browser: typeof navigator !== "undefined" ? navigator.userAgent : "Unknown",
      viewport: {
        width: typeof window !== "undefined" ? window.innerWidth : 0,
        height: typeof window !== "undefined" ? window.innerHeight : 0
      },
      devicePixelRatio: typeof window !== "undefined" ? window.devicePixelRatio : 1,
      currentUrl: url,
      pageTitle: typeof document !== "undefined" ? document.title : "",
      pageLanguage: typeof document !== "undefined" ? document.documentElement.lang || "en" : "en",
      theme: "Auto", // Dark / Light / Auto
      direction: typeof document !== "undefined" ? document.documentElement.dir || "ltr" : "ltr" // LTR / RTL
    };
    
    this.evidence = [];
    this.sections = [];
    this.components = [];
    
    this.designTokens = {
      colors: [],
      typography: [],
      spacing: [],
      radii: [],
      shadows: [],
      borders: [],
      motion: []
    };
    
    this.technologies = [];
    this.animations = [];
    
    this.accessibility = {
      score: 100,
      violations: [],
      contrastPairs: []
    };
    
    this.performance = {
      score: 100,
      metrics: {}
    };
    
    this.classification = {
      primaryStyle: "Unknown",
      confidence: 0,
      matchedStyles: [],
      rejectedStyles: []
    };
    
    this.confidence = {
      score: 0,
      reasons: []
    };
    
    this.generatedPrompt = "";
    this.visualLanguageRegistry = null;
    this.semanticRegistry = null;
    this.designPhilosophyRegistry = null;
    this.motionRegistry = null;
    this.motionSemanticRegistry = null;
    this.motionPhilosophyRegistry = null;
    this.platformRegistry = null;
    this.designGenome = null;
    this.promptRegistry = null;
    this.promptComposer = null;
    this.promptExports = null;
    this.modelProfiles = null;
    this.promptPresets = null;
    this.promptHistory = null;
    this.promptQuality = null;
    this.promptStudioUIState = null;
    
    this.diagnostics = {
      modulesExecuted: [],
      executionTimeMs: 0,
      skippedModules: [],
      errors: [],
      warnings: [],
      fallbacks: []
    };
  }

  /**
   * Add a captured evidence item.
   * @param {object} evidenceEntry
   */
  addEvidence(evidenceEntry) {
    this.evidence.push(evidenceEntry);
  }

  /**
   * Add execution diagnostic details.
   * @param {'error'|'warning'|'fallback'} type Category of diagnostic.
   * @param {string} moduleName Name of the module.
   * @param {string} message Description.
   */
  logDiagnostic(type, moduleName, message) {
    const pluralType = `${type}s`;
    if (this.diagnostics[pluralType]) {
      this.diagnostics[pluralType].push({
        module: moduleName,
        message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Complete the scan and track duration.
   * @param {number} startTime
   */
  complete(startTime) {
    this.metadata.duration = Date.now() - startTime;
    this.diagnostics.executionTimeMs = this.metadata.duration;
  }
}
