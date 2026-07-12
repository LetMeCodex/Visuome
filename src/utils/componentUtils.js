function uniqueByStyle(elements, limit = 6) {
  const seen = new Set();
  const result = [];
  for (const element of elements) {
    const signature = [element.role, element.styles.backgroundColor, element.styles.color, element.styles.borderRadius, element.styles.padding, element.styles.border, element.styles.boxShadow].join("|");
    if (seen.has(signature)) continue;
    seen.add(signature);
    result.push(element);
    if (result.length >= limit) break;
  }
  return result;
}

function description(element, count) {
  const display = element.styles.display;
  const tone = element.styles.backgroundColor === "rgba(0, 0, 0, 0)" ? "transparent" : "filled";
  return `${count > 1 ? `${count} observed; ` : ""}${tone} ${element.role} using ${display} layout`;
}

function summarize(elements, matcher) {
  const matches = elements.filter((element) => matcher.test(String(element.role || "").toLowerCase()));
  return uniqueByStyle(matches).map((element) => ({
    type: element.role,
    count: matches.filter((candidate) => candidate.role === element.role).length,
    description: description(element, matches.length),
    radius: element.styles.borderRadius,
    padding: element.styles.padding,
    color: element.styles.color,
    background: element.styles.backgroundColor,
    border: element.styles.border,
    shadow: element.styles.boxShadow,
    hoverMotion: element.styles.transition !== "all 0s ease 0s" ? element.styles.transition : "No explicit transition detected",
    dimensions: `${element.rect.width} × ${element.rect.height}px`,
    example: element.text || element.ariaLabel || element.tagName,
  }));
}

export function extractComponents(elements) {
  return {
    buttons: summarize(elements, /button|cta/),
    cards: summarize(elements, /card/),
    navigation: summarize(elements, /navigation|header/),
    forms: summarize(elements, /input|search bar|form/),
    media: summarize(elements, /media|image container|carousel/),
    badges: summarize(elements, /badge|chip/),
    tables: summarize(elements, /table/),
    widgets: summarize(elements, /widget|chart/),
  };
}
