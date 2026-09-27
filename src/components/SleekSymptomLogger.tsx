import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Flame, Heart, Sparkles, Smile, ChevronRight, Plus } from 'lucide-react';
import { ThemeConfig, DayLog } from '../types';

interface Symptom {
  id: string;
  label: string;
  category: 'body' | 'mood' | 'skin';
  icon: React.ElementType;
}

const PHASE_SYMPTOMS: Record<string, Symptom[]> = {
  Luteal: [
    { id: 'cramps', label: 'Cramps', category: 'body', icon: Flame },
    { id: 'bloating', label: 'Bloating', category: 'body', icon: Activity },
    { id: 'tender_breasts', label: 'Tender Breasts', category: 'body', icon: Heart },
    { id: 'acne', label: 'Breakout', category: 'skin', icon: Sparkles },
  ],
  Follicular: [
    { id: 'high_energy', label: 'High Energy', category: 'mood', icon: Smile },
    { id: 'glowing_skin', label: 'Glowing Skin', category: 'skin', icon: Sparkles },
    { id: 'ovulation_pain', label: 'Ovulation Pain', category: 'body', icon: Flame },
    { id: 'headache', label: 'Headache', category: 'body', icon: Activity },
  ],
  Period: [
    { id: 'cramps', label: 'Cramps', category: 'body', icon: Flame },
    { id: 'fatigue', label: 'Fatigue', category: 'body', icon: Activity },
    { id: 'headache', label: 'Headache', category: 'body', icon: Heart },
    { id: 'bloating', label: 'Bloating', category: 'body', icon: Sparkles },
  ],
};

interface SleekSymptomLoggerProps {
  currentPhase?: string;
  todayLog?: DayLog;
  theme: ThemeConfig;
  onToggleSymptom: (id: string) => void;
  onOpenLogModal: () => void;
}

export const SleekSymptomLogger: React.FC<SleekSymptomLoggerProps> = ({
  currentPhase = 'Luteal',
  todayLog,
  theme,
  onToggleSymptom,
  onOpenLogModal,
}) => {
  const [showAll, setShowAll] = useState(false);
  const selectedSymptoms = todayLog?.symptoms || [];

  const activeSymptoms = PHASE_SYMPTOMS[currentPhase] || PHASE_SYMPTOMS['Luteal'];

  return (
    <div className="product-card rounded-[32px] p-5 space-y-4">
      {/* Dynamic Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black font-['Fredoka'] text-[#2C2A29]">
            Contextual Quick Log
          </h3>
          <p className="text-xs font-medium text-[#7A7571]">
            Suggested for {currentPhase} Phase
          </p>
        </div>
        <button
          onClick={onOpenLogModal}
          className="flex items-center gap-1 text-xs font-black font-['Fredoka'] text-[#C86D51] hover:underline cursor-pointer"
        >
          <span>All Symptoms</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Sleek Visual Grid (Phase-aware suggestions) */}
      <div className="grid grid-cols-2 gap-2.5">
        <AnimatePresence>
          {activeSymptoms.map((symptom) => {
            const Icon = symptom.icon;
            const isSelected = selectedSymptoms.includes(symptom.id);

            return (
              <motion.button
                key={symptom.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => onToggleSymptom(symptom.id)}
                className={`flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 border cursor-pointer ${
                  isSelected
                    ? 'bg-[#C86D51] text-white border-[#C86D51] shadow-md shadow-rose-900/10'
                    : 'bg-stone-50/85 text-[#2C2A29] border-stone-200/60 hover:bg-stone-100/90'
                }`}
              >
                <div
                  className={`p-2 rounded-xl transition-colors ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-white text-[#C86D51] shadow-xs'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold font-['Fredoka'] text-left leading-tight truncate">
                  {symptom.label}
                </span>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
