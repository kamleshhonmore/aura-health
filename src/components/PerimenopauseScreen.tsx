import React, { useState } from 'react';
import { ThemeConfig, AppSettings } from '../types';
import {
  Flame,
  Moon,
  Heart,
  Smile,
  Sparkles,
  Coffee,
  Plus,
  Check,
  TrendingDown,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PerimenopauseScreenProps {
  theme: ThemeConfig;
  settings: AppSettings;
  onBack: () => void;
}

export const PerimenopauseScreen: React.FC<PerimenopauseScreenProps> = ({
  theme,
  settings,
  onBack,
}) => {
  const [hotFlashCount, setHotFlashCount] = useState(2);
  const [sleepScore, setSleepScore] = useState(7); // 1-10
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['Night Sweats', 'Brain Fog']);

  const perimenopauseSymptoms = [
    { id: 'Night Sweats', label: 'Night Sweats', icon: '💦' },
    { id: 'Hot Flash', label: 'Hot Flash', icon: '🔥' },
    { id: 'Brain Fog', label: 'Brain Fog', icon: '☁️' },
    { id: 'Sleep Disturbance', label: 'Sleep Issues', icon: '😴' },
    { id: 'Mood Fluctuation', label: 'Mood Shifts', icon: '🎭' },
    { id: 'Joint Aches', label: 'Joint Aches', icon: '🦴' },
    { id: 'Chills', label: 'Sudden Chills', icon: '❄️' },
    { id: 'Fatigue', label: 'Low Energy', icon: '🔋' },
  ];

  const handleToggleSymptom = (sym: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  const handleLogHotFlash = () => {
    setHotFlashCount((prev) => prev + 1);
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#AB47BC', '#FF7043', '#FFA726'],
    });
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4 font-['Nunito'] animate-in fade-in duration-200">
      {/* Header */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-[#F3E5F5] to-[#EDE7F6] border border-[#E1BEE7] shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white text-[#7B1FA2] shadow-xs">
            Cycle Transition Care
          </span>
          <span className="text-2xl">🧘‍♀️</span>
        </div>
        <h2 className="text-xl font-black font-['Fredoka'] text-[#3E1F47]">
          Peri-menopause Hub
        </h2>
        <p className="text-xs font-semibold text-[#6A397B] leading-relaxed">
          Track hormonal transitions, vasomotor flushes, and gentle adaptogenic wellness.
        </p>
      </div>

      {/* Quick Vasomotor Flushes Tracker */}
      <div className="p-4 rounded-3xl bg-white border border-pink-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#8E24AA] flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black font-['Fredoka'] text-[#2D1B2D]">
                Hot Flashes Today
              </h3>
              <p className="text-[10px] text-[#875C66]">Log episodes and triggers</p>
            </div>
          </div>
          <span className="text-xl font-black font-['Fredoka'] text-[#8E24AA]">
            {hotFlashCount} logged
          </span>
        </div>

        <button
          onClick={handleLogHotFlash}
          className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-[#AB47BC] to-[#BA68C8] hover:from-[#9C27B0] hover:to-[#AB47BC] text-white text-xs font-black font-['Fredoka'] flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          + Log Hot Flash Episode
        </button>
      </div>

      {/* Perimenopause Symptoms Selector */}
      <div className="p-4 rounded-3xl bg-white border border-pink-100 shadow-sm space-y-2.5">
        <h3 className="text-xs font-black font-['Fredoka'] text-[#2D1B2D]">
          Daily Sensations & Symptoms
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {perimenopauseSymptoms.map((s) => {
            const isSelected = selectedSymptoms.includes(s.id);
            return (
              <button
                key={s.id}
                onClick={() => handleToggleSymptom(s.id)}
                className={`p-2.5 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-50 border-[#BA68C8] text-[#7B1FA2] shadow-xs'
                    : 'bg-[#FFFDFE] border-gray-100 text-[#593E46] hover:bg-gray-50'
                }`}
              >
                <span className="text-base">{s.icon}</span>
                <span className="truncate">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sleep & Relaxation Bar */}
      <div className="p-4 rounded-3xl bg-white border border-pink-100 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-black font-['Fredoka'] text-[#2D1B2D]">
              Sleep Restfulness Score
            </h3>
          </div>
          <span className="text-xs font-black font-['Fredoka'] text-indigo-600">
            {sleepScore}/10
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          value={sleepScore}
          onChange={(e) => setSleepScore(Number(e.target.value))}
          className="w-full accent-[#7B1FA2] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-bold text-[#875C66]">
          <span>Restless</span>
          <span>Moderate</span>
          <span>Deep & Peaceful</span>
        </div>
      </div>

      {/* Doctor & Lifestyle Guidance */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 space-y-1.5 text-xs text-[#593E46]">
        <div className="flex items-center gap-2 font-black font-['Fredoka'] text-[#7B1FA2]">
          <BookOpen className="w-4 h-4" />
          Hormone Sync Wisdom
        </div>
        <p className="leading-relaxed font-medium">
          During perimenopause, estrogen levels fluctuate widely rather than dropping steadily. Cooling breathwork (Sheetali Pranayama), flaxseeds (lignans), and magnesium glycinate before bed help stabilize body temperature regulation.
        </p>
      </div>
    </div>
  );
};
