import React from "react";

export function IconButton({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-md hover:bg-[var(--color-bgCard)] border border-transparent hover:border-[var(--color-border)] transition-all text-[var(--color-textMuted)] hover:text-[var(--color-text)] focus:outline-none ${className}`}
    >
      {children}
    </button>
  );
}
export default IconButton;
