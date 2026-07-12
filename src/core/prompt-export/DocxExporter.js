/**
 * Mock exporter for Word DOCX binary representation.
 */
export class DocxExporter {
  static export(promptText) {
    return {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      size: (promptText || "").length,
      binaryMock: true
    };
  }
}
