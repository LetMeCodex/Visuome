import React, { useState, useEffect, useMemo } from "react";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Badge from "../components/ui/Badge.jsx";

const FAMOUS_BRANDS = [
  { name: "Stripe", domain: "stripe.com", theme: "Light", brand: "#635BFF", bg: "#FFFFFF", text: "#0A2540", border: "#E6EBF1", font: "Soehne", radius: "8px", density: "airy" },
  { name: "Apple", domain: "apple.com", theme: "Light", brand: "#000000", bg: "#FFFFFF", text: "#1D1D1F", border: "#D2D2D7", font: "SF Pro Display", radius: "0px", density: "balanced" },
  { name: "Spotify", domain: "spotify.com", theme: "Dark", brand: "#1DB954", bg: "#121212", text: "#FFFFFF", border: "#282828", font: "Circular", radius: "9999px", density: "compact" },
  { name: "Vercel", domain: "vercel.com", theme: "Dark", brand: "#FFFFFF", bg: "#000000", text: "#FFFFFF", border: "#111111", font: "Geist", radius: "6px", density: "balanced" },
  { name: "Linear", domain: "linear.app", theme: "Dark", brand: "#5E6AD2", bg: "#121212", text: "#EEEEEE", border: "#222222", font: "Inter", radius: "8px", density: "airy" },
  { name: "Notion", domain: "notion.so", theme: "Light", brand: "#000000", bg: "#FFFFFF", text: "#37352F", border: "#EDEDED", font: "Inter", radius: "4px", density: "balanced" },
  { name: "Figma", domain: "figma.com", theme: "Dark", brand: "#F24E1E", bg: "#1E1E1E", text: "#FFFFFF", border: "#2C2C2C", font: "Inter", radius: "6px", density: "compact" }
];

const makeGenome = (brand) => {
  return {
    metadata: {
      genomeId: `genome-preset-${brand.name.toLowerCase()}`,
      generatedAt: new Date().toISOString()
    },
    visualDNA: {
      colors: {
        theme: brand.theme,
        dominantPalette: [brand.brand, brand.bg, brand.text, brand.border],
        backgroundColors: [brand.bg],
        textColors: [brand.text],
        borderColors: [brand.border]
      },
      typography: {
        primaryFontFamily: brand.font,
        fontWeights: [400, 500, 700],
        fontSizes: ["12px", "14px", "16px", "24px", "32px"]
      }
    },
    designSystemDNA: {
      radiusScale: [brand.radius, "16px"],
      spacingScale: ["4px", "8px", "16px", "32px"]
    },
    layoutDNA: {
      density: brand.density
    }
  };
};

const SYSTEM_PRESETS = FAMOUS_BRANDS.map(brand => ({
  id: `preset-${brand.name.toLowerCase()}`,
  pageTitle: brand.name,
  domain: brand.domain,
  designGenome: makeGenome(brand)
}));

function parseHex(hex) {
  let cleaned = hex.replace("#", "");
  if (cleaned.length === 3) {
    cleaned = cleaned.split("").map(c => c + c).join("");
  }
  const num = parseInt(cleaned, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

function toHex(r, g, b) {
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
  const bin = (clamp(r) << 16) | (clamp(g) << 8) | clamp(b);
  return "#" + bin.toString(16).padStart(6, "0");
}

function blendHexColors(hexA, hexB, weight) {
  try {
    const cA = parseHex(hexA || "#161616");
    const cB = parseHex(hexB || "#c9bb3f");
    const r = cA.r * (1 - weight) + cB.r * weight;
    const g = cA.g * (1 - weight) + cB.g * weight;
    const b = cA.b * (1 - weight) + cB.b * weight;
    return toHex(r, g, b);
  } catch (e) {
    return hexA || "#161616";
  }
}

export function GenomeMixerPage({ designGenome = {}, scans = [] }) {
  const [genomeAId, setGenomeAId] = useState("");
  const [genomeBId, setGenomeBId] = useState("");
  const [blendWeight, setBlendWeight] = useState(0.5);
  const [mergeStrategy, setMergeStrategy] = useState("Dominant Blend");
  const [activeTab, setActiveTab] = useState("prompt"); // "prompt" | "variables" | "tailwind"
  
  const [blendColors, setBlendColors] = useState(true);
  const [blendTypo, setBlendTypo] = useState(true);
  const [blendSpacing, setBlendSpacing] = useState(true);
  
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  // Compile options from presets and active scans
  const allOptions = useMemo(() => {
    const list = scans.map(s => ({
      id: s.id,
      pageTitle: s.pageTitle || s.domain || "Scanned Site",
      domain: s.domain || "scanned.com",
      designGenome: s.designGenome || {}
    }));
    
    if (designGenome && Object.keys(designGenome).length > 0) {
      list.unshift({
        id: "active-scan",
        pageTitle: "Active Scan",
        domain: designGenome.metadata?.domain || "current-page",
        designGenome
      });
    }

    return [...list, ...SYSTEM_PRESETS];
  }, [scans, designGenome]);

  useEffect(() => {
    if (allOptions.length > 0) {
      const hasActiveScan = allOptions.some(o => o.id === "active-scan");
      if (hasActiveScan) {
        setGenomeAId("active-scan");
      } else if (!genomeAId) {
        setGenomeAId(allOptions[0]?.id);
      }
      if (!genomeBId) {
        setGenomeBId(allOptions[Math.min(1, allOptions.length - 1)]?.id);
      }
    }
  }, [allOptions]);

  const genomeA = useMemo(() => allOptions.find(o => o.id === genomeAId) || allOptions[0], [genomeAId, allOptions]);
  const genomeB = useMemo(() => allOptions.find(o => o.id === genomeBId) || allOptions[1] || allOptions[0], [genomeBId, allOptions]);

  // Mathematical blend operations
  const blendedPalette = useMemo(() => {
    if (!genomeA || !genomeB) return [];
    const colorsA = genomeA.designGenome?.visualDNA?.colors?.dominantPalette || [];
    const colorsB = genomeB.designGenome?.visualDNA?.colors?.dominantPalette || [];

    const maxLength = Math.max(colorsA.length, colorsB.length, 4);
    const result = [];
    for (let i = 0; i < maxLength; i++) {
      const colA = colorsA[i] || (i === 0 ? "#161616" : i === 1 ? "#ffffff" : i === 2 ? "#e8e4d9" : "#c9bb3f");
      const colB = colorsB[i] || (i === 0 ? "#161616" : i === 1 ? "#ffffff" : i === 2 ? "#e8e4d9" : "#c9bb3f");
      
      if (blendColors) {
        result.push(blendHexColors(colA, colB, blendWeight));
      } else {
        result.push(blendWeight > 0.5 ? colB : colA);
      }
    }
    return result;
  }, [genomeA, genomeB, blendWeight, blendColors]);

  const blendedSpacingScale = useMemo(() => {
    const scaleA = genomeA?.designGenome?.designSystemDNA?.spacingScale || ["4px", "8px", "16px", "32px"];
    const scaleB = genomeB?.designGenome?.designSystemDNA?.spacingScale || ["4px", "8px", "16px", "32px"];
    
    const parsePx = (str) => parseFloat(str) || 8;
    
    const result = [];
    const length = Math.max(scaleA.length, scaleB.length, 4);
    for (let i = 0; i < length; i++) {
      const valA = parsePx(scaleA[i]);
      const valB = parsePx(scaleB[i]);
      const blended = blendSpacing 
        ? Math.round(valA * (1 - blendWeight) + valB * blendWeight)
        : (blendWeight > 0.5 ? valB : valA);
      result.push(`${blended}px`);
    }
    return result;
  }, [genomeA, genomeB, blendWeight, blendSpacing]);

  const blendedRadiusScale = useMemo(() => {
    const scaleA = genomeA?.designGenome?.designSystemDNA?.radiusScale || ["2px", "4px", "8px"];
    const scaleB = genomeB?.designGenome?.designSystemDNA?.radiusScale || ["2px", "4px", "8px"];
    
    const parsePx = (str) => parseFloat(str) || 4;
    
    const result = [];
    const length = Math.max(scaleA.length, scaleB.length, 3);
    for (let i = 0; i < length; i++) {
      const valA = parsePx(scaleA[i]);
      const valB = parsePx(scaleB[i]);
      const blended = blendSpacing
        ? Math.round(valA * (1 - blendWeight) + valB * blendWeight)
        : (blendWeight > 0.5 ? valB : valA);
      result.push(`${blended}px`);
    }
    return result;
  }, [genomeA, genomeB, blendWeight, blendSpacing]);

  const blendedFontHeading = useMemo(() => {
    const fontA = genomeA?.designGenome?.visualDNA?.typography?.primaryFontFamily || "Unbounded";
    const fontB = genomeB?.designGenome?.visualDNA?.typography?.primaryFontFamily || "Manrope";
    return blendTypo 
      ? (blendWeight > 0.5 ? fontB : fontA)
      : fontA;
  }, [genomeA, genomeB, blendWeight, blendTypo]);

  const blendedFontBody = useMemo(() => {
    const fontA = genomeA?.designGenome?.visualDNA?.typography?.primaryFontFamily || "Manrope";
    const fontB = genomeB?.designGenome?.visualDNA?.typography?.primaryFontFamily || "Inter";
    return blendTypo 
      ? (blendWeight > 0.5 ? fontA : fontB)
      : fontB;
  }, [genomeA, genomeB, blendWeight, blendTypo]);

  const handleMix = () => {
    if (!genomeA || !genomeB) return;

    const colorsStr = blendedPalette.join(", ");
    const spacingStr = blendedSpacingScale.join(", ");
    const radiusStr = blendedRadiusScale.join(", ");

    const prompt = `You are a principal frontend engineer. Build a unified visual prompt specification blending design DNA from two target sites:

### 🧬 SOURCE A: ${genomeA.pageTitle} (${genomeA.domain})
- Primary Font: ${genomeA.designGenome?.visualDNA?.typography?.primaryFontFamily || "System"}

### 🧬 SOURCE B: ${genomeB.pageTitle} (${genomeB.domain})
- Primary Font: ${genomeB.designGenome?.visualDNA?.typography?.primaryFontFamily || "System"}

### 🎛️ MIX PARAMETERS & BLENDED SYSTEM TOKENS
- **Blend Weight:** ${(blendWeight * 100).toFixed(0)}% Source B / ${((1 - blendWeight) * 100).toFixed(0)}% Source A
- **Strategy:** ${mergeStrategy}
- **Interpolated Swatches:** ${colorsStr}
- **Interpolated Spacings:** ${spacingStr}
- **Interpolated Radii:** ${radiusStr}
- **Blended Font Pairing:** Headings: \`${blendedFontHeading}\` / Body: \`${blendedFontBody}\`

Ensure layout components and color systems interpolate structural sizes and typography variables accordingly to target a WCAG AA visual grid specification.`;

    setGeneratedPrompt(prompt.trim());
    setCopySuccess(false);
  };

  const handleCopy = () => {
    const textToCopy = activeTab === "prompt" ? generatedPrompt : activeTab === "variables" ? cssVariables : tailwindConfig;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Dynamic CSS variables output
  const cssVariables = useMemo(() => {
    if (!genomeA || !genomeB) return "";
    return `:root {
  /* Blended Palette */
${blendedPalette.map((c, idx) => `  --color-blend-${idx + 1}: ${c};`).join("\n")}
  --color-accent: ${blendedPalette[0] || "#c9bb3f"};

  /* Blended Fonts */
  --font-heading: '${blendedFontHeading}', sans-serif;
  --font-body: '${blendedFontBody}', sans-serif;

  /* Blended Spacing Scale */
${blendedSpacingScale.map((s, idx) => `  --spacing-scale-${idx + 1}: ${s};`).join("\n")}

  /* Blended Radius Scale */
${blendedRadiusScale.map((r, idx) => `  --radius-scale-${idx + 1}: ${r};`).join("\n")}
}`;
  }, [blendedPalette, blendedFontHeading, blendedFontBody, blendedSpacingScale, blendedRadiusScale, genomeA, genomeB]);

  const tailwindConfig = useMemo(() => {
    if (!genomeA || !genomeB) return "";
    return `module.exports = {
  theme: {
    extend: {
      colors: {
${blendedPalette.map((c, idx) => `        blend${idx + 1}: "${c}",`).join("\n")}
        accent: "${blendedPalette[0] || "#c9bb3f"}"
      },
      spacing: {
${blendedSpacingScale.map((s, idx) => `        scale${idx + 1}: "${s}",`).join("\n")}
      },
      borderRadius: {
${blendedRadiusScale.map((r, idx) => `        scale${idx + 1}: "${r}",`).join("\n")}
      },
      fontFamily: {
        heading: ["${blendedFontHeading}", "sans-serif"],
        body: ["${blendedFontBody}", "sans-serif"]
      }
    }
  }
};`;
  }, [blendedPalette, blendedFontHeading, blendedFontBody, blendedSpacingScale, blendedRadiusScale, genomeA, genomeB]);

  return (
    <div className="genome-mixer-page p-6 space-y-6 overflow-y-auto h-full text-[var(--color-text)] select-none animate-fade-in">
      
      {/* Editorial Header */}
      <div className="border-b border-[var(--color-border)] pb-4 space-y-1">
        <span className="font-caption block">Visual DNA Synthesizer</span>
        <h1 className="font-display-lg">Genome Mixer</h1>
        <p className="font-subtitle">
          Interpolate spacing grids, font pairings, and color configurations across two source genomes using slider weight densities.
        </p>
      </div>

      {/* Split Layout: Genome A & Genome B */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Side: Genome A */}
        <Card className="space-y-3 bg-[var(--color-bgMuted)]">
          <span className="font-caption block">Input Genome A</span>
          <select
            value={genomeAId}
            onChange={(e) => setGenomeAId(e.target.value)}
            className="w-full bg-[var(--color-bgCard)] border border-[var(--color-border)] rounded-[var(--radius-sm,2px)] px-2 py-1.5 focus:outline-none text-[var(--color-text)] font-mono text-xs cursor-pointer"
          >
            {allOptions.map(o => (
              <option key={`a-${o.id}`} value={o.id}>{o.pageTitle} ({o.domain})</option>
            ))}
          </select>
          {genomeA && (
            <div className="space-y-1 font-mono text-[10px] text-[var(--color-textMuted)] leading-relaxed">
              <div>Font: {genomeA.designGenome?.visualDNA?.typography?.primaryFontFamily || "System"}</div>
              <div className="flex items-center space-x-1.5 pt-1">
                <span>Swatches:</span>
                {(genomeA.designGenome?.visualDNA?.colors?.dominantPalette || []).slice(0, 4).map((c, i) => (
                  <span key={i} className="w-3.5 h-3.5 rounded-[var(--radius-xs,2px)] border border-[var(--color-border)]" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Right Side: Genome B */}
        <Card className="space-y-3 bg-[var(--color-bgMuted)]">
          <span className="font-caption block">Input Genome B</span>
          <select
            value={genomeBId}
            onChange={(e) => setGenomeBId(e.target.value)}
            className="w-full bg-[var(--color-bgCard)] border border-[var(--color-border)] rounded-[var(--radius-sm,2px)] px-2 py-1.5 focus:outline-none text-[var(--color-text)] font-mono text-xs cursor-pointer"
          >
            {allOptions.map(o => (
              <option key={`b-${o.id}`} value={o.id}>{o.pageTitle} ({o.domain})</option>
            ))}
          </select>
          {genomeB && (
            <div className="space-y-1 font-mono text-[10px] text-[var(--color-textMuted)] leading-relaxed">
              <div>Font: {genomeB.designGenome?.visualDNA?.typography?.primaryFontFamily || "System"}</div>
              <div className="flex items-center space-x-1.5 pt-1">
                <span>Swatches:</span>
                {(genomeB.designGenome?.visualDNA?.colors?.dominantPalette || []).slice(0, 4).map((c, i) => (
                  <span key={i} className="w-3.5 h-3.5 rounded-[var(--radius-xs,2px)] border border-[var(--color-border)]" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Settings Panel & Sliders */}
      <Card className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Slider */}
        <div className="space-y-2">
          <div className="flex justify-between font-caption">
            <span>Blend weight</span>
            <span className="font-mono">{(blendWeight * 100).toFixed(0)}% B</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={blendWeight}
            onChange={(e) => setBlendWeight(parseFloat(e.target.value))}
            className="w-full h-1 bg-[var(--color-border)] rounded-lg appearance-none cursor-pointer accent-[var(--color-accent)]"
          />
          <div className="flex justify-between font-mono text-[9px] text-[var(--color-textMuted)]">
            <span>100% A</span>
            <span>100% B</span>
          </div>
        </div>

        {/* Strategy dropdown */}
        <div className="space-y-1.5">
          <span className="font-caption block">Merge Strategy</span>
          <select
            value={mergeStrategy}
            onChange={(e) => setMergeStrategy(e.target.value)}
            className="w-full bg-[var(--color-bgMuted)] border border-[var(--color-border)] rounded-[var(--radius-sm,2px)] px-2 py-1.5 focus:outline-none text-xs font-mono cursor-pointer"
          >
            <option>Dominant Blend</option>
            <option>Average Attributes Interpolation</option>
            <option>Intersection Registry</option>
          </select>
        </div>

        {/* Attributes Checkboxes */}
        <div className="space-y-2">
          <span className="font-caption block">Blend Target Attributes</span>
          <div className="flex items-center space-x-4 text-xs font-mono">
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input type="checkbox" checked={blendColors} onChange={() => setBlendColors(!blendColors)} className="rounded" />
              <span>Colors</span>
            </label>
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input type="checkbox" checked={blendTypo} onChange={() => setBlendTypo(!blendTypo)} className="rounded" />
              <span>Type</span>
            </label>
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input type="checkbox" checked={blendSpacing} onChange={() => setBlendSpacing(!blendSpacing)} className="rounded" />
              <span>Grid</span>
            </label>
          </div>
        </div>
      </Card>

      {/* Dynamic Swatches Interpolation Visual Preview */}
      <Card className="p-4 space-y-3 bg-[var(--color-bgMuted)]">
        <span className="font-caption block">Live Blended Swatches Preview</span>
        <div className="flex items-center space-x-3.5 pt-1 overflow-x-auto">
          {blendedPalette.map((c, i) => (
            <div key={i} className="flex flex-col items-center space-y-1.5 shrink-0 animate-fade-in">
              <span className="w-10 h-10 rounded-[var(--radius,2px)] border border-[var(--color-border)] shadow-md transition-colors duration-150" style={{ backgroundColor: c }} />
              <span className="font-mono text-[9px] text-[var(--color-textMuted)]">{c}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-center pt-2">
        <Button onClick={handleMix} variant="primary" className="w-full max-w-sm py-2">
          Generate Blended Spec
        </Button>
      </div>

      {/* Output Panel & Tabs */}
      <Card className="flex flex-col space-y-3 min-h-[300px]">
        <div className="flex space-x-4 border-b border-[var(--color-border)] pb-1.5 text-xs font-semibold">
          <button 
            onClick={() => setActiveTab("prompt")}
            className={`pb-1 px-1 bg-transparent border-0 cursor-pointer transition-colors ${activeTab === "prompt" ? "text-[var(--color-accent)] font-bold border-b border-solid border-[var(--color-accent)]" : "text-[var(--color-textMuted)] hover:text-[var(--color-text)]"}`}
          >
            Blended Prompt Output
          </button>
          <button 
            onClick={() => setActiveTab("variables")}
            className={`pb-1 px-1 bg-transparent border-0 cursor-pointer transition-colors ${activeTab === "variables" ? "text-[var(--color-accent)] font-bold border-b border-solid border-[var(--color-accent)]" : "text-[var(--color-textMuted)] hover:text-[var(--color-text)]"}`}
          >
            CSS Variables
          </button>
          <button 
            onClick={() => setActiveTab("tailwind")}
            className={`pb-1 px-1 bg-transparent border-0 cursor-pointer transition-colors ${activeTab === "tailwind" ? "text-[var(--color-accent)] font-bold border-b border-solid border-[var(--color-accent)]" : "text-[var(--color-textMuted)] hover:text-[var(--color-text)]"}`}
          >
            Tailwind Theme Config
          </button>
        </div>

        <div className="flex-1 flex min-h-0">
          {activeTab === "prompt" && (
            generatedPrompt ? (
              <textarea
                readOnly
                value={generatedPrompt}
                className="w-full flex-1 bg-[var(--color-bgMuted)] border border-[var(--color-border)] p-3 rounded-[var(--radius-md,4px)] text-xs font-mono text-[var(--color-text)] resize-none focus:outline-none leading-relaxed h-[200px]"
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-[var(--color-textMuted)] text-xs text-center p-6 italic opacity-60">
                Configure inputs above and click "Generate Blended Spec" to synthesize your briefing.
              </div>
            )
          )}

          {activeTab === "variables" && (
            <textarea
              readOnly
              value={cssVariables}
              className="w-full flex-1 bg-[var(--color-bgMuted)] border border-[var(--color-border)] p-3 rounded-[var(--radius-md,4px)] text-xs font-mono text-[var(--color-text)] resize-none focus:outline-none leading-relaxed h-[200px]"
            />
          )}

          {activeTab === "tailwind" && (
            <textarea
              readOnly
              value={tailwindConfig}
              className="w-full flex-1 bg-[var(--color-bgMuted)] border border-[var(--color-border)] p-3 rounded-[var(--radius-md,4px)] text-xs font-mono text-[var(--color-text)] resize-none focus:outline-none leading-relaxed h-[200px]"
            />
          )}
        </div>

        {((activeTab === "prompt" && generatedPrompt) || (activeTab === "variables" && cssVariables) || (activeTab === "tailwind" && tailwindConfig)) && (
          <div className="flex space-x-2 pt-2 border-t border-[var(--color-border)]">
            <Button onClick={handleCopy} variant="primary" className="py-1">
              {copySuccess ? "✓ Copied" : "Copy Output"}
            </Button>
          </div>
        )}
      </Card>

    </div>
  );
}

export default GenomeMixerPage;
