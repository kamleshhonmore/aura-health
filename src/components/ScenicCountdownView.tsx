import React, { useState } from 'react';
import { CycleStatus } from '../utils/cycleCalculations';
import { ThemeConfig, PetCompanion, AppSettings, DayLog } from '../types';
import {
  Sparkles,
  Heart,
  Droplets,
  Plus,
  Palette,
  User,
  Quote,
  RefreshCw,
  Sun,
  Umbrella,
  Waves,
} from 'lucide-react';
import { fireCelebrationConfetti } from '../utils/confetti';

interface ScenicCountdownViewProps {
  status: CycleStatus;
  theme: ThemeConfig;
  pet: PetCompanion;
  settings: AppSettings;
  todayLog?: DayLog;
  onOpenLogModal: () => void;
  onOpenTheme: () => void;
  onOpenSettings: () => void;
  onTogglePeriodToday: () => void;
  onOpenAiChat?: () => void;
}

const wallpapers = [
  {
    id: 'beach',
    name: 'Sunny Beach',
    skyGradient: 'from-[#E0F7FA] via-[#FFF9C4] to-[#FFE082]',
    landscapeImg: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    characterEmoji: '🏄‍♀️',
    characterAlt: 'Beach Girl',
    bgTone: 'bg-[#FFF8E7]',
  },
  {
    id: 'sakura',
    name: 'Sakura Garden',
    skyGradient: 'from-[#FCE4EC] via-[#F8BBD0] to-[#E1BEE7]',
    landscapeImg: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&auto=format&fit=crop&q=80',
    characterEmoji: '🌸',
    characterAlt: 'Sakura Garden',
    bgTone: 'bg-[#FFF0F4]',
  },
  {
    id: 'cozy',
    name: 'Cozy Room',
    skyGradient: 'from-[#FFF3E0] via-[#FFE0B2] to-[#FFCC80]',
    landscapeImg: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
    characterEmoji: '☕',
    characterAlt: 'Cozy Living',
    bgTone: 'bg-[#FFFDF8]',
  },
  {
    id: 'starlight',
    name: 'Starry Twilight',
    skyGradient: 'from-[#1A237E] via-[#311B92] to-[#4A148C]',
    landscapeImg: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80',
    characterEmoji: '✨',
    characterAlt: 'Starry Dream',
    bgTone: 'bg-[#1F1424]',
  }
];

const dailyQuotes = [
  "“You only live once, but if you do it right, once is enough.”",
  "“Listen to your body, it speaks the wisdom of your deepest vitality.”",
  "“Flow with your rhythm, rest in your winter, shine in your summer.”",
  "“Every phase of your cycle brings a unique superpower.”",
  "“Nourish your inner sanctuary with patience, water, and warm peace.”",
];

export const ScenicCountdownView: React.FC<ScenicCountdownViewProps> = ({
  status,
  theme,
  pet,
  settings,
  todayLog,
  onOpenLogModal,
  onOpenTheme,
  onOpenSettings,
  onTogglePeriodToday,
  onOpenAiChat,
}) => {
  const [selectedWallpaperIdx, setSelectedWallpaperIdx] = useState(0);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [showWallpaperSelector, setShowWallpaperSelector] = useState(false);

  const currentWp = wallpapers[selectedWallpaperIdx];

  const handleNextQuote = () => {
    setQuoteIdx((prev) => (prev + 1) % dailyQuotes.length);
  };

  // Headline text matching Image 4
  let periodTitle = '';
  if (status.isPeriodToday) {
    periodTitle = `Period Day ${status.currentCycleDay}`;
  } else if (status.phase === 'ovulation') {
    periodTitle = 'Ovulation Day!';
  } else if (status.phase === 'fertile') {
    periodTitle = `Fertile in ${status.daysUntilOvulation}d`;
  } else {
    periodTitle = `Period in ${status.daysUntilNextPeriod} days`;
  }

  const pregnancyChanceText = `${status.conceptionChance} chance of getting pregnant`;

  return (
    <div className="w-full max-w-md mx-auto space-y-4 font-['Nunito'] relative animate-in fade-in duration-200">
      {/* Top Header Bar matching Image 4 */}
      <div className="flex items-center justify-between px-2 pt-1">
        {/* Custom Wallpaper & AI Chat Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowWallpaperSelector(!showWallpaperSelector)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/90 shadow-xs border border-pink-100 text-xs font-bold text-[#4A2E35] hover:bg-pink-50 cursor-pointer transition-transform active:scale-95"
          >
            <Palette className="w-3.5 h-3.5 text-[#FF5376]" />
            <span>Custom</span>
          </button>

          {onOpenAiChat && (
            <button
              onClick={onOpenAiChat}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xs text-xs font-bold font-['Fredoka'] hover:scale-105 cursor-pointer transition-transform active:scale-95"
              title="Ask Aura AI"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI</span>
            </button>
          )}
        </div>

        {/* Greeting Center */}
        <div className="text-center">
          <span className="text-[11px] font-semibold text-[#875C66] block">
            Good morning
          </span>
          <h2 className="text-sm font-black font-['Fredoka'] text-[#2D1B2D]">
            Joey 🌸
          </h2>
        </div>

        {/* Profile Button */}
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/90 shadow-xs border border-pink-100 text-xs font-bold text-[#4A2E35] hover:bg-pink-50 cursor-pointer transition-transform active:scale-95"
        >
          <User className="w-3.5 h-3.5 text-[#7E57C2]" />
          <span>Profile</span>
        </button>
      </div>

      {/* Wallpaper Picker Bar */}
      {showWallpaperSelector && (
        <div className="p-3 bg-white rounded-3xl border border-pink-100 shadow-lg space-y-2 animate-in zoom-in-95 duration-200">
          <span className="text-[11px] font-bold text-[#FF5376] uppercase tracking-wider block">
            Select Scenic Wallpaper:
          </span>
          <div className="grid grid-cols-4 gap-2">
            {wallpapers.map((wp, idx) => (
              <button
                key={wp.id}
                onClick={() => {
                  setSelectedWallpaperIdx(idx);
                  setShowWallpaperSelector(false);
                }}
                className={`flex flex-col items-center p-2 rounded-2xl border transition-all cursor-pointer ${
                  selectedWallpaperIdx === idx
                    ? 'border-[#FF5376] bg-pink-50 ring-2 ring-pink-300'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <span className="text-lg">{wp.characterEmoji}</span>
                <span className="text-[9px] font-bold text-[#4A2E35] mt-1 line-clamp-1">{wp.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Scenic Illustration Canvas & Floating Card matching Image 4 */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-pink-100 min-h-[420px] flex flex-col justify-between p-5 bg-gradient-to-b from-sky-100 via-rose-50 to-amber-50">
        {/* Background Scenic Landscape Image */}
        <img
          src={currentWp.landscapeImg}
          alt={currentWp.name}
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay pointer-events-none"
        />

        {/* Floating Period Countdown Card matching Image 4 */}
        <div className="relative z-10 mx-auto w-full max-w-[260px] p-5 rounded-3xl bg-white/95 backdrop-blur-md shadow-xl border border-pink-100/80 text-center space-y-1 animate-in zoom-in-95 duration-300">
          <span className="text-[11px] font-bold text-[#875C66] uppercase tracking-wider block">
            Cycle Status
          </span>
          <h3 className="text-2xl font-black font-['Fredoka'] text-[#2D1B2D] leading-tight">
            {periodTitle}
          </h3>
          <p className="text-xs font-semibold text-[#875C66]">
            {pregnancyChanceText}
          </p>

          <div className="pt-2 flex flex-col gap-1.5">
            <button
              onClick={onTogglePeriodToday}
              className={`w-full py-1.5 px-3 rounded-xl text-[11px] font-black font-['Fredoka'] cursor-pointer transition-all ${
                status.isPeriodToday
                  ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                  : 'bg-pink-500 text-white hover:bg-pink-600 shadow-sm'
              }`}
            >
              {status.isPeriodToday ? 'Period Active (Tap to Edit)' : '+ Period Started'}
            </button>
            <button
              onClick={onOpenLogModal}
              className="w-full py-1.5 px-3 rounded-xl text-[11px] font-black font-['Fredoka'] bg-white border border-pink-200 text-[#FF5376] hover:bg-pink-50 cursor-pointer shadow-xs flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Log Symptoms
            </button>
          </div>
        </div>

        {/* Scenic Character / Mascot in Landscape */}
        <div className="relative z-10 flex flex-col items-center justify-center my-4">
          <div className="w-24 h-24 rounded-full bg-white/40 backdrop-blur-xs border-2 border-white/80 flex items-center justify-center text-5xl shadow-lg animate-bounce-subtle">
            <span>{pet.avatar}</span>
          </div>
        </div>

        {/* Daily Quote Footer matching Image 4 */}
        <div className="relative z-10 p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-white/60 shadow-md text-center space-y-1">
          <div className="flex items-center justify-between">
            <Quote className="w-3.5 h-3.5 text-[#FF758C]" />
            <button
              onClick={handleNextQuote}
              title="Next Quote"
              className="p-1 text-[#875C66] hover:text-[#FF5376] cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
          <p className="text-xs font-semibold text-[#4A2E35] italic leading-relaxed">
            {dailyQuotes[quoteIdx]}
          </p>
        </div>
      </div>
    </div>
  );
};
