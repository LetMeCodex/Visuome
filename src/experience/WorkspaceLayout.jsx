import React from "react";
import NavigationRail from "./NavigationRail.jsx";
import TopCommandBar from "./TopCommandBar.jsx";
import ContextPanel from "./ContextPanel.jsx";
import StatusBar from "./StatusBar.jsx";
import WorkspaceRouter from "./WorkspaceRouter.jsx";

export function WorkspaceLayout({
  activePage = "Scan",
  onNavigate,
  report = {},
  promptRegistry,
  designGenome,
  currentUrl,
  onScan,
  searchQuery,
  scanStatus = "idle",
  scanStageIndex = 0,
  scanError = "",
  onLoadScan,
  timings = {},
  scans = []
}) {
  const [devMode, setDevMode] = React.useState(false);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("visuome_settings");
      if (saved) {
        const parsed = JSON.parse(saved);
        setDevMode(!!parsed.developerMode);
      }
    } catch {}
  }, [activePage]);

  return (
    <div className="workspace-layout flex flex-col h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-sans overflow-hidden transition-all duration-300">
      <div className="flex flex-1 overflow-hidden">
        <NavigationRail activePage={activePage} onNavigate={onNavigate} />
        
        <div className="flex-1 flex flex-col min-w-0">
          <TopCommandBar currentUrl={currentUrl} onScan={onScan} />
          
          <div className="flex-1 flex min-h-0 overflow-hidden">
            <div className="flex-1 overflow-hidden h-full">
              <WorkspaceRouter
                activePage={activePage}
                report={report}
                promptRegistry={promptRegistry}
                designGenome={designGenome}
                onScan={onScan}
                searchQuery={searchQuery}
                scanStatus={scanStatus}
                scanStageIndex={scanStageIndex}
                scanError={scanError}
                onLoadScan={onLoadScan}
                timings={timings}
                scans={scans}
              />
            </div>
            
            {devMode && (
              <div className="border-l border-[var(--color-border)] bg-[var(--color-bgMuted)] h-full w-64 shrink-0 transition-all duration-300">
                <ContextPanel activePage={activePage} />
              </div>
            )}
          </div>
          
          <StatusBar statusText="Systems nominal" />
        </div>
      </div>
    </div>
  );
}
export default WorkspaceLayout;
