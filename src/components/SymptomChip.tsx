import React from 'react';
import { motion } from 'motion/react';
import {
  LucideIcon,
  Zap,
  Heart,
  Smile,
  Activity,
  CloudRain,
  Flame,
  Sparkles,
  Droplets,
  Feather,
  Shield,
  Award,
  Compass,
  Brain,
  Meh,
  Frown,
  Moon,
  Sun,
  Coffee,
  Wind,
} from 'lucide-react';

const defaultIconMap: Record<string, LucideIcon> = {
  cramps: Zap,
  tender_breasts: Heart,
  headache: Brain,
  backache: Activity,
  fatigue: Moon,
  bloating: Wind,
  nausea: Feather,
  insomnia: Moon,
  hot_flashes: Flame,
  dizziness: Sparkles,
  ovulation_pain: Sparkles,
  acne: Sparkles,
  oily_skin: Droplets,
  dry_skin: Feather,
  glowing_skin: Sun,
  cravings_sweet: Coffee,
  cravings_salty: Coffee,
  constipation: Shield,
  diarrhea: Droplets,
  gas: Wind,
  high_appetite: Award,
  chills: CloudRain,
  swelling: Droplets,
  restless_legs: Activity,

  // Moods
  happy: Smile,
  calm: Feather,
  in_love: Heart,
  energetic: Zap,
  playful: Sparkles,
  sensitive: Heart,
  sad: Frown,
  anxious: Meh,
  irritable: Flame,
  angry: Flame,
  stressed: Brain,
  tired: Moon,
  confused: Compass,
  mood_swings: Sparkles,
  sensual: Heart,
  confident: Award,
};

interface SymptomChipProps {
  id?: string;
  label: string;
  category?: string;
  Icon?: LucideIcon;
  isSelected: boolean;
  onToggle: () => void;
}

export const SymptomChip: React.FC<SymptomChipProps> = ({
  id,
  label,
  category = 'BODY',
  Icon,
  isSelected,
  onToggle,
}) => {
  const ResolvedIcon = Icon || (id ? defaultIconMap[id] : null) || Activity;

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.02 }}
      onClick={onToggle}
      className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer select-none ${
        isSelected
          ? 'bg-[#C86D51] text-white border-[#C86D51] shadow-md shadow-rose-900/10'
          : 'bg-white/80 text-[#2C2A29] border-slate-100 hover:bg-slate-50'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-xl transition-colors ${
            isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-[#C86D51]'
          }`}
        >
          <ResolvedIcon className="w-5 h-5" />
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold leading-tight font-['Fredoka']">{label}</p>
          <p
            className={`text-[10px] uppercase tracking-wider font-bold mt-0.5 ${
              isSelected ? 'text-white/80' : 'text-[#7A7571]'
            }`}
          >
            {category}
          </p>
        </div>
      </div>
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
          isSelected ? 'border-white bg-white' : 'border-slate-200'
        }`}
      >
        {isSelected && <div className="w-2 h-2 rounded-full bg-[#C86D51]" />}
      </div>
    </motion.button>
  );
};
