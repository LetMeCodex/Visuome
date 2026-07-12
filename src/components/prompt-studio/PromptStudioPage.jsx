import React, { useState, useEffect } from "react";
import Button from "../ui/Button.jsx";
import Badge from "../ui/Badge.jsx";
import { PromptStudioEngine } from "../../core/prompt-studio/PromptStudioEngine.js";

export function PromptStudioPage({
  promptRegistry = {},
  designGenome = {}
}) {
  const [activeProfile, setActiveProfile] = useState("Master");
  const [localRegistry, setLocalRegistry] = useState(promptRegistry);
  const [editedText, setEditedText] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    setLocalRegistry(promptRegistry);
  }, [promptRegistry]);

  const getPromptForProfile = (profile, reg) => {
    if (!reg) return "";
    switch (profile) {
      case "Genome Mixer":
        return reg.genomeMixerPrompt || reg.masterPrompt;
      case "Custom":
        return reg.customPrompt || reg.masterPrompt;
      case "Master":
      default:
        return reg.masterPrompt;
    }
  };

  const currentPrompt = getPromptForProfile(activeProfile, localRegistry) || "No prompt compiled yet. Run a page scan to build the design system prompt.";
  const displayPrompt = editedText || currentPrompt;

  const profiles = [
    { name: "Master", desc: "Canonical system spec instructions" },
    { name: "Genome Mixer", desc: "Mixed archetype blending metrics" },
    { name: "Custom", desc: "Modular layout setup configuration" }
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(displayPrompt);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([displayPrompt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeProfile.toLowerCase().replace(/ /g, "-")}-design-prompt.txt`;
    a.click();
  };

  const handleRegenerate = async () => {
    if (!designGenome || Object.keys(designGenome).length === 0) {
      alert("No design genome active. Run page scan first.");
      return;
    }
    try {
      const engine = new PromptStudioEngine();
      const newRegistry = await engine.buildRegistry(designGenome, "markdown");
      setLocalRegistry(newRegistry);
      setEditedText("");
      alert("Prompts compiled successfully!");
    } catch (e) {
      alert("Compilation failed: " + e.message);
    }
  };

  return (
    <div className="prompt-studio-page flex h-full bg-[var(--color-bg)] text-[var(--color-text)] overflow-hidden select-none transition-all duration-150">
      
      {/* Column 1: Prompt Types (Left) */}
      <div className="w-56 border-r border-[var(--color-border)] bg-[var(--color-bgMuted)] p-4 flex flex-col justify-between shrink-0 h-full">
        <div className="space-y-3">
          <span className="font-caption block">Prompt Profiles</span>
          <div className="space-y-1">
            {profiles.map(p => (
              <button
                key={p.name}
                onClick={() => {
                  setActiveProfile(p.name);
                  setEditedText("");
                }}
                className={`w-full text-left px-3 py-2 border-0 rounded-[var(--radius-sm,2px)] transition-all cursor-pointer ${
                  activeProfile === p.name 
                    ? "bg-[var(--color-text)] text-[var(--color-bg)] font-semibold" 
                    : "text-[var(--color-textMuted)] bg-transparent hover:bg-[var(--color-bgCard)] hover:text-[var(--color-text)]"
                }`}
              >
                <div className="text-[11px] font-bold tracking-wide">{p.name}</div>
                <div className="text-[9px] text-[var(--color-textMuted)] mt-0.5 truncate max-w-full">{p.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Column 2: Prompt Editor (Center) */}
      <div className="flex-1 flex flex-col min-w-0 bg-[var(--color-bg)] h-full">
        {/* Editor Title Bar */}
        <div className="h-10 border-b border-[var(--color-border)] px-4 flex items-center justify-between bg-[var(--color-bgMuted)] shrink-0">
          <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-textMuted)]">{activeProfile.toLowerCase().replace(/ /g, "-")}.prompt</span>
          <Badge variant="info">Sync Idle</Badge>
        </div>
        
        {/* Textarea Workspace */}
        <div className="flex-1 overflow-hidden p-4 bg-[var(--color-bg)]">
          <textarea
            className="w-full h-full bg-[var(--color-bgCard)] border border-[var(--color-border)] p-4 rounded-[var(--radius-md,4px)] outline-none font-mono text-[10.5px] text-[var(--color-text)] leading-relaxed resize-none overflow-y-auto"
            value={displayPrompt}
            onChange={(e) => setEditedText(e.target.value)}
          />
        </div>

        {/* Bottom Actions Toolbar */}
        <div className="h-12 border-t border-[var(--color-border)] px-4 flex items-center justify-between bg-[var(--color-bgMuted)] shrink-0">
          <div className="flex space-x-2">
            <Button onClick={handleCopy} variant="primary" className="py-1">
              <span>{copySuccess ? "✓ Copied" : "Copy Prompt"}</span>
            </Button>
            <Button onClick={handleDownload} variant="secondary" className="py-1">
              Download txt
            </Button>
            <Button onClick={() => alert("Connecting prompt configuration to AI environment...")} variant="secondary" className="py-1">
              Copy System Config
            </Button>
          </div>
          <Button onClick={handleRegenerate} variant="secondary" className="text-[9px] py-1 px-2.5">
            Compile Spec
          </Button>
        </div>
      </div>

      {/* Column 3: Prompt Information (Right) */}
      <div className="w-56 border-l border-[var(--color-border)] bg-[var(--color-bgMuted)] p-4 flex flex-col justify-between shrink-0 h-full">
        <div className="space-y-4">
          <span className="font-caption block">Prompt Metadata</span>
          
          <div className="space-y-3 text-xs">
            <div className="space-y-1.5 border-b border-[var(--color-border)] pb-2.5">
              <span className="text-[9px] text-[var(--color-textMuted)] font-bold block uppercase tracking-wider">Engine Configuration</span>
              <div className="flex justify-between font-mono text-[10px]">
                <span className="text-[var(--color-textMuted)]">Target AI:</span>
                <span className="font-bold text-[var(--color-text)]">Claude 3.5</span>
              </div>
              <div className="flex justify-between font-mono text-[10px]">
                <span className="text(--color-textMuted)">Format:</span>
                <span className="font-semibold text-[var(--color-text)]">Markdown</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-[9px] text-[var(--color-textMuted)] font-bold block uppercase tracking-wider">Active Genome Data</span>
              <div className="flex justify-between font-mono text-[10px]">
                <span className="text-[var(--color-textMuted)]">Parsed Domain:</span>
                <span className="font-semibold text-[var(--color-text)] truncate max-w-[120px]">
                  {designGenome.metadata?.domain || "None"}
                </span>
              </div>
              <div className="flex justify-between font-mono text-[10px]">
                <span className="text-[var(--color-textMuted)]">Primary Style:</span>
                <span className="font-bold text-[var(--color-accentHover)]">
                  {designGenome.metadata?.primaryStyle || "Minimalist"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 bg-[var(--color-bgCard)] border border-[var(--color-border)] rounded-[var(--radius-xs,2px)] text-[9px] text-[var(--color-textMuted)] leading-relaxed font-mono">
          Ready for export to Cursor, Claude, Lovable, or v0 prompt targets.
        </div>
      </div>

    </div>
  );
}
export default PromptStudioPage;
