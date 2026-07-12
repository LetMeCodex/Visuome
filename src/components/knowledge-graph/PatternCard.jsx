import React from "react";
import Card from "../ui/Card.jsx";

export function PatternCard({ pattern = "Glassmorphism Card Layout" }) {
  return (
    <Card className="border-l-4 border-l-cyan-500">
      <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Pattern Node</span>
      <h4 className="text-sm font-bold text-white mt-1">{pattern}</h4>
      <p className="text-xs text-[#a9b1d6] mt-1">Identified styling design system structure.</p>
    </Card>
  );
}
export default PatternCard;
