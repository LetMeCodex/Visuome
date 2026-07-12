import React, { useEffect, useState, useRef } from "react";
import workspaceStore from "./WorkspaceStore.js";

export function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands = [
    { name: "Navigate to Dashboard", action: () => workspaceStore.setActivePage("Dashboard"), category: "Navigation", icon: "📊" },
    { name: "Navigate to Scan Results", action: () => workspaceStore.setActivePage("Scan Results"), category: "Navigation", icon: "📋" },
    { name: "Navigate to Genome Explorer", action: () => workspaceStore.setActivePage("Genome"), category: "Navigation", icon: "🧬" },
    { name: "Navigate to Knowledge Graph", action: () => workspaceStore.setActivePage("Knowledge Graph"), category: "Navigation", icon: "🕸️" },
    { name: "Navigate to Prompt Studio", action: () => workspaceStore.setActivePage("Prompt Studio"), category: "Navigation", icon: "💬" },
    { name: "Navigate to Clone Mode", action: () => workspaceStore.setActivePage("Clone Mode"), category: "Navigation", icon: "👥" },
    { name: "Navigate to Genome Mixer", action: () => workspaceStore.setActivePage("Genome Mixer"), category: "Navigation", icon: "🎛️" },
    { name: "Navigate to Vault", action: () => workspaceStore.setActivePage("Vault"), category: "Navigation", icon: "🔒" },
    { name: "Navigate to History", action: () => workspaceStore.setActivePage("History"), category: "Navigation", icon: "🕒" },
    { name: "Navigate to Exports", action: () => workspaceStore.setActivePage("Exports"), category: "Navigation", icon: "📥" },
    { name: "Navigate to Settings", action: () => workspaceStore.setActivePage("Settings"), category: "Navigation", icon: "⚙️" },
    { name: "Trigger Quick Scan", action: () => {
      const scanButton = document.querySelector(".top-command-bar button");
      if (scanButton) scanButton.click();
    }, category: "Actions", icon: "⚡" },
    { name: "Toggle Theme Mode", action: () => {
      const themeToggle = document.querySelector(".top-command-bar button[class*='icon-button']");
      if (themeToggle) themeToggle.click();
    }, category: "Actions", icon: "🌓" }
  ];

  const filtered = commands.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filtered.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
          onClose();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 select-none">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-xl bg-[var(--color-bgCard)]/95 backdrop-blur-md border border-[var(--color-border)] rounded-md shadow-2xl overflow-hidden flex flex-col max-h-[50vh] animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center space-x-3 border-b border-[var(--color-border)] px-4 py-3 bg-[var(--color-bgMuted)]">
          <span className="text-[var(--color-textMuted)] text-sm">🔍</span>
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent text-[var(--color-text)] border-0 outline-none text-xs placeholder-[var(--color-textMuted)] font-medium"
            placeholder="Type a command or search page..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="text-center py-6 text-xs text-[var(--color-textMuted)] italic">
              No command outcomes found matching "{query}"
            </div>
          ) : (
            filtered.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={cmd.name}
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  className={`w-full text-left flex items-center justify-between px-3 py-2 rounded transition-all duration-150 border-0 cursor-pointer ${
                    isSelected
                      ? "bg-[var(--color-accent)] text-[var(--color-text)] font-semibold"
                      : "text-[var(--color-textMuted)] bg-transparent hover:bg-[var(--color-bgMuted)] hover:text-[var(--color-text)]"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-sm">{cmd.icon}</span>
                    <span className="font-medium text-xs">{cmd.name}</span>
                  </div>
                  <span className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                    isSelected ? "bg-[var(--color-text)] text-[var(--color-bg)]" : "bg-[var(--color-bgMuted)] text-[var(--color-textMuted)]"
                  }`}>
                    {cmd.category}
                  </span>
                </button>
              );
            })
          )}
        </div>
        
        <div className="border-t border-[var(--color-border)] px-4 py-2 bg-[var(--color-bgMuted)] flex justify-between items-center text-[9px] text-[var(--color-textMuted)] font-mono">
          <span>Use ↑↓ to navigate, Enter to run</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
}
export default CommandPalette;
