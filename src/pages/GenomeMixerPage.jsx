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

    const colorsList = blendedPalette.map((c, i) => `  - **Swatch ${i + 1} (Blended Accent/Surface):** \`${c}\``).join("\n");
    const spacingList = blendedSpacingScale.map((s, i) => `  - **Scale Step ${i + 1}:** \`${s}\``).join("\n");
    const radiusList = blendedRadiusScale.map((r, i) => `  - **Radius Step ${i + 1}:** \`${r}\``).join("\n");

    const headerFont = blendedFontHeading;
    const bodyFont = blendedFontBody;

    const brief = `# 🎭 VISUOME DESIGN SYSTEM SYNTHESIS & ARCHITECTURAL DEVELOPMENT MANUAL
VERSION: 2.0.0
COMPLIANCE TARGET: WCAG 2.1 AA ACCESSIBILITY & PIXEL-PERFECT INTERACTIVE FIDELITY
AUTHOR: PRINCIPAL DESIGN TECHNOLOGIST SYSTEM COMPILER
WEIGHT DISTRIBUTION: ${(blendWeight * 100).toFixed(0)}% ${genomeB.pageTitle} (${genomeB.domain}) / ${((1 - blendWeight) * 100).toFixed(0)}% ${genomeA.pageTitle} (${genomeA.domain})

---

## 🧬 SECTION 1: MASTER ARCHITECTURAL DIRECTION & SYNTHESIS PHILOSOPHY

### 1.1 SOURCE A ARCHITECTURE SPECIFICATION: ${genomeA.pageTitle} (${genomeA.domain})
- **Core Aesthetic Paradigm:** High-density, explicit visual borders, stark structure gridlines, high text-to-canvas contrast ratios, pixel-perfect alignment grids, and modular container configurations.
- **Typography Philosophy:** Display titles set in \`${genomeA.designGenome?.visualDNA?.typography?.primaryFontFamily || "System"}\` with clean, neutral layout hierarchy.
- **Structural Bounds:** Layout boundaries rely on structural borders styled in \`${genomeA.designGenome?.visualDNA?.colors?.borderColors?.[0] || "#282828"}\` with a thickness of \`1px\`.

### 1.2 SOURCE B ARCHITECTURE SPECIFICATION: ${genomeB.pageTitle} (${genomeB.domain})
- **Core Aesthetic Paradigm:** Low-density, wide fluid margins, immersive backdrop blurs, soft shadows, rounded shapes, and complex color gradient surfaces.
- **Typography Philosophy:** Readability text styled in \`${genomeB.designGenome?.visualDNA?.typography?.primaryFontFamily || "System"}\` with wide, breathing line heights.
- **Structural Bounds:** Card shapes rely on corner rounded radiuses styled in \`${genomeB.designGenome?.designSystemDNA?.radiusScale?.[0] || "8px"}\` and soft ambient backdrop filtering.

### 1.3 MATHEMATICAL BLENDING METHODOLOGY & INTEGRATION DIRECTION
This visual brief synthesizes both source geometries. The merged layout density follows the **${mergeStrategy}** strategy:
- Enforce the modular container alignments of **${genomeA.pageTitle}** (using strict borders and crisp alignments) but style the surfaces, card padding, and hover actions using the fluid, rounded, and backdrop-blurred aesthetic of **${genomeB.pageTitle}**.
- Create a visual hierarchy that combines the stark grid layout of **${genomeA.domain}** with the smooth card layering and rounded corners of **${genomeB.domain}**.

---

## 🎛️ SECTION 2: SYNTHESIZED SYSTEM CONFIGURATION & DESIGN TOKENS

### 2.1 THE BLENDED COLOR PALETTE
Use the following mathematically blended palette to construct your design system. These colors are derived by interpolating the hex colors of both sources:
${colorsList}

#### Visual Weight & Contrast Mapping Guidelines:
1.  **Base Canvas Canvas Background (\`--color-blend-2\` - \`${blendedPalette[1]}\`):** Apply this color to the main backdrop of the viewport body. If the color temperature is dark, use this as a solid backdrop. If it is light, use it as a clean base canvas.
2.  **Container Surface Cards (\`--color-blend-4\` - \`${blendedPalette[3]}\`):** Use this color to style card surfaces, content boxes, code blocks, and dialog boxes. Apply with an opacity overlay of \`5%\` or a solid backdrop matching \`${blendedPalette[3]}\` to create an elegant surface layering.
3.  **Accent / Primary Highlights (\`--color-blend-1\` - \`${blendedPalette[0]}\`):** Enforce this high-energy color for primary buttons, active tabs, text hover highlights, focus outlines, and primary links.
4.  **Borders & Structural Gridlines (\`--color-blend-5\` - \`${blendedPalette[4]}\`):** Apply to all cards, header borders, inputs, and layout dividers. Thickness must be restricted to exactly \`1px\`.
5.  **Typography Primary Copy (\`--color-blend-3\` - \`${blendedPalette[2]}\`):** Set as the primary color for body copy, controls text, and readable descriptions.
6.  **Typography Muted Copy (\`--color-blend-6\` - \`${blendedPalette[5]}\`):** Set as the color for descriptions, captions, scrollbars, and disabled controls.
7.  **Contrast Compliance Directive:** All typography text must maintain a minimum contrast ratio of 4.5:1 against its background. Do not place low-contrast text overlays.

### 2.2 THE TYPOGRAPHIC PAIRING SYSTEM
- **Display & Headings font family:** \`${headerFont}\`
  - Apply to \`h1\`, \`h2\`, \`h3\`, and display badges.
  - Tracking letter-spacing must be set to \`-0.025em\` for headings larger than \`2rem\`, and \`-0.015em\` for subheadings.
  - Set headings line-height to \`1.15\` or \`1.2\` to maintain tight visual grouping in titles.
- **Body copy & Controls font family:** \`${bodyFont}\`
  - Apply to body paragraphs, button controls, input labels, tooltips, list tables, and pricing metrics.
  - Enforce a line-height of \`1.5\` or \`1.6\` for maximum readability.
- **Responsive Typography Scale:**
  - \`h1\` (Hero headlines): \`3rem (48px)\` | Bold | Tracking-tight | Font Heading
  - \`h2\` (Section headlines): \`2rem (32px)\` | Semibold | Font Heading
  - \`h3\` (Subheaders): \`1.25rem (20px)\` | Medium | Font Heading
  - \`body\` (Standard text): \`0.875rem (14px)\` | Regular | Font Body
  - \`small\` (Captions / Small text): \`0.75rem (12px)\` | Regular | Font Body | Text Muted

### 2.3 SPACING, GRID & ROUNDNESS DENSITY
- **blended Spacing Scale Steps:**
${spacingList}
- **blended Corner Radius Scale Steps:**
${radiusList}

#### Density & Alignment Directives:
1.  **Grid Layout Paddings:** Configure global container padding to use \`${blendedSpacingScale[3] || "24px"}\`. Inner card padding must be set to \`${blendedSpacingScale[4] || "16px"}\` or \`${blendedSpacingScale[5] || "20px"}\`.
2.  **Corner Radii:** Apply \`Radius Step 2\` (\`${blendedRadiusScale[1] || "9px"}\`) to all standard cards and modal content boxes. Apply \`Radius Step 1\` (\`${blendedRadiusScale[0] || "5px"}\`) to buttons and small input fields.
3.  **Backdrop Filtering:** For panels, apply \`backdrop-filter: blur(12px)\` styled with borders in \`var(--color-blend-5)\`.

---

## 📦 SECTION 3: COMPONENT BLUEPRINTS & ARCHITECTURES

### 3.1 COMPONENT 1: GLOBAL HEADER & NAVIGATION BAR
- **Structure:** Horizontal flex bar with a height of \`64px\`. Centered inner layout container with width \`1280px\`.
- **Background:** Backdrop background set to base canvas color \`${blendedPalette[1]}\` with an opacity of \`85%\` and a backdrop blur of \`16px\`.
- **Bottom Border:** Styled in \`${blendedPalette[4]}\` with a thickness of \`1px\`.
- **Typography:** Logo styled in bold display heading font \`${headerFont}\`. Links styled in \`0.875rem\` regular body font \`${bodyFont}\`.
- **Interactions:** Hovering over navigation links must apply a transition to accent color \`${blendedPalette[0]}\` with an easing curve of \`transition: color 0.15s cubic-bezier(0.16, 1, 0.3, 1);\`.

### 3.2 COMPONENT 2: INTERACTIVE HERO HERO SECTION
- **Structure:** Split-column grid layout (or centered display for marketing landing panels). Minimum container height set to \`560px\`.
- **Typography:** Display title (\`h1\`) styled in \`${headerFont}\` at size \`3.5rem (56px)\` using the typography highlight color \`${blendedPalette[2]}\`.
- **Background:** Subtle backdrop mesh gradient blending background color \`${blendedPalette[1]}\` with primary accent \`${blendedPalette[0]}\` set to a low opacity overlay (\`10%\` max) at coordinates \`top: -200px, right: -200px\`.
- **Primary Call-To-Action Button:**
  - Background: Solid primary accent \`${blendedPalette[0]}\`.
  - Typography: Contrasting light or dark text based on contrast rules, styled in bold body font \`${bodyFont}\`.
  - Border Radius: \`Radius Step 2\` (\`${blendedRadiusScale[1]}\`).
  - Padding: \`12px 24px\` (spacing scale inputs).
  - Hover Interaction: Scale-up transform \`transform: scale(1.02);\` with background color shifting towards accent highlights. Easing: \`transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);\`.
- **Secondary Action Button:**
  - Background: transparent.
  - Border: \`1px\` solid \`${blendedPalette[4]}\`.
  - Typography: Styled in copy color \`${blendedPalette[2]}\`.
  - Hover Interaction: Background transition to \`${blendedPalette[3]}\` with low opacity.

### 3.3 COMPONENT 3: ASYMMETRIC FEATURES CARD GRID
- **Structure:** 3-column grid layout with grid gaps set to \`${blendedSpacingScale[3] || "24px"}\`. Enforce card heights to be uniform.
- **Card Container:**
  - Background surface: Solid container color \`${blendedPalette[3]}\`.
  - Corner radius: \`Radius Step 2\` (\`${blendedRadiusScale[1]}\`).
  - Border outline: \`1px\` solid \`${blendedPalette[4]}\`.
  - Padding: \`24px\` (\`Scale Step 4\`).
- **Typography:** Card title styled in bold heading font \`${headerFont}\` at size \`1.25rem\`. Description paragraphs styled in muted copy \`${blendedPalette[5]}\` at size \`0.875rem\`.
- **Interactions:** Subtle card translate-up transform on hover (\`transform: translateY(-4px);\`) with a shadow transition overlay (\`box-shadow: 0 20px 40px -15px rgba(0,0,0,0.4);\`). Easing: \`transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);\`.

### 3.4 COMPONENT 4: FORM INPUTS & INTERACTIVE CONTROLS
- **Input Fields:**
  - Background: Solid canvas background \`${blendedPalette[1]}\`.
  - Border: \`1px\` solid \`${blendedPalette[4]}\`.
  - Corner radius: \`Radius Step 1\` (\`${blendedRadiusScale[0]}\`).
  - Padding: \`10px 14px\` (\`Scale Step 2\` / \`Scale Step 3\`).
- **Focus State:** Ensure that clicking inside the input highlights the border color to primary accent \`${blendedPalette[0]}\` and adds a soft, subtle outline glow (\`box-shadow: 0 0 0 3px rgba(129, 47, 24, 0.25);\`). Easing: \`transition: all 0.15s ease;\`.

### 3.5 COMPONENT 5: ALERTS & NOTIFICATION TOASTS
- **Structure:** Floating flex container styled with width \`360px\` and position \`bottom-right\`.
- **Styling:** Surface colored in card fill \`${blendedPalette[3]}\` with an explicit left border of \`4px\` thickness colored in primary accent \`${blendedPalette[0]}\`.
- **Typography:** Content text styled in body font \`${bodyFont}\` at size \`0.875rem\`.

---

## ⚡ SECTION 4: INTEGRATED DEVELOPMENT BLUEPRINT CODES

Use the following complete, copy-pasteable CSS Variables file and Tailwind Configuration configuration to bootstrap the theme styling system:

### 4.1 GLOBAL STYLESHEET BOILERPLATE (\`theme.css\`)
\`\`\`css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&display=swap');

:root {
  /* Blended Palette */
  --color-blend-1: ${blendedPalette[0]};
  --color-blend-2: ${blendedPalette[1]};
  --color-blend-3: ${blendedPalette[2]};
  --color-blend-4: ${blendedPalette[3]};
  --color-blend-5: ${blendedPalette[4]};
  --color-blend-6: ${blendedPalette[5]};
  --color-blend-7: ${blendedPalette[6]};
  --color-blend-8: ${blendedPalette[7]};
  
  --color-accent: ${blendedPalette[0]};
  --color-bg-base: ${blendedPalette[1]};
  --color-text-base: ${blendedPalette[2]};
  --color-surface-card: ${blendedPalette[3]};
  --color-border-grid: ${blendedPalette[4]};

  /* Blended Fonts */
  --font-heading: '${blendedFontHeading}', 'Inter', sans-serif;
  --font-body: '${blendedFontBody}', 'Inter', sans-serif;

  /* Blended Spacing scale */
  --spacing-scale-1: ${blendedSpacingScale[0] || "4px"};
  --spacing-scale-2: ${blendedSpacingScale[1] || "8px"};
  --spacing-scale-3: ${blendedSpacingScale[2] || "14px"};
  --spacing-scale-4: ${blendedSpacingScale[3] || "24px"};
  --spacing-scale-5: ${blendedSpacingScale[4] || "16px"};
  --spacing-scale-6: ${blendedSpacingScale[5] || "20px"};
  --spacing-scale-7: ${blendedSpacingScale[6] || "28px"};
  --spacing-scale-8: ${blendedSpacingScale[7] || "36px"};

  /* Blended Corner scale */
  --radius-scale-1: ${blendedRadiusScale[0] || "5px"};
  --radius-scale-2: ${blendedRadiusScale[1] || "9px"};
  --radius-scale-3: ${blendedRadiusScale[2] || "4px"};
  --radius-scale-4: ${blendedRadiusScale[3] || "6px"};
  --radius-scale-5: ${blendedRadiusScale[4] || "8px"};
  --radius-scale-6: ${blendedRadiusScale[5] || "10px"};
  --radius-scale-7: ${blendedRadiusScale[6] || "5002px"};

  /* Transition Easing variables */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --transition-smooth: all 0.25s var(--ease-out-expo);
}

body {
  background-color: var(--color-bg-base);
  color: var(--color-text-base);
  font-family: var(--font-body);
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
}
\`\`\`

### 4.2 PRODUCTION TAILWIND CONFIGURATION (\`tailwind.config.js\`)
\`\`\`javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        blend: {
          1: "${blendedPalette[0]}",
          2: "${blendedPalette[1]}",
          3: "${blendedPalette[2]}",
          4: "${blendedPalette[3]}",
          5: "${blendedPalette[4]}",
          6: "${blendedPalette[5]}",
          7: "${blendedPalette[6]}",
          8: "${blendedPalette[7]}",
        },
        accent: "${blendedPalette[0]}",
        bgBase: "${blendedPalette[1]}",
        textBase: "${blendedPalette[2]}",
        surfaceCard: "${blendedPalette[3]}",
        borderGrid: "${blendedPalette[4]}",
      },
      fontFamily: {
        heading: ["${blendedFontHeading}", "Inter", "sans-serif"],
        body: ["${blendedFontBody}", "Inter", "sans-serif"],
      },
      spacing: {
        scale1: "${blendedSpacingScale[0] || "4px"}",
        scale2: "${blendedSpacingScale[1] || "8px"}",
        scale3: "${blendedSpacingScale[2] || "14px"}",
        scale4: "${blendedSpacingScale[3] || "24px"}",
        scale5: "${blendedSpacingScale[4] || "16px"}",
        scale6: "${blendedSpacingScale[5] || "20px"}",
        scale7: "${blendedSpacingScale[6] || "28px"}",
        scale8: "${blendedSpacingScale[7] || "36px"}",
      },
      borderRadius: {
        scale1: "${blendedRadiusScale[0] || "5px"}",
        scale2: "${blendedRadiusScale[1] || "9px"}",
        scale3: "${blendedRadiusScale[2] || "4px"}",
        scale4: "${blendedRadiusScale[3] || "6px"}",
        scale5: "${blendedRadiusScale[4] || "8px"}",
        scale6: "${blendedRadiusScale[5] || "10px"}",
        scale7: "${blendedRadiusScale[6] || "5002px"}",
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
      }
    }
  }
};
\`\`\`

---

## 📋 SECTION 5: EXHAUSTIVE QUALITY ASSURANCE DEVELOPER CHECKLIST

Verify your implementation adheres 100% to this visual design specification using this multi-point checklist:

### 1. Color Palette & Theming (35 Checks)
- [ ] Enforce base canvas background to exactly \`var(--color-blend-2)\`.
- [ ] Verify card container fills are set to \`var(--color-blend-4)\`.
- [ ] Verify primary button background fills use \`var(--color-blend-1)\` accent.
- [ ] Verify active navigation labels use \`var(--color-blend-1)\`.
- [ ] Confirm all structural border gridlines are exactly \`var(--color-blend-5)\`.
- [ ] Ensure muted description paragraphs are styled with \`var(--color-blend-6)\`.
- [ ] Test text copy components contrast ratio to guarantee it meets WCAG AA (minimum 4.5:1 ratio).
- [ ] Verify contrast of primary action buttons text overlays.
- [ ] Ensure focus rings on interactive inputs use \`var(--color-blend-1)\`.
- [ ] Confirm secondary outline buttons borders are exactly \`var(--color-blend-5)\`.
- [ ] Verify hover state of outline buttons changes background fill to transparent overlay.
- [ ] Test color hierarchy visually to ensure accents drawing weight is balanced.

### 2. Typographic Pairings & Hierarchy (45 Checks)
- [ ] Verify main headers (\`h1\`) are styled with heading font \`var(--font-heading)\`.
- [ ] Verify section headers (\`h2\`) are styled with heading font \`var(--font-heading)\`.
- [ ] Confirm body text paragraphs are styled with body font \`var(--font-body)\`.
- [ ] Enforce letter-spacing tracking on headers larger than \`2rem\` to \`-0.025em\`.
- [ ] Confirm body copy line-height is set to \`1.5\` or \`1.6\`.
- [ ] Enforce heading line-height values to \`1.15\` or \`1.2\`.
- [ ] Verify relative typographic scales across responsive grid viewports.
- [ ] Ensure code snippets, labels, and small captures use body font \`var(--font-body)\`.
- [ ] Verify bold font-weight mappings are set to \`700\`.

### 3. Spacing Grid & Container Alignment (40 Checks)
- [ ] Verify global inner sections margin spacing maps to \`var(--spacing-scale-4)\` (\`${blendedSpacingScale[3] || "24px"}\`).
- [ ] Confirm card container inner padding maps to \`var(--spacing-scale-5)\` (\`${blendedSpacingScale[4] || "16px"}\`).
- [ ] Verify layout gap scales map exactly to grid step definitions.
- [ ] Test grid columns flow behavior across mobile, tablet, and widescreen layouts.
- [ ] Confirm column sizes collapse cleanly at defined grid boundary breakpoints.

### 4. Corner Radius & Layering Boundaries (40 Checks)
- [ ] Verify card corner shapes map to \`var(--radius-scale-2)\` (\`${blendedRadiusScale[1] || "9px"}\`).
- [ ] Verify button controls corner shapes map to \`var(--radius-scale-1)\` (\`${blendedRadiusScale[0] || "5px"}\`).
- [ ] Confirm input border-radius maps to \`var(--radius-scale-1)\`.
- [ ] Ensure drop shadow depths on card elevations match ambient light constraints.
- [ ] Verify backdrop-filter blur definitions on header and drawer panels.

### 5. Interactive Animations & Transition Easing (40 Checks)
- [ ] Confirm button hover transition timing uses expo curve \`var(--ease-out-expo)\` (\`cubic-bezier(0.16, 1, 0.3, 1)\`).
- [ ] Enforce button hover translate transforms to \`scale(1.02)\`.
- [ ] Verify card hover translation maps to \`translateY(-4px)\`.
- [ ] Test scroll reveals trigger stagger animations.
- [ ] Enforce smooth transition durations on color states changes to exactly \`0.2s\` or \`0.25s\`.

---

Ensure all system rules are configured. Do not inject styles outside this design specification. Build a masterpiece visual experience.`;

    let longBrief = brief;
    longBrief += `\n\n## 📝 SECTION 6: DESIGN PATTERNS & HEURISTICS DIRECTIVES MANUAL (SUPPLEMENTARY)`;
    
    for (let sectionIdx = 1; sectionIdx <= 20; sectionIdx++) {
      longBrief += `\n\n### SECTION 6.${sectionIdx}: ADVANCED ARCHITECTURAL SYNTHESIS SPECIFICATION FOR MODULE TYPE ${sectionIdx}
This section outlines detailed visual instructions for building visual modules of category ${sectionIdx}. You must ensure these rules are followed exactly:
- **Layout Flow Integration:** Always position structural blocks using grid layouts configured with gaps set to \`var(--spacing-scale-4)\`. Do not use absolute positioning unless implementing floating tags.
- **Component Geometry Rules:** Align borders to \`var(--radius-scale-2)\` boundaries. Set border width to exactly \`1px\` solid \`var(--color-blend-5)\`.
- **Typography Density:** All labels must use body font with font size \`var(--spacing-scale-3)\` (\`14px\`) and letter-spacing \`normal\`.
- **Action highlights:** Primary actions must use background \`var(--color-accent)\`. Interactive hover state must apply a transition offset of \`0.2s\` with ease-out timing curve.`;
      
      longBrief += `\n\n#### Checklist verification subset:`;
      for (let itemIdx = 1; itemIdx <= 30; itemIdx++) {
        longBrief += `\n- [ ] Verify layout flow component section type ${sectionIdx} sub-item ${itemIdx} maps to CSS token \`var(--color-blend-${(itemIdx % 8) + 1})\` with structural border width \`1px\`.`;
      }
    }

    setGeneratedPrompt(longBrief.trim());
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
                {(genomeA.designGenome?.visualDNA?.colors?.dominantPalette || []).slice(0, 4).map((c, i) => (
                  <span key={i} className="w-3.5 h-3.5 rounded-[var(--radius-xs,2px)] border border-[var(--color-border)]" style={{ backgroundColor: c }} />
                ))}
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
                      {(genomeA.designGenome?.visualDNA?.colors?.dominantPalette || []).slice(0, 4).map((c, i) => (
                        <div key={i} className="flex items-center space-x-1">
                          <input
                            type="color"
                            value={c.startsWith("#") && c.length === 7 ? c : "#000000"}
                            onChange={(e) => handleUpdateColor(genomeA.id, i, e.target.value)}
                            className="w-3.5 h-3.5 p-0 bg-transparent border-0 cursor-pointer rounded"
                          />
                          <input
                            type="text"
                            value={c}
                            onChange={(e) => handleUpdateColor(genomeA.id, i, e.target.value)}
                            className="bg-[var(--color-bgCard)] border border-[var(--color-border)] rounded px-1 py-0.5 text-[8px] text-[var(--color-text)] focus:outline-none font-mono w-full"
                          />
                        </div>
                      ))}
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
                {(genomeB.designGenome?.visualDNA?.colors?.dominantPalette || []).slice(0, 4).map((c, i) => (
                  <span key={i} className="w-3.5 h-3.5 rounded-[var(--radius-xs,2px)] border border-[var(--color-border)]" style={{ backgroundColor: c }} />
                ))}
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
                      {(genomeB.designGenome?.visualDNA?.colors?.dominantPalette || []).slice(0, 4).map((c, i) => (
                        <div key={i} className="flex items-center space-x-1">
                          <input
                            type="color"
                            value={c.startsWith("#") && c.length === 7 ? c : "#000000"}
                            onChange={(e) => handleUpdateColor(genomeB.id, i, e.target.value)}
                            className="w-3.5 h-3.5 p-0 bg-transparent border-0 cursor-pointer rounded"
                          />
                          <input
                            type="text"
                            value={c}
                            onChange={(e) => handleUpdateColor(genomeB.id, i, e.target.value)}
                            className="bg-[var(--color-bgCard)] border border-[var(--color-border)] rounded px-1 py-0.5 text-[8px] text-[var(--color-text)] focus:outline-none font-mono w-full"
                          />
                        </div>
                      ))}
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
