import React from "react";

export function EmptyState({ message = "No data available." }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-[var(--color-textMuted)]">
      <svg className="w-10 h-10 mb-3 text-[var(--color-border)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0h-4M4 13H8m4 0h4" />
      </svg>
      <span className="text-xs tracking-wide">{message}</span>
    </div>
  );
}
export default EmptyState;
