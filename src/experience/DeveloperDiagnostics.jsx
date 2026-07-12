import React, { useEffect, useState } from "react";
import workspaceStore from "./WorkspaceStore.js";
import Card from "../components/ui/Card.jsx";

export function DeveloperDiagnostics() {
  const [visible, setVisible] = useState(false);
  const [state, setState] = useState(workspaceStore.getState());
  const [renders, setRenders] = useState(1);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "d") {
        setVisible((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    const unsubscribe = workspaceStore.subscribe((s) => {
      setState(s);
      setRenders((r) => r + 1);
    });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      unsubscribe();
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed top-16 right-4 z-50 w-80 max-h-[80vh] overflow-y-auto bg-black/90 border border-indigo-500/50 rounded-lg p-4 shadow-2xl text-xs text-[#a9b1d6]">
      <h3 className="text-white font-bold mb-3 border-b border-indigo-500/30 pb-1.5 flex justify-between">
        <span>🛠️ Developer Diagnostics</span>
        <button onClick={() => setVisible(false)} className="text-xs hover:text-white">✕</button>
      </h3>
      
      <div className="space-y-3 font-mono">
        <div>
          <span className="text-indigo-400 block">Active Page:</span>
          <span className="text-white font-bold">{state.activePage}</span>
        </div>
        <div>
          <span className="text-indigo-400 block">Theme:</span>
          <span className="text-white font-bold">{state.theme}</span>
        </div>
        <div>
          <span className="text-indigo-400 block">Search Query:</span>
          <span className="text-white font-bold">"{state.searchQuery}"</span>
        </div>
        <div>
          <span className="text-indigo-400 block">Render Count:</span>
          <span className="text-white font-bold">{renders}</span>
        </div>
        <div>
          <span className="text-indigo-400 block">Full Store State:</span>
          <pre className="text-[10px] bg-black/60 p-2 rounded border border-[#2f3147] mt-1 text-[#565f89] overflow-x-auto">
            {JSON.stringify({
              activePage: state.activePage,
              theme: state.theme,
              lastSearch: state.lastSearch,
              sidebarOpen: state.sidebarOpen,
              contextPanelWidth: state.contextPanelWidth
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
export default DeveloperDiagnostics;
