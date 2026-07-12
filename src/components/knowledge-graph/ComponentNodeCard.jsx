import React from "react";
import Card from "../ui/Card.jsx";

export function ComponentNodeCard({ tag = "button", name = "Primary Button", role = "button" }) {
  return (
    <Card className="border-l-4 border-l-blue-500">
      <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Component Node</span>
      <h4 className="text-sm font-bold text-white mt-1">{name}</h4>
      <div className="flex justify-between items-center text-[10px] text-[#a9b1d6] mt-2">
        <span>Tag: <strong>&lt;{tag}&gt;</strong></span>
        <span>Aria Role: <strong>{role}</strong></span>
      </div>
    </Card>
  );
}
export default ComponentNodeCard;
