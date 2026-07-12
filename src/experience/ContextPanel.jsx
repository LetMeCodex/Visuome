import React from "react";

export function ContextPanel({ activePage = "Dashboard", data = {} }) {
  const getContextMarkup = () => {
    switch (activePage) {
      case "Scan Results":
        return (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[var(--color-accentHover)] uppercase tracking-wider font-heading">Report Telemetry</h4>
            <div className="space-y-3 text-xs text-[var(--color-textMuted)]">
              <div className="p-2.5 bg-[var(--color-bgCard)] border border-[var(--color-border)] rounded-md">
                <span className="font-semibold text-[var(--color-text)] block">Visual DNA Weight</span>
                <p className="text-[10px] text-[var(--color-textMuted)] mt-0.5">38% contribution score</p>
              </div>
              <div className="p-2.5 bg-[var(--color-bgCard)] border border-[var(--color-border)] rounded-md">
                <span className="font-semibold text-[var(--color-text)] block">Platform Attributes</span>
                <p className="text-[10px] text-[var(--color-textMuted)] mt-0.5">14 properties discovered</p>
              </div>
              <div className="p-2.5 bg-[var(--color-bgCard)] border border-[var(--color-border)] rounded-md">
                <span className="font-semibold text-[var(--color-text)] block">Accessibility Rating</span>
                <p className="text-[10px] text-[var(--color-textMuted)] mt-0.5">Level AA (88% compliance)</p>
              </div>
            </div>
          </div>
        );
      case "Genome":
        return (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[var(--color-accentHover)] uppercase tracking-wider font-heading">Genome Telemetry</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-[var(--color-textMuted)] font-medium">Genome Size:</span><span className="font-bold text-[var(--color-text)]">4.2 KB</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-textMuted)] font-medium">Fingerprint:</span><span className="font-mono text-[10px] text-[var(--color-text)]">FING-99a-3b2</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-textMuted)] font-medium">Confidence:</span><span className="text-emerald-600 font-bold">96%</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-textMuted)] font-medium">Registries:</span><span className="font-bold text-[var(--color-text)]">14 loaded</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-textMuted)] font-medium">DNA Blocks:</span><span className="font-bold text-[var(--color-text)]">8 blocks</span></div>
            </div>
          </div>
        );
      case "Knowledge Graph":
        return (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[var(--color-accentHover)] uppercase tracking-wider font-heading">Graph Telemetry</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-[var(--color-textMuted)] font-medium">Nodes Count:</span><span className="font-bold text-[var(--color-text)]">28 nodes</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-textMuted)] font-medium">Edges Count:</span><span className="font-bold text-[var(--color-text)]">32 edges</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-textMuted)] font-medium">Max Depth:</span><span className="font-bold text-[var(--color-text)]">3 levels</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-textMuted)] font-medium">Patterns:</span><span className="font-bold text-[var(--color-text)]">4 mapped</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-textMuted)] font-medium">Components:</span><span className="font-bold text-[var(--color-text)]">18 nodes</span></div>
            </div>
          </div>
        );
      case "Prompt Studio":
        return (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[var(--color-accentHover)] uppercase tracking-wider font-heading">Prompt Studio</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-[var(--color-textMuted)] font-medium">Active Profile:</span><span className="font-bold text-[var(--color-text)]">Master</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-textMuted)] font-medium">Variables:</span><span className="font-bold text-[var(--color-text)]">12 configured</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-textMuted)] font-medium">Total Size:</span><span className="font-bold text-[var(--color-text)]">1.2k chars</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-textMuted)] font-medium">Model:</span><span className="font-bold text-[var(--color-accentHover)]">Claude 3.5 Sonnet</span></div>
            </div>
          </div>
        );
      case "Clone Mode":
        return (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[var(--color-accentHover)] uppercase tracking-wider font-heading">Clone Fidelity</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-[var(--color-textMuted)] font-medium">Fidelity Grade:</span><span className="font-bold text-emerald-600">High Precision</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-textMuted)] font-medium">Excluded Elements:</span><span className="font-bold text-[var(--color-text)]">4 parameters</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-textMuted)] font-medium">Est. Tokens Count:</span><span className="font-bold text-[var(--color-text)]">2.4k tokens</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-textMuted)] font-medium">Complexity:</span><span className="text-amber-600 font-bold">Medium</span></div>
            </div>
          </div>
        );
      case "Genome Mixer":
        return (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[var(--color-accentHover)] uppercase tracking-wider font-heading">Mixer Statistics</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-[var(--color-textMuted)] font-medium">Merged Genomes:</span><span className="font-bold text-[var(--color-text)]">3 layers</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-textMuted)] font-medium">Weight A:</span><span className="font-bold text-[var(--color-text)]">60%</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-textMuted)] font-medium">Weight B:</span><span className="font-bold text-[var(--color-text)]">25%</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-textMuted)] font-medium">Weight C:</span><span className="font-bold text-[var(--color-text)]">15%</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-textMuted)] font-medium">Blend Type:</span><span className="text-[var(--color-accentHover)] font-bold">Hybrid Blend</span></div>
            </div>
          </div>
        );
      case "Exports":
        return (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[var(--color-accentHover)] uppercase tracking-wider font-heading">Export Settings</h4>
            <div className="space-y-2 text-xs text-[var(--color-textMuted)]">
              <p className="text-[10px] leading-relaxed">
                Choose offline exports formats. Packages include style tokens mapping and accessibility reports.
              </p>
            </div>
          </div>
        );
      case "History":
        return (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[var(--color-accentHover)] uppercase tracking-wider font-heading">Timeline Version</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-[var(--color-textMuted)] font-medium">Total Snapshots:</span><span className="font-bold text-[var(--color-text)]">14 records</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-textMuted)] font-medium">Storage Limit:</span><span className="font-bold text-[var(--color-text)]">100 (auto-purge)</span></div>
            </div>
          </div>
        );
      case "Vault":
        return (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[var(--color-accentHover)] uppercase tracking-wider font-heading">Vault Insights</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-[var(--color-textMuted)] font-medium">Pinned Items:</span><span className="font-bold text-[var(--color-text)]">3 assets</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-textMuted)] font-medium">Collections:</span><span className="font-bold text-[var(--color-text)]">2 total</span></div>
            </div>
          </div>
        );
      case "Settings":
        return (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[var(--color-accentHover)] uppercase tracking-wider font-heading">Settings Guide</h4>
            <div className="space-y-2 text-xs text-[var(--color-textMuted)]">
              <p className="text-[10px] leading-relaxed">
                Configure key triggers, developer diagnostics mode, and automated sitemap scanning limits.
              </p>
            </div>
          </div>
        );
      case "Dashboard":
      default:
        return (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[var(--color-accentHover)] uppercase tracking-wider font-heading">Quick Insights</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-[var(--color-textMuted)] font-medium">Latest Scan:</span><span className="font-bold text-[var(--color-text)]">Just now</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-textMuted)] font-medium">Execution:</span><span className="font-bold text-[var(--color-text)]">2.07s</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-textMuted)] font-medium">Pipeline:</span><span className="text-emerald-600 font-bold">Stable</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-textMuted)] font-medium">Memory:</span><span className="font-bold text-[var(--color-text)]">14.2 MB</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-textMuted)] font-medium">Version:</span><span className="font-bold text-[var(--color-text)]">v0.6.0</span></div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="context-panel w-64 shrink-0 bg-[var(--color-bgMuted)] border-l border-[var(--color-border)] p-4 text-[var(--color-text)] select-none h-full overflow-y-auto">
      {getContextMarkup()}
    </div>
  );
}
export default ContextPanel;
