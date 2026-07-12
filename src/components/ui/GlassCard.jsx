import React from "react";

export function GlassCard({ children, className = "" }) {
  return (
    <div className={`p-4 rounded-lg bg-[#1a1b26]/70 backdrop-blur-md border border-[#2f3147]/50 ${className}`}>
      {children}
    </div>
  );
}
export default GlassCard;
