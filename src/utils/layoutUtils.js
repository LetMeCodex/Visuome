function mostCommon(values, fallback = "Not detected") {
  const map = new Map();
  values.filter(Boolean).forEach((value) => map.set(value, (map.get(value) || 0) + 1));
  return [...map.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || fallback;
}

function describeGrid(element) {
  const columns = element.styles.gridTemplateColumns;
  if (!columns || columns === "none") return "";
  const count = columns.includes("repeat(")
    ? Number(columns.match(/repeat\((\d+)/)?.[1] || 0)
    : columns.split(/\s+/).filter(Boolean).length;
  return count ? `${count}-column CSS grid (${columns})` : `CSS grid (${columns})`;
}

export function extractLayout(scan, density) {
  const { elements, page } = scan;
  const header = elements.find((element) => element.role === "header");
  const sidebar = elements.find((element) => element.role === "sidebar navigation");
  const main = elements.find((element) => element.tagName === "main" || element.role === "app shell");
  const grids = elements.filter((element) => /grid/.test(element.styles.display) && element.styles.gridTemplateColumns !== "none");
  const flex = elements.filter((element) => /flex/.test(element.styles.display));
  const sections = elements
    .filter((element) => /section|header|navigation|footer/.test(element.role))
    .sort((a, b) => a.rect.top - b.rect.top)
    .slice(0, 18)
    .map((element, index) => ({
      order: index + 1,
      role: element.role,
      label: element.text || element.ariaLabel || `${element.tagName} section`,
      bounds: element.rect,
      layout: element.styles.display,
    }));
  const maxWidthCandidates = elements
    .filter((element) => /main|section|app shell|content/.test(element.role) && element.rect.width > page.viewport.width * 0.35)
    .map((element) => element.rect.width)
    .sort((a, b) => b - a);
  const contentWidth = main?.rect.width || maxWidthCandidates[0] || page.viewport.width;
  const alignments = elements.map((element) => element.styles.textAlign).filter((value) => value && value !== "start");
  const navDescription = sidebar
    ? `Persistent sidebar (${sidebar.rect.width}px)${header ? ` with ${header.rect.height}px top header` : ""}`
    : header
      ? `Top navigation in a ${header.rect.height}px header`
      : "Content-led navigation without a dominant fixed shell";
  const structure = sidebar
    ? "Application shell with sidebar and a primary content region"
    : header && grids.length
      ? "Top-level header followed by responsive grid-based content sections"
      : "Single-column document flow with nested content regions";

  return {
    structure,
    shell: `${Math.round(contentWidth)}px observed content width inside a ${page.viewport.width}px viewport${sidebar ? `; ${sidebar.rect.width}px sidebar` : ""}`,
    headerHeight: header ? `${header.rect.height}px` : "Not detected",
    sidebarWidth: sidebar ? `${sidebar.rect.width}px` : "Not detected",
    contentMaxWidth: main?.styles.maxWidth && main.styles.maxWidth !== "none" ? main.styles.maxWidth : `${Math.round(contentWidth)}px observed`,
    navigation: navDescription,
    contentFlow: flex.length > grids.length ? "Flex-led composition with stacked responsive regions" : grids.length ? "Grid-led browsing with stacked sections" : "Natural block flow",
    gridSystem: grids.length ? mostCommon(grids.map(describeGrid)) : "No dominant explicit CSS grid detected",
    alignment: mostCommon(alignments, "Primarily left/start aligned"),
    responsiveness: `Fluid widths observed at ${page.viewport.width}px; ${grids.length ? "grid tracks may collapse across breakpoints" : "content relies on flexible block/flex sizing"}`,
    density,
    flexDirections: [...new Set(flex.map((element) => element.styles.flexDirection).filter(Boolean))],
    sections,
  };
}
