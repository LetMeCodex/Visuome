export class VisualTreeNode {
  constructor(element, rect, style, inViewport) {
    this.tagName = element.tagName.toLowerCase();
    this.id = element.id || "";
    this.classes = Array.from(element.classList || []);
    this.rect = rect;
    this.inViewport = inViewport;
    this.priority = "Medium"; // Critical | High | Medium | Low | Ignore
    this.componentRole = "unknown";
    this.children = [];
  }
}

export class VisualTree {
  static IGNORED_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE", "META", "LINK", "HEAD", "TITLE"]);

  /**
   * Check if a DOM node should be considered visible.
   * @param {Element} element
   * @param {CSSStyleDeclaration} style
   * @param {DOMRect} rect
   */
  static isVisible(element, style, rect) {
    if (style.display === "none" || style.visibility === "hidden" || parseFloat(style.opacity) === 0) {
      return false;
    }
    if (rect.width === 0 && rect.height === 0) {
      return false;
    }
    return true;
  }

  /**
   * Determine whether element boundaries overlap with the current viewport.
   * @param {DOMRect} rect
   */
  static isInViewport(rect) {
    const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1024;
    const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 768;
    return (
      rect.bottom >= 0 &&
      rect.right >= 0 &&
      rect.top <= viewportHeight &&
      rect.left <= viewportWidth
    );
  }

  /**
   * Classify element focus priority.
   */
  static determinePriority(element, role, rect) {
    const tag = element.tagName.toLowerCase();
    const identity = `${element.id} ${element.className}`.toLowerCase();

    if (identity.includes("hero") || (rect.top < 300 && element.querySelector("h1"))) {
      return "Critical";
    }
    if (tag === "nav" || role === "navigation" || identity.includes("menu") || identity.includes("navbar") || identity.includes("header")) {
      return "High";
    }
    if (tag === "footer" || role === "contentinfo" || identity.includes("footer")) {
      return "Medium";
    }
    if (tag === "button" || tag === "input" || tag === "select" || tag === "textarea") {
      return "Medium";
    }
    return "Medium";
  }

  /**
   * Resolve general component heuristics.
   */
  static identifyComponentRole(element, role) {
    const tag = element.tagName.toLowerCase();
    const identity = `${element.id} ${element.className}`.toLowerCase();

    if (tag === "button" || role === "button" || identity.includes("btn") || identity.includes("button")) return "button";
    if (tag === "input" || tag === "textarea" || tag === "select") return "input";
    if (tag === "nav" || role === "navigation" || identity.includes("navbar")) return "navbar";
    if (tag === "footer") return "footer";
    if (identity.includes("sidebar")) return "sidebar";
    if (identity.includes("card") || identity.includes("tile")) return "card";
    if (identity.includes("carousel") || identity.includes("slider")) return "carousel";
    if (identity.includes("tabs") || identity.includes("tab-list")) return "tabs";
    if (identity.includes("modal") || identity.includes("dialog")) return "modal";
    if (identity.includes("badge")) return "badge";
    if (identity.includes("chip") || identity.includes("pill") || identity.includes("tag")) return "chip";
    if (identity.includes("avatar")) return "avatar";
    if (tag === "img" || tag === "video" || identity.includes("media")) return "media";
    return "unknown";
  }

  /**
   * Traverse the DOM recursively and construct a pruned Visual Tree.
   * @param {Element} element Root element.
   * @returns {VisualTreeNode|null}
   */
  static build(element) {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
      return null;
    }

    if (this.IGNORED_TAGS.has(element.tagName)) {
      return null;
    }

    // Skip Visuome components / extensions UI and ignored elements
    if (element.hasAttribute("data-visuome-ignore") || element.closest?.("[data-visuome-ignore]")) {
      return null;
    }

    let style = null;
    try {
      style = window.getComputedStyle(element);
    } catch {}
    if (!style) {
      return null;
    }
    const rect = element.getBoundingClientRect();

    if (!this.isVisible(element, style, rect)) {
      return null;
    }

    const inViewport = this.isInViewport(rect);
    const node = new VisualTreeNode(element, {
      x: Math.round(rect.x),
      y: Math.round(rect.y),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      top: Math.round(rect.top),
      left: Math.round(rect.left),
      right: Math.round(rect.right),
      bottom: Math.round(rect.bottom)
    }, style, inViewport);

    const role = element.getAttribute("role") || "";
    node.priority = this.determinePriority(element, role, rect);
    node.componentRole = this.identifyComponentRole(element, role);

    for (const child of element.children) {
      const childNode = this.build(child);
      if (childNode) {
        node.children.push(childNode);
      }
    }

    // Decorative wrapper merging logic:
    // If a div node is a generic container with exactly one element child
    // and matching sizes, lift the inner node up to collapse redundancy.
    if (node.children.length === 1 && node.tagName === "div") {
      const singleChild = node.children[0];
      const widthDiff = Math.abs(node.rect.width - singleChild.rect.width);
      const heightDiff = Math.abs(node.rect.height - singleChild.rect.height);
      
      if (widthDiff <= 2 && heightDiff <= 2 && node.classes.length === 0 && !node.id) {
        return singleChild;
      }
    }

    return node;
  }
}
