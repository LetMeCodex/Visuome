/**
 * ExportRegistry holds generated export files metadata, checksums, and output formats.
 */
export class ExportRegistry {
  constructor(data = {}) {
    this.metadata = data.metadata || {
      exportId: "",
      genomeId: "",
      promptId: "",
      version: "1.0.0",
      generatedAt: new Date().toISOString(),
      checksum: ""
    };

    this.formats = data.formats || {
      clipboard: "",
      markdown: "",
      txt: "",
      json: "",
      yaml: "",
      xml: "",
      pdf: null,
      docx: null,
      zip: null
    };

    this.diagnostics = data.diagnostics || {
      executionTimeMs: 0,
      validationStatus: "PASS"
    };
  }
}
