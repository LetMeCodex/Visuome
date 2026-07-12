import React from "react";

export function Tooltip({ text = "", children }) {
  return (
    <div className="group relative inline-block">
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded bg-[#1a1b26] border border-[#2f3147] px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100 shadow-lg">
        {text}
      </span>
    </div>
  );
}
export default Tooltip;
