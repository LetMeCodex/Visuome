/**
 * Extensible template compiler rendering prompts to Markdown, TXT, JSON, XML, or YAML layouts.
 */
export class PromptTemplateEngine {
  /**
   * Safe JSON stringify helper that handles circular references gracefully.
   */
  static safeJsonStringify(val) {
    try {
      const seen = new WeakSet();
      return JSON.stringify(val, (key, value) => {
        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) return "[Circular]";
          seen.add(value);
        }
        return value;
      }, 2);
    } catch {
      return "{ [Serialization Error] }";
    }
  }

  /**
   * Render a prompt template structure to the target format.
   * @param {string} title
   * @param {object} sections
   * @param {string} format markdown, text, json, xml, yaml
   */
  static render(title, sections, format = "markdown") {
    switch (format.toLowerCase()) {
      case "json":
        return this.safeJsonStringify({ title, sections });
      case "xml":
        return this.renderXml(title, sections);
      case "yaml":
        return this.renderYaml(title, sections);
      case "text":
      case "plain":
        return this.renderText(title, sections);
      case "markdown":
      default:
        return this.renderMarkdown(title, sections);
    }
  }

  static renderMarkdown(title, sections) {
    let out = `# ${title}\n\n`;
    for (const [secTitle, val] of Object.entries(sections)) {
      out += `## ${secTitle}\n`;
      if (typeof val === "object") {
        out += "```json\n" + this.safeJsonStringify(val) + "\n```\n\n";
      } else {
        out += `${val}\n\n`;
      }
    }
    return out.trim();
  }

  static renderText(title, sections) {
    let out = `=== ${title} ===\n\n`;
    for (const [secTitle, val] of Object.entries(sections)) {
      out += `[ ${secTitle} ]\n`;
      if (typeof val === "object") {
        out += this.safeJsonStringify(val) + "\n\n";
      } else {
        out += `${val}\n\n`;
      }
    }
    return out.trim();
  }

  static renderXml(title, sections) {
    let out = `<prompt>\n  <title>${title}</title>\n  <sections>\n`;
    for (const [secTitle, val] of Object.entries(sections)) {
      out += `    <section name="${secTitle}">\n`;
      if (typeof val === "object") {
        out += `      <![CDATA[\n${this.safeJsonStringify(val)}\n]]>\n`;
      } else {
        out += `      ${val}\n`;
      }
      out += `    </section>\n`;
    }
    out += `  </sections>\n</prompt>`;
    return out;
  }

  static renderYaml(title, sections) {
    let out = `title: "${title}"\nsections:\n`;
    for (const [secTitle, val] of Object.entries(sections)) {
      out += `  ${secTitle.replace(/[\s:]/g, "_")}:\n`;
      if (typeof val === "object") {
        const lines = this.safeJsonStringify(val).split("\n");
        for (const line of lines) {
          out += `    ${line}\n`;
        }
      } else {
        out += `    "${val.replace(/"/g, '\\"')}"\n`;
      }
    }
    return out.trim();
  }
}
export default PromptTemplateEngine;
