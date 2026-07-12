export class DocumentDiscoveryModule {
  initialize() {
    this.data = {};
  }

  /**
   * Scan active page context and gather document metadata.
   * @param {import('../ScanSession').ScanSession} session
   * @returns {Promise<object>} Captured page metadata.
   */
  async scan(session) {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches ||
                   document.body?.classList.contains("dark") ||
                   document.documentElement?.classList.contains("dark") ||
                   document.body?.getAttribute("data-theme") === "dark" ||
                   document.documentElement?.getAttribute("data-theme") === "dark";

    const description = document.querySelector('meta[name="description"]')?.content || "";
    let favicon = "";
    try {
      favicon = document.querySelector('link[rel~="icon"]')?.href || new URL("/favicon.ico", window.location.href).href;
    } catch {
      favicon = "";
    }

    this.data = {
      title: document.title || "",
      description,
      url: window.location.href,
      hostname: window.location.hostname,
      pathname: window.location.pathname,
      favicon,
      language: document.documentElement.lang || "en",
      theme: isDark ? "Dark" : "Light",
      direction: document.documentElement.dir || "ltr",
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      scrollDimensions: {
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight
      },
      devicePixelRatio: window.devicePixelRatio || 1,
      browser: navigator.userAgent,
      timestamp: new Date().toISOString()
    };

    return this.data;
  }

  /**
   * Validate that the metadata is correctly captured.
   * @param {object} data
   * @returns {boolean}
   */
  validate(data) {
    return Boolean(data && data.url && data.title !== undefined);
  }

  cleanup() {}
  destroy() {}
}
