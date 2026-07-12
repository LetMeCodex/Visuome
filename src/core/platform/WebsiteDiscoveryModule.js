/**
 * Non-destructively scans active DOM anchors and link headers to map same-origin links.
 */
export class WebsiteDiscoveryModule {
  initialize() {
    this.logs = [];
  }

  /**
   * Run structural website discovery on the active DOM context.
   * @param {import('../ScanSession').ScanSession} session
   * @returns {Promise<object>} Discovery payload.
   */
  async scan(session) {
    const currentUrl = window.location.href;
    const origin = window.location.origin;

    const links = [];
    const elements = document.querySelectorAll("a[href]");
    const canonical = document.querySelector("link[rel='canonical']")?.getAttribute("href") || currentUrl;

    const sitemapRefs = [];
    const robotsRefs = [];

    // Search sitemap in link headers
    const sitemapLink = document.querySelector("link[type*='sitemap']");
    if (sitemapLink) {
      sitemapRefs.push(sitemapLink.getAttribute("href"));
    }

    let linksProcessed = 0;
    for (const el of elements) {
      if (linksProcessed >= 200) break; // Capped at max 200 links
      const rawHref = el.getAttribute("href");
      if (!rawHref) continue;

      try {
        const parsed = new URL(rawHref, currentUrl);
        if (parsed.origin === origin) {
          links.push({
            url: parsed.href,
            text: el.textContent?.trim() || "",
            context: el.closest("header") ? "header" : el.closest("footer") ? "footer" : el.closest("nav") ? "navigation" : "body"
          });
          linksProcessed++;
        }
      } catch {
        // Skip unparseable href attributes safely
      }
    }

    return {
      currentUrl,
      origin,
      canonicalUrl: canonical,
      internalLinks: links,
      headerLinks: links.filter(l => l.context === "header"),
      footerLinks: links.filter(l => l.context === "footer"),
      navigationLinks: links.filter(l => l.context === "navigation"),
      sitemapReferences: sitemapRefs,
      robotsReferences: robotsRefs,
      diagnostics: {
        totalLinksScanned: elements.length,
        internalLinksCollected: links.length
      }
    };
  }

  validate(data) {
    return typeof data === "object";
  }

  cleanup() {}
  destroy() {}
}
