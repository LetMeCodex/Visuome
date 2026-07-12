/**
 * Classifies page layout type strictly based on same-origin URL structures, meta tags, and visible headings.
 */
export class PageClassificationModule {
  initialize() {}

  /**
   * Run heuristics classification on current active page metadata and patterns.
   * @param {import('../ScanSession').ScanSession} session
   * @returns {Promise<string>} Mapped page category keyword.
   */
  async scan(session) {
    const url = window.location.href.toLowerCase();
    const title = (document.title || "").toLowerCase();
    const h1Text = (document.querySelector("h1")?.textContent || "").toLowerCase();
    const textContent = (document.body?.textContent || "").slice(0, 5000).toLowerCase();

    // 1. Checkout
    if (url.includes("/checkout") || url.includes("/cart") || title.includes("checkout") || title.includes("cart")) {
      return "Checkout";
    }

    // 2. Product
    if (url.includes("/product") || url.includes("/shop/") || title.includes("product details")) {
      return "Product";
    }

    // 3. Category
    if (url.includes("/category") || url.includes("/shop") || title.includes("categories")) {
      return "Category";
    }

    // 4. Search
    if (url.includes("/search") || url.includes("q=") || title.includes("search results")) {
      return "Search";
    }

    // 5. Settings
    if (url.includes("/settings") || url.includes("/account") || title.includes("settings") || title.includes("my account")) {
      return "Settings";
    }

    // 6. Authentication
    if (url.includes("/login") || url.includes("/signin") || url.includes("/signup") || url.includes("/register") || title.includes("log in") || title.includes("sign up")) {
      return "Authentication";
    }

    // 7. Dashboard
    if (url.includes("/dashboard") || url.includes("/app") || title.includes("dashboard")) {
      return "Dashboard";
    }

    // 8. Documentation
    if (url.includes("/docs") || url.includes("/wiki") || url.includes("/help") || title.includes("documentation") || title.includes("docs")) {
      return "Documentation";
    }

    // 9. Pricing
    if (url.includes("/pricing") || url.includes("/plans") || title.includes("pricing") || title.includes("plans")) {
      return "Pricing";
    }

    // 10. Contact
    if (url.includes("/contact") || title.includes("contact us") || title.includes("support")) {
      return "Contact";
    }

    // 11. About
    if (url.includes("/about") || title.includes("about us") || title.includes("our team")) {
      return "About";
    }

    // 12. Article
    if (url.includes("/article") || url.includes("/post/") || (url.match(/\/\d{4}\/\d{2}\/\d{2}\//) && textContent.length > 2000)) {
      return "Article";
    }

    // 13. Blog
    if (url.includes("/blog") || title.includes("blog")) {
      return "Blog";
    }

    // 14. Home
    const path = window.location.pathname;
    if (path === "/" || path === "/index.html" || path === "/index.php" || path === "") {
      return "Home";
    }

    // 15. Landing
    if (h1Text && (textContent.includes("sign up for free") || textContent.includes("get started"))) {
      return "Landing";
    }

    return "Unknown";
  }

  validate(data) {
    return typeof data === "string";
  }

  cleanup() {}
  destroy() {}
}
