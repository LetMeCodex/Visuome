import React from "react";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Badge from "../components/ui/Badge.jsx";
import workspaceStore from "../experience/WorkspaceStore.js";

export function DashboardPage({ designGenome = {}, promptRegistry = {}, onScan, scans = [] }) {
  const handleNavigate = (page) => {
    workspaceStore.setActivePage(page);
  };

  // Helper values extracted from the active designGenome
  const metadata = designGenome.metadata || {};
  const layout = designGenome.layoutDNA || {};
  const colorsList = designGenome.visualDNA?.colors || [];

  const metrics = [
    { label: "Website", value: metadata.domain || "No active scan" },
    { label: "Last Scan", value: metadata.timestamp ? new Date(metadata.timestamp).toLocaleTimeString() : "Never" },
    { label: "Confidence", value: metadata.confidence ? `${metadata.confidence}%` : "0%" },
    { label: "Pages", value: designGenome.platformDNA?.pages?.length || (metadata.domain ? 1 : 0) },
    { label: "Components", value: designGenome.knowledgeGraphDNA?.components?.length || (metadata.domain ? 6 : 0) },
    { label: "Knowledge Graph", value: designGenome.knowledgeGraphDNA?.nodes?.length || (metadata.domain ? 12 : 0) },
    { label: "Prompt Status", value: promptRegistry?.masterPrompt ? "Compiled" : "Empty" },
    { label: "Genome Health", value: metadata.confidence ? (metadata.confidence > 75 ? "Stable" : "Ad-hoc") : "Unknown" },
    { label: "Pipeline Status", value: metadata.domain ? "Operational" : "Idle" }
  ];

  return (
    <div className="dashboard-page p-6 max-w-4xl mx-auto space-y-8 overflow-y-auto h-full text-[var(--color-text)] select-none">
      
      {/* Title & Start Header */}
      <div className="space-y-2">
        <span className="font-caption block">
          — VISUOME INTELLIGENCE STUDIO
        </span>
        <h1 className="font-display-lg">
          What would you like to <em className="outline-text not-italic">create?</em>
        </h1>
        <p className="font-subtitle max-w-lg">
          Generate production-ready design prompts by crawling websites, blending genomes, or composing custom style structures.
        </p>
      </div>

      {/* Scorecard Table (Step 9) */}
      <div className="space-y-3 pt-2">
        <div className="text-[10px] font-bold text-[var(--color-textMuted)] uppercase tracking-wider block font-heading opacity-60">
          Design System Scorecard
        </div>
        <div className="grid grid-cols-3 gap-px bg-[var(--color-border)] border border-[var(--color-border)] rounded-[var(--radius-md,4px)] overflow-hidden">
          {metrics.map((m, idx) => (
            <div key={idx} className="bg-[var(--color-bgCard)] p-3 space-y-1">
              <span className="font-caption block tracking-wider">{m.label}</span>
              <div className="font-mono text-xs font-bold text-[var(--color-text)] break-all truncate">
                {m.value === "Compiled" ? (
                  <Badge variant="success">Compiled</Badge>
                ) : m.value === "Operational" ? (
                  <Badge variant="info">Operational</Badge>
                ) : m.value === "Stable" ? (
                  <Badge variant="success">Stable</Badge>
                ) : (
                  m.value
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Creation Actions Matrix (Flat style, no dropshadows) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <Card
          onClick={() => handleNavigate("Genome Mixer")}
          className="c-slate flex flex-col justify-between cursor-pointer aspect-[3/4] border border-[var(--color-border)] hover:translate-y-0 active:scale-[0.99] min-h-[200px]"
        >
          <div className="flex justify-between items-center text-[10px] font-bold font-mono">
            <span>01</span>
            <span className="px-2 py-0.5 rounded-[var(--radius-xs)] bg-[rgba(22,22,22,0.12)] font-sans uppercase text-[8px] tracking-wide">[mix]</span>
          </div>
          <div className="font-display-xl select-none mt-2">
            M
          </div>
          <div className="space-y-1 pt-4">
            <h3 className="font-h3">Mix Genomes</h3>
            <p className="font-body opacity-90 leading-tight">
              Blend and weight multiple visual design DNA registries into a mixed archetype.
            </p>
            <span className="font-caption block mt-1.5 opacity-85">
              Open Mixer →
            </span>
          </div>
        </Card>

        <Card
          onClick={() => handleNavigate("Custom Prompt")}
          className="c-umber flex flex-col justify-between cursor-pointer aspect-[3/4] border border-[var(--color-border)] hover:translate-y-0 active:scale-[0.99] min-h-[200px]"
        >
          <div className="flex justify-between items-center text-[10px] font-bold font-mono text-[var(--color-bg)]">
            <span>02</span>
            <span className="px-2 py-0.5 rounded-[var(--radius-xs)] bg-[rgba(232,228,217,0.18)] font-sans uppercase text-[8px] tracking-wide text-[var(--color-bg)]">[custom]</span>
          </div>
          <div className="font-display-xl select-none mt-2 text-[var(--color-bg)]">
            P
          </div>
          <div className="space-y-1 pt-4 text-[var(--color-bg)]">
            <h3 className="font-h3 text-[var(--color-bg)]">Custom Spec</h3>
            <p className="font-body opacity-90 leading-tight text-[var(--color-bg)]">
              Manually compile grid sections, framework targets, and layout parameters.
            </p>
            <span className="font-caption block mt-1.5 opacity-85 text-[var(--color-accent)]">
              Build Spec →
            </span>
          </div>
        </Card>
      </div>

      {/* Recent Scans Table */}
      <div className="space-y-3 pt-4 border-t border-[var(--color-border)]">
        <div className="flex justify-between items-center">
          <div className="text-[10px] font-bold text-[var(--color-textMuted)] uppercase tracking-wider block font-heading opacity-60">
            Recent Forensic Scans
          </div>
          <Button onClick={onScan} variant="secondary" className="text-[9px] py-1 px-2.5">
            Crawl Current Page
          </Button>
        </div>

        {scans.length === 0 ? (
          <div className="text-center py-6 font-mono text-[10px] text-[var(--color-textMuted)] italic bg-[var(--color-bgCard)] rounded-[var(--radius-md,4px)] border border-[var(--color-border)]">
            No scans captured in local history yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {scans.slice(0, 4).map((item, idx) => (
              <Card
                key={idx}
                className="flex items-center justify-between p-3.5 bg-[var(--color-bgCard)] border border-[var(--color-border)] hover:border-[var(--color-text)] cursor-pointer"
                onClick={() => {
                  workspaceStore.setState({ activePage: "Genome" });
                  if (workspaceStore.onLoadScan) {
                    workspaceStore.onLoadScan(item);
                  }
                }}
              >
                <div className="space-y-0.5 truncate max-w-[70%]">
                  <span className="font-title block truncate">
                    {item.pageTitle || item.domain || "Discovered Page"}
                  </span>
                  <span className="font-mono block truncate text-[9px] text-[var(--color-textMuted)]">
                    {item.url}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono text-[9px] text-[var(--color-accentHover)] font-bold block uppercase tracking-wider">
                    {item.primaryStyle || "Minimalist"}
                  </span>
                  <span className="font-caption block mt-0.5 text-[9px]">
                    {item.scannedAt ? new Date(item.scannedAt).toLocaleDateString() : ""}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
export default DashboardPage;
