import React, { useState } from 'react';
import { PetCompanion, ThemeConfig } from '../types';
import { Sparkles, MessageCircle, Heart } from 'lucide-react';

interface PetMascotProps {
  pet: PetCompanion;
  theme: ThemeConfig;
  cyclePhase: 'period' | 'follicular' | 'fertile' | 'ovulation' | 'luteal';
  isWaterGoalReached: boolean;
  onOpenPetSelector: () => void;
}

export const PetMascot: React.FC<PetMascotProps> = ({
  pet,
  theme,
  cyclePhase,
  isWaterGoalReached,
  onOpenPetSelector,
}) => {
  const [bounce, setBounce] = useState(false);
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);

  // Pick relevant greetings based on state
  let greetingList = pet.greetings.standard;
  if (isWaterGoalReached) {
    greetingList = pet.greetings.waterGoal;
  } else if (cyclePhase === 'period') {
    greetingList = pet.greetings.period;
  } else if (cyclePhase === 'ovulation') {
    greetingList = pet.greetings.ovulation;
  } else if (cyclePhase === 'fertile') {
    greetingList = pet.greetings.fertile;
  }

  const currentGreeting = greetingList[activeMessageIndex % greetingList.length];

  const handleTapPet = () => {
    setBounce(true);
    setActiveMessageIndex((prev) => prev + 1);
    setTimeout(() => setBounce(false), 600);
  };

  return (
    <div
      className={`p-4 rounded-3xl ${theme.bgCard} border ${theme.borderCard} ${theme.shadowColor} shadow-md flex items-center gap-3.5 relative overflow-hidden transition-all`}
    >
      {/* Interactive Mascot Avatar */}
      <button
        onClick={handleTapPet}
        title="Tap to talk to me!"
        className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFF5F8] to-[#FFE3EB] border border-[#FFCDD2] shadow-sm flex items-center justify-center text-3xl shrink-0 cursor-pointer transition-transform ${
          bounce ? 'scale-125 rotate-6' : 'hover:scale-110 active:scale-95 animate-bounce-subtle'
        }`}
      >
        <span>{pet.avatar}</span>
      </button>

      {/* Speech Bubble */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <span className={`font-black text-xs font-['Fredoka'] ${theme.textPrimary}`}>
              {pet.name}
            </span>
            <span className="text-[10px] text-[#FF6B8B] font-bold px-1.5 py-0.2 rounded-full bg-[#FFE3E9]">
              Companion
            </span>
          </div>
          <button
            onClick={onOpenPetSelector}
            className="text-[10px] font-bold text-[#FF6B8B] hover:underline cursor-pointer"
          >
            Change Pet
          </button>
        </div>

        <p
          onClick={handleTapPet}
          className={`text-xs font-medium ${theme.textSecondary} leading-snug cursor-pointer select-none line-clamp-2`}
        >
          {currentGreeting}
        </p>
      </div>
    </div>
  );
};
