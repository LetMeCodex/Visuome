import React from "react";

export function Tabs({ list = [], active = "", onChange }) {
  return (
    <div className="flex border-b border-[#2f3147] mb-4">
      {list.map(t => (
        <button
          key={t}
          onClick={() => onChange && onChange(t)}
          className={`px-4 py-2 text-xs transition-all border-b-2 font-medium ${
            active === t
              ? "border-[#4f46e5] text-white font-bold"
              : "border-transparent text-[#a9b1d6] hover:text-white"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
export default Tabs;
