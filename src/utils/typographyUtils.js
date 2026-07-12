function add(map, value) {
  const normalized = String(value || "").trim();
  if (!normalized || normalized === "normal") return;
  map.set(normalized, (map.get(normalized) || 0) + 1);
}

function ranked(map, limit = 10) {
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([value, count]) => ({ value, count }));
}

function modeFor(elements, property, fallback = "") {
  const values = new Map();
  elements.forEach((element) => add(values, element.styles[property]));
  return ranked(values, 1)[0]?.value || fallback;
}

function typeStyle(element) {
  if (!element) return {};
  return {
    fontFamily: element.styles.fontFamily,
    fontSize: element.styles.fontSize,
    fontWeight: element.styles.fontWeight,
    lineHeight: element.styles.lineHeight,
    letterSpacing: element.styles.letterSpacing,
    textTransform: element.styles.textTransform,
  };
}

export function extractTypography(elements) {
  const families = new Map();
  const sizes = new Map();
  const weights = new Map();
  const lineHeights = new Map();
  const letterSpacing = new Map();
  const transforms = new Map();
  const textElements = elements.filter((element) => element.text || /button|cta|link|input/.test(element.role));

  for (const element of textElements) {
    add(families, element.styles.fontFamily);
    add(sizes, element.styles.fontSize);
    add(weights, element.styles.fontWeight);
    add(lineHeights, element.styles.lineHeight);
    add(letterSpacing, element.styles.letterSpacing);
    add(transforms, element.styles.textTransform);
  }

  const headings = elements.filter((element) => /^h[1-4]$/.test(element.tagName)).sort((a, b) => Number.parseFloat(b.styles.fontSize) - Number.parseFloat(a.styles.fontSize));
  const bodyElements = textElements.filter((element) => ["p", "span", "li", "div", "article"].includes(element.tagName) && Number.parseFloat(element.styles.fontSize) >= 12);
  const buttons = elements.filter((element) => /button|cta/.test(String(element.role).toLowerCase()));
  const primaryFamily = modeFor(bodyElements.length ? bodyElements : textElements, "fontFamily", "system-ui, sans-serif");
  const headingFamily = modeFor(headings, "fontFamily", primaryFamily);
  const personality = /serif/i.test(headingFamily) && !/sans-serif/i.test(headingFamily)
    ? "Editorial, expressive, and reading-led"
    : /mono/i.test(headingFamily)
      ? "Technical, precise, and developer-oriented"
      : headings.some((heading) => Number(heading.styles.fontWeight) >= 700)
        ? "Confident modern sans-serif with strong display hierarchy"
        : "Neutral modern sans-serif with restrained hierarchy";

  return {
    fontFamilies: ranked(families, 8),
    headingFont: headingFamily,
    bodyFont: primaryFamily,
    fallbackStack: primaryFamily.split(",").slice(1).join(",").trim(),
    h1: typeStyle(headings.find((element) => element.tagName === "h1")),
    h2: typeStyle(headings.find((element) => element.tagName === "h2")),
    h3: typeStyle(headings.find((element) => element.tagName === "h3")),
    headingScale: headings.slice(0, 8).map((element) => ({
      role: element.tagName.toUpperCase(),
      text: element.text,
      ...typeStyle(element),
    })),
    bodyText: typeStyle(bodyElements[0] || textElements[0]),
    smallText: typeStyle([...textElements].sort((a, b) => Number.parseFloat(a.styles.fontSize) - Number.parseFloat(b.styles.fontSize))[0]),
    buttonText: typeStyle(buttons[0]),
    commonSizes: ranked(sizes, 10),
    commonWeights: ranked(weights, 8),
    lineHeights: ranked(lineHeights, 8),
    letterSpacing: ranked(letterSpacing, 8),
    textTransforms: ranked(transforms, 6),
    personality,
  };
}
