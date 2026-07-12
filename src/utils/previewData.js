import { buildReport } from "./scannerUtils.js";

const baseStyles = {
  display: "block", position: "static", zIndex: "auto", color: "rgb(255, 255, 255)", backgroundColor: "rgba(0, 0, 0, 0)", backgroundImage: "none",
  fontFamily: 'Inter, "Segoe UI", sans-serif', fontSize: "14px", fontWeight: "400", lineHeight: "20px", letterSpacing: "0px", textTransform: "none", textAlign: "start",
  padding: "0px", paddingTop: "0px", paddingRight: "0px", paddingBottom: "0px", paddingLeft: "0px", margin: "0px", marginTop: "0px", marginRight: "0px", marginBottom: "0px", marginLeft: "0px",
  gap: "normal", rowGap: "normal", columnGap: "normal", border: "0px none rgb(255, 255, 255)", borderWidth: "0px", borderColor: "rgb(255, 255, 255)", borderStyle: "none", borderRadius: "0px",
  boxShadow: "none", opacity: "1", backdropFilter: "none", filter: "none", transition: "all 0s ease 0s", animation: "none 0s ease 0s 1 normal none running", transform: "none", overflow: "visible",
  objectFit: "fill", aspectRatio: "auto", width: "auto", height: "auto", maxWidth: "none", minHeight: "0px", gridTemplateColumns: "none", gridTemplateRows: "none", flexDirection: "row", alignItems: "normal", justifyContent: "normal",
};

function element(tagName, role, text, style = {}, rect = {}) {
  return {
    tagName, role, ariaRole: "", ariaLabel: text, id: "", classTokens: [role.replaceAll(" ", "-")], text, parentHint: "main", childHints: [],
    rect: { x: 0, y: 0, width: 320, height: 44, top: 0, left: 0, right: 320, bottom: 44, ...rect },
    styles: { ...baseStyles, ...style },
  };
}

export function createPreviewReport() {
  const elements = [
    element("main", "app shell", "", { display: "grid", backgroundColor: "rgb(18, 18, 18)", gridTemplateColumns: "240px 1fr", minHeight: "900px" }, { width: 1440, height: 900 }),
    element("aside", "sidebar navigation", "Your Library", { display: "flex", flexDirection: "column", gap: "12px", padding: "16px", paddingTop: "16px", paddingRight: "16px", paddingBottom: "16px", paddingLeft: "16px", backgroundColor: "rgb(0, 0, 0)", width: "240px" }, { width: 240, height: 900 }),
    element("header", "header", "Home Search Your Library", { display: "flex", alignItems: "center", gap: "24px", padding: "12px 24px", paddingTop: "12px", paddingRight: "24px", paddingBottom: "12px", paddingLeft: "24px", backgroundColor: "rgb(18, 18, 18)", height: "64px" }, { x: 240, width: 1200, height: 64 }),
    element("section", "hero section", "Made for you", { display: "flex", flexDirection: "column", gap: "16px", padding: "32px", paddingTop: "32px", paddingRight: "32px", paddingBottom: "32px", paddingLeft: "32px", backgroundImage: "linear-gradient(rgb(54, 34, 102), rgb(18, 18, 18))" }, { x: 240, y: 64, width: 1200, height: 220 }),
    element("h1", "content", "Good afternoon", { fontSize: "32px", lineHeight: "40px", fontWeight: "700" }, { x: 272, y: 88, width: 400, height: 40 }),
    element("button", "primary CTA", "Play", { display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "12px 20px", paddingTop: "12px", paddingRight: "20px", paddingBottom: "12px", paddingLeft: "20px", borderRadius: "999px", backgroundColor: "rgb(30, 215, 96)", color: "rgb(0, 0, 0)", fontWeight: "700", transition: "transform 0.2s ease 0s" }),
    element("button", "secondary CTA", "Follow", { display: "inline-flex", padding: "10px 16px", paddingTop: "10px", paddingRight: "16px", paddingBottom: "10px", paddingLeft: "16px", border: "1px solid rgb(179, 179, 179)", borderWidth: "1px", borderStyle: "solid", borderColor: "rgb(179, 179, 179)", borderRadius: "999px", backgroundColor: "rgba(0, 0, 0, 0)", transition: "border-color 0.2s ease 0s" }),
    element("nav", "top navigation", "Home Search", { display: "flex", gap: "20px", color: "rgb(179, 179, 179)" }),
  ];
  for (let index = 0; index < 56; index += 1) {
    elements.push(element("article", index % 2 ? "playlist card" : "album card", `Playlist ${index + 1}`, { display: "flex", flexDirection: "column", gap: "12px", padding: "16px", paddingTop: "16px", paddingRight: "16px", paddingBottom: "16px", paddingLeft: "16px", borderRadius: "8px", backgroundColor: "rgb(31, 31, 31)", boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.25)", transition: "background-color 0.2s ease 0s, transform 0.2s ease 0s" }, { x: 280 + (index % 5) * 190, y: 320 + Math.floor(index / 5) * 240, width: 172, height: 220 }));
    elements.push(element("img", "image container", "", { borderRadius: "8px", objectFit: "cover", aspectRatio: "1 / 1", width: "140px", height: "140px" }, { width: 140, height: 140 }));
    elements.push(element("li", "list item", index % 3 ? "Recently played" : "Discover weekly", { display: "flex", alignItems: "center", gap: "12px", padding: "8px 12px", paddingTop: "8px", paddingRight: "12px", paddingBottom: "8px", paddingLeft: "12px", color: "rgb(179, 179, 179)" }));
  }
  const scan = {
    page: {
      title: "Spotify – Web Player", url: "https://open.spotify.com/", hostname: "open.spotify.com", pathname: "/", metaDescription: "Music for everyone.", favicon: "https://open.spotifycdn.com/cdn/images/favicon32.b64ecc03.png",
      viewport: { width: 1440, height: 900, devicePixelRatio: 1 }, bodyClasses: [], htmlClasses: [], scannedAt: new Date().toISOString(),
      textHints: ["Good afternoon", "Made for you", "Recently played", "Your Library", "Playlist", "Album", "Artist", "Song", "Listen now", "Discover weekly"],
    },
    elements,
    debug: { scannedElementCount: 1148, usedElementCount: elements.length, ignoredElementCount: 927, capped: false, durationMs: 186 },
  };
  return buildReport(scan);
}
