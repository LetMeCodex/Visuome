import React from "react";

export function Toast({ text = "", type = "success", onClose }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center p-3 rounded-lg border border-[#2f3147] bg-[#1a1b26] text-white shadow-xl space-x-3">
      <span className="text-xs">{text}</span>
      <button onClick={onClose} className="text-xs text-[#a9b1d6] hover:text-white">✕</button>
    </div>
  );
}
export default Toast;
