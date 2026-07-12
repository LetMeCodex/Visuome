const TRANSPARENT = new Set(["transparent", "rgba(0, 0, 0, 0)", "rgba(0,0,0,0)", ""]);

function clamp(value, min = 0, max = 255) {
  return Math.min(max, Math.max(min, value));
}

export function parseCssColor(value) {
  if (!value || TRANSPARENT.has(value.trim().toLowerCase())) return null;
  const match = value.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,\/]\s*([\d.]+))?\s*\)/i);
  if (!match) {
    if (/^#[0-9a-f]{3,8}$/i.test(value)) {
      const clean = value.slice(1);
      const normalized = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean.slice(0, 6);
      const number = Number.parseInt(normalized, 16);
      return { r: number >> 16, g: (number >> 8) & 255, b: number & 255, a: 1, original: value };
    }
    return null;
  }
  return {
    r: clamp(Number(match[1])),
    g: clamp(Number(match[2])),
    b: clamp(Number(match[3])),
    a: match[4] === undefined ? 1 : clamp(Number(match[4]), 0, 1),
    original: value,
  };
}

export function rgbToHex({ r, g, b }) {
  return `#${[r, g, b].map((channel) => Math.round(channel).toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}

export function relativeLuminance(color) {
  if (!color) return 0;
  const channels = [color.r, color.g, color.b].map((value) => {
    const normalized = value / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

export function contrastRatio(first, second) {
  const l1 = relativeLuminance(parseCssColor(first));
  const l2 = relativeLuminance(parseCssColor(second));
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function saturation(color) {
  const max = Math.max(color.r, color.g, color.b) / 255;
  const min = Math.min(color.r, color.g, color.b) / 255;
  if (max === min) return 0;
  const light = (max + min) / 2;
  return (max - min) / (1 - Math.abs(2 * light - 1));
}

function toToken(entry, total) {
  const roleCounts = [...entry.roles.entries()].sort((a, b) => b[1] - a[1]);
  return {
    hex: entry.hex,
    originalRgba: entry.original,
    role: roleCounts[0]?.[0] || "Visual token",
    usageCount: entry.count,
    usagePercentage: Number(((entry.count / Math.max(1, total)) * 100).toFixed(1)),
    where: roleCounts.slice(0, 4).map(([role]) => role),
    examples: entry.examples.slice(0, 3),
    luminance: Number(relativeLuminance(entry.color).toFixed(3)),
    saturation: Number(saturation(entry.color).toFixed(3)),
  };
}

export function extractColors(elements) {
  const colors = new Map();
  const gradients = new Map();
  let declarationCount = 0;

  const addColor = (value, role, element) => {
    const parsed = parseCssColor(value);
    if (!parsed || parsed.a < 0.04) return;
    declarationCount += 1;
    const hex = rgbToHex(parsed);
    const entry = colors.get(hex) || { hex, color: parsed, original: value, count: 0, roles: new Map(), examples: [] };
    entry.count += 1;
    entry.roles.set(role, (entry.roles.get(role) || 0) + 1);
    const label = `${element.tagName}${element.role ? ` · ${element.role}` : ""}${element.text ? ` · ${element.text.slice(0, 34)}` : ""}`;
    if (!entry.examples.includes(label)) entry.examples.push(label);
    colors.set(hex, entry);
  };

  for (const element of elements) {
    const { styles } = element;
    addColor(styles.color, /button|cta|link/.test(String(element.role).toLowerCase()) ? "Interactive text" : "Text", element);
    addColor(styles.backgroundColor, /body|shell|section|header|navigation/.test(element.role) ? "Background" : "Surface", element);
    addColor(styles.borderColor, "Border", element);
    if (styles.boxShadow && styles.boxShadow !== "none") {
      const shadowColors = styles.boxShadow.match(/rgba?\([^)]*\)|#[0-9a-f]{3,8}/gi) || [];
      shadowColors.forEach((color) => addColor(color, "Shadow", element));
    }
    if (/gradient\(/i.test(styles.backgroundImage || "")) {
      const gradient = styles.backgroundImage;
      const entry = gradients.get(gradient) || { value: gradient, usageCount: 0, examples: [] };
      entry.usageCount += 1;
      if (entry.examples.length < 3) entry.examples.push(`${element.tagName} · ${element.role}`);
      gradients.set(gradient, entry);
    }
  }

  const all = [...colors.values()].map((entry) => toToken(entry, declarationCount)).sort((a, b) => b.usageCount - a.usageCount);
  const byRole = (role) => all.filter((token) => colors.get(token.hex).roles.has(role));
  const backgrounds = [...byRole("Background"), ...byRole("Surface")].filter((token, index, list) => list.findIndex((item) => item.hex === token.hex) === index);
  const text = [...byRole("Text"), ...byRole("Interactive text")].filter((token, index, list) => list.findIndex((item) => item.hex === token.hex) === index);
  const accents = all.filter((token) => token.saturation > 0.38 && token.luminance > 0.035 && token.luminance < 0.92);
  const semanticMap = [
    ["success", /(success|complete|available|online|approved|positive)/i],
    ["warning", /(warning|caution|pending|attention)/i],
    ["danger", /(danger|error|delete|failed|invalid|destructive)/i],
    ["info", /(info|notice|help|learn)/i],
  ];
  const statePalette = [];
  for (const [state, pattern] of semanticMap) {
    const matching = elements.filter((element) => pattern.test(`${element.text} ${element.classTokens.join(" ")} ${element.ariaLabel}`));
    if (!matching.length) continue;
    const candidate = matching.map((element) => parseCssColor(element.styles.backgroundColor) || parseCssColor(element.styles.color)).find(Boolean);
    if (candidate) statePalette.push({ state, hex: rgbToHex(candidate), originalRgba: candidate.original, role: `${state} state` });
  }

  return {
    corePalette: all.slice(0, 10),
    backgroundPalette: backgrounds.filter((token) => token.luminance < 0.96).slice(0, 8),
    surfacePalette: byRole("Surface").slice(0, 8),
    textPalette: text.slice(0, 8),
    accentPalette: accents.slice(0, 8),
    borderPalette: byRole("Border").slice(0, 8),
    gradients: [...gradients.values()].sort((a, b) => b.usageCount - a.usageCount).slice(0, 8),
    statePalette,
  };
}

export function isDarkPalette(colors) {
  const backgrounds = colors.backgroundPalette.length ? colors.backgroundPalette : colors.corePalette;
  if (!backgrounds.length) return false;
  const weighted = backgrounds.reduce((sum, token) => sum + token.luminance * token.usageCount, 0);
  const count = backgrounds.reduce((sum, token) => sum + token.usageCount, 0);
  return weighted / Math.max(1, count) < 0.24;
}
