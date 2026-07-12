import React from "react";

export function Button({ children, onClick, variant = "primary", className = "" }) {
  const base = "px-4 py-2 rounded-[var(--radius-sm,2px)] text-[10px] font-bold tracking-wider uppercase transition-all duration-200 focus:outline-none select-none border border-solid flex items-center justify-center gap-1.5 cursor-pointer";
  
  const variants = {
    primary: "bg-[var(--color-text)] text-[var(--color-bg)] border-[var(--color-text)] hover:bg-[var(--color-bgMuted)] hover:text-[var(--color-text)] hover:border-[var(--color-border)] active:scale-[0.98]",
    secondary: "bg-transparent text-[var(--color-text)] border-[var(--color-border)] hover:bg-[var(--color-bgMuted)] hover:border-[var(--color-text)] active:scale-[0.98]",
    danger: "bg-transparent text-[var(--color-danger)] border-[var(--color-danger)] hover:bg-[var(--color-danger)] hover:text-[var(--color-bgCard)] active:scale-[0.98]"
  };

  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}
export default Button;
