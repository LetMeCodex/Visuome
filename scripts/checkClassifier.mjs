import assert from "node:assert/strict";
import { extractColors } from "../src/utils/colorUtils.js";
import { classifyPage } from "../src/utils/classificationUtils.js";

const baseStyles = {
  display: "block", position: "static", color: "rgb(24, 28, 36)", backgroundColor: "rgb(255, 255, 255)", backgroundImage: "none",
  fontFamily: "Inter, sans-serif", fontSize: "16px", fontWeight: "400", lineHeight: "24px", letterSpacing: "0px", textTransform: "none", textAlign: "start",
  padding: "0px", paddingTop: "0px", paddingRight: "0px", paddingBottom: "0px", paddingLeft: "0px", margin: "0px", marginTop: "0px", marginRight: "0px", marginBottom: "0px", marginLeft: "0px",
  gap: "normal", rowGap: "normal", columnGap: "normal", border: "0px none rgb(0, 0, 0)", borderWidth: "0px", borderColor: "rgb(220, 224, 230)", borderStyle: "none", borderRadius: "0px",
  boxShadow: "none", backdropFilter: "none", transition: "all 0s ease 0s", animation: "none 0s ease 0s 1 normal none running",
};

function element(role, text = "", style = {}, tagName = "div") {
  return { tagName, role, text, ariaLabel: text, classTokens: [], rect: { width: 320, height: 80, top: 0 }, styles: { ...baseStyles, ...style } };
}

function fixture({ domain, title, hints, dark = false, roles = [], padded = false }) {
  const background = dark ? "rgb(18, 18, 18)" : "rgb(255, 255, 255)";
  const color = dark ? "rgb(245, 245, 245)" : "rgb(24, 28, 36)";
  const elements = [element("app shell", "", { backgroundColor: background, color, paddingTop: padded ? "64px" : "0px" }, "main")];
  roles.forEach((role, index) => elements.push(element(role, hints[index % hints.length] || role, {
    backgroundColor: role.includes("card") ? (dark ? "rgb(31, 31, 31)" : "rgb(250, 250, 250)") : background,
    color,
    display: role === "hero section" ? "flex" : role.includes("card") ? "grid" : "block",
    paddingTop: padded && index === 0 ? "72px" : "12px",
    borderRadius: role.includes("card") ? "8px" : "0px",
  }, role.includes("navigation") ? "nav" : role === "hero section" ? "section" : "div")));
  const scan = {
    page: { title, hostname: domain, pathname: "/", metaDescription: hints.join(" "), textHints: hints, viewport: { width: 1440, height: 900 } },
    elements,
  };
  return classifyPage(scan, extractColors(elements));
}

const cases = [
  {
    name: "Spotify",
    expected: "Dark Media Streaming Interface",
    report: fixture({ domain: "open.spotify.com", title: "Spotify Web Player", dark: true, hints: ["Music", "Playlist", "Album", "Artist", "Song", "Listen now", "Browse your library"], roles: ["sidebar navigation", "top navigation", "playlist card", "album card", "media card", "image container", "media card", "image container", "button", "grid item"] }),
    rejects: ["Glassmorphism", "Premium SaaS Landing Page"],
  },
  {
    name: "Vercel",
    expected: ["Premium SaaS Landing Page", "Developer Tool / Docs Platform"],
    report: fixture({ domain: "vercel.com", title: "Vercel", hints: ["Develop. Preview. Ship.", "Product platform for developers", "Deploy with your team", "Customers", "Pricing", "Get started"], roles: ["hero section", "top navigation", "primary CTA", "secondary CTA", "button", "feature card"] }),
  },
  {
    name: "Stripe",
    expected: "Premium SaaS Landing Page",
    report: fixture({ domain: "stripe.com", title: "Stripe", hints: ["Payments infrastructure for the internet", "Products", "Pricing", "Customers", "Enterprise billing", "Start now"], roles: ["hero section", "top navigation", "primary CTA", "secondary CTA", "feature card", "feature card"] }),
  },
  {
    name: "GitHub",
    expected: "Developer Tool / Docs Platform",
    report: fixture({ domain: "github.com", title: "GitHub", dark: true, hints: ["Repository", "Pull request", "Developer platform", "Code collaboration", "CLI", "Issues"], roles: ["top navigation", "sidebar navigation", "button", "list item", "list item", "content section"] }),
    rejects: ["E-commerce Marketplace", "Glassmorphism"],
  },
  {
    name: "Apple",
    expected: "Minimal Luxury",
    report: fixture({ domain: "apple.com", title: "Apple", padded: true, hints: ["Apple", "iPhone", "Premium crafted experience", "Designed with care"], roles: ["hero section", "top navigation", "image container"] }),
  },
  {
    name: "Wikipedia",
    expected: "Editorial / Blog / Knowledge Platform",
    report: fixture({ domain: "wikipedia.org", title: "Wikipedia", hints: ["The free encyclopedia with references and citations for every article", "Read long-form knowledge written and reviewed by contributors", "Article", "References", "Citation"], roles: ["top navigation", "content section", "content section", "link"] }),
    rejects: ["Premium SaaS Landing Page", "Dashboard/Admin Interface"],
  },
  {
    name: "Amazon",
    expected: "E-commerce Marketplace",
    report: fixture({ domain: "amazon.com", title: "Amazon", hints: ["Shop products", "$29.99", "Add to cart", "Checkout", "Customer reviews", "Delivery deals"], roles: ["top navigation", "search bar", "product card", "product card", "image container", "image container", "primary CTA", "button"] }),
  },
];

for (const test of cases) {
  const accepted = Array.isArray(test.expected) ? test.expected : [test.expected];
  assert.ok(accepted.includes(test.report.primaryStyle), `${test.name}: expected ${accepted.join(" or ")}, received ${test.report.primaryStyle}; top scores ${JSON.stringify(test.report.styleScores.slice(0, 3).map(({ style, score }) => ({ style, score })))}`);
  for (const rejected of test.rejects || []) assert.ok(test.report.rejectedStyles.some((item) => item.style === rejected), `${test.name}: expected ${rejected} rejection`);
  console.log(`✓ ${test.name}: ${test.report.primaryStyle} (${test.report.confidence}%)`);
}
