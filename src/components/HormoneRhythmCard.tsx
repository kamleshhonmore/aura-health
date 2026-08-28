import React from 'react';
import { CyclePhaseInfo } from '../types';
import { Activity, ShieldAlert, Sparkles, Lightbulb } from 'lucide-react';

interface HormoneRhythmCardProps {
  info: CyclePhaseInfo;
}

export const HormoneRhythmCard: React.FC<HormoneRhythmCardProps> = ({ info }) => {
  return (
    <div className="p-5 bg-[#181B24] border border-white/8 rounded-3xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#E5C388]/15 border border-[#E5C388]/30 text-[#E5C388]">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Endocrine Biomarker Trajectory</h3>
            <p className="text-[11px] text-[#7E8799]">Day {info.cycleDay} Physiological Wave</p>
          </div>
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#9CAF88]/15 text-[#9CAF88] font-medium border border-[#9CAF88]/30">
          Optimal Zone
        </span>
      </div>

      {/* Hormonal Bars */}
      <div className="space-y-2.5">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#C4C9D6] font-medium">Estrogen (Estradiol)</span>
            <span className="text-[#E29587] font-semibold">{info.estrogenLevel}% • Rising</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#202430] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#E29587] to-[#F2ADA0] transition-all duration-700"
              style={{ width: `${info.estrogenLevel}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#C4C9D6] font-medium">Luteinizing Hormone (LH)</span>
            <span className="text-[#E5C388] font-semibold">{info.lhLevel}% • Basal</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#202430] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#E5C388] to-[#F5DBA8] transition-all duration-700"
              style={{ width: `${info.lhLevel}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#C4C9D6] font-medium">Progesterone</span>
            <span className="text-[#9CAF88] font-semibold">{info.progesteroneLevel}% • Low (Pre-ovulatory)</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#202430] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#9CAF88] to-[#BED3A9] transition-all duration-700"
              style={{ width: `${info.progesteroneLevel}%` }}
            />
          </div>
        </div>
      </div>

      {/* Clinical Guidance Box */}
      <div className="p-3 rounded-2xl bg-[#12141C] border border-white/5 space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs text-[#E5C388] font-semibold">
          <Lightbulb className="w-3.5 h-3.5" />
          Follicular Phase Guidance
        </div>
        <p className="text-xs text-[#9DA4B5] leading-relaxed">
          {info.dailyAdvice}
        </p>
      </div>
    </div>
  );
};
