import React from "react";

export function SidebarItem({ label = "", active = false, onClick }) {
  const handleClick = (e) => {
    console.log("Visuome SidebarItem clicked:", label);
    if (onClick) onClick(e);
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full text-left text-xs px-3 py-2 rounded transition-all ${
        active
          ? "bg-[#4f46e5] text-white font-semibold"
          : "text-[#a9b1d6] hover:bg-[#24283b] hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}
export default SidebarItem;
