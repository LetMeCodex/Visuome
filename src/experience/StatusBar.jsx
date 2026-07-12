import React from "react";

export function StatusBar({ statusText = "Systems nominal" }) {
  return (
    <div className="status-bar h-8 bg-[var(--color-bgMuted)] border-t border-[var(--color-border)] px-4 flex items-center justify-between text-[10px] text-[var(--color-textMuted)] shrink-0 select-none tracking-wider font-semibold">
      <div className="flex items-center space-x-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse"></span>
        <span className="uppercase text-[9px] text-[var(--color-text)]">Visuome Studio</span>
        <span className="opacity-40">/</span>
        <span>{statusText}</span>
      </div>
      <div className="flex items-center space-x-2 text-[var(--color-textMuted)] opacity-60">
        <span>Offline Engine</span>
      </div>
    </div>
  );
}
export default StatusBar;
