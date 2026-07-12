import React from "react";
import Card from "../ui/Card.jsx";

export function PipelineTimeline({ timings = {} }) {
  const steps = [
    { label: "Scan Started", key: "DOCUMENT_DISCOVERY" },
    { label: "Visual Analysis", key: "STYLE_DISCOVERY" },
    { label: "Motion Analysis", key: "MOTION_DISCOVERY" },
    { label: "Platform Analysis", key: "PLATFORM_INTELLIGENCE" },
    { label: "Genome Build", key: "DESIGN_GENOME_BUILD" },
    { label: "Prompt Studio", key: "PROMPT_STUDIO_BUILD" },
    { label: "Completed", key: "EXPORT_ENGINE" }
  ];

  return (
    <Card className="bg-[#1c1d2a] border-[#2f3147] hover:border-[#4f46e5]/40 transition-all duration-300 select-none">
      <span className="text-[10px] font-bold text-[#565f89] uppercase tracking-wider mb-4 block">Crawl & Analysis Progression</span>
      <div className="relative pl-6 space-y-4">
        {/* Timeline Line */}
        <div className="absolute left-2.5 top-2.5 bottom-2.5 w-0.5 bg-gradient-to-b from-[#4f46e5] to-[#5de4f4] opacity-50" />

        {steps.map((step, idx) => {
          const completed = timings[step.key] !== undefined;
          return (
            <div key={idx} className="relative flex items-center justify-between text-xs py-0.5">
              {/* Dot */}
              <div
                className={`absolute -left-[20px] w-2.5 h-2.5 rounded-full border transition-all duration-500 ${
                  completed
                    ? "bg-[#5de4f4] border-[#4f46e5] shadow-md shadow-[#4f46e5]/50 scale-110"
                    : "bg-[#14151f] border-[#2f3147]"
                }`}
              />
              <span className={completed ? "text-white font-medium" : "text-[#565f89]"}>
                {step.label}
              </span>
              {completed && (
                <span className="text-[#89b4fa] font-mono text-[10px] bg-[#24283b] px-1.5 py-0.5 rounded border border-[#2f3147]/50">
                  +{timings[step.key]} ms
                </span>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
export default PipelineTimeline;
