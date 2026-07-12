export class DomDiscoveryModule {
  initialize() {
    this.nodes = new Map();
    this.counter = 0;
    this.visitedCount = 0;
    this.ignoredCount = 0;
    this.filteredCount = 0;
    this.visibleCount = 0;
  }

  /**
   * Traverse DOM, populate stable Node Registry, and capture raw Node Snapshots.
   * @param {import('../ScanSession').ScanSession} session
   * @returns {Promise<Map<string, object>>} Map of deterministic IDs to snapshots.
   */
  async scan(session) {
    const root = document.body || document.documentElement;
    session.data.sections = []; // Reset sections container
    session.data.domElements = new Map(); // Store DOM element references
    this.traverse(root, null, 0, session);

    session.data.nodeRegistry = this.nodes;

    if (!session.data.diagnostics) {
      session.data.diagnostics = {};
    }
    session.data.diagnostics.visitedNodes = this.visitedCount;
    session.data.diagnostics.ignoredNodes = this.ignoredCount;
    session.data.diagnostics.filteredNodes = this.filteredCount;
    session.data.diagnostics.visibleNodes = this.visibleCount;
    session.data.diagnostics.sectionCount = session.data.sections.length;

    return this.nodes;
  }

  /**
   * Internal pre-order traversal loop.
   */
  traverse(element, parentId, depth, session) {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
      return;
    }

    this.visitedCount++;

    const tag = element.tagName.toUpperCase();
    const ignoredTags = new Set(["SCRIPT", "STYLE", "TEMPLATE", "META", "NOSCRIPT", "HEAD", "LINK", "TITLE"]);

    if (ignoredTags.has(tag) || element.hasAttribute("data-visuome-ignore") || element.closest?.("[data-visuome-ignore]")) {
      this.ignoredCount++;
      return;
    }

    const rect = element.getBoundingClientRect();
    let style = null;
    try {
      style = window.getComputedStyle(element);
    } catch {}

    if (!style) {
      this.ignoredCount++;
      return;
    }

    const isVisible = style.display !== "none" && 
                      style.visibility !== "hidden" && 
                      parseFloat(style.opacity) !== 0 && 
                      (rect.width > 0 || rect.height > 0);

    if (!isVisible) {
      this.filteredCount++;
      return;
    }

    this.visibleCount++;
    const nodeId = `node-${this.counter++}`;

    const attributes = {};
    for (const attr of element.attributes) {
      attributes[attr.name] = attr.value;
    }

    const accessibility = {
      role: element.getAttribute("role") || "",
      label: element.getAttribute("aria-label") || element.getAttribute("aria-labelledby") || "",
      hidden: element.getAttribute("aria-hidden") === "true",
      labeledBy: element.getAttribute("aria-labelledby") || ""
    };

    const boundingBox = {
      x: Math.round(rect.x),
      y: Math.round(rect.y),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      top: Math.round(rect.top),
      left: Math.round(rect.left),
      right: Math.round(rect.right),
      bottom: Math.round(rect.bottom)
    };

    const snapshot = {
      id: nodeId,
      tag: tag.toLowerCase(),
      attributes,
      classes: Array.from(element.classList),
      dataset: { ...element.dataset },
      accessibility,
      boundingBox,
      visibility: true,
      domDepth: depth,
      childrenCount: element.children.length,
      parentId
    };

    // 1. Capture Pseudo-Elements Styling (::before, ::after)
    try {
      const beforeStyle = window.getComputedStyle(element, "::before");
      const beforeContent = beforeStyle?.getPropertyValue("content");
      if (beforeContent && beforeContent !== "none" && beforeContent !== '""') {
        snapshot.pseudoBefore = {
          content: beforeContent,
          color: beforeStyle.color,
          backgroundColor: beforeStyle.backgroundColor,
          display: beforeStyle.display
        };
      }

      const afterStyle = window.getComputedStyle(element, "::after");
      const afterContent = afterStyle?.getPropertyValue("content");
      if (afterContent && afterContent !== "none" && afterContent !== '""') {
        snapshot.pseudoAfter = {
          content: afterContent,
          color: afterStyle.color,
          backgroundColor: afterStyle.backgroundColor,
          display: afterStyle.display
        };
      }
    } catch (e) {}

    // 2. Virtual Lists structure detection
    try {
      const isVirtualList = element.scrollHeight > element.clientHeight * 3 && 
                           element.children.length > 0 && 
                           element.children.length < 30 &&
                           (style.overflowY === "auto" || style.overflowY === "scroll");
      if (isVirtualList) {
        snapshot.isVirtualList = true;
      }
    } catch (e) {}

    // Semantic design-free logical section discovery
    let sectionRole = "Unknown";
    const ariaRole = accessibility.role;
    const lowerTag = tag.toLowerCase();

    const elementId = typeof element.id === "string" ? element.id : "";
    const elementClass = typeof element.className === "string" ? element.className : (element.className?.baseVal || "");

    if (lowerTag === "nav" || ariaRole === "navigation") {
      sectionRole = "Navigation";
    } else if (lowerTag === "footer" || ariaRole === "contentinfo") {
      sectionRole = "Footer";
    } else if (lowerTag === "main" || ariaRole === "main") {
      sectionRole = "Main";
    } else if (lowerTag === "aside" || ariaRole === "complementary") {
      sectionRole = "Sidebar";
    } else if (lowerTag === "dialog" || ariaRole === "dialog") {
      sectionRole = "Dialog";
    } else if (lowerTag === "article" || ariaRole === "article") {
      sectionRole = "Article";
    } else if (lowerTag === "header" || ariaRole === "banner") {
      sectionRole = "Navigation";
    } else if (lowerTag === "section" || ariaRole === "region") {
      sectionRole = "Section";
    } else if (elementId.toLowerCase().includes("hero") || elementClass.toLowerCase().includes("hero")) {
      sectionRole = "Hero";
    }

    if (sectionRole !== "Unknown") {
      snapshot.sectionRole = sectionRole;
      session.data.sections.push({
        nodeId,
        tag: lowerTag,
        role: sectionRole,
        boundingBox
      });
    }

    this.nodes.set(nodeId, snapshot);
    session.data.domElements.set(nodeId, element);

    // 3. Traverse standard DOM children
    for (const child of element.children) {
      this.traverse(child, nodeId, depth + 1, session);
    }

    // 4. Traverse Shadow DOM roots if attached
    if (element.shadowRoot) {
      for (const child of element.shadowRoot.children) {
        this.traverse(child, nodeId, depth + 1, session);
      }
    }

    // 5. Traverse same-origin Nested Iframes
    if (tag === "IFRAME") {
      try {
        const iframeDoc = element.contentDocument || element.contentWindow?.document;
        if (iframeDoc && iframeDoc.body) {
          for (const child of iframeDoc.body.children) {
            this.traverse(child, nodeId, depth + 1, session);
          }
        }
      } catch (e) {}
    }
  }

  validate(data) {
    return data instanceof Map && data.size > 0;
  }

  cleanup() {}
  destroy() {}
}
