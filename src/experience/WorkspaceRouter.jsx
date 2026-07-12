import React from "react";
import DashboardPage from "../pages/DashboardPage.jsx";
import GenomePage from "../pages/GenomePage.jsx";
import KnowledgeGraphPage from "../pages/KnowledgeGraphPage.jsx";
import PromptStudioPage from "../components/prompt-studio/PromptStudioPage.jsx";
import GenomeMixerPage from "../pages/GenomeMixerPage.jsx";
import CustomPromptPage from "../pages/CustomPromptPage.jsx";
import HistoryPage from "../pages/HistoryPage.jsx";
import ExportPage from "../pages/ExportPage.jsx";
import VaultPage from "../pages/VaultPage.jsx";
import SettingsPage from "../pages/SettingsPage.jsx";
import ScanResultsPage from "../pages/ScanResultsPage.jsx";

import WorkspaceErrorBoundary from "./WorkspaceErrorBoundary.jsx";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";

export function WorkspaceRouter({
  activePage = "Scan",
  report = {},
  promptRegistry,
  designGenome,
  onScan,
  scanStatus = "idle",
  scanStageIndex = 0,
  scanError = "",
  onLoadScan,
  timings = {},
  scans = []
}) {
  const renderPage = () => {
    // Full screen live pipeline progress visualizer
    if (scanStatus === "scanning") {
      const steps = [
        { label: "Colors & Typography Discovery", index: 0 },
        { label: "Spacing & Density Discovery", index: 1 },
        { label: "Components & Elements Discovery", index: 2 },
        { label: "Motion & Transition Curves Discovery", index: 3 },
        { label: "Immutable Design Genome Building", index: 4 },
        { label: "Optimized Prompt Compilation", index: 5 }
      ];
      
      const progress = Math.round(((scanStageIndex + 1) / steps.length) * 100);

      return (
        <div className="fixed inset-0 z-50 bg-[var(--color-bg)] flex items-center justify-center p-6 select-none transition-all duration-300">
          <Card className="w-full max-w-lg border border-[var(--color-border)] p-8 space-y-6 shadow-md bg-[var(--color-bgCard)]">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[var(--color-accent)] uppercase tracking-wider block font-heading">Studio Pipeline Active</span>
              <h2 className="text-xl font-bold tracking-tight text-[var(--color-text)] font-heading">Analyzing Visual Intelligence</h2>
            </div>

            {/* Live Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-[var(--color-textMuted)] font-medium">
                <span>Crawl Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-[var(--color-bgMuted)] rounded-full h-1 overflow-hidden">
                <div
                  className="bg-[var(--color-accent)] h-1 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Live Steps Progression */}
            <div className="space-y-3 pt-2">
              {steps.map((s) => {
                const isActive = scanStageIndex === s.index;
                const isCompleted = scanStageIndex > s.index;
                return (
                  <div key={s.index} className="flex items-center justify-between text-xs py-0.5 border-b border-[var(--color-border)] pb-2 last:border-b-0 last:pb-0">
                    <span className={`font-semibold flex items-center space-x-2 ${
                      isActive ? "text-[var(--color-text)]" : isCompleted ? "text-[var(--color-textMuted)] line-through opacity-50" : "text-[var(--color-textMuted)] opacity-60"
                    }`}>
                      <span>{isCompleted ? "✓" : isActive ? "⚡" : "○"}</span>
                      <span className="tracking-wide">{s.label}</span>
                    </span>
                    <span className="text-[10px] font-mono text-[var(--color-textMuted)]">
                      {isCompleted ? "Captured" : isActive ? "Analyzing..." : "Pending"}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      );
    }

    if (scanStatus === "error" || scanError) {
      return (
        <div className="p-6 h-full flex flex-col items-center justify-center text-[var(--color-text)] bg-[var(--color-bg)] select-none">
          <Card className="w-full max-w-md border border-rose-500/30 p-6 space-y-4 shadow-sm">
            <div className="flex items-center space-x-3 text-rose-500">
              <span className="text-xl">⚠️</span>
              <h3 className="text-sm font-bold uppercase tracking-wider font-heading">Discovery Failure</h3>
            </div>
            
            <p className="text-xs text-[var(--color-textMuted)] leading-relaxed">
              {scanError || "An unexpected error occurred during the visual crawl execution."}
            </p>

            <div className="flex space-x-3 pt-2">
              <Button onClick={onScan} variant="primary" className="text-xs font-semibold">
                Retry Scan
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    switch (activePage) {
      case "Scan Results":
        return <ScanResultsPage report={report} designGenome={designGenome} onScan={onScan} />;
      case "Genome":
        return <GenomePage designGenome={designGenome} />;
      case "Knowledge Graph":
        return <KnowledgeGraphPage designGenome={designGenome} />;
      case "Prompt Studio":
        return <PromptStudioPage promptRegistry={promptRegistry} designGenome={designGenome} />;
      case "Genome Mixer":
        return <GenomeMixerPage designGenome={designGenome} scans={scans} />;
      case "Custom Prompt":
        return <CustomPromptPage designGenome={designGenome} report={report} />;
      case "History":
        return <HistoryPage designGenome={designGenome} />;
      case "Exports":
        return <ExportPage designGenome={designGenome} promptRegistry={promptRegistry} />;
      case "Vault":
        return <VaultPage onLoadScan={onLoadScan} />;
      case "Settings":
        return <SettingsPage />;
      case "Scan":
        return report && Object.keys(report).length > 0 ? (
          <ScanResultsPage report={report} designGenome={designGenome} onScan={onScan} />
        ) : (
          <DashboardPage designGenome={designGenome} promptRegistry={promptRegistry} timings={timings} onScan={onScan} scans={scans} />
        );
      case "Dashboard":
      default:
        return <DashboardPage designGenome={designGenome} promptRegistry={promptRegistry} timings={timings} onScan={onScan} scans={scans} />;
    }
  };

  return (
    <WorkspaceErrorBoundary>
      <div className="h-full w-full overflow-hidden animate-fade-in" key={activePage}>
        {renderPage()}
      </div>
    </WorkspaceErrorBoundary>
  );
}
export default WorkspaceRouter;
