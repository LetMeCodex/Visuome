/**
 * Classifies visible page navigation elements including headers, footers, pagination, and breadcrumbs.
 */
export class NavigationDiscoveryModule {
  initialize() {}

  /**
   * Scans navigation regions in DOM to categorise active menus.
   * @param {import('../ScanSession').ScanSession} session
   * @returns {Promise<object>} Navigation categories layout.
   */
  async scan(session) {
    const primary = [];
    const secondary = [];
    const footer = [];
    const sidebar = [];
    const breadcrumbs = [];
    const pagination = [];

    // 1. Footer links
    const footerElements = document.querySelectorAll("footer a[href]");
    for (const el of footerElements) {
      footer.push({ url: el.href, text: el.textContent?.trim() || "" });
    }

    // 2. Sidebar links
    const sidebarElements = document.querySelectorAll("aside a[href], .sidebar a[href], [class*='sidebar'] a[href]");
    for (const el of sidebarElements) {
      sidebar.push({ url: el.href, text: el.textContent?.trim() || "" });
    }

    // 3. Breadcrumbs
    const breadcrumbElements = document.querySelectorAll("[class*='breadcrumb'] a[href], [aria-label*='breadcrumb'] a[href]");
    for (const el of breadcrumbElements) {
      breadcrumbs.push({ url: el.href, text: el.textContent?.trim() || "" });
    }

    // 4. Pagination
    const paginationElements = document.querySelectorAll("[class*='pagination'] a[href], [aria-label*='pagination'] a[href], [class*='pager'] a[href]");
    for (const el of paginationElements) {
      pagination.push({ url: el.href, text: el.textContent?.trim() || "" });
    }

    // 5. Primary & Secondary
    const navElements = document.querySelectorAll("nav");
    let navIdx = 0;
    for (const nav of navElements) {
      const links = nav.querySelectorAll("a[href]");
      const items = Array.from(links).map(el => ({ url: el.href, text: el.textContent?.trim() || "" }));
      if (navIdx === 0) {
        primary.push(...items);
      } else {
        secondary.push(...items);
      }
      navIdx++;
    }

    return {
      primary,
      secondary,
      footer,
      sidebar,
      breadcrumbs,
      pagination
    };
  }

  validate(data) {
    return typeof data === "object";
  }

  cleanup() {}
  destroy() {}
}
