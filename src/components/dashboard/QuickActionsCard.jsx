import React from "react";
import Card from "../ui/Card.jsx";
import Button from "../ui/Button.jsx";

export function QuickActionsCard({ onAction }) {
  return (
    <Card className="bg-[#1c1d2a] border-[#2f3147] hover:border-[#4f46e5]/40 transition-all duration-300">
      <span className="text-[10px] font-bold text-[#565f89] uppercase tracking-wider mb-3 block">Quick Actions</span>
      <div className="flex flex-col space-y-2">
        <Button onClick={() => onAction && onAction("recalculate")} variant="primary" className="text-xs bg-[#4f46e5] hover:bg-[#5a52e6] border-0 text-white font-semibold shadow-md">
          Recalculate Genome
        </Button>
        <Button onClick={() => onAction && onAction("checksum")} variant="secondary" className="text-xs border-[#2f3147] text-[#a9b1d6] hover:text-white hover:bg-[#24283b] transition-all">
          Verify Checksums
        </Button>
        <Button onClick={() => onAction && onAction("purge")} variant="danger" className="text-xs bg-[#ff7f96]/10 hover:bg-[#ff7f96]/20 border border-[#ff7f96]/30 text-[#ff7f96] transition-all">
          Purge Cache
        </Button>
      </div>
    </Card>
  );
}
export default QuickActionsCard;
