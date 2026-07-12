import React, { useState, useMemo, useEffect } from "react";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Badge from "../components/ui/Badge.jsx";

export function CustomPromptPage({ designGenome = {}, report = {} }) {
  const scannedDomain = report?.page?.domain || report?.domain || "Active Website";

  // Dynamic sections extraction from the scanned genome layout
  const initialSections = useMemo(() => {
    const layoutSections = designGenome?.layoutDNA?.sections || [];
    if (layoutSections.length > 0) {
      const result = {};
      layoutSections.forEach((sec) => {
        const label = sec.label || `${sec.role || "section"} ${sec.order}`;
        result[label] = true;
      });
      return result;
    }
    return {
      "Navigation Header": true,
      "Hero Showcase": true,
      "Features Card Grid": true,
      "Pricing Module": false,
      "Footer Details": true
    };
  }, [designGenome]);

  // Dynamic components extraction from the scanned report components
  const initialComponents = useMemo(() => {
    const comps = report?.components || designGenome?.components || {};
    const foundKeys = Object.entries(comps)
      .filter(([_, arr]) => arr && arr.length > 0)
      .map(([k]) => k);

    if (foundKeys.length > 0) {
      const result = {};
      foundKeys.forEach((key) => {
        const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/s$/, ""); // e.g., buttons -> Button
        result[label] = true;
      });
      return result;
    }
    return {
      "Buttons": true,
      "Cards": true,
      "Form Inputs": false,
      "Modals": false,
      "Badges": true
    };
  }, [report, designGenome]);

  const initialLayout = useMemo(() => {
    const grid = designGenome?.layoutDNA?.gridSystem;
    if (grid && !/no dominant/i.test(grid)) return "Strict CSS Grid";
    const flow = designGenome?.layoutDNA?.contentFlow;
    if (flow && /flex/i.test(flow)) return "Fluid Flex layout";
    return "Strict CSS Grid";
  }, [designGenome]);

  const initialTypography = useMemo(() => {
    const heading = designGenome?.visualDNA?.typography?.headingFont;
    const body = designGenome?.visualDNA?.typography?.bodyFont;
    if (heading && body) return `${heading} & ${body} Pairing`;
    return "Unbounded & Manrope Pairing";
  }, [designGenome]);

  const [selectedSections, setSelectedSections] = useState(initialSections);
  const [selectedComponents, setSelectedComponents] = useState(initialComponents);

  const [layout, setLayout] = useState(initialLayout);
  const [typography, setTypography] = useState(initialTypography);
  const [animation, setAnimation] = useState("Spring Hover Interactions");
  const [accessibility, setAccessibility] = useState("WCAG AA Contrast Compliant");
  const [performance, setPerformance] = useState("Optimized System Fonts");
  const [responsive, setResponsive] = useState("Dynamic Column Collapse");
  const [framework, setFramework] = useState("React");
  const [outputFormat, setOutputFormat] = useState("Tailwind CSS");

  // Synchronize dynamic checklists and params when the active scan/genome is changed
  useEffect(() => {
    setSelectedSections(initialSections);
  }, [initialSections]);

  useEffect(() => {
    setSelectedComponents(initialComponents);
  }, [initialComponents]);

  useEffect(() => {
    setLayout(initialLayout);
  }, [initialLayout]);

  useEffect(() => {
    setTypography(initialTypography);
  }, [initialTypography]);

  const [customRequirements, setCustomRequirements] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("prompt");

  const toggleSection = (key) => {
    setSelectedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleComponent = (key) => {
    setSelectedComponents(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCompose = () => {
    const activeSecs = Object.entries(selectedSections).filter(([_, v]) => v).map(([k]) => k);
    const activeComps = Object.entries(selectedComponents).filter(([_, v]) => v).map(([k]) => k);

    const prompt = `You are a principal designer. Compile a custom visual prompt specification based on these structural building blocks:

### 🍱 SECTIONS
${activeSecs.map(s => `- ${s}`).join("\n")}

### 🎛️ COMPONENTS
${activeComps.map(c => `- ${c}`).join("\n")}

### 📐 LAYOUT RULES
- Grid System: ${layout}
- Typography: ${typography}
- Animations: ${animation}
- Accessibility Level: ${accessibility}
- Performance Strategy: ${performance}
- Responsive Behavior: ${responsive}

### ⚙️ SYSTEM SETTINGS
- Framework: ${framework}
- Output Format: ${outputFormat}
- Project Intent: ${customRequirements || "General dashboard composition"}

Ensure components map cleanly to these variables and compile into semantic markup.`;

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
    <div className="custom-prompt-page p-6 space-y-6 overflow-y-auto h-full text-[var(--color-text)] select-none animate-fade-in">
      
      {/* Editorial Header */}
      <div className="border-b border-[var(--color-border)] pb-4 space-y-1">
        <span className="font-caption block">Visual Prompt Compiler</span>
        <h1 className="font-display-lg">Custom Prompt Spec</h1>
        <p className="font-subtitle">
          Manually select layout grids, components, typography scales, accessibility profiles, and system settings to build modular design prompts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left Column: Building Blocks Checklist (Step 14) */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="space-y-4">
            <span className="font-caption block">1. Target System Specs</span>
            
            <div className="space-y-3 text-xs">
              {/* What are you building? */}
              <div className="flex flex-col space-y-1">
                <span className="text-[10px] font-bold text-[var(--color-textMuted)] uppercase tracking-wider">Project Intent</span>
                <textarea
                  value={customRequirements}
                  onChange={(e) => setCustomRequirements(e.target.value)}
                  placeholder="e.g. A developer billing dashboard."
                  className="w-full bg-[var(--color-bgMuted)] border border-[var(--color-border)] p-2 rounded-[var(--radius-sm,2px)] text-xs font-mono text-[var(--color-text)] resize-none focus:outline-none leading-relaxed h-[50px] placeholder:opacity-55"
                />
              </div>

              {/* Sections Checklist */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold text-[var(--color-textMuted)] uppercase tracking-wider block">Sections Spec</span>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(selectedSections).map(sec => (
                    <label key={sec} className="flex items-center space-x-2 cursor-pointer font-mono text-[10px]">
                      <input type="checkbox" checked={selectedSections[sec]} onChange={() => toggleSection(sec)} className="rounded" />
                      <span className="truncate">{sec}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Components Checklist */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold text-[var(--color-textMuted)] uppercase tracking-wider block">Components Spec</span>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(selectedComponents).map(comp => (
                    <label key={comp} className="flex items-center space-x-2 cursor-pointer font-mono text-[10px]">
                      <input type="checkbox" checked={selectedComponents[comp]} onChange={() => toggleComponent(comp)} className="rounded" />
                      <span className="truncate">{comp}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Core Layout Rules Blocks */}
          <Card className="space-y-3 font-mono text-xs">
            <span className="font-caption block">2. Layout Parameters</span>
            
            <div className="grid grid-cols-2 gap-2.5">
              <div className="flex flex-col space-y-1">
                <span className="text-[9px] text-[var(--color-textMuted)] font-bold uppercase">Grid System</span>
                <select value={layout} onChange={(e) => setLayout(e.target.value)} className="bg-[var(--color-bgMuted)] border border-[var(--color-border)] rounded-[var(--radius-sm,2px)] px-1.5 py-1 text-[10px] focus:outline-none">
                  <option>Strict CSS Grid</option>
                  <option>Fluid Flex layout</option>
                  <option>Asymmetric Offsets</option>
                  {!["Strict CSS Grid", "Fluid Flex layout", "Asymmetric Offsets"].includes(layout) && (
                    <option value={layout}>{layout}</option>
                  )}
                </select>
              </div>

              <div className="flex flex-col space-y-1">
                <span className="text-[9px] text-[var(--color-textMuted)] font-bold uppercase">Typography</span>
                <select value={typography} onChange={(e) => setTypography(e.target.value)} className="bg-[var(--color-bgMuted)] border border-[var(--color-border)] rounded-[var(--radius-sm,2px)] px-1.5 py-1 text-[10px] focus:outline-none">
                  <option>Unbounded & Manrope Pairing</option>
                  <option>System Sans pairings</option>
                  <option>Serif display headers</option>
                  {!["Unbounded & Manrope Pairing", "System Sans pairings", "Serif display headers"].includes(typography) && (
                    <option value={typography}>{typography}</option>
                  )}
                </select>
              </div>

              <div className="flex flex-col space-y-1">
                <span className="text-[9px] text-[var(--color-textMuted)] font-bold uppercase">Animations</span>
                <select value={animation} onChange={(e) => setAnimation(e.target.value)} className="bg-[var(--color-bgMuted)] border border-[var(--color-border)] rounded-[var(--radius-sm,2px)] px-1.5 py-1 text-[10px] focus:outline-none">
                  <option>Spring Hover Interactions</option>
                  <option>Staggered Reveals</option>
                  <option>Reduced motion physics</option>
                </select>
              </div>

              <div className="flex flex-col space-y-1">
                <span className="text-[9px] text-[var(--color-textMuted)] font-bold uppercase">Accessibility</span>
                <select value={accessibility} onChange={(e) => setAccessibility(e.target.value)} className="bg-[var(--color-bgMuted)] border border-[var(--color-border)] rounded-[var(--radius-sm,2px)] px-1.5 py-1 text-[10px] focus:outline-none">
                  <option>WCAG AA Contrast Compliant</option>
                  <option>WCAG AAA strict compliance</option>
                  <option>Section 508 guidelines</option>
                </select>
              </div>

              <div className="flex flex-col space-y-1">
                <span className="text-[9px] text-[var(--color-textMuted)] font-bold uppercase">Framework</span>
                <select value={framework} onChange={(e) => setFramework(e.target.value)} className="bg-[var(--color-bgMuted)] border border-[var(--color-border)] rounded-[var(--radius-sm,2px)] px-1.5 py-1 text-[10px] focus:outline-none">
                  <option>React</option>
                  <option>Vue</option>
                  <option>Svelte</option>
                  <option>HTML & CSS</option>
                </select>
              </div>

              <div className="flex flex-col space-y-1">
                <span className="text-[9px] text-[var(--color-textMuted)] font-bold uppercase">Output format</span>
                <select value={outputFormat} onChange={(e) => setOutputFormat(e.target.value)} className="bg-[var(--color-bgMuted)] border border-[var(--color-border)] rounded-[var(--radius-sm,2px)] px-1.5 py-1 text-[10px] focus:outline-none">
                  <option>Tailwind CSS</option>
                  <option>Styled Components</option>
                  <option>Vanilla CSS styles</option>
                </select>
              </div>
            </div>
            
            <Button onClick={handleCompose} variant="primary" className="w-full mt-3">
              Compose Spec
            </Button>
          </Card>
        </div>

        {/* Right Column: Output Briefing */}
        <div className="lg:col-span-3 flex flex-col space-y-4">
          <Card className="flex-1 flex flex-col justify-between min-h-[300px]">
            <div className="space-y-4 flex-1 flex flex-col">
              <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-2">
                <span className="font-caption block">Custom Specification Output</span>
                {generatedPrompt && (
                  <Badge variant="success">Compiled</Badge>
                )}
              </div>

              {generatedPrompt ? (
                <textarea
                  readOnly
                  value={generatedPrompt}
                  className="w-full flex-1 bg-[var(--color-bgMuted)] border border-[var(--color-border)] p-3 rounded-[var(--radius-md,4px)] text-xs font-mono text-[var(--color-text)] resize-none focus:outline-none leading-relaxed h-[240px]"
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-[var(--color-textMuted)] text-xs text-center p-6 italic opacity-60">
                  Select building blocks and click "Compose Spec" to generate layout blueprints.
                </div>
              )}
            </div>

            {generatedPrompt && (
              <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex space-x-2">
                <Button onClick={handleCopy} variant="primary">
                  <span>{copySuccess ? "✓ Copied" : "Copy Prompt"}</span>
                </Button>
                <Button
                  onClick={() => {
                    const blob = new Blob([generatedPrompt], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `custom-brief.txt`;
                    a.click();
                  }}
                  variant="secondary"
                >
                  Download txt
                </Button>
              </div>
            )}
          </Card>
        </div>

      </div>

    </div>
  );
}

export default CustomPromptPage;
