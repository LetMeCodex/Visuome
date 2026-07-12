import { ExportRegistry } from "./ExportRegistry.js";
import { ClipboardExporter } from "./ClipboardExporter.js";
import { MarkdownExporter } from "./MarkdownExporter.js";
import { TextExporter } from "./TextExporter.js";
import { JsonExporter } from "./JsonExporter.js";
import { YamlExporter } from "./YamlExporter.js";
import { XmlExporter } from "./XmlExporter.js";
import { PdfExporter } from "./PdfExporter.js";
import { DocxExporter } from "./DocxExporter.js";
import { ZipExporter } from "./ZipExporter.js";
import { ExportValidator } from "./ExportValidator.js";
import { ExportDiagnostics } from "./ExportDiagnostics.js";

/**
 * Orchestrator generating and verifying all export formats.
 */
export class ExportEngine {
  /**
   * Generates a fully populated ExportRegistry.
   * @param {object} promptRegistry
   * @returns {Promise<ExportRegistry>}
   */
  async buildExport(promptRegistry) {
    const startMs = performance.now();
    const promptText = promptRegistry.masterPrompt || "";

    const formats = {
      clipboard: ClipboardExporter.export(promptText),
      markdown: MarkdownExporter.export(promptText),
      txt: TextExporter.export(promptText),
      json: JsonExporter.export(promptText),
      yaml: YamlExporter.export(promptText),
      xml: XmlExporter.export(promptText),
      pdf: PdfExporter.export(promptText),
      docx: DocxExporter.export(promptText),
      zip: ZipExporter.export(promptText)
    };

    const hash = this.generateSimpleHash(promptText);

    const registry = new ExportRegistry({
      metadata: {
        exportId: `exp-${Math.random().toString(36).slice(2, 11)}`,
        genomeId: promptRegistry.metadata?.genomeId || "",
        promptId: promptRegistry.metadata?.promptId || "",
        version: "1.0.0",
        generatedAt: new Date().toISOString(),
        checksum: hash
      },
      formats
    });

    const diagnostics = ExportDiagnostics.generate(startMs);
    registry.diagnostics = diagnostics;

    const validation = ExportValidator.validate(registry);
    if (!validation.valid) {
      throw new Error(`Export validation failed: ${validation.errors.join(", ")}`);
    }

    Object.freeze(registry.metadata);
    Object.freeze(registry.formats);
    Object.freeze(registry.diagnostics);
    Object.freeze(registry);

    return registry;
  }

  generateSimpleHash(text) {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16);
  }
}
