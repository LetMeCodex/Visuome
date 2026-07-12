import React from "react";

export function Badge({ children, variant = "default" }) {
  const base = "px-2 py-0.5 rounded-[var(--radius-xs,2px)] text-[9px] font-bold tracking-wider uppercase inline-block border border-solid";
  
  const variants = {
    default: "bg-[var(--color-bgMuted)] text-[var(--color-text)] border-[var(--color-border)]",
    success: "bg-emerald-500/10 text-[var(--color-success)] border-emerald-500/20",
    warning: "bg-amber-500/10 text-[var(--color-warning)] border-amber-500/20",
    info: "bg-sky-500/10 text-[var(--color-accent)] border-sky-500/20"
  };

  return <span className={`${base} ${variants[variant]}`}>{children}</span>;
}
export default Badge;
