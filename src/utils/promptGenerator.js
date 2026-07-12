const SAFETY_LINE = "Use this design analysis only for authorized recreation or original inspiration. Do not copy protected logos, brand names, exact text, proprietary images, or copyrighted assets unless you own them or have permission.";

function values(items, selector, limit = 6) {
  return items.slice(0, limit).map(selector).filter(Boolean).join(", ");
}

function paletteLine(colors) {
  const tokens = colors.corePalette.slice(0, 8).map((token) => `${token.hex} (${token.role.toLowerCase()}, ${token.usagePercentage}% observed usage)`);
  return tokens.join(", ") || "Use a restrained semantic palette derived from the supplied tokens";
}

function tokenContext(report) {
  const { classification, designTokens, layout, components } = report;
  const componentNames = Object.entries(components).filter(([, items]) => items.length).map(([name]) => name).join(", ");
  return {
    style: classification.primaryStyle,
    category: classification.industryCategory,
    mood: classification.mood,
    density: classification.density,
    palette: paletteLine(designTokens.colors),
    heading: designTokens.typography.headingFont,
    body: designTokens.typography.bodyFont,
    sizes: values(designTokens.typography.commonSizes, (item) => item.value),
    weights: values(designTokens.typography.commonWeights, (item) => item.value),
    spacing: values(designTokens.spacing.commonValues, (item) => item.value),
    radii: values(designTokens.radius.commonValues, (item) => item.value),
    shadows: values(designTokens.shadows, (item) => item.value, 4) || "minimal/none",
    borders: values(designTokens.borders, (item) => item.value, 4) || "restrained low-contrast dividers",
    motion: values(designTokens.motion, (item) => item.transition || item.animation, 4) || "subtle 150–250ms state transitions",
    layout: `${layout.structure}; ${layout.navigation}; ${layout.gridSystem}; ${layout.contentMaxWidth} content width`,
    components: componentNames || "buttons, navigation, content regions, and responsive media",
  };
}

export function generatePrompts(report) {
  const t = tokenContext(report);
  const shared = `Visual direction: ${t.style} for ${t.category}. Mood: ${t.mood}. Density: ${t.density}. Color tokens: ${t.palette}. Typography: headings use ${t.heading}; body uses ${t.body}; common sizes ${t.sizes || "follow a clear modular scale"}; weights ${t.weights || "400, 500, 700"}. Spacing scale: ${t.spacing || "4px, 8px, 12px, 16px, 24px, 32px, 48px"}. Radius tokens: ${t.radii || "4px, 8px, 12px"}. Shadows: ${t.shadows}. Borders: ${t.borders}. Layout: ${t.layout}. Reusable component families: ${t.components}. Motion: ${t.motion}.`;
  const a11y = "Preserve semantic landmarks, keyboard navigation, visible focus states, touch targets of at least 40px, readable type, text wrapping, and WCAG-aware foreground/background contrast. Respect prefers-reduced-motion.";

  const prompts = {
    figmaPrompt: `Create a polished, original Figma interface guided by this measured visual system. ${shared} Build responsive desktop and mobile frames, define color/text/effect styles, establish auto-layout constraints, and create variants for default, hover, focus, active, disabled, loading, and error states. Keep the composition recognizable as the same design language without reproducing protected content or exact branded layout. ${a11y}\n\n${SAFETY_LINE}`,
    reactTailwindPrompt: `Build an original, production-ready React + Tailwind interface from this design-system analysis. ${shared} Define the extracted colors, type sizes, spacing, radii, shadows, and border treatments as Tailwind theme tokens or CSS variables. Structure the page with semantic header/navigation/main/section/footer regions matching the observed shell and content flow. Implement reusable components for ${t.components}, with responsive grid/flex behavior, fluid content widths, intentional empty/loading/error states, and hover/focus/active states derived from the motion tokens. Keep data, text, and media replaceable; do not hardcode protected brand assets. ${a11y}\n\n${SAFETY_LINE}`,
    v0CursorLovablePrompt: `Generate an implementation-ready web interface in React using Tailwind CSS and small reusable components. ${shared} Start with the page shell and navigation, then implement the visible section order, component variants, forms/media states, responsive behavior, and local interaction state. Use exact extracted token values where supplied; use semantic names such as background, surface, foreground, muted, accent, border, success, warning, and danger. Include realistic but original placeholder content, clean component boundaries, no external API dependency, and no copyrighted source assets. ${a11y}\n\n${SAFETY_LINE}`,
    imageGenerationPrompt: `Create a high-fidelity UI mockup showing an original ${t.style.toLowerCase()} for ${t.category.toLowerCase()}. ${shared} Present a believable complete product surface at desktop aspect ratio with a clear first-viewport focal point, coherent downstream sections, legible hierarchy, reusable component geometry, realistic original media placeholders, and restrained motion implied through state cues. No source-site logo, no copied text, no proprietary imagery, no watermark, and no pixel-identical composition.\n\n${SAFETY_LINE}`,
    designSystemPrompt: `Create a reusable design system and component library based on these measured principles. ${shared} Define primitive and semantic color tokens, type roles, spacing steps, grid/container rules, radius/elevation/border scales, icon guidance, media ratios, and motion durations/easings. Document component anatomy and variants for ${t.components}; include default, hover, focus-visible, active, selected, disabled, loading, empty, success, warning, and error states. Add responsive rules and accessibility acceptance criteria. Keep all naming and examples original.\n\n${SAFETY_LINE}`,
    authorizedRecreationPrompt: `For a site you own or are explicitly authorized to reproduce: recreate the visual structure closely using the extracted design tokens, but replace protected brand assets, text, and images unless authorized. ${shared} Validate responsive behavior, semantic structure, component states, keyboard operation, and contrast. Keep an asset-permission checklist and substitute any item whose ownership is unclear.\n\n${SAFETY_LINE}`,
    originalInspirationPrompt: `Create an original interface inspired by these design principles without copying exact assets, text, logos, or protected layout. ${shared} Change the content hierarchy, page composition, copy, imagery, and branded details while retaining only general principles such as palette relationships, typographic rhythm, density, spacing logic, component geometry, and motion character. ${a11y}\n\n${SAFETY_LINE}`,
  };

  // Add Prompt Studio expected keys as fallbacks
  prompts.masterPrompt = prompts.originalInspirationPrompt;
  prompts.clonePrompt = prompts.authorizedRecreationPrompt;
  prompts.genomeMixerPrompt = prompts.v0CursorLovablePrompt;
  prompts.learningPrompt = prompts.figmaPrompt;
  prompts.developerPrompt = prompts.reactTailwindPrompt;

  return prompts;
}

export { SAFETY_LINE };
