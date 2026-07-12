import { contrastRatio } from "./colorUtils.js";

function clamp(score) {
  return Math.max(1, Math.min(10, Math.round(score)));
}

function consistencyScore(tokens, elements) {
  const topColors = tokens.colors.corePalette.slice(0, 5).reduce((sum, item) => sum + item.usagePercentage, 0);
  const families = tokens.typography.fontFamilies.length;
  const radii = tokens.radius.commonValues.length;
  return clamp(5 + Math.min(3, topColors / 28) + (families <= 3 ? 1 : 0) + (radii <= 5 ? 1 : 0) - (elements.length < 20 ? 2 : 0));
}

export function buildScorecard(report, elements) {
  const colors = report.designTokens.colors;
  const typography = report.designTokens.typography;
  const layout = report.layout;
  const components = report.components;
  const background = colors.backgroundPalette[0]?.originalRgba || colors.corePalette[0]?.originalRgba;
  const text = colors.textPalette[0]?.originalRgba;
  const contrast = background && text ? contrastRatio(background, text) : 0;
  const componentCount = Object.values(components).reduce((sum, list) => sum + list.length, 0);
  const interactive = elements.filter((element) => /button|cta|link|input|search/.test(String(element.role).toLowerCase()));
  const unnamed = interactive.filter((element) => !element.text && !element.ariaLabel).length;
  const motionCount = report.designTokens.motion.length;
  const visualConsistency = consistencyScore(report.designTokens, elements);
  const colorHarmony = clamp(5 + Math.min(2, colors.corePalette.length / 4) + (colors.accentPalette.length ? 1 : 0) + (contrast >= 4.5 ? 2 : contrast >= 3 ? 1 : 0));
  const typographyStrength = clamp(5 + (typography.headingFont ? 1 : 0) + (typography.bodyFont ? 1 : 0) + Math.min(2, typography.commonSizes.length / 4) + (typography.headingScale.length ? 1 : 0));
  const layoutClarity = clamp(5 + (layout.sections.length ? 1 : 0) + (/grid|flex/i.test(layout.contentFlow) ? 1.5 : 0) + (layout.navigation ? 1 : 0) + (layout.contentMaxWidth ? 1 : 0));
  const componentPolish = clamp(4 + Math.min(3, componentCount / 3) + (report.designTokens.radius.commonValues.length ? 1 : 0) + (report.designTokens.borders.length ? 1 : 0) + (report.designTokens.shadows.length ? 1 : 0));
  const motionQuality = clamp(motionCount ? 6 + Math.min(3, motionCount / 4) : 4);
  const accessibilitySignal = clamp(5 + (contrast >= 4.5 ? 3 : contrast >= 3 ? 1 : 0) + (interactive.length && unnamed / interactive.length < 0.15 ? 2 : 0) - (unnamed > 4 ? 2 : 0));
  const promptUsefulness = clamp(6 + (colors.corePalette.length ? 1 : 0) + (typography.commonSizes.length ? 1 : 0) + (componentCount ? 1 : 0) + (layout.sections.length ? 1 : 0));

  return {
    visualConsistency: { score: visualConsistency, reason: `Dominant colors, ${typography.fontFamilies.length} font stack(s), and ${report.designTokens.radius.commonValues.length} radius token(s) indicate ${visualConsistency >= 8 ? "a cohesive" : "a moderately varied"} system.` },
    colorHarmony: { score: colorHarmony, reason: contrast ? `Primary observed text/background contrast is approximately ${contrast.toFixed(1)}:1; ${colors.accentPalette.length} accent color(s) were identified.` : "The palette is coherent, but a representative contrast pair could not be confirmed." },
    typographyStrength: { score: typographyStrength, reason: `${typography.headingScale.length || 0} heading treatment(s), ${typography.commonSizes.length} common size(s), and a stable body stack were extracted.` },
    layoutClarity: { score: layoutClarity, reason: `${layout.structure}; ${layout.sections.length} major visible region(s) were ordered.` },
    componentPolish: { score: componentPolish, reason: `${componentCount} distinct component treatment(s) were found across buttons, cards, navigation, forms, and media.` },
    motionQuality: { score: motionQuality, reason: motionCount ? `${motionCount} repeated transition/animation pattern(s) create ${report.designTokens.motionPersonality.toLowerCase()}.` : "Little explicit motion was available in computed styles at rest." },
    accessibilitySignal: { score: accessibilitySignal, reason: `${interactive.length - unnamed} of ${interactive.length} visible interactive elements exposed readable text or an ARIA label in the scan.` },
    promptUsefulness: { score: promptUsefulness, reason: "The output includes measured palette, type, spacing, component, layout, responsive, motion, and safety constraints." },
  };
}
