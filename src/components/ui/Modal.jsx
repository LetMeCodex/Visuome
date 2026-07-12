import React from "react";

export function Modal({ isOpen, onClose, title = "", children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#1a1b26] border border-[#2f3147] rounded-lg p-6 w-96 text-white shadow-2xl">
        <div className="flex justify-between items-center mb-4 border-b border-[#2f3147] pb-2">
          <h3 className="text-sm font-bold">{title}</h3>
          <button onClick={onClose} className="text-[#a9b1d6] hover:text-white text-xs">✕</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
export default Modal;
