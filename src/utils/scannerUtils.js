import { extractColors } from "./colorUtils.js";
import { extractTypography } from "./typographyUtils.js";
import { extractLayout } from "./layoutUtils.js";
import { extractComponents } from "./componentUtils.js";
import { extractMotion } from "./motionUtils.js";
import { classifyPage } from "./classificationUtils.js";
import { buildScorecard } from "./scoreUtils.js";
import { generatePrompts } from "./promptGenerator.js";

const SPACING_PROPERTIES = ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "marginTop", "marginRight", "marginBottom", "marginLeft", "gap", "rowGap", "columnGap"];

function rankedValues(values, limit = 12) {
  const map = new Map();
  values.filter((value) => value && value !== "0px" && value !== "normal" && value !== "auto").forEach((value) => map.set(value, (map.get(value) || 0) + 1));
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([value, count]) => ({ value, count }));
}

function mode(elements, property, fallback = "Not detected") {
  return rankedValues(elements.map((element) => element.styles[property]), 1)[0]?.value || fallback;
}

function extractSpacing(elements, density) {
  const all = [];
  elements.forEach((element) => SPACING_PROPERTIES.forEach((property) => all.push(element.styles[property])));
  const sections = elements.filter((element) => /section|hero/.test(element.role));
  const cards = elements.filter((element) => /card/.test(element.role));
  const buttons = elements.filter((element) => /button|cta/.test(String(element.role).toLowerCase()));
  const nav = elements.filter((element) => /navigation|header/.test(element.role));
  const grids = elements.filter((element) => /grid/.test(element.styles.display));
  return {
    commonValues: rankedValues(all),
    commonPadding: rankedValues(elements.flatMap((element) => [element.styles.paddingTop, element.styles.paddingRight, element.styles.paddingBottom, element.styles.paddingLeft]), 8),
    commonMargin: rankedValues(elements.flatMap((element) => [element.styles.marginTop, element.styles.marginRight, element.styles.marginBottom, element.styles.marginLeft]), 8),
    commonGaps: rankedValues(elements.flatMap((element) => [element.styles.gap, element.styles.rowGap, element.styles.columnGap]), 8),
    sectionPadding: mode(sections, "paddingTop"),
    cardPadding: mode(cards, "paddingTop"),
    buttonPadding: mode(buttons, "padding"),
    navSpacing: mode(nav, "gap"),
    gridGap: mode(grids, "gap"),
    verticalRhythm: rankedValues(elements.map((element) => element.styles.marginBottom), 5).map((item) => item.value).join(", ") || "No dominant rhythm",
    density,
  };
}

function extractRadius(elements) {
  const radiusElements = elements.filter((element) => element.styles.borderRadius && element.styles.borderRadius !== "0px");
  return {
    commonValues: rankedValues(radiusElements.map((element) => element.styles.borderRadius), 10),
    buttons: mode(elements.filter((element) => /button|cta/.test(String(element.role).toLowerCase())), "borderRadius"),
    cards: mode(elements.filter((element) => /card/.test(element.role)), "borderRadius"),
    media: mode(elements.filter((element) => /media|image/.test(element.role)), "borderRadius"),
    inputs: mode(elements.filter((element) => /input|search/.test(element.role)), "borderRadius"),
    pills: mode(elements.filter((element) => /badge|chip/.test(element.role)), "borderRadius"),
    personality: radiusElements.length > elements.length * 0.3 ? "Soft and rounded" : radiusElements.length ? "Selectively rounded" : "Square and structural",
  };
}

function shadowType(value) {
  if (/inset/.test(value)) return "Inset / tactile";
  if (/rgba?\([^)]*(?:0\.[4-9]|,\s*1\))/.test(value)) return "Strong elevation";
  if (/0px 0px|0 0/.test(value)) return "Glow / ambient";
  return "Soft elevation";
}

function extractShadows(elements) {
  const values = new Map();
  elements.forEach((element) => {
    const value = element.styles.boxShadow;
    if (!value || value === "none") return;
    const entry = values.get(value) || { value, usageCount: 0, roles: new Set(), type: shadowType(value) };
    entry.usageCount += 1;
    entry.roles.add(element.role);
    values.set(value, entry);
  });
  return [...values.values()].sort((a, b) => b.usageCount - a.usageCount).slice(0, 12).map((entry) => ({ ...entry, roles: [...entry.roles].slice(0, 5) }));
}

function extractBorders(elements) {
  const values = new Map();
  elements.forEach((element) => {
    if (!element.styles.border || element.styles.borderStyle === "none" || element.styles.borderWidth === "0px") return;
    const value = `${element.styles.borderWidth} ${element.styles.borderStyle} ${element.styles.borderColor}`;
    const entry = values.get(value) || { value, width: element.styles.borderWidth, style: element.styles.borderStyle, color: element.styles.borderColor, usageCount: 0, roles: new Set() };
    entry.usageCount += 1;
    entry.roles.add(element.role);
    values.set(value, entry);
  });
  return [...values.values()].sort((a, b) => b.usageCount - a.usageCount).slice(0, 12).map((entry) => ({ ...entry, roles: [...entry.roles].slice(0, 5), strength: Number.parseFloat(entry.width) >= 2 ? "Strong" : "Low-contrast / divider" }));
}

export function buildReport(scan) {
  if (!scan?.elements?.length) throw new Error("Not enough visible design data found.");
  const colors = extractColors(scan.elements);
  const classification = classifyPage(scan, colors);
  const typography = extractTypography(scan.elements);
  const spacing = extractSpacing(scan.elements, classification.density);
  const radius = extractRadius(scan.elements);
  const shadows = extractShadows(scan.elements);
  const borders = extractBorders(scan.elements);
  const motion = extractMotion(scan.elements);
  const layout = extractLayout(scan, classification.density);
  const components = extractComponents(scan.elements);
  const report = {
    page: {
      title: scan.page.title,
      url: scan.page.url,
      domain: scan.page.hostname,
      favicon: scan.page.favicon,
      viewport: scan.page.viewport,
    },
    classification,
    designTokens: {
      colors,
      typography,
      spacing,
      radius,
      shadows,
      borders,
      motion: motion.items,
      motionDurations: motion.commonDurations,
      motionPersonality: motion.personality,
    },
    layout,
    components,
    scorecard: {},
    prompts: {},
    debug: {
      scannedElementCount: scan.debug.scannedElementCount,
      usedElementCount: scan.debug.usedElementCount,
      ignoredElementCount: scan.debug.ignoredElementCount,
      scanDurationMs: scan.debug.durationMs,
      confidenceWarnings: [
        ...(classification.confidence < 60 ? ["The visual system is mixed or lacks enough decisive evidence for a high-confidence primary label."] : []),
        ...(scan.debug.capped ? ["The performance cap was reached; repeated or later DOM nodes were omitted."] : []),
      ],
      limitations: [
        "Analysis reflects visible DOM elements and their current computed state in the active viewport.",
        "Pseudo-elements, cross-origin iframe internals, hover-only states, and stylesheet source variables may not be observable.",
        "Semantic labels are heuristic and should be reviewed before production use.",
        "No form values, passwords, typed emails, or payment-field values are collected.",
      ],
    },
  };
  report.scorecard = buildScorecard(report, scan.elements);
  report.prompts = scan.promptRegistry || generatePrompts(report);
  report.timings = scan.timings || {};
  report.designGenome = scan.designGenome;
  report.platformRegistry = scan.platformRegistry;
  report.visualLanguageRegistry = scan.visualLanguageRegistry;
  report.semanticRegistry = scan.semanticRegistry;
  report.designPhilosophyRegistry = scan.designPhilosophyRegistry;
  report.motionRegistry = scan.motionRegistry;
  report.motionSemanticRegistry = scan.motionSemanticRegistry;
  report.motionPhilosophyRegistry = scan.motionPhilosophyRegistry;
  report.scanResult = scan;
  return report;
}

export function canScanUrl(url = "") {
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) return false;
    return parsed.hostname !== "chromewebstore.google.com";
  } catch {
    return false;
  }
}
