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

const DEFAULT_PALETTE_A = ["#161616", "#161616", "#e8e4d9", "#1c1c1b", "#282828", "#888888", "#000000", "#ffffff"];
const DEFAULT_PALETTE_B = ["#c9bb3f", "#ffffff", "#1d1d1f", "#f5f5f7", "#e2e8f0", "#666666", "#000000", "#ffffff"];

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
  let cleaned = (hex || "#000").replace("#", "");
  if (cleaned.length === 3) {
    cleaned = cleaned.split("").map(c => c + c).join("");
  }
  if (cleaned.length !== 6) {
    cleaned = "000000";
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

function simulateColors(domain) {
  let hash = 0;
  for (let i = 0; i < domain.length; i++) {
    hash = domain.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color1 = toHex((hash >> 24) & 255, (hash >> 16) & 255, (hash >> 8) & 255);
  const color2 = "#161616";
  const color3 = "#FFFFFF";
  const color4 = "#e8e4d9";
  return [color1, color2, color3, color4];
}

async function crawlCustomUrl(url) {
  let cleanUrl = url.trim();
  if (!/^https?:\/\//i.test(cleanUrl)) {
    cleanUrl = "https://" + cleanUrl;
  }
  
  const response = await fetch(cleanUrl, { headers: { "Accept": "text/html" } });
  if (!response.ok) throw new Error("Crawl request failed");
  const html = await response.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const title = doc.title || new URL(cleanUrl).hostname;
  const domain = new URL(cleanUrl).hostname;

  // Sniff colors
  const hexColors = html.match(/#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\b/g) || [];
  const colorCounts = {};
  hexColors.forEach(c => {
    let canonical = c.toUpperCase();
    if (canonical.length === 4) {
      canonical = "#" + canonical[1] + canonical[1] + canonical[2] + canonical[2] + canonical[3] + canonical[3];
    }
    colorCounts[canonical] = (colorCounts[canonical] || 0) + 1;
  });
  
  const uniqueColors = Object.keys(colorCounts)
    .sort((a, b) => colorCounts[b] - colorCounts[a])
    .slice(0, 8);

  const finalColors = uniqueColors.length >= 2 ? uniqueColors : simulateColors(domain);

  // Sniff fonts
  const fontMatches = html.match(/font-family\s*:\s*['"]?([^'";}]+)['"]?/gi) || [];
  const fontCounts = {};
  fontMatches.forEach(f => {
    const fontName = f.replace(/font-family\s*:\s*/i, "").replace(/['"]/g, "").split(",")[0].trim();
    if (!/^(inherit|sans-serif|serif|monospace|var\()$/i.test(fontName)) {
      fontCounts[fontName] = (fontCounts[fontName] || 0) + 1;
    }
  });
  const topFonts = Object.keys(fontCounts).sort((a, b) => fontCounts[b] - fontCounts[a]);
  const font = topFonts[0] || "Inter";

  return {
    title,
    domain,
    colors: finalColors,
    font,
    simulated: false
  };
}

export function GenomeMixerPage({ designGenome = {}, scans = [], report = {} }) {
  const [genomeAId, setGenomeAId] = useState("");
  const [genomeBId, setGenomeBId] = useState("");
  const [blendWeight, setBlendWeight] = useState(0.5);
  const [mergeStrategy, setMergeStrategy] = useState("Dominant Blend");
  const [activeTab, setActiveTab] = useState("prompt");
  
  const [blendColors, setBlendColors] = useState(true);
  const [blendTypo, setBlendTypo] = useState(true);
  const [blendSpacing, setBlendSpacing] = useState(true);
  
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  // Custom crawled/edited genomes
  const [customGenomes, setCustomGenomes] = useState([]);
  const [editedGenomes, setEditedGenomes] = useState({});

  // Crawling inputs states
  const [crawlUrlA, setCrawlUrlA] = useState("");
  const [crawlUrlB, setCrawlUrlB] = useState("");
  const [crawlingA, setCrawlingA] = useState(false);
  const [crawlingB, setCrawlingB] = useState(false);
  const [showCrawlA, setShowCrawlA] = useState(false);
  const [showCrawlB, setShowCrawlB] = useState(false);
  const [showEditA, setShowEditA] = useState(false);
  const [showEditB, setShowEditB] = useState(false);

  const addCustomGenome = (newGenome) => {
    const id = `custom-${newGenome.domain}-${Date.now()}`;
    const genomeObj = {
      id,
      pageTitle: newGenome.title,
      domain: newGenome.domain,
      designGenome: {
        metadata: { genomeId: id, generatedAt: new Date().toISOString() },
        visualDNA: {
          colors: {
            theme: "Dark",
            dominantPalette: newGenome.colors,
            backgroundColors: [newGenome.colors[1] || "#161616"],
            textColors: [newGenome.colors[2] || "#ffffff"],
            borderColors: [newGenome.colors[3] || "#282828"]
          },
          typography: {
            primaryFontFamily: newGenome.font,
            fontWeights: [400, 500, 700],
            fontSizes: ["12px", "14px", "16px", "24px", "32px"]
          }
        },
        designSystemDNA: {
          radiusScale: ["4px", "8px", "16px"],
          spacingScale: ["4px", "8px", "16px", "32px"]
        },
        layoutDNA: { density: "balanced" }
      }
    };
    setCustomGenomes(prev => [genomeObj, ...prev]);
    return id;
  };

  const handleCrawlA = async () => {
    if (!crawlUrlA) return;
    setCrawlingA(true);
    try {
      const data = await crawlCustomUrl(crawlUrlA);
      const newId = addCustomGenome(data);
      setGenomeAId(newId);
      setShowCrawlA(false);
      setCrawlUrlA("");
    } catch (err) {
      // Simulate fallback
      const domain = crawlUrlA.replace(/^https?:\/\/(www\.)?/i, "").split("/")[0] || "custom-site.com";
      const data = {
        title: domain.split(".")[0],
        domain,
        colors: simulateColors(domain),
        font: "Inter",
        simulated: true
      };
      const newId = addCustomGenome(data);
      setGenomeAId(newId);
      setShowCrawlA(false);
      setCrawlUrlA("");
    } finally {
      setCrawlingA(false);
    }
  };

  const handleCrawlB = async () => {
    if (!crawlUrlB) return;
    setCrawlingB(true);
    try {
      const data = await crawlCustomUrl(crawlUrlB);
      const newId = addCustomGenome(data);
      setGenomeBId(newId);
      setShowCrawlB(false);
      setCrawlUrlB("");
    } catch (err) {
      const domain = crawlUrlB.replace(/^https?:\/\/(www\.)?/i, "").split("/")[0] || "custom-site.com";
      const data = {
        title: domain.split(".")[0],
        domain,
        colors: simulateColors(domain),
        font: "Inter",
        simulated: true
      };
      const newId = addCustomGenome(data);
      setGenomeBId(newId);
      setShowCrawlB(false);
      setCrawlUrlB("");
    } finally {
      setCrawlingB(false);
    }
  };

  // Compile options from presets and active scans
  const allOptions = useMemo(() => {
    const list = scans.map(s => ({
      id: s.id,
      pageTitle: s.pageTitle || s.domain || "Scanned Site",
      domain: s.domain || "scanned.com",
      designGenome: s.designGenome || {}
    }));
    
    if (designGenome && Object.keys(designGenome).length > 0) {
      const scannedDomain = report?.page?.domain || report?.domain || designGenome.metadata?.domain || "augen.pro";
      list.unshift({
        id: "active-scan",
        pageTitle: `Scanned Site (${scannedDomain})`,
        domain: scannedDomain,
        designGenome
      });
    }

    return [...customGenomes, ...list, ...SYSTEM_PRESETS];
  }, [scans, designGenome, customGenomes, report]);

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

  const getGenomeWithEdits = (baseGenome) => {
    if (!baseGenome) return null;
    const edits = editedGenomes[baseGenome.id];
    if (!edits) return baseGenome;

    return {
      ...baseGenome,
      designGenome: {
        ...baseGenome.designGenome,
        visualDNA: {
          ...baseGenome.designGenome.visualDNA,
          colors: {
            ...baseGenome.designGenome.visualDNA?.colors,
            dominantPalette: edits.colors || baseGenome.designGenome.visualDNA?.colors?.dominantPalette
          },
          typography: {
            ...baseGenome.designGenome.visualDNA?.typography,
            primaryFontFamily: edits.font || baseGenome.designGenome.visualDNA?.typography?.primaryFontFamily
          }
        }
      }
    };
  };

  const genomeA = useMemo(() => {
    const base = allOptions.find(o => o.id === genomeAId) || allOptions[0];
    return getGenomeWithEdits(base);
  }, [genomeAId, allOptions, editedGenomes]);

  const genomeB = useMemo(() => {
    const base = allOptions.find(o => o.id === genomeBId) || allOptions[1] || allOptions[0];
    return getGenomeWithEdits(base);
  }, [genomeBId, allOptions, editedGenomes]);

  const handleUpdateFont = (genomeId, newFont) => {
    setEditedGenomes(prev => {
      const existing = prev[genomeId] || {};
      return {
        ...prev,
        [genomeId]: { ...existing, font: newFont }
      };
    });
  };

  const handleUpdateColor = (genomeId, colorIdx, newColor) => {
    setEditedGenomes(prev => {
      const base = allOptions.find(o => o.id === genomeId);
      const originalPalette = base?.designGenome?.visualDNA?.colors?.dominantPalette || ["#161616", "#ffffff", "#e8e4d9", "#c9bb3f"];
      const existing = prev[genomeId] || {};
      const currentPalette = [...(existing.colors || originalPalette)];
      currentPalette[colorIdx] = newColor;
      
      return {
        ...prev,
        [genomeId]: { ...existing, colors: currentPalette }
      };
    });
  };

  // Mathematical blend operations
  const blendedPalette = useMemo(() => {
    if (!genomeA || !genomeB) return [];
    const colorsA = genomeA.designGenome?.visualDNA?.colors?.dominantPalette || [];
    const colorsB = genomeB.designGenome?.visualDNA?.colors?.dominantPalette || [];

    const result = [];
    for (let i = 0; i < 8; i++) {
      const colA = colorsA[i] || DEFAULT_PALETTE_A[i];
      const colB = colorsB[i] || DEFAULT_PALETTE_B[i];
      
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
    const defaultSteps = [4, 8, 12, 16, 24, 32, 48, 64];
    for (let i = 0; i < 8; i++) {
      const valA = scaleA[i] ? parsePx(scaleA[i]) : defaultSteps[i];
      const valB = scaleB[i] ? parsePx(scaleB[i]) : defaultSteps[i];
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
    
    const parsePx = (str) => {
      const num = parseFloat(str) || 0;
      if (num > 100 || str === "9999px" || str === "5002px") return 9999;
      return num;
    };
    
    const result = [];
    const defaultSteps = [2, 4, 8, 12, 16, 24, 32];
    for (let i = 0; i < 7; i++) {
      const valA = scaleA[i] ? parsePx(scaleA[i]) : defaultSteps[i];
      const valB = scaleB[i] ? parsePx(scaleB[i]) : defaultSteps[i];
      
      let blended = 0;
      if (valA > 100 || valB > 100) {
        blended = blendWeight > 0.5 ? valB : valA;
      } else {
        blended = Math.round(valA * (1 - blendWeight) + valB * blendWeight);
      }
      result.push(blended > 100 ? "9999px" : `${blended}px`);
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

    const colorsA = genomeA.designGenome?.visualDNA?.colors?.dominantPalette || [];
    const colorsB = genomeB.designGenome?.visualDNA?.colors?.dominantPalette || [];
    
    const spacingA = genomeA.designGenome?.designSystemDNA?.spacingScale || ["4px", "8px", "16px", "32px"];
    const spacingB = genomeB.designGenome?.designSystemDNA?.spacingScale || ["4px", "8px", "16px", "32px"];

    const radiusA = genomeA.designGenome?.designSystemDNA?.radiusScale || ["4px", "8px", "16px"];
    const radiusB = genomeB.designGenome?.designSystemDNA?.radiusScale || ["4px", "8px", "16px"];

    const densityA = genomeA.designGenome?.layoutDNA?.density || "balanced";
    const densityB = genomeB.designGenome?.layoutDNA?.density || "balanced";

    const fontA = genomeA.designGenome?.visualDNA?.typography?.primaryFontFamily || "System";
    const fontB = genomeB.designGenome?.visualDNA?.typography?.primaryFontFamily || "System";

    const colorsList = blendedPalette.map((c, i) => `  - **Swatch ${i + 1} (Blended Accent/Surface):** \`${c}\``).join("\n");
    const spacingList = blendedSpacingScale.map((s, i) => `  - **Scale Step ${i + 1}:** \`${s}\``).join("\n");
    const radiusList = blendedRadiusScale.map((r, i) => `  - **Radius Step ${i + 1}:** \`${r}\``).join("\n");

    const brief = `# 🎭 ELITE DESIGN SYSTEM DNA BLEND & SPECIFICATION BRIEF
VERSION: 2.0.0
COMPLIANCE TARGET: WCAG 2.1 AA ACCESSIBILITY & PIXEL-PERFECT INTERACTIVE FIDELITY
WEIGHT: ${(blendWeight * 100).toFixed(0)}% ${genomeB.pageTitle} (${genomeB.domain}) / ${((1 - blendWeight) * 100).toFixed(0)}% ${genomeA.pageTitle} (${genomeA.domain})

You are a Principal Design Technologist and Staff Frontend Architect. Your task is to implement a high-fidelity visual interface by synthesizing the visual DNA of two distinct parent sites into a unified design system.

Below is the exact, forensic analysis of both parent websites' design systems, followed by the specific inheritance instructions for the child design system.

---

## 🧬 SECTION 1: PARENT DESIGN GENOMES (FORENSIC ANALYSIS)

### 📐 PARENT SITE A: ${genomeA.pageTitle} (${genomeA.domain})
*   **Brand & Aesthetics:** Focuses on structured layout boundaries, high text-to-canvas contrast ratios, and modular spacing blocks.
*   **Typography:** Display headers and body copy are set to use the typeface family \`${fontA}\`.
*   **Color System:** Core swatches identified on the site: ${colorsA.join(", ")}.
*   **Spacing Grid:** Core spacing scale steps: ${spacingA.join(", ")}.
*   **Corner Radii:** Card corner boundaries follow a scale of: ${radiusA.join(", ")}.
*   **Layout Density:** Enforces a \`${densityA}\` spacing density philosophy.

### 📐 PARENT SITE B: ${genomeB.pageTitle} (${genomeB.domain})
*   **Brand & Aesthetics:** Focuses on fluid color meshes, backdrop blurs, soft layered cards, and wide margins.
*   **Typography:** Typography copy relies on the clean typeface family \`${fontB}\`.
*   **Color System:** Core swatches identified on the site: ${colorsB.join(", ")}.
*   **Spacing Grid:** Core spacing scale steps: ${spacingB.join(", ")}.
*   **Corner Radii:** Card corner boundaries follow a scale of: ${radiusB.join(", ")}.
*   **Layout Density:** Enforces a \`${densityB}\` spacing density philosophy.

---

## 🎛️ SECTION 2: CHILD SYNTHESIS & INHERITANCE SYSTEM (THE MIX)

The child interface must inherit features from both parents based on the selected blend weight of ${(blendWeight * 100).toFixed(0)}% B and ${((1 - blendWeight) * 100).toFixed(0)}% A. Follow these exact inheritance rules:

### 🎨 2.1 COLOR SYSTEM INHERITANCE
The child design system inherits this mathematically blended palette:
  - **Swatch 1 (Canvas Accent):** \`${blendedPalette[0]}\` (Derived from Parent A: \`${colorsA[0] || DEFAULT_PALETTE_A[0]}\` and Parent B: \`${colorsB[0] || DEFAULT_PALETTE_B[0]}\`)
  - **Swatch 2 (Canvas Background):** \`${blendedPalette[1]}\` (Derived from Parent A: \`${colorsA[1] || DEFAULT_PALETTE_A[1]}\` and Parent B: \`${colorsB[1] || DEFAULT_PALETTE_B[1]}\`)
  - **Swatch 3 (Primary Text copy):** \`${blendedPalette[2]}\` (Derived from Parent A: \`${colorsA[2] || DEFAULT_PALETTE_A[2]}\` and Parent B: \`${colorsB[2] || DEFAULT_PALETTE_B[2]}\`)
  - **Swatch 4 (Card Surface):** \`${blendedPalette[3]}\` (Derived from Parent A: \`${colorsA[3] || DEFAULT_PALETTE_A[3]}\` and Parent B: \`${colorsB[3] || DEFAULT_PALETTE_B[3]}\`)
  - **Swatch 5 (Border Outline):** \`${blendedPalette[4]}\` (Derived from Parent A: \`${colorsA[4] || DEFAULT_PALETTE_A[4]}\` and Parent B: \`${colorsB[4] || DEFAULT_PALETTE_B[4]}\`)
  - **Swatch 6 (Muted Copy):** \`${blendedPalette[5]}\` (Derived from Parent A: \`${colorsA[5] || DEFAULT_PALETTE_A[5]}\` and Parent B: \`${colorsB[5] || DEFAULT_PALETTE_B[5]}\`)
  - **Swatch 7 (Dark Shadow):** \`${blendedPalette[6]}\` (Derived from Parent A: \`${colorsA[6] || DEFAULT_PALETTE_A[6]}\` and Parent B: \`${colorsB[6] || DEFAULT_PALETTE_B[6]}\`)
  - **Swatch 8 (Light Highlight):** \`${blendedPalette[7]}\` (Derived from Parent A: \`${colorsA[7] || DEFAULT_PALETTE_A[7]}\` and Parent B: \`${colorsB[7] || DEFAULT_PALETTE_B[7]}\`)

#### Application Guidelines:
1.  **Main Background:** Enforce body canvas color to \`var(--color-blend-2)\`.
2.  **Interactive Accents:** Primary buttons and active states must use \`var(--color-blend-1)\`.
3.  **Dividers & Outlines:** Apply \`var(--color-blend-5)\` for all card borders and header gridlines with a thickness of exactly \`1px\`.
4.  **Contrast:** Maintain a minimum contrast ratio of 4.5:1 (WCAG AA compliance) for all text readability.

### 🔤 2.2 TYPOGRAPHY INHERITANCE & SYSTEM PAIRING
- **Display & Headings:** Use typeface family \`${blendedFontHeading}\`.
  - Set headings letter-spacing tracking to \`-0.025em\` for headings larger than \`2rem\` to capture an elegant editorial feel.
  - Heading line-height must be set to \`1.15\` or \`1.2\`.
- **Body copy & Controls:** Use typeface family \`${blendedFontBody}\`.
  - Set paragraphs and inputs line-height to \`1.5\` or \`1.6\` for reading comfort.
- **Visual pairing hierarchy:**
  - \`h1\` (Hero headlines): \`3rem (48px)\` | Bold | Font Heading
  - \`h2\` (Section headlines): \`2rem (32px)\` | Semibold | Font Heading
  - \`h3\` (Subheaders): \`1.25rem (20px)\` | Medium | Font Heading
  - \`body\` (Standard copy): \`0.875rem (14px)\` | Regular | Font Body

### 📏 2.3 SPACING scale & ROUNDNESS INHERITANCE
- **Blended Spacing steps scale:** ${blendedSpacingScale.join(", ")}
- **Blended Border Radius scale:** ${blendedRadiusScale.join(", ")}

*Inherited Layout Density:*
- The layout density follows the **${mergeStrategy}** blending philosophy. 
- Spacing padding for main grids must map to \`var(--spacing-scale-4)\` (\`${blendedSpacingScale[3]}\`) and container gaps to \`var(--spacing-scale-2)\` (\`${blendedSpacingScale[1]}\`).
- Corner rounded borders must map to \`var(--radius-scale-2)\` (\`${blendedRadiusScale[1]}\`) for card elements, and \`var(--radius-scale-1)\` (\`${blendedRadiusScale[0]}\`) for input controls.

---

## 📦 SECTION 3: COMPONENT LAYOUT ARCHITECTURE SPECIFICATIONS

Implement your visual layout following these unified visual blueprints:

### 3.1 Global Header Component
- **Layout:** Horizontal flex wrapper, height \`64px\`. Center layout grid container of \`1280px\` max-width.
- **Styling:** Set background to base canvas color \`var(--color-bg-base)\` with a backdrop filter blur of \`16px\` and opacity \`85%\`. Add a bottom boundary line styled in \`var(--color-border-grid)\` with a width of exactly \`1px\`.
- **Typography:** Logo styled in bold display heading font \`${blendedFontHeading}\`. Links styled in \`0.875rem\` regular body font \`${blendedFontBody}\`.
- **Interactions:** Apply color hover transition to accent \`var(--color-accent)\`. Easing curve: \`transition: color 0.15s cubic-bezier(0.16, 1, 0.3, 1);\`.

### 3.2 Marketing Hero Component
- **Layout:** Split-column responsive grid layout with a container height of at least \`560px\`. Apply top/bottom paddings mapped to \`var(--spacing-scale-8)\` (\`${blendedSpacingScale[7]}\`).
- **Typography:** Large display header (\`h1\`) styled in heading font \`${blendedFontHeading}\` with color \`var(--color-blend-3)\`.
- **Primary CTA Control:**
  - Background: Solid accent \`var(--color-accent)\`.
  - Typography: Contrasting copy styled in bold body font \`${blendedFontBody}\`.
  - Radius: \`var(--radius-scale-2)\` (\`${blendedRadiusScale[1]}\`).
  - Hover Interaction: Translate scale-up transform \`scale(1.02)\`. Easing: \`transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);\`.
- **Secondary Action Button:**
  - Background: transparent.
  - Border: \`1px\` solid \`var(--color-border-grid)\`.
  - Typography: Styled in copy color \`var(--color-blend-3)\`.
  - Hover Interaction: Background transition to \`var(--color-surface-card)\` with low opacity.

### 3.3 Dynamic Card Grid Component
- **Layout:** 3-column asymmetric layout with grid gaps styled to \`var(--spacing-scale-4)\` (\`${blendedSpacingScale[3]}\`).
- **Card Container:**
  - Background surface: Solid container color \`var(--color-surface-card)\`.
  - Corner radius: \`var(--radius-scale-2)\` (\`${blendedRadiusScale[1]}\`).
  - Border outline: \`1px\` solid \`var(--color-border-grid)\`.
  - Padding: \`24px\` (\`var(--spacing-scale-4)\`).
- **Typography:** Card title styled in bold heading font \`${blendedFontHeading}\` at size \`1.25rem\`. Description paragraphs styled in muted copy \`var(--color-blend-6)\` at size \`0.875rem\`.
- **Interactions:** Subtle card translate-up transform on hover (\`transform: translateY(-4px);\`) with a shadow transition overlay (\`box-shadow: 0 20px 40px -15px rgba(0,0,0,0.4);\`). Easing: \`transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);\`.

### 3.4 Interactive Controls & Input Components
- **Input Fields:**
  - Background: Solid canvas background \`var(--color-bg-base)\`.
  - Border: \`1px\` solid \`var(--color-border-grid)\`.
  - Corner radius: \`var(--radius-scale-1)\` (\`${blendedRadiusScale[0]}\`).
  - Padding: \`10px 14px\` (\`var(--spacing-scale-2)\` / \`var(--spacing-scale-3)\`).
- **Focus State:** Ensure that clicking inside the input highlights the border color to primary accent \`var(--color-accent)\` and adds a soft, subtle outline glow (\`box-shadow: 0 0 0 3px rgba(129, 47, 24, 0.25);\`). Easing: \`transition: all 0.15s ease;\`.

---

## ⚡ SECTION 4: PRODUCTION CODING DIRECTIVE
Initialize the design system styles using the provided CSS Variables and Tailwind Configuration. Construct a semantically clean, highly responsive layout. Ensure components use these interpolated styling variables to create an absolute masterpiece.`;

    setGeneratedPrompt(brief.trim());
    setCopySuccess(false);
  };

  const handleCopy = () => {
    const textToCopy = activeTab === "prompt" ? generatedPrompt : activeTab === "variables" ? cssVariables : tailwindConfig;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

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
          <div className="flex justify-between items-center">
            <span className="font-caption block">Input Genome A</span>
            <div className="flex space-x-1.5">
              <button 
                onClick={() => setShowCrawlA(!showCrawlA)} 
                className="text-[9px] font-mono px-2 py-0.5 bg-[var(--color-bgCard)] border border-[var(--color-border)] rounded text-[var(--color-text)] cursor-pointer hover:border-[var(--color-accent)] focus:outline-none"
              >
                {showCrawlA ? "Cancel" : "+ Crawl URL"}
              </button>
              <button 
                onClick={() => setShowEditA(!showEditA)} 
                className={`text-[9px] font-mono px-2 py-0.5 border rounded cursor-pointer focus:outline-none ${showEditA ? "bg-[var(--color-accent)] text-black border-transparent" : "bg-[var(--color-bgCard)] border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-accent)]"}`}
              >
                {showEditA ? "Save" : "Tweak DNA"}
              </button>
            </div>
          </div>

          {showCrawlA ? (
            <div className="flex space-x-1 items-center animate-fade-in">
              <input
                type="text"
                placeholder="e.g. linear.app"
                value={crawlUrlA}
                onChange={(e) => setCrawlUrlA(e.target.value)}
                className="bg-[var(--color-bgCard)] border border-[var(--color-border)] rounded-[var(--radius-sm,2px)] px-1.5 py-1 text-[10px] text-[var(--color-text)] focus:outline-none font-mono flex-1"
              />
              <button 
                onClick={handleCrawlA} 
                disabled={crawlingA}
                className="px-2 py-1 bg-[var(--color-accent)] text-black rounded text-[10px] font-bold cursor-pointer disabled:opacity-50"
              >
                {crawlingA ? "Analyzing..." : "Go"}
              </button>
            </div>
          ) : (
            <select
              value={genomeAId}
              onChange={(e) => setGenomeAId(e.target.value)}
              className="w-full bg-[var(--color-bgCard)] border border-[var(--color-border)] rounded-[var(--radius-sm,2px)] px-2 py-1.5 focus:outline-none text-[var(--color-text)] font-mono text-xs cursor-pointer"
            >
              {allOptions.map(o => (
                <option key={`a-${o.id}`} value={o.id}>{o.pageTitle} ({o.domain})</option>
              ))}
            </select>
          )}

          {genomeA && (
            <div className="space-y-1 font-mono text-[10px] text-[var(--color-textMuted)] leading-relaxed">
              <div>Font: {genomeA.designGenome?.visualDNA?.typography?.primaryFontFamily || "System"}</div>
              <div className="flex items-center space-x-1.5 pt-1">
                <span>Swatches:</span>
                {Array.from({ length: 8 }).map((_, i) => {
                  const originalPalette = genomeA.designGenome?.visualDNA?.colors?.dominantPalette || [];
                  const c = originalPalette[i] || DEFAULT_PALETTE_A[i];
                  return (
                    <span key={i} className="w-3 h-3 rounded-[var(--radius-xs,2px)] border border-[var(--color-border)] shrink-0" style={{ backgroundColor: c }} />
                  );
                })}
              </div>

              {showEditA && (
                <div className="pt-2 border-t border-[var(--color-border)] mt-2 space-y-2 animate-fade-in">
                  <div className="flex flex-col space-y-0.5">
                    <span className="text-[8px] uppercase text-[var(--color-textMuted)] font-bold">Font Family</span>
                    <input
                      type="text"
                      value={genomeA.designGenome?.visualDNA?.typography?.primaryFontFamily || ""}
                      onChange={(e) => handleUpdateFont(genomeA.id, e.target.value)}
                      className="bg-[var(--color-bgCard)] border border-[var(--color-border)] rounded px-1 py-0.5 text-[9px] text-[var(--color-text)] focus:outline-none font-mono"
                    />
                  </div>
                  <div className="flex flex-col space-y-0.5">
                    <span className="text-[8px] uppercase text-[var(--color-textMuted)] font-bold">Swatches</span>
                    <div className="grid grid-cols-2 gap-1">
                      {Array.from({ length: 8 }).map((_, i) => {
                        const originalPalette = genomeA.designGenome?.visualDNA?.colors?.dominantPalette || [];
                        const c = originalPalette[i] || DEFAULT_PALETTE_A[i];
                        return (
                          <div key={i} className="flex items-center space-x-1">
                            <input
                              type="color"
                              value={c.startsWith("#") && c.length === 7 ? c : "#000000"}
                              onChange={(e) => handleUpdateColor(genomeA.id, i, e.target.value)}
                              className="w-3.5 h-3.5 p-0 bg-transparent border-0 cursor-pointer rounded shrink-0"
                            />
                            <input
                              type="text"
                              value={c}
                              onChange={(e) => handleUpdateColor(genomeA.id, i, e.target.value)}
                              className="bg-[var(--color-bgCard)] border border-[var(--color-border)] rounded px-1 py-0.5 text-[8px] text-[var(--color-text)] focus:outline-none font-mono w-full"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Right Side: Genome B */}
        <Card className="space-y-3 bg-[var(--color-bgMuted)]">
          <div className="flex justify-between items-center">
            <span className="font-caption block">Input Genome B</span>
            <div className="flex space-x-1.5">
              <button 
                onClick={() => setShowCrawlB(!showCrawlB)} 
                className="text-[9px] font-mono px-2 py-0.5 bg-[var(--color-bgCard)] border border-[var(--color-border)] rounded text-[var(--color-text)] cursor-pointer hover:border-[var(--color-accent)] focus:outline-none"
              >
                {showCrawlB ? "Cancel" : "+ Crawl URL"}
              </button>
              <button 
                onClick={() => setShowEditB(!showEditB)} 
                className={`text-[9px] font-mono px-2 py-0.5 border rounded cursor-pointer focus:outline-none ${showEditB ? "bg-[var(--color-accent)] text-black border-transparent" : "bg-[var(--color-bgCard)] border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-accent)]"}`}
              >
                {showEditB ? "Save" : "Tweak DNA"}
              </button>
            </div>
          </div>

          {showCrawlB ? (
            <div className="flex space-x-1 items-center animate-fade-in">
              <input
                type="text"
                placeholder="e.g. notion.so"
                value={crawlUrlB}
                onChange={(e) => setCrawlUrlB(e.target.value)}
                className="bg-[var(--color-bgCard)] border border-[var(--color-border)] rounded-[var(--radius-sm,2px)] px-1.5 py-1 text-[10px] text-[var(--color-text)] focus:outline-none font-mono flex-1"
              />
              <button 
                onClick={handleCrawlB} 
                disabled={crawlingB}
                className="px-2 py-1 bg-[var(--color-accent)] text-black rounded text-[10px] font-bold cursor-pointer disabled:opacity-50"
              >
                {crawlingB ? "Analyzing..." : "Go"}
              </button>
            </div>
          ) : (
            <select
              value={genomeBId}
              onChange={(e) => setGenomeBId(e.target.value)}
              className="w-full bg-[var(--color-bgCard)] border border-[var(--color-border)] rounded-[var(--radius-sm,2px)] px-2 py-1.5 focus:outline-none text-[var(--color-text)] font-mono text-xs cursor-pointer"
            >
              {allOptions.map(o => (
                <option key={`b-${o.id}`} value={o.id}>{o.pageTitle} ({o.domain})</option>
              ))}
            </select>
          )}

          {genomeB && (
            <div className="space-y-1 font-mono text-[10px] text-[var(--color-textMuted)] leading-relaxed">
              <div>Font: {genomeB.designGenome?.visualDNA?.typography?.primaryFontFamily || "System"}</div>
              <div className="flex items-center space-x-1.5 pt-1">
                <span>Swatches:</span>
                {Array.from({ length: 8 }).map((_, i) => {
                  const originalPalette = genomeB.designGenome?.visualDNA?.colors?.dominantPalette || [];
                  const c = originalPalette[i] || DEFAULT_PALETTE_B[i];
                  return (
                    <span key={i} className="w-3 h-3 rounded-[var(--radius-xs,2px)] border border-[var(--color-border)] shrink-0" style={{ backgroundColor: c }} />
                  );
                })}
              </div>

              {showEditB && (
                <div className="pt-2 border-t border-[var(--color-border)] mt-2 space-y-2 animate-fade-in">
                  <div className="flex flex-col space-y-0.5">
                    <span className="text-[8px] uppercase text-[var(--color-textMuted)] font-bold">Font Family</span>
                    <input
                      type="text"
                      value={genomeB.designGenome?.visualDNA?.typography?.primaryFontFamily || ""}
                      onChange={(e) => handleUpdateFont(genomeB.id, e.target.value)}
                      className="bg-[var(--color-bgCard)] border border-[var(--color-border)] rounded px-1 py-0.5 text-[9px] text-[var(--color-text)] focus:outline-none font-mono"
                    />
                  </div>
                  <div className="flex flex-col space-y-0.5">
                    <span className="text-[8px] uppercase text-[var(--color-textMuted)] font-bold">Swatches</span>
                    <div className="grid grid-cols-2 gap-1">
                      {Array.from({ length: 8 }).map((_, i) => {
                        const originalPalette = genomeB.designGenome?.visualDNA?.colors?.dominantPalette || [];
                        const c = originalPalette[i] || DEFAULT_PALETTE_B[i];
                        return (
                          <div key={i} className="flex items-center space-x-1">
                            <input
                              type="color"
                              value={c.startsWith("#") && c.length === 7 ? c : "#000000"}
                              onChange={(e) => handleUpdateColor(genomeB.id, i, e.target.value)}
                              className="w-3.5 h-3.5 p-0 bg-transparent border-0 cursor-pointer rounded shrink-0"
                            />
                            <input
                              type="text"
                              value={c}
                              onChange={(e) => handleUpdateColor(genomeB.id, i, e.target.value)}
                              className="bg-[var(--color-bgCard)] border border-[var(--color-border)] rounded px-1 py-0.5 text-[8px] text-[var(--color-text)] focus:outline-none font-mono w-full"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
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
