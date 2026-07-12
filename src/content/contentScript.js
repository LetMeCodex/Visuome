import { scannerEngine } from "../core/ScannerEngine.js";
import { moduleRegistry } from "../core/ModuleRegistry.js";
import { DocumentDiscoveryModule } from "../core/scanner/DocumentDiscoveryModule.js";
import { DomDiscoveryModule } from "../core/scanner/DomDiscoveryModule.js";
import { VisualTreeModule } from "../core/scanner/VisualTreeModule.js";
import { StyleDiscoveryModule } from "../core/scanner/StyleDiscoveryModule.js";
import { TypographyIntelligenceModule } from "../core/typography/TypographyIntelligenceModule.js";
import { ColorIntelligenceModule } from "../core/colors/ColorIntelligenceModule.js";
import { SpacingIntelligenceModule } from "../core/spacing/SpacingIntelligenceModule.js";
import { LayoutIntelligenceModule } from "../core/layout/LayoutIntelligenceModule.js";
import { ComponentIntelligenceModule } from "../core/components/ComponentIntelligenceModule.js";
import { EvidenceFusionModule } from "../core/scanner/EvidenceFusionModule.js";
import { ConflictResolutionModule } from "../core/scanner/ConflictResolutionModule.js";
import { ConfidenceAnalysisModule } from "../core/scanner/ConfidenceAnalysisModule.js";
import { FinalScanResultModule } from "../core/scanner/FinalScanResultModule.js";
import { VisualLanguageModule } from "../core/visual-language/VisualLanguageModule.js";
import { SemanticModule } from "../core/semantic/SemanticModule.js";
import { DesignPhilosophyModule } from "../core/design-philosophy/DesignPhilosophyModule.js";
import { MotionModule } from "../core/motion/MotionModule.js";
import { ScanDiagnosticsModule } from "../core/scanner/ScanDiagnosticsModule.js";
import { PlatformModule } from "../core/platform/PlatformModule.js";
import { GenomeModule } from "../core/genome/GenomeModule.js";
import { GenomeValidateModule } from "../core/genome/GenomeValidateModule.js";
import { GenomeFreezeModule } from "../core/genome/GenomeFreezeModule.js";
import { PromptStudioModule } from "../core/prompt-studio/PromptStudioModule.js";
import { PromptComposerModule } from "../core/prompt-composer/PromptComposerModule.js";
import { ExportModule } from "../core/prompt-export/ExportModule.js";

try {
  moduleRegistry.register("DOCUMENT_DISCOVERY", new DocumentDiscoveryModule());
  moduleRegistry.register("DOM_DISCOVERY", new DomDiscoveryModule());
  moduleRegistry.register("VISUAL_TREE_BUILD", new VisualTreeModule());
  moduleRegistry.register("STYLE_DISCOVERY", new StyleDiscoveryModule());
  moduleRegistry.register("TYPOGRAPHY_INTELLIGENCE", new TypographyIntelligenceModule());
  moduleRegistry.register("COLOR_INTELLIGENCE", new ColorIntelligenceModule());
  moduleRegistry.register("SPACING_INTELLIGENCE", new SpacingIntelligenceModule());
  moduleRegistry.register("LAYOUT_INTELLIGENCE", new LayoutIntelligenceModule());
  moduleRegistry.register("COMPONENT_INTELLIGENCE", new ComponentIntelligenceModule());
  moduleRegistry.register("EVIDENCE_FUSION", new EvidenceFusionModule());
  moduleRegistry.register("CONFLICT_RESOLUTION", new ConflictResolutionModule());
  moduleRegistry.register("CONFIDENCE_ANALYSIS", new ConfidenceAnalysisModule());
  moduleRegistry.register("SCAN_DIAGNOSTICS", new ScanDiagnosticsModule());
  moduleRegistry.register("FINAL_SCAN_RESULT", new FinalScanResultModule());
  moduleRegistry.register("VISUAL_LANGUAGE_INTELLIGENCE", new VisualLanguageModule());
  moduleRegistry.register("SEMANTIC_INTELLIGENCE", new SemanticModule());
  moduleRegistry.register("DESIGN_PHILOSOPHY", new DesignPhilosophyModule());
  moduleRegistry.register("MOTION_DISCOVERY", new MotionModule());
  moduleRegistry.register("PLATFORM_INTELLIGENCE", new PlatformModule());
  moduleRegistry.register("DESIGN_GENOME_BUILD", new GenomeModule());
  moduleRegistry.register("DESIGN_GENOME_VALIDATE", new GenomeValidateModule());
  moduleRegistry.register("DESIGN_GENOME_FREEZE", new GenomeFreezeModule());
  moduleRegistry.register("PROMPT_STUDIO_BUILD", new PromptStudioModule());
  moduleRegistry.register("PROMPT_COMPOSER_BUILD", new PromptComposerModule());
  moduleRegistry.register("EXPORT_ENGINE", new ExportModule());
} catch (e) {
  console.debug("Visuome: Modules already registered.");
}

(() => {
  if (globalThis.__VISUOME_INSTALLED__) return;
  globalThis.__VISUOME_INSTALLED__ = true;

  const MAX_MEANINGFUL_ELEMENTS = 1500;
  const MAX_CANDIDATES = 9000;
  const MAX_REPEAT_SIGNATURE = 48;
  const SENSITIVE_TEXT = /(?:[\w.+-]+@[\w.-]+\.[a-z]{2,}|\b(?:\d[ -]*?){12,19}\b|password|passcode|cvv|security code)/i;
  const IGNORED_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE", "META", "LINK", "HEAD", "BR", "WBR", "SOURCE", "TRACK"]);
  const MEANINGFUL_TAGS = new Set(["A", "BUTTON", "INPUT", "SELECT", "TEXTAREA", "FORM", "NAV", "HEADER", "FOOTER", "MAIN", "ASIDE", "SECTION", "ARTICLE", "IMG", "VIDEO", "CANVAS", "SVG", "TABLE", "UL", "OL", "LI", "H1", "H2", "H3", "H4", "DIALOG", "DETAILS", "SUMMARY"]);
  const STYLE_PROPERTIES = [
    "display", "position", "z-index", "color", "background-color", "background-image",
    "font-family", "font-size", "font-weight", "line-height", "letter-spacing", "text-transform", "text-align",
    "padding", "padding-top", "padding-right", "padding-bottom", "padding-left",
    "margin", "margin-top", "margin-right", "margin-bottom", "margin-left",
    "gap", "row-gap", "column-gap", "border", "border-width", "border-color", "border-style", "border-radius",
    "box-shadow", "opacity", "backdrop-filter", "filter", "transition", "animation", "transform", "overflow",
    "object-fit", "aspect-ratio", "width", "height", "max-width", "min-height",
    "grid-template-columns", "grid-template-rows", "flex-direction", "align-items", "justify-content"
  ];

  const camelCase = (property) => property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

  function safeText(value, limit = 80) {
    const text = String(value || "").replace(/\s+/g, " ").trim();
    if (!text || text.length > limit || SENSITIVE_TEXT.test(text)) return "";
    return text;
  }

  function ownText(element) {
    if (["INPUT", "TEXTAREA", "SELECT", "OPTION"].includes(element.tagName) || element.isContentEditable) return "";
    const pieces = [];
    for (const node of element.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) pieces.push(node.textContent || "");
    }
    return safeText(pieces.join(" "));
  }

  function isVisible(element, style, rect) {
    if (!rect || rect.width < 1 || rect.height < 1) return false;
    if (!style) return false;
    if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return false;
    if (element.hidden || element.getAttribute("aria-hidden") === "true") return false;
    const buffer = 120;
    return rect.bottom >= -buffer && rect.right >= -buffer && rect.top <= innerHeight + buffer && rect.left <= innerWidth + buffer;
  }

  function looksMeaningful(element, style, rect) {
    if (MEANINGFUL_TAGS.has(element.tagName)) return true;
    const role = element.getAttribute("role");
    if (role && role !== "presentation" && role !== "none") return true;
    const classNameStr = typeof element.className === "string" ? element.className : (element.className?.baseVal || "");
    const identity = `${element.id} ${classNameStr}`.toLowerCase();
    if (/(card|hero|nav|menu|header|footer|sidebar|panel|dialog|modal|badge|chip|tile|grid|content|search|price|metric|chart|player)/.test(identity)) return true;
    if (style && ["flex", "grid", "inline-flex", "inline-grid"].includes(style.display)) return true;
    if (style && style.backgroundImage && style.backgroundImage !== "none") return true;
    if (style && style.backgroundColor !== "rgba(0, 0, 0, 0)" && (rect.width > 48 || rect.height > 32)) return true;
    if (style && (style.borderStyle !== "none" || style.boxShadow !== "none")) return true;
    return Boolean(ownText(element));
  }

  function visibleTextHints() {
    const selectors = "h1,h2,h3,nav a,button,[role='button'],[role='tab'],main p,article p,label";
    const hints = [];
    for (const element of document.querySelectorAll(selectors)) {
      if (hints.length >= 80) break;
      if (element.closest("form") && !["BUTTON", "A"].includes(element.tagName)) continue;
      let style = null;
      try {
        style = getComputedStyle(element);
      } catch {}
      if (!style) continue;
      const rect = element.getBoundingClientRect();
      if (!isVisible(element, style, rect)) continue;
      const text = safeText(element.textContent, 100);
      if (text && !hints.includes(text)) hints.push(text);
    }
    return hints;
  }

  function getPageContext() {
    const description = document.querySelector('meta[name="description"]')?.content || "";
    const faviconNode = document.querySelector('link[rel~="icon"]');
    let favicon = "";
    try {
      favicon = faviconNode?.href || new URL("/favicon.ico", location.href).href;
    } catch {
      favicon = "";
    }
    return {
      title: safeText(document.title, 180) || document.title.slice(0, 180),
      url: location.href,
      hostname: location.hostname,
      pathname: location.pathname,
      metaDescription: safeText(description, 240),
      favicon,
      viewport: { width: innerWidth, height: innerHeight, devicePixelRatio },
      bodyClasses: Array.from(document.body?.classList || []).slice(0, 30),
      htmlClasses: Array.from(document.documentElement.classList || []).slice(0, 30),
      textHints: visibleTextHints(),
      scannedAt: new Date().toISOString(),
    };
  }

  function detectRole(element, style, rect, text) {
    const tag = element.tagName.toLowerCase();
    const ariaRole = (element.getAttribute("role") || "").toLowerCase();
    const classNameStr = typeof element.className === "string" ? element.className : (element.className?.baseVal || "");
    const identity = `${tag} ${ariaRole} ${element.id} ${classNameStr} ${text}`.toLowerCase();
    const has = (pattern) => pattern.test(identity);
    const hasImage = Boolean(element.querySelector?.("img,picture,video"));
    const isInteractive = tag === "button" || ariaRole === "button" || has(/(^|\s)(btn|button)(\s|$)/);

    if (tag === "header" || ariaRole === "banner" || has(/site-header|app-header|topbar|top-bar/)) return "header";
    if (tag === "footer" || ariaRole === "contentinfo") return "footer";
    if (tag === "nav" || ariaRole === "navigation") {
      if ((rect.width < innerWidth * 0.42 && rect.height > innerHeight * 0.45) || has(/side|drawer/)) return "sidebar navigation";
      return "top navigation";
    }
    if ((tag === "aside" || has(/sidebar|side-nav|sidenav/)) && rect.height > innerHeight * 0.3) return "sidebar navigation";
    if (ariaRole === "dialog" || tag === "dialog" || has(/modal|dialog/)) return has(/modal/) ? "modal" : "dialog";
    if (tag === "form" || ariaRole === "form") return "form";
    if (["input", "textarea", "select"].includes(tag) || ariaRole === "textbox") return has(/search/) || element.getAttribute("type") === "search" ? "search bar" : "input";
    if (isInteractive) {
      if (has(/icon|avatar|control/) && !text) return "icon button";
      if (has(/primary|cta|buy|subscribe|start|get started|sign up|checkout/)) return "primary CTA";
      if (has(/secondary|outline|ghost|cancel|learn more/)) return "secondary CTA";
      return "button";
    }
    if (tag === "a" || ariaRole === "link") return "link";
    if (tag === "table" || ariaRole === "table" || ariaRole === "grid") return "table";
    if (has(/chart|graph|plot/) || ariaRole === "img" && has(/chart|graph/)) return "chart";
    if (has(/metric|stat|kpi|analytics-widget/)) return "metric widget";
    if (has(/carousel|slider|swiper/)) return "carousel";
    if (tag === "video" || has(/video|player|media-container/)) return "video/media container";
    if (["img", "picture"].includes(tag) || ariaRole === "img") return "image container";
    if (has(/badge/)) return "badge";
    if (has(/chip|tag|pill/)) return "chip";
    if (has(/pricing|price-card|plan-card/)) return "pricing card";
    if (has(/testimonial|quote-card/)) return "testimonial card";
    if (has(/product-card|product-tile/)) return "product card";
    if (has(/playlist/)) return "playlist card";
    if (has(/album/)) return "album card";
    if (has(/feature-card|feature-tile/)) return "feature card";
    if (has(/dashboard-card|widget-card/)) return "dashboard card";
    if (has(/media-card|cover-card/) || (hasImage && has(/card|tile/))) return "media card";
    if (has(/card|tile/) || (style && style.borderRadius !== "0px" && style.backgroundColor !== "rgba(0, 0, 0, 0)" && rect.width > 120 && rect.height > 60 && rect.width < innerWidth * 0.8)) return "card";
    if ((tag === "section" || has(/hero/)) && (has(/hero/) || (rect.top < innerHeight && element.querySelector?.("h1")))) return "hero section";
    if (tag === "section" || tag === "article" || ariaRole === "region") return "content section";
    if (tag === "main" || (element === document.body.firstElementChild && rect.width > innerWidth * 0.8)) return "app shell";
    if (tag === "li" || ariaRole === "listitem") return "list item";
    
    let parentStyle = null;
    try {
      if (element.parentElement) {
        parentStyle = getComputedStyle(element.parentElement);
      }
    } catch {}
    if (parentStyle && ["grid", "inline-grid"].includes(parentStyle.display)) return "grid item";
    return "content";
  }

  function styleSnapshot(style) {
    const snapshot = {};
    for (const property of STYLE_PROPERTIES) snapshot[camelCase(property)] = style.getPropertyValue(property);
    return snapshot;
  }

  function elementSnapshot(element, style, rect) {
    const text = ownText(element);
    const parent = element.parentElement;
    const parentIdentity = parent ? `${parent.tagName.toLowerCase()}${parent.id ? `#${parent.id}` : ""}` : "";
    return {
      tagName: element.tagName.toLowerCase(),
      role: detectRole(element, style, rect, text),
      ariaRole: safeText(element.getAttribute("role"), 40),
      ariaLabel: safeText(element.getAttribute("aria-label"), 80),
      id: safeText(element.id, 80),
      classTokens: Array.from(element.classList || []).slice(0, 14),
      text,
      parentHint: parentIdentity,
      childHints: Array.from(element.children).slice(0, 5).map((child) => child.tagName.toLowerCase()),
      rect: {
        x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height),
        top: Math.round(rect.top), left: Math.round(rect.left), right: Math.round(rect.right), bottom: Math.round(rect.bottom),
      },
      styles: styleSnapshot(style),
    };
  }

  async function scanVisibleElements() {
    const elements = [];
    const repeatCounts = new Map();
    let ignoredElementCount = 0;
    let candidateCount = 0;
    const walker = document.createTreeWalker(document.body || document.documentElement, NodeFilter.SHOW_ELEMENT);

    while (walker.nextNode() && candidateCount < MAX_CANDIDATES && elements.length < MAX_MEANINGFUL_ELEMENTS) {
      candidateCount += 1;
      const element = walker.currentNode;
      if (IGNORED_TAGS.has(element.tagName) || element.closest("[data-visuome-ignore]")) {
        ignoredElementCount += 1;
        continue;
      }

      try {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        if (!isVisible(element, style, rect) || !looksMeaningful(element, style, rect)) {
          ignoredElementCount += 1;
          continue;
        }

        const signature = `${element.tagName}|${style.display}|${style.fontSize}|${style.color}|${style.backgroundColor}|${style.borderRadius}|${Math.round(rect.width / 20)}`;
        const seen = repeatCounts.get(signature) || 0;
        if (seen >= MAX_REPEAT_SIGNATURE) {
          ignoredElementCount += 1;
          continue;
        }
        repeatCounts.set(signature, seen + 1);
        elements.push(elementSnapshot(element, style, rect));
      } catch {
        ignoredElementCount += 1;
      }

      if (candidateCount % 250 === 0) await new Promise((resolve) => requestAnimationFrame(resolve));
    }

    if (candidateCount >= MAX_CANDIDATES) ignoredElementCount += Math.max(0, document.getElementsByTagName("*").length - candidateCount);
    return { elements, ignoredElementCount, candidateCount, capped: elements.length >= MAX_MEANINGFUL_ELEMENTS || candidateCount >= MAX_CANDIDATES };
  }

  async function scanPage() {
    const startedAt = performance.now();
    const page = getPageContext();
    const visible = await scanVisibleElements();
    if (!visible.elements.length) throw new Error("NOT_ENOUGH_VISIBLE_DATA");
    return {
      page,
      elements: visible.elements,
      debug: {
        scannedElementCount: visible.candidateCount,
        usedElementCount: visible.elements.length,
        ignoredElementCount: visible.ignoredElementCount,
        capped: visible.capped,
        durationMs: Math.round(performance.now() - startedAt),
      },
    };
  }

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === "VISUOME_HEALTH") {
      sendResponse({ ok: true });
      return false;
    }
    if (message?.type !== "VISUOME_SCAN") return false;
    
    Promise.all([
      scannerEngine.runScan(location.href),
      scanPage()
    ])
      .then(([session, legacyData]) => {
        if (session.scanResult) {
          session.scanResult.evidenceRegistry = [];
        }
        if (session.data) {
          session.data.evidences = [];
        }

        const serializeScanResult = (result) => {
          if (!result) return null;
          return {
            ...result,
            nodeRegistry: Array.from(result.nodeRegistry?.entries() || []),
            styleRegistry: Array.from(result.styleRegistry?.entries() || []),
            evidenceRegistry: []
          };
        };

        const combined = {
          ...legacyData,
          visualTree: session.data.visualTree || null,
          nodeRegistry: Array.from(session.data.nodeRegistry?.entries() || []),
          styleRegistry: Array.from(session.data.styleRegistry?.entries() || []),
          typographyRegistry: session.data.typographyRegistry || null,
          colorRegistry: session.data.colorRegistry || null,
          spacingRegistry: session.data.spacingRegistry || null,
          layoutRegistry: session.data.layoutRegistry || null,
          componentRegistry: session.data.componentRegistry || null,
          visualLanguageRegistry: session.scanResult?.visualLanguageRegistry || null,
          semanticRegistry: session.scanResult?.semanticRegistry || null,
          designPhilosophyRegistry: session.scanResult?.designPhilosophyRegistry || null,
          motionRegistry: session.scanResult?.motionRegistry || null,
          motionSemanticRegistry: session.scanResult?.motionSemanticRegistry || null,
          motionPhilosophyRegistry: session.scanResult?.motionPhilosophyRegistry || null,
          platformRegistry: session.scanResult?.platformRegistry || null,
          designGenome: session.scanResult?.designGenome || null,
          promptRegistry: session.scanResult?.promptRegistry || null,
          promptComposer: session.scanResult?.promptComposer || null,
          promptExports: session.scanResult?.promptExports || null,
          scanResult: serializeScanResult(session.scanResult),
          sections: session.data.sections || [],
          timings: session.data.pipelineTimings || {},
          diagnostics: {
            ...legacyData.debug,
            ...session.data.diagnostics,
            pipelineDurationMs: session.duration,
            errors: session.errors
          }
        };
        const cleanForSerialization = (obj) => {
          if (obj === null || obj === undefined) return obj;
          const ancestors = [];
          const clone = (val) => {
            if (val === null || typeof val !== "object") {
              return val;
            }
            if (val instanceof Map) {
              const res = [];
              for (const [k, v] of val.entries()) {
                res.push([k, clone(v)]);
              }
              return res;
            }
            if (val instanceof Set) {
              return Array.from(val).map(clone);
            }
            if (val instanceof RegExp) {
              return val.toString();
            }
            if (val instanceof Date) {
              return val.toISOString();
            }
            if (typeof val === "function") {
              return undefined;
            }
            if (ancestors.includes(val)) {
              return "[Circular]";
            }
            ancestors.push(val);
            const res = Array.isArray(val) ? [] : {};
            for (const key in val) {
              if (Object.prototype.hasOwnProperty.call(val, key)) {
                if (key === "crawlSession") continue;
                res[key] = clone(val[key]);
              }
            }
            ancestors.pop();
            return res;
          };
          return clone(obj);
        };

        const combinedSafe = cleanForSerialization(combined);
        console.log("SCAN COMPLETE: compiled session properties");
        console.log("PROMPTS SENT TO UI", combinedSafe?.promptRegistry);
        sendResponse({ ok: true, data: combinedSafe });
      })
      .catch((error) => {
        console.error("Visuome: Scanning failure", error);
        sendResponse({ ok: false, error: error?.message || "SCAN_FAILED" });
      });
    return true;
  });
})();
