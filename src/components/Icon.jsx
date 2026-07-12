export default function Icon({ name, size = 18, className = "", strokeWidth = 1.7 }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth, strokeLinecap: "round", strokeLinejoin: "round", className, "aria-hidden": true };
  const glyphs = {
    dna: <><path d="M7 3c7 4 3 14 10 18"/><path d="M17 3C10 7 14 17 7 21"/><path d="M8.5 6h7M7.5 10h9M7.5 14h9M8.5 18h7"/></>,
    scan: <><path d="M4 7V5a1 1 0 0 1 1-1h2M17 4h2a1 1 0 0 1 1 1v2M20 17v2a1 1 0 0 1-1 1h-2M7 20H5a1 1 0 0 1-1-1v-2"/><circle cx="12" cy="12" r="3"/><path d="M12 9V7M12 17v-2M9 12H7M17 12h-2"/></>,
    database: <><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/></>,
    copy: <><rect x="9" y="9" width="10" height="10" rx="2"/><path d="M15 9V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/></>,
    save: <><path d="M5 4h12l2 2v14H5z"/><path d="M8 4v5h8V4M8 20v-7h8v7"/></>,
    trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/></>,
    palette: <><path d="M12 3a9 9 0 0 0 0 18h1.5a2 2 0 0 0 0-4H12a2 2 0 0 1 0-4h4a5 5 0 0 0 0-10z"/><circle cx="7.5" cy="10" r=".8" fill="currentColor"/><circle cx="9" cy="6.5" r=".8" fill="currentColor"/><circle cx="14" cy="6.5" r=".8" fill="currentColor"/></>,
    type: <><path d="M4 5h16M12 5v14M8 19h8"/></>,
    layout: <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 9v12"/></>,
    components: <><path d="m12 3 8 4.5-8 4.5-8-4.5zM4 12l8 4.5 8-4.5M4 16.5l8 4.5 8-4.5"/></>,
    motion: <><path d="M3 12h3l2-7 4 14 3-10 2 6h4"/></>,
    score: <><path d="m12 3 2.2 5.5 5.8.4-4.4 3.8 1.4 5.7-5-3.1-5 3.1 1.4-5.7L4 8.9l5.8-.4z"/></>,
    flask: <><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3M8 15h8"/></>,
    bug: <><path d="M8 7h8M9 4l1.5 3M15 4l-1.5 3M6 13H3M21 13h-3M6 17l-2 2M18 17l2 2"/><rect x="6" y="7" width="12" height="13" rx="6"/><path d="M12 7v13"/></>,
    shield: <><path d="M12 3 5 6v5c0 4.6 2.8 8 7 10 4.2-2 7-5.4 7-10V6z"/><path d="m9 12 2 2 4-4"/></>,
    chevron: <path d="m8 10 4 4 4-4"/>,
    check: <path d="m5 12 4 4L19 6"/>,
    alert: <><path d="M12 3 2.8 19h18.4z"/><path d="M12 9v4M12 17h.01"/></>,
    external: <><path d="M14 4h6v6M20 4l-9 9"/><path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6"/></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/></>,
    globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 4 5.5 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.5-4-9s1.5-6.5 4-9"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    x: <path d="m6 6 12 12M18 6 6 18"/>,
    refresh: <><path d="M20 6v5h-5"/><path d="M18.5 15a7 7 0 1 1-.4-6.8L20 10"/></>,
  };
  return <svg {...common}>{glyphs[name] || glyphs.components}</svg>;
}
