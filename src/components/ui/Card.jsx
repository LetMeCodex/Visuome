import React from "react";

export function Card({ children, className = "", onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`p-4 rounded-[var(--radius-md,4px)] bg-[var(--color-bgCard)] border border-[var(--color-border)] transition-all duration-200 ${className}`}
    >
      {children}
    </div>
  );
}
export default Card;
