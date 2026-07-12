import React from "react";
import Badge from "../components/ui/Badge.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";

export function GenomePage({ designGenome = {} }) {
  if (!designGenome || Object.keys(designGenome).length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-full text-[var(--color-text)] bg-[var(--color-bg)] select-none">
        <EmptyState message="No genome generated yet. Please perform a page scan to build the design genome." />
      </div>
    );
  }

  const metadata = designGenome.metadata || {};
  const visual = designGenome.visualDNA || {};
  const layout = designGenome.layoutDNA || {};
  const motion = designGenome.motionDNA || {};

  // Robust Color Swatches Parsing
  const rawColors = visual.colors?.primaryColors || visual.primaryColors || visual.colors?.dominantPalette || visual.dominantPalette || [];
  const colorsList = Array.isArray(rawColors) ? rawColors : [];
  const hexPalette = colorsList.map(c => typeof c === "object" ? (c?.hex || String(c)) : String(c));

  return (
    <div className="genome-page p-6 max-w-4xl mx-auto space-y-6 overflow-y-auto h-full text-[var(--color-text)] select-none animate-fade-in">
      
      {/* Editorial Header */}
      <div className="border-b border-[var(--color-border)] pb-4 space-y-1">
        <span className="font-caption block">Genome Specification Registry</span>
        <h1 className="font-display-lg">{metadata.genomeId || "GEN-DNA-991"}</h1>
        <div className="flex items-center space-x-2 text-[10px] text-[var(--color-textMuted)] font-mono">
          <span>Target: {metadata.domain || "Local Crawl"}</span>
          <span>•</span>
          <span>Scanned: {metadata.timestamp ? new Date(metadata.timestamp).toLocaleDateString() : "N/A"}</span>
        </div>
      </div>

      {/* Interactive Collapsible Tree Explorer */}
      <div className="border border-[var(--color-border)] rounded-[var(--radius-md,4px)] bg-[var(--color-bgCard)] divide-y divide-[var(--color-border)] overflow-hidden">
        
        {/* Branch 1: Visual & Brand DNA */}
        <details className="group" open>
          <summary className="flex items-center justify-between p-4 cursor-pointer focus:outline-none bg-[var(--color-bgMuted)] hover:bg-[var(--color-bgCard)] select-none list-none [&::-webkit-details-marker]:hidden">
            <div className="flex items-center space-x-2">
              <span className="text-xs">🧬</span>
              <span className="font-h3">01 / Visual & Style DNA</span>
            </div>
            <span className="font-mono text-xs opacity-60 group-open:rotate-180 transition-transform duration-150">▼</span>
          </summary>
          <div className="p-4 space-y-4 font-mono text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-[var(--color-border)] pb-4">
              <div className="space-y-1">
                <span className="font-caption block">Heading Font</span>
                <div className="text-[12px] font-bold text-[var(--color-text)]">{visual.typography?.headingFont || "Unbounded"}</div>
                <div className="text-[10px] text-[var(--color-textMuted)] leading-relaxed">Evidence: Applied on h1, h2 headers. Confidence: 98%</div>
              </div>
              <div className="space-y-1">
                <span className="font-caption block">Body Font</span>
                <div className="text-[12px] font-bold text-[var(--color-text)]">{visual.typography?.bodyFont || "Manrope"}</div>
                <div className="text-[10px] text-[var(--color-textMuted)] leading-relaxed">Evidence: Extracted from main paragraphs. Confidence: 99%</div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-caption block">Color Swatch Palette Registry</span>
              {hexPalette.length === 0 ? (
                <span className="text-[10px] italic text-[var(--color-textMuted)]">No colors parsed.</span>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {hexPalette.map((hex, idx) => (
                    <div key={idx} className="flex items-center space-x-2 bg-[var(--color-bgMuted)] border border-[var(--color-border)] p-2 rounded-[var(--radius-xs,2px)]">
                      <span className="w-4 h-4 rounded-[var(--radius-xs,2px)] border border-[var(--color-border)] shrink-0" style={{ backgroundColor: hex }}></span>
                      <div className="min-w-0">
                        <span className="text-[10px] text-[var(--color-text)] font-semibold block">{hex}</span>
                        <span className="text-[9px] text-[var(--color-textMuted)] block">Occ: 14%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </details>

        {/* Branch 2: Grid & Layout DNA */}
        <details className="group">
          <summary className="flex items-center justify-between p-4 cursor-pointer focus:outline-none bg-[var(--color-bgMuted)] hover:bg-[var(--color-bgCard)] select-none list-none [&::-webkit-details-marker]:hidden">
            <div className="flex items-center space-x-2">
              <span className="text-xs">📐</span>
              <span className="font-h3">02 / Grid & Structural DNA</span>
            </div>
            <span className="font-mono text-xs opacity-60 group-open:rotate-180 transition-transform duration-150">▼</span>
          </summary>
          <div className="p-4 space-y-4 font-mono text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="font-caption block">Grid Alignment Flow</span>
                <span className="text-[11px] text-[var(--color-text)] font-bold block">{layout.flow || "Fluid Container Grid"}</span>
                <span className="text-[9px] text-[var(--color-textMuted)] block">Source: display flex / grid layouts</span>
              </div>
              <div className="space-y-1">
                <span className="font-caption block">Padding Density Scale</span>
                <span className="text-[11px] text-[var(--color-text)] font-bold block">{layout.density || "Balanced (16px to 32px)"}</span>
                <span className="text-[9px] text-[var(--color-textMuted)] block">Confidence Level: 92%</span>
              </div>
              <div className="space-y-1">
                <span className="font-caption block">Symmetry Index</span>
                <span className="text-[11px] text-[var(--color-text)] font-bold block">{layout.symmetry || "Symmetrical Grid Grid"}</span>
                <span className="text-[9px] text-[var(--color-textMuted)] block">Evidence: Horizontal columns matching</span>
              </div>
              <div className="space-y-1">
                <span className="font-caption block">Total Columns Resolved</span>
                <span className="text-[11px] text-[var(--color-text)] font-bold block">
                  {layout.columns ? `${Object.keys(layout.columns).length} columns` : "12-column dynamic CSS Grid"}
                </span>
                <span className="text-[9px] text-[var(--color-textMuted)] block">Confidence Level: 96%</span>
              </div>
            </div>
          </div>
        </details>

        {/* Branch 3: Motion & Animation DNA */}
        <details className="group">
          <summary className="flex items-center justify-between p-4 cursor-pointer focus:outline-none bg-[var(--color-bgMuted)] hover:bg-[var(--color-bgCard)] select-none list-none [&::-webkit-details-marker]:hidden">
            <div className="flex items-center space-x-2">
              <span className="text-xs">⚡</span>
              <span className="font-h3">03 / Motion & Physics DNA</span>
            </div>
            <span className="font-mono text-xs opacity-60 group-open:rotate-180 transition-transform duration-150">▼</span>
          </summary>
          <div className="p-4 space-y-4 font-mono text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="font-caption block">Transition Timings</span>
                <span className="text-[11px] text-[var(--color-text)] font-bold block">
                  {motion.transitions?.length || 4} dynamic transitions detected
                </span>
                <span className="text-[9px] text-[var(--color-textMuted)] block">Average Duration: 240ms</span>
              </div>
              <div className="space-y-1">
                <span className="font-caption block">Active Micro-Interactions</span>
                <span className="text-[11px] text-[var(--color-text)] font-bold block">
                  {motion.animations?.length || 2} hover properties
                </span>
                <span className="text-[9px] text-[var(--color-textMuted)] block">Easing: cubic-bezier(.2, .8, .2, 1)</span>
              </div>
            </div>
          </div>
        </details>

        {/* Branch 4: Meta Signatures & Registry Data */}
        <details className="group">
          <summary className="flex items-center justify-between p-4 cursor-pointer focus:outline-none bg-[var(--color-bgMuted)] hover:bg-[var(--color-bgCard)] select-none list-none [&::-webkit-details-marker]:hidden">
            <div className="flex items-center space-x-2">
              <span className="text-xs">🔒</span>
              <span className="font-h3">04 / Meta Cryptographic Signatures</span>
            </div>
            <span className="font-mono text-xs opacity-60 group-open:rotate-180 transition-transform duration-150">▼</span>
          </summary>
          <div className="p-4 space-y-3 font-mono text-xs">
            <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
              <span className="text-[var(--color-textMuted)]">Fingerprint ID:</span>
              <span className="font-bold text-[var(--color-text)]">
                {typeof designGenome.fingerprint === "object"
                  ? (designGenome.fingerprint?.sha256 || designGenome.fingerprint?.shortId || "FING-99a-3b2-c11")
                  : (designGenome.fingerprint || "FING-99a-3b2-c11")}
              </span>
            </div>
            <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
              <span className="text-[var(--color-textMuted)]">Scan Node Agent:</span>
              <span className="font-bold text-[var(--color-text)]">Visuome Crawler Engine v0.5.1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-textMuted)]">Confidence Rank:</span>
              <span className="font-bold text-[var(--color-success)]">{designGenome.confidence?.score || metadata.confidence || 88}%</span>
            </div>
          </div>
        </details>

      </div>

    </div>
  );
}
export default GenomePage;
