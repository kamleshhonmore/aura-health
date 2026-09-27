import React from 'react';
import {
  Zap, Activity, Brain, Bone, Battery, Droplets, Coffee, Moon, Sun,
  Target, Sparkles, Smile, Flame, Waves, Wind, ShieldAlert, Heart,
  Thermometer, RefreshCw, Feather
} from 'lucide-react';

interface IllustrationProps {
  id: string;
  className?: string;
}

export const SymptomIllustration: React.FC<IllustrationProps> = ({ id, className = "w-6 h-6" }) => {
  switch (id) {
    case 'cramps':
      return (
        <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-tr from-[#FF5376]/20 to-[#FF85A1]/30 p-2 text-[#FF5376] ${className}`}>
          <Zap className="w-5 h-5" />
          <div className="absolute inset-0 rounded-2xl border border-[#FF5376]/40 animate-pulse" />
        </div>
      );
    case 'tender_breasts':
      return (
        <div className={`flex items-center justify-center rounded-2xl bg-gradient-to-tr from-[#C86D51]/20 to-[#E29578]/30 p-2 text-[#C86D51] ${className}`}>
          <Heart className="w-5 h-5 fill-[#C86D51]/30" />
        </div>
      );
    case 'headache':
      return (
        <div className={`flex items-center justify-center rounded-2xl bg-gradient-to-tr from-[#7B6B8D]/20 to-[#9D8CB0]/30 p-2 text-[#7B6B8D] ${className}`}>
          <Brain className="w-5 h-5" />
        </div>
      );
    case 'backache':
      return (
        <div className={`flex items-center justify-center rounded-2xl bg-gradient-to-tr from-[#D97706]/20 to-[#F59E0B]/30 p-2 text-[#D97706] ${className}`}>
          <Bone className="w-5 h-5" />
        </div>
      );
    case 'fatigue':
      return (
        <div className={`flex items-center justify-center rounded-2xl bg-gradient-to-tr from-[#646478]/20 to-[#9E948C]/30 p-2 text-[#646478] ${className}`}>
          <Battery className="w-5 h-5" />
        </div>
      );
    case 'bloating':
      return (
        <div className={`flex items-center justify-center rounded-2xl bg-gradient-to-tr from-[#4A7C59]/20 to-[#81C784]/30 p-2 text-[#4A7C59] ${className}`}>
          <Waves className="w-5 h-5" />
        </div>
      );
    case 'nausea':
      return (
        <div className={`flex items-center justify-center rounded-2xl bg-gradient-to-tr from-[#5B8A72]/20 to-[#A3B899]/30 p-2 text-[#5B8A72] ${className}`}>
          <Coffee className="w-5 h-5" />
        </div>
      );
    case 'insomnia':
      return (
        <div className={`flex items-center justify-center rounded-2xl bg-gradient-to-tr from-[#3B82F6]/20 to-[#93C5FD]/30 p-2 text-[#3B82F6] ${className}`}>
          <Moon className="w-5 h-5" />
        </div>
      );
    case 'hot_flashes':
      return (
        <div className={`flex items-center justify-center rounded-2xl bg-gradient-to-tr from-[#EF4444]/20 to-[#FCA5A5]/30 p-2 text-[#EF4444] ${className}`}>
          <Flame className="w-5 h-5" />
        </div>
      );
    case 'dizziness':
      return (
        <div className={`flex items-center justify-center rounded-2xl bg-gradient-to-tr from-[#8B5CF6]/20 to-[#C4B5FD]/30 p-2 text-[#8B5CF6] ${className}`}>
          <RefreshCw className="w-5 h-5 animate-spin" />
        </div>
      );
    case 'ovulation_pain':
      return (
        <div className={`flex items-center justify-center rounded-2xl bg-gradient-to-tr from-[#EC4899]/20 to-[#F472B6]/30 p-2 text-[#EC4899] ${className}`}>
          <Target className="w-5 h-5" />
        </div>
      );
    case 'acne':
    case 'oily_skin':
    case 'dry_skin':
    case 'glowing_skin':
      return (
        <div className={`flex items-center justify-center rounded-2xl bg-gradient-to-tr from-[#10B981]/20 to-[#6EE7B7]/30 p-2 text-[#10B981] ${className}`}>
          <Sparkles className="w-5 h-5" />
        </div>
      );
    case 'cravings_sweet':
    case 'cravings_salty':
    case 'high_appetite':
      return (
        <div className={`flex items-center justify-center rounded-2xl bg-gradient-to-tr from-[#F59E0B]/20 to-[#FDE68A]/30 p-2 text-[#F59E0B] ${className}`}>
          <Flame className="w-5 h-5" />
        </div>
      );
    case 'constipation':
    case 'diarrhea':
    case 'gas':
      return (
        <div className={`flex items-center justify-center rounded-2xl bg-gradient-to-tr from-[#14B8A6]/20 to-[#5FE9D0]/30 p-2 text-[#14B8A6] ${className}`}>
          <Wind className="w-5 h-5" />
        </div>
      );
    default:
      return (
        <div className={`flex items-center justify-center rounded-2xl bg-gradient-to-tr from-[#C86D51]/20 to-[#E29578]/30 p-2 text-[#C86D51] ${className}`}>
          <Activity className="w-5 h-5" />
        </div>
      );
  }
};
