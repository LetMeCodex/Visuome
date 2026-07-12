import React from "react";
import ConfidenceRing from "../charts/ConfidenceRing.jsx";
import Card from "../ui/Card.jsx";

export function OverallScoreCard({ score = 95 }) {
  return (
    <Card className="flex items-center justify-between">
      <div>
        <span className="text-xs text-[#a9b1d6]">Overall Design Score</span>
        <h3 className="text-lg font-bold text-white mt-1">Excellent</h3>
      </div>
      <ConfidenceRing score={score} />
    </Card>
  );
}
export default OverallScoreCard;
