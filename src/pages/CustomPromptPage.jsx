import React, { useState, useMemo } from "react";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Badge from "../components/ui/Badge.jsx";

export function CustomPromptPage({ designGenome = {}, report = {} }) {
  const scannedDomain = report?.page?.domain || report?.domain || "Active Website";

  // State configurations for building blocks
  const [selectedSections, setSelectedSections] = useState({
    "Navigation Header": true,
    "Hero Showcase": true,
    "Features Card Grid": true,
    "Pricing Module": false,
    "Footer Details": true
  });

  const [selectedComponents, setSelectedComponents] = useState({
    "Buttons": true,
    "Cards": true,
    "Form Inputs": false,
    "Modals": false,
    "Badges": true
  });

  const [layout, setLayout] = useState("Strict CSS Grid");
  const [typography, setTypography] = useState("Unbounded & Manrope Pairing");
  const [animation, setAnimation] = useState("Spring Hover Interactions");
  const [accessibility, setAccessibility] = useState("WCAG AA Contrast Compliant");
  const [performance, setPerformance] = useState("Optimized System Fonts");
  const [responsive, setResponsive] = useState("Dynamic Column Collapse");
  const [framework, setFramework] = useState("React");
  const [outputFormat, setOutputFormat] = useState("Tailwind CSS");
  const [outcomeProfile, setOutcomeProfile] = useState("Original Inspiration");

  const [customRequirements, setCustomRequirements] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  const toggleSection = (key) => {
    setSelectedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleComponent = (key) => {
    setSelectedComponents(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getComponentSublabel = (compKey) => {
    if (!report?.components) return null;
    const keyMap = {
      "Buttons": "buttons",
      "Cards": "cards",
      "Form Inputs": "forms",
      "Badges": "badges",
      "Modals": "widgets"
    };
    const arr = report.components[keyMap[compKey]];
    if (arr && arr.length > 0) {
      return `${arr.length} found (${arr[0].dimensions || "dynamic"})`;
    }
    return null;
  };

  const getSectionSublabel = (secKey) => {
    const sections = designGenome?.layoutDNA?.sections || [];
    if (sections.length === 0) return null;
    const found = sections.find(s => s.label?.toLowerCase().includes(secKey.split(" ")[0].toLowerCase()));
    if (found) {
      return `${found.role || "section"} (${found.rect?.height || 0}px height)`;
    }
    return null;
  };

  const compileForensicTokens = () => {
    if (!report || Object.keys(report).length === 0) return "";

    const colors = report.designTokens?.colors || {};
    const typo = report.designTokens?.typography || {};
    const spacing = report.designTokens?.spacing || {};
    const radius = report.designTokens?.radius || {};
    const comps = report.components || {};

    let markdown = "\n\n### 🧬 EXTRACTED FORENSIC DESIGN TOKENS\n";

    // Colors
    if (colors.corePalette?.length) {
      markdown += "\n#### 🎨 Color Palette\n";
      colors.corePalette.slice(0, 6).forEach(token => {
        markdown += `- \`${token.hex}\`: ${token.role || "Color Swatch"} (Usage: ${token.usagePercentage}%)\n`;
      });
    }

    // Typography
    if (typo.primaryFontFamily) {
      markdown += `\n#### 🔤 Typography\n- **Primary Font:** \`${typo.primaryFontFamily}\`\n`;
      if (typo.headingFontFamily) {
        markdown += `- **Heading Font:** \`${typo.headingFontFamily}\`\n`;
      }
      if (typo.fontSizes?.length) {
        markdown += `- **Sizes:** ${typo.fontSizes.slice(0, 6).join(", ")}\n`;
      }
    }

    // Spacing & Corner treats
    if (spacing.scale?.length) {
      markdown += `\n#### 📐 Spacing & Boundaries\n- **Spacing Steps:** ${spacing.scale.slice(0, 5).join(", ")}\n`;
    }
    if (radius.scale?.length) {
      markdown += `- **Border Radii:** ${radius.scale.slice(0, 4).join(", ")}\n`;
    }

    // Observed components styling
    let compLines = "";
    if (comps.buttons?.length && selectedComponents["Buttons"]) {
      const btn = comps.buttons[0];
      compLines += `- **Buttons:** background \`${btn.background}\`, text \`${btn.color}\`, padding \`${btn.padding}\`, radius \`${btn.radius}\`\n`;
    }
    if (comps.cards?.length && selectedComponents["Cards"]) {
      const card = comps.cards[0];
      compLines += `- **Cards:** background \`${card.background}\`, border \`${card.border || "none"}\`, padding \`${card.padding}\`, shadow \`${card.shadow || "none"}\`\n`;
    }
    if (comps.forms?.length && selectedComponents["Form Inputs"]) {
      const form = comps.forms[0];
      compLines += `- **Form Inputs:** background \`${form.background}\`, border \`${form.border}\`, radius \`${form.radius}\`\n`;
    }

    if (compLines) {
      markdown += `\n#### 📦 Observed Component Metrics\n${compLines}`;
    }

    return markdown;
  };

  const handleCompose = () => {
    const activeSecs = Object.entries(selectedSections).filter(([_, v]) => v).map(([k]) => k);
    const activeComps = Object.entries(selectedComponents).filter(([_, v]) => v).map(([k]) => k);
    
    const tokenSpec = compileForensicTokens();

    const profileRules = outcomeProfile === "Original Inspiration"
      ? "Create an original interface inspired by these design principles without copying exact assets, text, logos, or protected layout."
      : "Recreate the visual structure closely using the extracted design tokens, but replace protected brand assets, text, and images unless authorized.";

    const prompt = `You are a principal designer. Compile a custom visual prompt specification based on these structural building blocks:

### 🎯 OUTCOME TARGET PROFILE
- **Strategy:** ${outcomeProfile}
- **Boundary Directive:** ${profileRules}

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
${tokenSpec}

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
        <span className="font-caption block">Visual Spec Compiler</span>
        <h1 className="font-display-lg">Custom Prompt</h1>
        <p className="font-subtitle">
          Construct custom developer instructions combining structural blocks with forensic styling metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Left Column: Spec Builder */}
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
                <div className="grid grid-cols-1 gap-2">
                  {Object.keys(selectedSections).map(sec => {
                    const sublabel = getSectionSublabel(sec);
                    return (
                      <label key={sec} className="flex flex-col p-2 bg-[var(--color-bgMuted)] border border-[var(--color-border)] rounded hover:border-[var(--color-accent)] cursor-pointer select-none">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" checked={selectedSections[sec]} onChange={() => toggleSection(sec)} className="rounded" />
                          <span className="font-mono text-[10px] font-bold">{sec}</span>
                        </div>
                        {sublabel && (
                          <span className="text-[9px] text-[var(--color-textMuted)] pl-5 font-mono">{sublabel}</span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Components Checklist */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold text-[var(--color-textMuted)] uppercase tracking-wider block">Components Spec</span>
                <div className="grid grid-cols-1 gap-2">
                  {Object.keys(selectedComponents).map(comp => {
                    const sublabel = getComponentSublabel(comp);
                    return (
                      <label key={comp} className="flex flex-col p-2 bg-[var(--color-bgMuted)] border border-[var(--color-border)] rounded hover:border-[var(--color-accent)] cursor-pointer select-none">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" checked={selectedComponents[comp]} onChange={() => toggleComponent(comp)} className="rounded" />
                          <span className="font-mono text-[10px] font-bold">{comp}</span>
                        </div>
                        {sublabel && (
                          <span className="text-[9px] text-[var(--color-textMuted)] pl-5 font-mono">{sublabel}</span>
                        )}
                      </label>
                    );
                  })}
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
                </select>
              </div>

              <div className="flex flex-col space-y-1">
                <span className="text-[9px] text-[var(--color-textMuted)] font-bold uppercase">Typography</span>
                <select value={typography} onChange={(e) => setTypography(e.target.value)} className="bg-[var(--color-bgMuted)] border border-[var(--color-border)] rounded-[var(--radius-sm,2px)] px-1.5 py-1 text-[10px] focus:outline-none">
                  <option>Unbounded & Manrope Pairing</option>
                  <option>System Sans pairings</option>
                  <option>Serif display headers</option>
                </select>
              </div>

              <div className="flex flex-col space-y-1">
                <span className="text-[9px] text-[var(--color-textMuted)] font-bold uppercase">Outcome Target</span>
                <select value={outcomeProfile} onChange={(e) => setOutcomeProfile(e.target.value)} className="bg-[var(--color-bgMuted)] border border-[var(--color-border)] rounded-[var(--radius-sm,2px)] px-1.5 py-1 text-[10px] focus:outline-none">
                  <option>Original Inspiration</option>
                  <option>Authorized Reconstruction</option>
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
          <Card className="flex-1 flex flex-col justify-between min-h-[450px]">
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
                  className="w-full flex-1 bg-[var(--color-bgMuted)] border border-[var(--color-border)] p-3 rounded-[var(--radius-md,4px)] text-xs font-mono text-[var(--color-text)] resize-none focus:outline-none leading-relaxed h-[360px]"
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
