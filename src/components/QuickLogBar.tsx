import React from 'react';
import { ThemeConfig, DayLog } from '../types';
import { symptomList, moodList } from '../data';
import { Sparkles, Heart, Activity, Scale, Thermometer, Plus, Edit3 } from 'lucide-react';

interface QuickLogBarProps {
  todayLog?: DayLog;
  theme: ThemeConfig;
  onOpenLogModal: () => void;
  onToggleSymptom: (symptomId: string) => void;
}

export const QuickLogBar: React.FC<QuickLogBarProps> = ({
  todayLog,
  theme,
  onOpenLogModal,
  onToggleSymptom,
}) => {
  const popularSymptoms = ['cramps', 'tender_breasts', 'headache', 'bloating', 'glowing_skin', 'acne'];
  const activeSymptoms = todayLog?.symptoms || [];
  const activeMoods = todayLog?.moods || [];
  const intimacy = todayLog?.intimacy || [];

  return (
    <div
      className={`p-4 rounded-3xl ${theme.bgCard} border ${theme.borderCard} ${theme.shadowColor} shadow-md space-y-3 transition-all`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-[#FCE4EC] text-[#E91E63] flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <h3 className={`font-black text-xs font-['Fredoka'] ${theme.textPrimary}`}>
            Today's Log & Body Diary
          </h3>
        </div>

        <button
          onClick={onOpenLogModal}
          className="text-xs font-black font-['Fredoka'] text-[#FF6B8B] hover:text-[#E91E63] flex items-center gap-1 cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          Detailed Log
        </button>
      </div>

      {/* Body Stats Quick Row: Weight, Temp, Intimacy, Mood */}
      <div className="grid grid-cols-3 gap-2">
        {/* Weight */}
        <div
          onClick={onOpenLogModal}
          className={`p-2 rounded-2xl bg-[#F9F9FB] border border-[#EEEEEE] hover:border-pink-200 transition-colors flex flex-col items-center justify-center cursor-pointer text-center`}
        >
          <span className="text-[10px] font-semibold text-[#875C66] flex items-center gap-1">
            <Scale className="w-3 h-3 text-[#FF708F]" /> Weight
          </span>
          <span className="text-xs font-black font-['Fredoka'] text-[#4A2E35]">
            {todayLog?.weight ? `${todayLog.weight} kg` : '--'}
          </span>
        </div>

        {/* Temp */}
        <div
          onClick={onOpenLogModal}
          className={`p-2 rounded-2xl bg-[#F9F9FB] border border-[#EEEEEE] hover:border-pink-200 transition-colors flex flex-col items-center justify-center cursor-pointer text-center`}
        >
          <span className="text-[10px] font-semibold text-[#875C66] flex items-center gap-1">
            <Thermometer className="w-3 h-3 text-[#FFB300]" /> BBT
          </span>
          <span className="text-xs font-black font-['Fredoka'] text-[#4A2E35]">
            {todayLog?.temperature ? `${todayLog.temperature} °F` : '--'}
          </span>
        </div>

        {/* Intimacy */}
        <div
          onClick={onOpenLogModal}
          className={`p-2 rounded-2xl bg-[#F9F9FB] border border-[#EEEEEE] hover:border-pink-200 transition-colors flex flex-col items-center justify-center cursor-pointer text-center`}
        >
          <span className="text-[10px] font-semibold text-[#875C66] flex items-center gap-1">
            <Heart className="w-3 h-3 text-[#E91E63]" /> Intimacy
          </span>
          <span className="text-xs font-black font-['Fredoka'] text-[#4A2E35] capitalize truncate max-w-[80px]">
            {intimacy.length > 0 && intimacy[0] !== 'none' ? intimacy[0].replace('_', ' ') : 'None'}
          </span>
        </div>
      </div>

      {/* Quick Clickable Symptom Chips */}
      <div>
        <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1.5 ${theme.textMuted}`}>
          Quick Symptom Tap
        </span>
        <div className="flex flex-wrap gap-1.5">
          {popularSymptoms.map((symId) => {
            const sym = symptomList.find((s) => s.id === symId);
            if (!sym) return null;
            const isSelected = activeSymptoms.includes(symId);
            return (
              <button
                key={symId}
                onClick={() => onToggleSymptom(symId)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold font-['Fredoka'] flex items-center gap-1.5 transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#FF6B8B] text-white border-[#FF6B8B] shadow-xs scale-105'
                    : 'bg-[#F9F9FB] text-[#614950] border-[#EAE4E7] hover:border-pink-300'
                }`}
              >
                <span>{sym.emoji}</span>
                <span>{sym.name}</span>
              </button>
            );
          })}
          <button
            onClick={onOpenLogModal}
            className="px-2.5 py-1.5 rounded-xl text-xs font-bold font-['Fredoka'] bg-[#FFF0F3] text-[#E91E63] border border-[#FFCDD2] flex items-center gap-1 hover:bg-[#FFE0E6] cursor-pointer"
          >
            <Plus className="w-3 h-3" /> More
          </button>
        </div>
      </div>

      {/* Active Moods and Notes Preview */}
      {(activeMoods.length > 0 || (todayLog?.notes && todayLog.notes.trim().length > 0)) && (
        <div className="pt-2 border-t border-pink-50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            {activeMoods.map((mId) => {
              const m = moodList.find((item) => item.id === mId);
              return m ? (
                <span key={mId} className="px-2 py-0.5 rounded-lg bg-[#FFF2F5] text-[#875C66] font-bold text-[11px] border border-pink-100">
                  {m.emoji} {m.name}
                </span>
              ) : null;
            })}
          </div>

          {todayLog?.notes && (
            <span className="text-[11px] text-[#FF6B8B] font-semibold italic truncate max-w-[140px]">
              "{todayLog.notes}"
            </span>
          )}
        </div>
      )}
    </div>
  );
};
