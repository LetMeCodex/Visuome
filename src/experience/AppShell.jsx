import React, { useEffect, useState } from "react";
import { ThemeProvider } from "./ThemeProvider.jsx";
import { WindowStateProvider } from "./WindowState.jsx";
import WorkspaceLayout from "./WorkspaceLayout.jsx";
import workspaceStore from "./WorkspaceStore.js";

import DeveloperDiagnostics from "./DeveloperDiagnostics.jsx";
import CommandPalette from "./CommandPalette.jsx";

export function AppShell({
  report = {},
  promptRegistry = {},
  designGenome = {},
  currentUrl = "localhost",
  onScan,
  scanStatus = "idle",
  scanStageIndex = 0,
  scanError = "",
  onLoadScan,
  timings = {},
  scans = []
}) {
  const [storeState, setStoreState] = useState(workspaceStore.getState());
  const [paletteOpen, setPaletteOpen] = useState(false);

  console.log("PROMPTS RECEIVED inside AppShell", promptRegistry);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    const unsubscribe = workspaceStore.subscribe((state) => {
      setStoreState(state);
    });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      unsubscribe();
    };
  }, []);

  const handleNavigate = (page) => {
    console.log("Visuome AppShell: handleNavigate called for page:", page);
    workspaceStore.setState({ activePage: page });
  };

  return (
    <ThemeProvider>
      <WindowStateProvider>
        <WorkspaceLayout
          activePage={storeState.activePage}
          onNavigate={handleNavigate}
          report={report}
          promptRegistry={promptRegistry}
          designGenome={designGenome}
          currentUrl={currentUrl}
          onScan={onScan}
          searchQuery={storeState.searchQuery}
          scanStatus={scanStatus}
          scanStageIndex={scanStageIndex}
          scanError={scanError}
          onLoadScan={onLoadScan}
          timings={timings}
          scans={scans}
        />
        <DeveloperDiagnostics />
        <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} />
      </WindowStateProvider>
    </ThemeProvider>
  );
}
export default AppShell;
