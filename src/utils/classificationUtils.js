function includesAny(text, terms) {
  return terms.some((term) => text.includes(term));
}

function countRoles(elements, pattern) {
  return elements.filter((element) => pattern.test(String(element.role || "").toLowerCase())).length;
}

function createFeatures(scan, colors) {
  const text = [scan.page.title, scan.page.metaDescription, scan.page.hostname, scan.page.pathname, ...(scan.page.textHints || [])].join(" ").toLowerCase();
  const elements = scan.elements;
  const total = Math.max(1, elements.length);
  const backgrounds = elements.map((element) => element.styles.backgroundColor);
  const translucent = backgrounds.filter((value) => /rgba\([^)]*,\s*0?\.[1-9]/.test(value)).length;
  const blurred = elements.filter((element) => element.styles.backdropFilter && element.styles.backdropFilter !== "none").length;
  const shadowed = elements.filter((element) => element.styles.boxShadow && element.styles.boxShadow !== "none").length;
  const rounded = elements.filter((element) => Number.parseFloat(element.styles.borderRadius) >= 8).length;
  const highContrastBorders = elements.filter((element) => Number.parseFloat(element.styles.borderWidth) >= 2).length;
  const media = countRoles(elements, /media|image container|playlist|album|product card/);
  const cards = countRoles(elements, /card/);
  const buttons = countRoles(elements, /button|cta/);
  const grids = elements.filter((element) => /grid/.test(element.styles.display)).length;
  const longText = scan.page.textHints.filter((hint) => hint.length > 70).length;
  const whitespace = elements.filter((element) => {
    const padding = ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"].map((key) => Number.parseFloat(element.styles[key]) || 0);
    return Math.max(...padding) >= 48;
  }).length;

  return {
    text,
    domain: scan.page.hostname.replace(/^www\./, ""),
    dark: colors.backgroundPalette.length ? colors.backgroundPalette.slice(0, 4).filter((token) => token.luminance < 0.18).length >= Math.ceil(Math.min(4, colors.backgroundPalette.length) / 2) : false,
    media,
    cards,
    buttons,
    grids,
    blurred,
    translucent,
    shadowed,
    roundedRatio: rounded / total,
    highContrastBorders,
    whitespaceRatio: whitespace / total,
    longText,
    sidebar: countRoles(elements, /sidebar navigation/) > 0,
    topNav: countRoles(elements, /top navigation|header/) > 0,
    hero: countRoles(elements, /hero section/) > 0 || elements.some((element) => element.tagName === "h1" && element.rect.top < scan.page.viewport.height),
    forms: countRoles(elements, /form|input|search/) > 0,
    tables: countRoles(elements, /table/) > 0,
    charts: countRoles(elements, /chart|metric widget/) > 0,
    prices: /(?:\$|€|£|₹)\s?\d|\bprice|pricing|per month|buy now/.test(text),
    code: elements.some((element) => ["code", "pre", "kbd"].includes(element.tagName)) || includesAny(text, ["api", "sdk", "cli", "github", "developer", "deploy", "repository", "pull request"]),
    total,
  };
}

function evaluate(name, signals, counterSignals) {
  let score = 0;
  const evidence = [];
  const counterEvidence = [];
  for (const signal of signals) {
    if (!signal.when) continue;
    score += signal.points;
    evidence.push(signal.evidence);
  }
  for (const signal of counterSignals) {
    if (!signal.when) continue;
    score -= signal.points;
    counterEvidence.push(signal.evidence);
  }
  const normalized = Math.max(0, Math.min(100, score));
  return { style: name, score: normalized, confidence: normalized, evidence, counterEvidence };
}

function s(when, points, evidence) {
  return { when, points, evidence };
}

function buildEvaluations(f) {
  const musicTerms = includesAny(f.text, ["music", "playlist", "album", "artist", "song", "listen", "podcast", "spotify"]);
  const entertainmentTerms = includesAny(f.text, ["stream", "browse", "library", "player", "entertainment", "watch", "episode"]);
  const marketingTerms = includesAny(f.text, ["features", "customers", "pricing", "get started", "book a demo", "product", "solutions", "platform"]);
  const b2bTerms = includesAny(f.text, ["business", "teams", "enterprise", "workflow", "productivity", "organizations"]);
  const aiTerms = includesAny(f.text, ["artificial intelligence", "generative ai", " ai ", "copilot", "prompt", "model", "agents"]);
  const commerceTerms = includesAny(f.text, ["cart", "shop", "add to cart", "checkout", "delivery", "reviews", "deals", "amazon"]);
  const editorialTerms = includesAny(f.text, ["article", "read", "author", "published", "references", "citation", "wikipedia", "encyclopedia"]);
  const developerTerms = f.code || includesAny(f.text, ["documentation", "developers", "code collaboration", "repository", "vercel"]);
  const dashboardTerms = includesAny(f.text, ["dashboard", "analytics", "reports", "filter", "admin", "manage", "overview"]);
  const luxuryTerms = includesAny(f.text, ["apple", "collection", "crafted", "experience", "premium"]);
  const corporateTerms = includesAny(f.text, ["enterprise", "company", "leadership", "investors", "security", "compliance"]);
  const portfolioTerms = includesAny(f.text, ["portfolio", "case study", "selected work", "my work", "projects"]);
  const educationTerms = includesAny(f.text, ["course", "lesson", "quiz", "learn", "student", "module", "progress"]);
  const fintechTerms = includesAny(f.text, ["payments", "fintech", "banking", "financial", "billing", "stripe"]);
  const neon = /rgb\((?:0|[12]?\d),\s*(?:1\d\d|2\d\d),|#(?:00ffff|ff00ff|39ff14|00ff)/i.test(f.text);

  return [
    evaluate("Dark Media Streaming Interface", [
      s(f.dark, 22, "Dark background and surface tokens dominate the visible viewport."),
      s(musicTerms, 28, "Visible labels contain music, playlist, album, artist, song, or listening language."),
      s(entertainmentTerms, 12, "Browsing and playback language indicates entertainment content."),
      s(f.media >= 4, 14, `${f.media} media/image-oriented elements form a browsing surface.`),
      s(f.sidebar, 10, "A persistent sidebar navigation pattern is visible."),
      s(f.grids >= 2, 6, "Repeated grid layouts support dense media discovery."),
      s(/spotify|soundcloud|music\.apple/.test(f.domain), 18, `The ${f.domain} domain reinforces the observed media signals.`),
    ], [s(!musicTerms && !entertainmentTerms, 30, "No visible media, listening, or entertainment language was found."), s(!f.dark, 12, "The visible palette is not predominantly dark.")]),

    evaluate("Premium SaaS Landing Page", [
      s(f.hero, 18, "A prominent headline/hero region appears in the first viewport."),
      s(marketingTerms, 22, "Product marketing, feature, customer, or pricing language is visible."),
      s(b2bTerms, 16, "Business, team, enterprise, or workflow language supports a SaaS product narrative."),
      s(f.buttons >= 2, 10, "Multiple action controls create a conversion-oriented hierarchy."),
      s(f.topNav, 8, "Top navigation supports a marketing-site shell."),
      s(/vercel|stripe|notion|linear/.test(f.domain), 14, `The ${f.domain} domain supports the observed SaaS signals.`),
      s(f.whitespaceRatio > 0.02, 8, "Generous section spacing suggests polished product marketing."),
    ], [s(f.tables && f.charts, 14, "Data-heavy tables and charts point toward an in-product dashboard."), s(musicTerms, 22, "Media and listening signals outweigh product-marketing structure.")]),

    evaluate("AI Startup Interface", [
      s(aiTerms, 36, "AI, model, prompt, copilot, or agent terminology is visible."),
      s(f.hero, 12, "A product-focused hero region is present."),
      s(f.translucent >= 3, 8, "Multiple translucent surfaces support a futuristic visual language."),
      s(f.blurred >= 2, 12, "Several visible panels use backdrop blur."),
      s(marketingTerms, 10, "Startup/product marketing language is present."),
    ], [s(!aiTerms, 34, "No meaningful AI, model, prompt, or agent language was found.")]),

    evaluate("Dashboard/Admin Interface", [
      s(f.tables, 22, "Visible tables or data grids indicate operational data management."),
      s(f.charts, 22, "Metrics, charts, or KPI widgets appear in the viewport."),
      s(f.sidebar, 12, "Sidebar navigation supports an application shell."),
      s(dashboardTerms, 20, "Dashboard, analytics, reports, admin, or filter language is visible."),
      s(f.cards >= 4, 8, "Repeated cards may form a widget system."),
    ], [s(!f.tables && !f.charts && !dashboardTerms, 28, "No metrics, charts, data tables, filters, or admin language was detected.")]),

    evaluate("E-commerce Marketplace", [
      s(commerceTerms, 34, "Cart, checkout, shopping, delivery, deal, or review language is visible."),
      s(f.prices, 22, "Price strings or purchase language appear in the page content."),
      s(f.forms, 8, "Search/filter controls support product discovery."),
      s(f.media >= 4 && f.cards >= 3, 12, "Image-led repeated cards resemble a product catalog."),
      s(/amazon|etsy|ebay|shopify/.test(f.domain), 16, `The ${f.domain} domain reinforces the observed commerce pattern.`),
    ], [s(!commerceTerms && !f.prices, 32, "No cart, product-price, checkout, or purchase evidence was found.")]),

    evaluate("Editorial / Blog / Knowledge Platform", [
      s(editorialTerms, 34, "Article, reference, citation, author, or reading language is visible."),
      s(f.longText >= 2, 14, "Several long text snippets indicate reading-oriented content."),
      s(!f.sidebar && !f.charts, 6, "The viewport favors document flow over operational widgets."),
      s(/wikipedia|medium|substack/.test(f.domain), 20, `The ${f.domain} domain reinforces the observed knowledge/editorial structure.`),
    ], [s(f.charts && f.tables, 8, "Operational data components compete with the reading flow."), s(commerceTerms, 18, "Shopping language conflicts with a primarily editorial classification.")]),

    evaluate("Developer Tool / Docs Platform", [
      s(developerTerms, 32, "Developer, API, repository, deployment, or code language is visible."),
      s(f.code, 18, "Code-oriented elements or terminology appear in the viewport."),
      s(f.sidebar, 8, "Sidebar navigation is consistent with documentation or developer tooling."),
      s(/github|vercel|npmjs|developer|docs\./.test(f.domain), 20, `The ${f.domain} domain reinforces the observed developer-tool signals.`),
      s(f.dark, 6, "A dark or high-contrast palette supports the developer-oriented interface."),
    ], [s(!developerTerms, 28, "No API, code, repository, CLI, or documentation evidence was found.")]),

    evaluate("Glassmorphism", [
      s(f.blurred >= 3, 34, `${f.blurred} visible elements use backdrop-filter blur.`),
      s(f.translucent >= 4, 28, `${f.translucent} translucent computed background colors are visible.`),
      s(f.blurred >= 2 && f.translucent >= 3, 22, "Blur and translucency occur together across multiple layered panels."),
    ], [s(f.blurred < 2, 34, "Fewer than two visible elements use backdrop-filter blur."), s(f.translucent < 3, 20, "There are not enough translucent panels for a glass system.")]),

    evaluate("Neumorphism", [
      s(f.shadowed >= 6, 22, "Many components use computed shadows."),
      s(f.roundedRatio > 0.28, 16, "Rounded component geometry is widespread."),
      s(f.text.includes("inset"), 24, "Inset surface treatment is visible."),
    ], [s(f.shadowed < 4, 24, "The interface lacks the paired soft shadows required for tactile raised surfaces."), s(f.highContrastBorders > 2, 12, "Hard borders conflict with a soft neumorphic surface model.")]),

    evaluate("Brutalist", [
      s(f.highContrastBorders >= 4, 28, "Multiple visible elements use thick, assertive borders."),
      s(f.roundedRatio < 0.08, 12, "Corners are predominantly square and block-like."),
      s(includesAny(f.text, ["brutal", "raw", "manifesto"]), 16, "Visible language suggests an intentionally raw presentation."),
    ], [s(f.roundedRatio > 0.25, 18, "Widespread rounded geometry conflicts with a brutalist treatment."), s(f.highContrastBorders < 2, 20, "No repeated harsh-border system was found.")]),

    evaluate("Cyberpunk", [
      s(f.dark, 18, "The viewport uses a dark base."),
      s(neon, 28, "Highly saturated neon-like color signals are present."),
      s(includesAny(f.text, ["terminal", "glitch", "cyber", "matrix"]), 24, "Terminal, glitch, cyber, or matrix language appears in the viewport."),
      s(f.shadowed >= 8, 8, "Heavy glow/shadow usage supports an aggressive futuristic effect."),
    ], [s(!neon, 28, "No repeated neon palette or aggressive glow signal was detected."), s(!includesAny(f.text, ["terminal", "glitch", "cyber", "matrix"]), 12, "No glitch, terminal, or cyber-futurist visual language was found.")]),

    evaluate("Minimal Luxury", [
      s(f.whitespaceRatio > 0.025, 22, "Large paddings create a spacious, low-noise composition."),
      s(f.cards < 5, 10, "The surface avoids dense card repetition."),
      s(f.media >= 1, 8, "Prominent imagery supports product/editorial focus."),
      s(luxuryTerms, 16, "Premium product or crafted-experience language appears in the viewport."),
      s(/apple|aesop|hermes|rolex/.test(f.domain), 24, `The ${f.domain} domain reinforces the observed premium product presentation.`),
      s(f.roundedRatio < 0.2, 6, "Restrained component framing keeps the visual noise low."),
    ], [s(f.cards >= 10, 16, "Dense repeated cards conflict with a low-noise luxury composition."), s(f.tables || f.charts, 12, "Operational data UI conflicts with a product-led luxury presentation.")]),

    evaluate("Corporate / Enterprise", [
      s(corporateTerms, 30, "Enterprise, security, compliance, company, or investor language is visible."),
      s(f.topNav, 10, "Structured top navigation supports a formal information architecture."),
      s(marketingTerms, 10, "Solutions/product language supports a corporate marketing site."),
      s(!f.dark, 6, "A light, conservative surface palette supports enterprise presentation."),
    ], [s(!corporateTerms, 24, "No formal enterprise, company, compliance, or investor language was found.")]),

    evaluate("Creative Portfolio", [
      s(portfolioTerms, 36, "Portfolio, project, selected-work, or case-study language is visible."),
      s(f.media >= 3, 14, "Large visual previews support project showcase content."),
      s(f.hero, 8, "A personal/project-led hero hierarchy is present."),
    ], [s(!portfolioTerms, 26, "No personal portfolio, project, or case-study evidence was found.")]),

    evaluate("Education / Learning Platform", [
      s(educationTerms, 38, "Course, lesson, quiz, module, student, or learning language is visible."),
      s(f.cards >= 3, 10, "Repeated cards can represent courses or modules."),
      s(f.sidebar, 8, "Sidebar navigation supports lessons or curriculum structure."),
    ], [s(!educationTerms, 30, "No course, lesson, quiz, module, or progress evidence was found.")]),
  ].map((item) => ({ ...item, fintechTerms }));
}

function industryFor(features, primary) {
  if (/spotify|music|soundcloud/.test(features.text)) return "Music & Entertainment";
  if (/stripe|payments|fintech|banking|billing/.test(features.text)) return "Financial Technology";
  if (/github|vercel|developer|api|repository/.test(features.text)) return "Developer Tools";
  if (/amazon|cart|shop|checkout/.test(features.text)) return "Retail & E-commerce";
  if (/wikipedia|encyclopedia|citation/.test(features.text)) return "Knowledge & Publishing";
  if (/apple/.test(features.domain)) return "Consumer Technology";
  if (/Education/.test(primary)) return "Education";
  return "General Digital Product";
}

function interfaceFor(primary, features) {
  const map = {
    "Dark Media Streaming Interface": "Streaming web application",
    "Premium SaaS Landing Page": "Product marketing website",
    "AI Startup Interface": "AI product interface",
    "Dashboard/Admin Interface": "Operational dashboard",
    "E-commerce Marketplace": "Marketplace storefront",
    "Editorial / Blog / Knowledge Platform": "Reading and knowledge platform",
    "Developer Tool / Docs Platform": features.hero ? "Developer product platform" : "Developer documentation/tooling",
    "Minimal Luxury": "Consumer product marketing",
    "Corporate / Enterprise": "Enterprise marketing website",
    "Creative Portfolio": "Portfolio showcase",
    "Education / Learning Platform": "Learning application",
  };
  return map[primary] || "Mixed web interface";
}

export function classifyPage(scan, colors) {
  const features = createFeatures(scan, colors);
  const evaluations = buildEvaluations(features).sort((a, b) => b.score - a.score);
  const top = evaluations[0];
  const uncertain = top.score < 60;
  const primaryStyle = uncertain ? "Mixed / Uncertain Visual System" : top.style;
  const confidence = uncertain ? Math.min(59, top.score) : top.score;
  let secondaryStyles = evaluations.filter((item) => item.style !== top.style && item.score >= 42).slice(0, 4).map((item) => item.style);

  if (top.style === "Dark Media Streaming Interface") {
    secondaryStyles = ["Music Streaming UI", "Entertainment Dashboard", "Brand Accent Heavy", "Dense Content Layout"];
  } else if (/vercel/.test(features.domain)) {
    secondaryStyles = ["Developer Tool / Docs Platform", "Minimal high-contrast developer aesthetic", ...secondaryStyles].slice(0, 4);
  } else if (/stripe/.test(features.domain)) {
    secondaryStyles = ["Fintech SaaS", "Gradient-led enterprise marketing", ...secondaryStyles].slice(0, 4);
  } else if (/github/.test(features.domain)) {
    secondaryStyles = ["Code Collaboration Interface", "Developer Platform", ...secondaryStyles.filter((style) => style !== "E-commerce Marketplace")].slice(0, 4);
  }

  const rejectionPriority = top.style === "Dark Media Streaming Interface"
    ? ["Glassmorphism", "Premium SaaS Landing Page", "AI Startup Interface", "Corporate / Enterprise"]
    : /github/.test(features.domain)
      ? ["E-commerce Marketplace", "Glassmorphism", "Minimal Luxury"]
      : /wikipedia/.test(features.domain)
        ? ["Premium SaaS Landing Page", "Dashboard/Admin Interface", "E-commerce Marketplace"]
        : evaluations.slice(-5).map((item) => item.style);
  const rejectedStyles = [...new Set(rejectionPriority)].map((style) => {
    const evaluation = evaluations.find((item) => item.style === style);
    const reason = evaluation?.counterEvidence[0] || `Only ${evaluation?.score || 0}/100 evidence was found, well below the selected system.`;
    return { style, reason };
  }).slice(0, 6);

  const premiumFeel = Math.max(3, Math.min(10, Math.round((features.whitespaceRatio * 80) + (features.roundedRatio * 8) + (features.shadowed > 2 ? 2 : 0) + (top.score / 25))));
  const visualComplexity = Math.max(2, Math.min(10, Math.round((features.cards + features.grids * 2 + features.media + features.buttons) / Math.max(2, features.total / 30))));
  const density = features.total > 400 ? "Dense" : features.total > 180 ? "Balanced" : "Airy";

  return {
    primaryStyle,
    confidence,
    secondaryStyles,
    industryCategory: industryFor(features, primaryStyle),
    interfaceType: interfaceFor(primaryStyle, features),
    mood: features.dark ? "Focused, immersive, and refined" : "Clear, open, and structured",
    energy: features.shadowed > 8 || features.buttons > 8 ? "Dynamic" : "Measured",
    density,
    premiumFeel,
    visualComplexity,
    evidence: uncertain ? ["No single taxonomy label accumulated at least 60/100 evidence.", ...top.evidence.slice(0, 5)] : top.evidence.slice(0, 8),
    rejectedStyles,
    styleScores: evaluations.map(({ style, score, evidence, counterEvidence }) => ({ style, score, evidence, counterEvidence })),
  };
}
