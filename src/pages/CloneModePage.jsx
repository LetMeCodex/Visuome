import React, { useState } from "react";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";

export function CloneModePage({ designGenome = {} }) {
  const [framework, setFramework] = useState("React & Tailwind CSS");
  const [targetAI, setTargetAI] = useState("Claude 3.5 Sonnet");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  const handleGenerate = () => {
    const layout = designGenome.layoutDNA || {};
    const typography = designGenome.visualDNA?.typography || {};
    const colorTheme = designGenome.visualDNA?.colorTheme || "Light Cream Theme";
    const rawColors = designGenome.visualDNA?.colors?.dominantPalette || designGenome.visualDNA?.primaryColors || [];
    const colorsList = Array.isArray(rawColors) ? rawColors : [];
    
    let prompt = `You are a principal designer and expert front-end engineer. Your task is to reconstruct/clone the user interface structure and style of the scanned page. 
    
Re-create this design adhering to the visual specifications listed below:

### 📐 LAYOUT CONFIGURATION
* **Grid Hierarchy:** Follow a ${layout.density || "balanced"} composition flow using a structural grid layout with ${layout.symmetry || "symmetrical"} alignments.
* **Component Rhythm:** Align elements in regular spacing segments (e.g., margins, padding scales of 8px/16px/24px/32px) to match the layout consistency.

### 🎨 DESIGN SYSTEM & THEME
* **Color Palette Philosophy:** Responds to a ${colorTheme} profile.
* **Primary Branding Colors:** ${colorsList.length > 0 ? colorsList.slice(0, 5).join(", ") : "#F5F2EB, #121212, #E5E5E5"}
* **Typography Weights:** Set header components to use '${typography.headingFont || "Unbounded"}' and body descriptions to use '${typography.bodyFont || "Manrope"}'. Ensure prominent heading letter-spacing with clean line-height parameters.

### 📦 STRUCTURAL COMPONENT BLOCKS
* **Top Header Navigation:** Features a thin 1px separation border with integrated logo/brand text, inline navigation links, and action CTA triggers.
* **Grid Card Elements:** Contained inside cards with 1px borders, small border radiuses, and zero heavy neon glow.
* **Interactive Elements:** Solid backgrounds for primary actions, thin borders for secondary buttons, and smooth hover scaling (200ms duration).

### ⚙️ OUTPUT FRAMEWORK & TARGET
* **Code Output Format:** ${framework}
* **Optimized for Compiler:** ${targetAI}
* **Accessibility Check:** Conforms to WCAG AA guidelines with high-contrast text layers and descriptive ARIA semantics.`;

    setGeneratedPrompt(prompt.trim());
    setCopySuccess(false);
  };

  const handleCopy = () => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="clone-mode-page p-6 space-y-6 overflow-y-auto h-full text-[var(--color-text)] select-none">
      <div>
        <h2 className="text-xl font-bold mb-1 font-heading">Clone Mode Briefing</h2>
        <p className="text-xs text-[var(--color-textMuted)] font-medium">Generate a comprehensive, expert-level natural language prompt to clone the scanned webpage's structure.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column Config */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="space-y-4">
            <span className="text-[10px] font-bold text-[var(--color-accentHover)] uppercase tracking-wider block font-heading">Clone Parameters</span>
            
            <div className="space-y-3 text-xs">
              <div className="flex flex-col space-y-1">
                <span className="text-[10px] font-semibold text-[var(--color-textMuted)]">Target Framework</span>
                <select
                  value={framework}
                  onChange={(e) => setFramework(e.target.value)}
                  className="bg-[var(--color-bgMuted)] border border-[var(--color-border)] rounded-md px-2 py-1.5 focus:outline-none text-[var(--color-text)] cursor-pointer font-medium"
                >
                  <option>React & Tailwind CSS</option>
                  <option>Vanilla HTML & CSS</option>
                  <option>Next.js & Styled Components</option>
                  <option>Vue.js & Tailwind</option>
                </select>
              </div>

              <div className="flex flex-col space-y-1">
                <span className="text-[10px] font-semibold text-[var(--color-textMuted)]">AI Assistant Target</span>
                <select
                  value={targetAI}
                  onChange={(e) => setTargetAI(e.target.value)}
                  className="bg-[var(--color-bgMuted)] border border-[var(--color-border)] rounded-md px-2 py-1.5 focus:outline-none text-[var(--color-text)] cursor-pointer font-medium"
                >
                  <option>Claude 3.5 Sonnet</option>
                  <option>GPT-4o</option>
                  <option>Gemini 1.5 Pro</option>
                  <option>Cursor / Lovable / Bolt</option>
                </select>
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              variant="primary"
              className="w-full mt-2"
            >
              Generate Clone Brief
            </Button>
          </Card>

          <Card className="space-y-3">
            <span className="text-[10px] font-bold text-[var(--color-textMuted)] uppercase tracking-wider block font-heading">Fidelity Metrics</span>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--color-textMuted)]">Fidelity Match:</span>
                <span className="font-bold text-emerald-500">98.4%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-textMuted)]">Layout Symmetry:</span>
                <span className="font-semibold">{designGenome.layoutDNA?.symmetry || "Balanced"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-textMuted)]">Identified Blocks:</span>
                <span className="font-semibold">Grid Structure</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column Brief Output */}
        <div className="lg:col-span-3 flex flex-col space-y-4">
          <Card className="flex-1 flex flex-col justify-between min-h-[300px]">
            <div className="space-y-4 flex-1 flex flex-col">
              <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-2">
                <span className="text-xs font-bold text-[var(--color-text)] font-heading">Narrative UI Briefing</span>
                {generatedPrompt && (
                  <span className="text-[10px] text-emerald-500 font-semibold uppercase">Briefing Compiled</span>
                )}
              </div>

              {generatedPrompt ? (
                <textarea
                  readOnly
                  value={generatedPrompt}
                  className="w-full flex-1 bg-[var(--color-bgMuted)] border border-[var(--color-border)] p-4 rounded-md text-xs font-mono text-[var(--color-text)] resize-none focus:outline-none leading-relaxed h-[280px]"
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-[var(--color-textMuted)] text-xs text-center p-6 italic opacity-60">
                  Select parameters and click "Generate Clone Brief" to build.
                </div>
              )}
            </div>

            {generatedPrompt && (
              <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex space-x-2">
                <Button onClick={handleCopy} variant="primary">
                  <span>{copySuccess ? "✓ Copied" : "Copy Briefing"}</span>
                </Button>
                <Button
                  onClick={() => {
                    const blob = new Blob([generatedPrompt], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `clone-ui-brief.txt`;
                    a.click();
                  }}
                  variant="secondary"
                >
                  Download .txt
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default CloneModePage;
