import React from 'react';
import { PcosAssessmentResult } from '../types';
import { ShieldCheck, ArrowRight, Activity, Stethoscope } from 'lucide-react';

interface PcosRiskCardProps {
  result: PcosAssessmentResult;
  onOpenAssessment: () => void;
}

export const PcosRiskCard: React.FC<PcosRiskCardProps> = ({ result, onOpenAssessment }) => {
  const getBadgeColor = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-[#9CAF88]/15 text-[#9CAF88] border-[#9CAF88]/30';
      case 'Moderate': return 'bg-[#E5C388]/15 text-[#E5C388] border-[#E5C388]/30';
      case 'Elevated': return 'bg-[#E29587]/15 text-[#E29587] border-[#E29587]/30';
      default: return 'bg-[#9CAF88]/15 text-[#9CAF88] border-[#9CAF88]/30';
    }
  };

  return (
    <div className="p-5 bg-gradient-to-br from-[#1E222D] to-[#151720] border border-white/8 rounded-3xl space-y-3.5 shadow-xl relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#E29587]/15 border border-[#E29587]/30 text-[#E29587]">
            <Stethoscope className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Rotterdam PCOS Risk Index</h3>
            <p className="text-[11px] text-[#7E8799]">Evidence-Based Clinical Screening</p>
          </div>
        </div>

        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${getBadgeColor(result.riskLevel)}`}>
          {result.riskLevel} Risk ({result.riskScore}%)
        </span>
      </div>

      <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#111318] border border-white/5">
        <div className="w-12 h-12 rounded-xl bg-[#202430] flex flex-col items-center justify-center font-sans">
          <span className="text-base font-extrabold text-white leading-none">{result.riskScore}</span>
          <span className="text-[9px] text-[#7E8799]">/100</span>
        </div>
        <div className="flex-1">
          <p className="text-xs text-[#C4C9D6] line-clamp-2 leading-relaxed">
            {result.summary}
          </p>
        </div>
      </div>

      <button
        onClick={onOpenAssessment}
        className="w-full py-2.5 px-4 rounded-xl bg-[#252A38] hover:bg-[#2F3547] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border border-white/10"
      >
        <span>View Diagnostic Breakdown & Quiz</span>
        <ArrowRight className="w-3.5 h-3.5 text-[#E29587]" />
      </button>
    </div>
  );
};
