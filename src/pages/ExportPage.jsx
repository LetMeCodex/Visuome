import React from "react";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";

export function ExportPage({ designGenome = {}, promptRegistry = {} }) {
  const formats = [
    { name: "Markdown", ext: ".md", mime: "text/markdown", desc: "Human readable prompt with visual styling details.", size: "4.2 KB", icon: "📝" },
    { name: "Text Document", ext: ".txt", mime: "text/plain", desc: "Plain copy-paste instructions for LLM prompt context.", size: "3.8 KB", icon: "📄" },
    { name: "JSON Config", ext: ".json", mime: "application/json", desc: "Structured design system tokens for styling integrations.", size: "5.1 KB", icon: "📦" },
    { name: "YAML Configuration", ext: ".yaml", mime: "text/yaml", desc: "Clean configuration block mapping styling tokens.", size: "4.6 KB", icon: "🌀" },
    { name: "XML Layout", ext: ".xml", mime: "application/xml", desc: "Hierarchical sitemaps selectors representation.", size: "6.2 KB", icon: "🌐" }
  ];

  const triggerDownload = (formatObj) => {
    let content = "";
    if (formatObj.name === "JSON Config") {
      content = JSON.stringify(designGenome, null, 2);
    } else {
      content = promptRegistry?.masterPrompt || "No active design system prompts found.";
    }

    const blob = new Blob([content], { type: formatObj.mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `visuome-blueprint-${designGenome?.metadata?.genomeId || "output"}${formatObj.ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="export-page p-6 space-y-6 overflow-y-auto h-full text-[var(--color-text)] select-none">
      <div>
        <h2 className="text-xl font-bold mb-1 font-heading">Export Blueprints</h2>
        <p className="text-xs text-[var(--color-textMuted)] font-medium">Export prompt codes to Markdown, JSON, XML, PDF, DOCX, ZIP packages.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {formats.map(f => (
          <Card key={f.name} className="flex items-start justify-between p-4 bg-[var(--color-bgCard)] hover:border-[var(--color-accent)]/20 transition-all duration-200">
            <div className="space-y-2 flex-1 pr-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold font-heading text-[var(--color-text)]">{f.name}</span>
                <span className="text-[10px] text-[var(--color-textMuted)] font-mono">{f.ext}</span>
              </div>
              <p className="text-[11px] text-[var(--color-textMuted)] leading-relaxed">{f.desc}</p>
              
              <div className="flex space-x-3 text-[9px] text-[var(--color-textMuted)] font-mono font-semibold">
                <span>Size: <strong className="text-[var(--color-text)]">{f.size}</strong></span>
                <span>•</span>
                <span>Verified</span>
              </div>
            </div>

            <Button
              onClick={() => triggerDownload(f)}
              variant="secondary"
              className="text-[10px] py-1 px-3 shrink-0"
            >
              Export
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
export default ExportPage;
