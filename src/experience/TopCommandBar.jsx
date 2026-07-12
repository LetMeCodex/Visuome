import React from "react";
import SearchBar from "../components/ui/SearchBar.jsx";
import IconButton from "../components/ui/IconButton.jsx";
import Button from "../components/ui/Button.jsx";
import { useTheme } from "./ThemeProvider.jsx";
import workspaceStore from "./WorkspaceStore.js";

export function TopCommandBar({ currentUrl = "localhost", onSearch, onScan }) {
  const { theme, toggleTheme } = useTheme() || { theme: "dark", toggleTheme: () => {} };
  const [notifOpen, setNotifOpen] = React.useState(false);

  const handleSearch = (query) => {
    workspaceStore.setSearchQuery(query);
    if (onSearch) onSearch(query);
  };

  const triggerScan = () => {
    if (onScan) onScan();
  };

  return (
    <div className="top-command-bar h-14 bg-[var(--color-bgMuted)] border-b border-[var(--color-border)] px-4 flex items-center justify-between text-[var(--color-text)] select-none shrink-0 relative transition-all duration-150">
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div className="flex items-center space-x-2 bg-[var(--color-bgCard)] border border-[var(--color-border)] px-2.5 py-1 rounded-[var(--radius-xs,2px)] shrink-0 max-w-[200px] md:max-w-[300px] truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse shrink-0"></span>
          <span className="text-[10px] font-mono tracking-wide text-[var(--color-text)] truncate">{currentUrl}</span>
        </div>
        
        <div className="relative flex-1 max-w-xs">
          <SearchBar onChange={handleSearch} placeholder="Search commands..." />
        </div>
      </div>

      <div className="flex items-center space-x-3 shrink-0">
        <Button
          onClick={triggerScan}
          variant="primary"
          className="py-1"
        >
          <span>🔍</span>
          <span className="tracking-wide">Scan</span>
        </Button>

        <div className="relative">
          <IconButton onClick={() => setNotifOpen(!notifOpen)} className="relative hover:bg-[var(--color-bgCard)] text-[var(--color-text)]">
            <span>🔔</span>
          </IconButton>
          
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-[var(--color-bgCard)] border border-[var(--color-border)] rounded-[var(--radius-md,4px)] p-3 z-50 animate-fade-in">
              <div className="flex justify-between items-center mb-2 border-b border-[var(--color-border)] pb-1.5">
                <h4 className="text-[10px] font-bold text-[var(--color-text)] font-heading uppercase tracking-wider">Notifications</h4>
                <button onClick={() => setNotifOpen(false)} className="text-[9px] text-[var(--color-textMuted)] hover:text-[var(--color-text)] bg-transparent border-0 cursor-pointer">Clear</button>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="p-2 bg-[var(--color-bgMuted)] rounded-[var(--radius-xs,2px)] border border-[var(--color-border)]">
                  <div className="font-semibold text-[var(--color-text)]">Visual Scan Operational</div>
                  <div className="text-[10px] text-[var(--color-textMuted)] mt-0.5 leading-relaxed">Visuome offline scanner engine loaded successfully.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <IconButton onClick={toggleTheme} className="hover:bg-[var(--color-bgCard)] text-[var(--color-text)]">
          {theme === "dark" ? "☀️" : "🌙"}
        </IconButton>
      </div>
    </div>
  );
}
export default TopCommandBar;
