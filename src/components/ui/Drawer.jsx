import React from "react";

export function Drawer({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-[#1a1b26] border-l border-[#2f3147] z-40 p-4 text-white shadow-2xl flex flex-col transition-all duration-300">
      <div className="flex justify-end mb-4">
        <button onClick={onClose} className="text-[#a9b1d6] hover:text-white text-xs">✕ Close</button>
      </div>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
export default Drawer;
