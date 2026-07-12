import { Evidence } from "../models/Evidence.js";

const PROPERTIES = [
  "display", "position", "width", "height", "min-width", "max-width", "min-height", "max-height",
  "margin-top", "margin-right", "margin-bottom", "margin-left",
  "padding-top", "padding-right", "padding-bottom", "padding-left",
  "gap", "row-gap", "column-gap",
  "font-family", "font-size", "font-weight", "line-height", "letter-spacing",
  "color", "background-color", "background-image",
  "border-top-width", "border-right-width", "border-bottom-width", "border-left-width",
  "border-top-color", "border-right-color", "border-bottom-color", "border-left-color",
  "border-top-style", "border-right-style", "border-bottom-style", "border-left-style",
  "border-top-left-radius", "border-top-right-radius", "border-bottom-left-radius", "border-bottom-right-radius",
  "box-shadow", "opacity", "overflow", "transform", "transition", "animation", "z-index",
  "flex-direction", "flex-wrap", "align-items", "justify-content",
  "grid-template-columns", "grid-template-rows",
  "object-fit", "aspect-ratio", "pointer-events", "cursor", "visibility"
];

function getCustomPropertyNames() {
  const vars = new Set();
  try {
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.style) {
            for (let i = 0; i < rule.style.length; i++) {
              const name = rule.style[i];
              if (name.startsWith("--")) {
                vars.add(name);
              }
            }
          }
        }
      } catch {
        // Skip cross-origin sheets safely
      }
    }
  } catch {}

  const commonVars = ["--primary", "--secondary", "--background", "--foreground", "--accent", "--font-sans", "--font-mono", "--radius"];
  for (const v of commonVars) vars.add(v);
  return Array.from(vars);
}

function calculateSpecificity(selector) {
  let a = 0, b = 0, c = 0;
  if (selector.includes("#")) a += (selector.split("#").length - 1);
  if (selector.includes(".")) b += (selector.split(".").length - 1);
  if (selector.includes("[")) b += (selector.split("[").length - 1);
  const tags = selector.replace(/[#.[\]]/g, " ").split(/\s+/).filter(Boolean);
  c += tags.length;
  return `${a},${b},${c}`;
}

function getMatchedRules(element) {
  return [];
}

function getPseudoElementData(element, pseudo) {
  let style = null;
  try {
    style = window.getComputedStyle(element, pseudo);
  } catch {}
  if (!style) {
    return { presence: false };
  }
  const content = style.content;
  if (!content || content === "none" || content === "normal" || content === '""') {
    return { presence: false };
  }

  return {
    presence: true,
    content,
    visibility: style.visibility,
    display: style.display,
    boundingBox: {
      width: style.width,
      height: style.height
    },
    computedStyle: {
      color: style.color,
      backgroundColor: style.backgroundColor,
      display: style.display,
      position: style.position
    }
  };
}

export class StyleDiscoveryModule {
  initialize() {
    this.styleRegistry = new Map();
    this.evidences = [];
    this.computedStyleCache = new Map();
    
    this.computedStyleCount = 0;
    this.cssVarCount = 0;
    this.inlineStyleCount = 0;
    this.matchedRuleCount = 0;
    this.pseudoElementCount = 0;
    this.cacheHits = 0;
    this.startTime = 0;
  }

  /**
   * Discovers and captures style details for each element in DOM mapping.
   * @param {import('../ScanSession').ScanSession} session
   * @returns {Promise<Map<string, object>>} Complete Style Registry
   */
  async scan(session) {
    this.startTime = performance.now();
    const domElements = session.data.domElements;
    if (!domElements || domElements.size === 0) {
      console.warn("Visuome StyleDiscoveryModule: No elements registry found inside session context.");
      return this.styleRegistry;
    }

    const customPropertyNames = getCustomPropertyNames();

    for (const [nodeId, element] of domElements.entries()) {
      try {
        const selector = `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ""}${element.className ? `.${Array.from(element.classList).join(".")}` : ""}`;

        let style;
        if (this.computedStyleCache.has(element)) {
          style = this.computedStyleCache.get(element);
          this.cacheHits++;
        } else {
          try {
            style = window.getComputedStyle(element);
          } catch {}
          if (!style) {
            style = { getPropertyValue: () => "" };
          }
          this.computedStyleCache.set(element, style);
          this.computedStyleCount++;
        }

        // 1. Computed Style collection
        const computedStyles = {};
        for (const prop of PROPERTIES) {
          const val = style.getPropertyValue(prop);
          computedStyles[prop] = val;
          this.evidences.push(new Evidence("Computed Style", val, 100, `${selector} -> ${prop}`));
        }

        // 2. CSS variables collection (only run at root levels to avoid redundant replication)
        const cssVariables = [];
        const isRoot = element === document.documentElement || element === document.body || nodeId === "node-0";
        if (isRoot) {
          for (const varName of customPropertyNames) {
            const val = style.getPropertyValue(varName)?.trim();
            if (val) {
              cssVariables.push({ name: varName, value: val });
              this.cssVarCount++;
              this.evidences.push(new Evidence("CSS Variable", val, 90, `${selector} -> ${varName}`));
            }
          }
        }

        // 3. Inline style collection
        const inlineStyles = {};
        if (element.style && element.style.length > 0) {
          for (let i = 0; i < element.style.length; i++) {
            const propName = element.style[i];
            const val = element.style.getPropertyValue(propName);
            inlineStyles[propName] = val;
            this.inlineStyleCount++;
            this.evidences.push(new Evidence("Inline Style", val, 95, `${selector} -> inline::${propName}`));
          }
        }

        // 4. Matched rules collection
        const matchedRules = getMatchedRules(element);
        this.matchedRuleCount += matchedRules.length;

        // 5. Pseudo Elements
        const before = getPseudoElementData(element, "::before");
        const after = getPseudoElementData(element, "::after");
        if (before.presence) this.pseudoElementCount++;
        if (after.presence) this.pseudoElementCount++;

        this.styleRegistry.set(nodeId, {
          computedStyles,
          inlineStyles,
          cssVariables,
          matchedRules,
          pseudoElements: { before, after }
        });
      } catch (error) {
        console.warn(`Visuome StyleDiscoveryModule: Error extracting styles for node "${nodeId}":`, error);
        session.addError(`STYLE_DISCOVERY::${nodeId}`, error);
      }
    }

    session.data.styleRegistry = this.styleRegistry;
    session.data.evidences = (session.data.evidences || []).concat(this.evidences);

    if (!session.data.diagnostics) {
      session.data.diagnostics = {};
    }
    const cacheHitRatio = this.computedStyleCount + this.cacheHits > 0 
      ? this.cacheHits / (this.computedStyleCount + this.cacheHits) 
      : 0;

    session.data.diagnostics.styleStats = {
      computedStyleCount: this.computedStyleCount,
      cssVarCount: this.cssVarCount,
      inlineStyleCount: this.inlineStyleCount,
      matchedRuleCount: this.matchedRuleCount,
      pseudoElementCount: this.pseudoElementCount,
      cacheHits: this.cacheHits,
      cacheMisses: this.computedStyleCount,
      cacheHitRatio: parseFloat(cacheHitRatio.toFixed(2)),
      collectionDurationMs: Math.round(performance.now() - this.startTime)
    };

    return this.styleRegistry;
  }

  validate(data) {
    return data instanceof Map && data.size >= 0;
  }

  cleanup() {
    this.computedStyleCache.clear();
  }

  destroy() {
    this.cleanup();
  }
}
