import React, { useState, useEffect } from 'react';
import { ThemeConfig, AppSettings, KickLog } from '../types';
import {
  Baby,
  Heart,
  Calendar,
  Sparkles,
  Clock,
  Play,
  RotateCcw,
  CheckCircle,
  Award,
  BookOpen,
} from 'lucide-react';
import { fireCelebrationConfetti } from '../utils/confetti';

interface PregnancyModeViewProps {
  settings: AppSettings;
  theme: ThemeConfig;
  onUpdateDueDate: (newDueDate: string) => void;
  onNavigateToBabyAI?: () => void;
}

export const PregnancyModeView: React.FC<PregnancyModeViewProps> = ({
  settings,
  theme,
  onUpdateDueDate,
  onNavigateToBabyAI,
}) => {
  const [kickCount, setKickCount] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [kickHistory, setKickHistory] = useState<KickLog[]>([
    { id: 'k1', timestamp: 'Today 10:30 AM', count: 10, durationMinutes: 18 },
    { id: 'k2', timestamp: 'Yesterday 8:15 PM', count: 10, durationMinutes: 22 },
  ]);

  // Pregnancy calculations
  const dueDate = new Date(settings.pregnancyDueDate);
  const now = new Date();
  const totalPregnancyDays = 280; // 40 weeks
  const remainingMs = dueDate.getTime() - now.getTime();
  const remainingDays = Math.max(0, Math.floor(remainingMs / (1000 * 60 * 60 * 24)));
  const daysPassed = Math.max(0, totalPregnancyDays - remainingDays);
  const currentWeek = Math.floor(daysPassed / 7) + 1;
  const currentDayInWeek = daysPassed % 7;

  // Trimester
  let trimester = 1;
  if (currentWeek > 27) trimester = 3;
  else if (currentWeek > 13) trimester = 2;

  // Fruit comparison
  const babyFruits = [
    { week: 4, fruit: 'Poppy Seed', emoji: '🌱', size: '0.1 cm', weight: '0.1 g' },
    { week: 8, fruit: 'Raspberry', emoji: '🫐', size: '1.6 cm', weight: '1 g' },
    { week: 12, fruit: 'Plum', emoji: '🍑', size: '5.4 cm', weight: '14 g' },
    { week: 15, fruit: 'Apple', emoji: '🍎', size: '10.1 cm', weight: '70 g' },
    { week: 20, fruit: 'Banana', emoji: '🍌', size: '25.6 cm', weight: '300 g' },
    { week: 24, fruit: 'Ear of Corn', emoji: '🌽', size: '30.0 cm', weight: '600 g' },
    { week: 28, fruit: 'Eggplant', emoji: '🍆', size: '37.6 cm', weight: '1 kg' },
    { week: 32, fruit: 'Pineapple', emoji: '🍍', size: '42.4 cm', weight: '1.7 kg' },
    { week: 36, fruit: 'Papaya', emoji: '🍈', size: '47.4 cm', weight: '2.6 kg' },
    { week: 40, fruit: 'Watermelon', emoji: '🍉', size: '51.2 cm', weight: '3.4 kg' },
  ];

  const currentFruit = babyFruits.reduce((prev, curr) => {
    return currentWeek >= curr.week ? curr : prev;
  }, babyFruits[0]);

  // Kick timer loop
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleRecordKick = () => {
    if (!isTimerRunning) {
      setIsTimerRunning(true);
    }
    const nextCount = kickCount + 1;
    setKickCount(nextCount);

    if (nextCount === 10) {
      setIsTimerRunning(false);
      fireCelebrationConfetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FFB74D', '#FF8A65', '#FF80AB'],
      });
      const newLog: KickLog = {
        id: String(Date.now()),
        timestamp: 'Just now',
        count: 10,
        durationMinutes: Math.max(1, Math.round(timerSeconds / 60)),
      };
      setKickHistory([newLog, ...kickHistory]);
    }
  };

  const handleResetKickSession = () => {
    setIsTimerRunning(false);
    setTimerSeconds(0);
    setKickCount(0);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Hero Pregnancy Status Card */}
      <div
        className={`p-5 rounded-3xl ${theme.bgCard} border ${theme.borderCard} shadow-lg space-y-4 relative overflow-hidden`}
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF3E0] text-[#E65100] border border-[#FFE0B2]">
              Trimester {trimester} • Week {currentWeek}, Day {currentDayInWeek}
            </span>
            <h2 className="text-2xl font-black font-['Fredoka'] text-[#4A2E35] mt-1">
              Baby is size of an {currentFruit.fruit} {currentFruit.emoji}
            </h2>
            <p className="text-xs font-semibold text-[#875C66]">
              Approx {currentFruit.size} • {currentFruit.weight}
            </p>
          </div>

          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#FFE0B2] to-[#FFCC80] flex items-center justify-center text-3xl shadow-md">
            <span>{currentFruit.emoji}</span>
          </div>
        </div>

        {/* Due Date & Countdown Bar */}
        <div className="p-3 rounded-2xl bg-[#FFFDF8] border border-[#FFE0B2] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#F57C00]" />
            <div>
              <span className="text-[10px] font-bold text-[#8D6E63] uppercase">Due Date</span>
              <p className="font-black font-['Fredoka'] text-[#4A2E35]">
                {dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xl font-black font-['Fredoka'] text-[#F57C00]">
              {remainingDays}
            </span>
            <span className="text-[11px] font-bold text-[#8D6E63] block">Days Remaining</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-bold text-[#875C66]">
            <span>Day 1</span>
            <span>Week {currentWeek} of 40</span>
            <span>Week 40</span>
          </div>
          <div className="w-full h-3 rounded-full bg-orange-100 overflow-hidden">
            <div
              style={{ width: `${Math.min(100, (daysPassed / totalPregnancyDays) * 100)}%` }}
              className="h-full bg-gradient-to-r from-[#FFA726] to-[#FF7043] rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Baby Kick Counter Widget */}
      <div className={`p-5 rounded-3xl ${theme.bgCard} border ${theme.borderCard} shadow-md space-y-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FFF3E0] text-[#E65100] flex items-center justify-center">
              <Baby className="w-4 h-4" />
            </div>
            <div>
              <h3 className={`text-xs font-black font-['Fredoka'] ${theme.textPrimary}`}>
                Baby Kick Counter (10 Kicks Target)
              </h3>
              <p className="text-[10px] text-[#875C66]">Count 10 movements & time the session</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-[#E65100] bg-[#FFF3E0] px-2.5 py-1 rounded-xl">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTimer(timerSeconds)}</span>
          </div>
        </div>

        {/* Big Tap to Kick Button */}
        <div className="flex flex-col items-center justify-center py-2 space-y-3">
          <button
            onClick={handleRecordKick}
            className="w-28 h-28 rounded-full bg-gradient-to-br from-[#FFA726] to-[#FF7043] hover:from-[#FB8C00] hover:to-[#F4511E] text-white flex flex-col items-center justify-center shadow-lg shadow-orange-200 cursor-pointer active:scale-95 transition-transform"
          >
            <span className="text-3xl font-black font-['Fredoka']">{kickCount}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">Tap Kick</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetKickSession}
              className="px-3 py-1.5 rounded-xl bg-gray-100 text-[#5C454B] text-xs font-bold flex items-center gap-1 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>

        {/* Recent Kick Sessions */}
        {kickHistory.length > 0 && (
          <div className="pt-2 border-t border-orange-50 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A88B93]">
              Past Kick Logs
            </span>
            {kickHistory.map((k) => (
              <div
                key={k.id}
                className="px-3 py-2 rounded-xl bg-[#FFFDF8] border border-orange-100 flex items-center justify-between text-xs"
              >
                <span className="font-bold text-[#4A2E35]">{k.timestamp}</span>
                <span className="text-[#E65100] font-black font-['Fredoka']">
                  10 Kicks in {k.durationMinutes} mins ✅
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Future Baby Face & Genetics AI Feature Card */}
      {onNavigateToBabyAI && (
        <button
          onClick={onNavigateToBabyAI}
          className="w-full p-4 rounded-3xl bg-gradient-to-r from-[#FFF0F5] via-[#FCE4EC] to-[#EDE7F6] border-2 border-pink-200 shadow-md hover:shadow-lg transition-all flex items-center justify-between text-left cursor-pointer hover:scale-[1.01] active:scale-[0.99] group"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-pink-600 bg-white/90 px-2.5 py-0.5 rounded-full border border-pink-200">
                ✨ Parents AI Blend
              </span>
            </div>
            <h3 className="text-sm font-black font-['Fredoka'] text-[#2D1B2D]">
              Future Baby Face Generator
            </h3>
            <p className="text-xs text-[#875C66]">
              Upload Mom & Dad photos to predict baby traits & features
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-white/90 border border-pink-100 flex items-center justify-center text-2xl shadow-xs shrink-0">
            <span>👶</span>
          </div>
        </button>
      )}

      {/* Week 15 Mom & Baby Insights */}
      <div className={`p-4 rounded-3xl ${theme.bgCard} border ${theme.borderCard} shadow-md space-y-2`}>
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#FF7043]" />
          <h3 className={`text-xs font-black font-['Fredoka'] ${theme.textPrimary}`}>
            Week {currentWeek} Health & Care Tips
          </h3>
        </div>
        <ul className="text-xs text-[#614950] space-y-1.5 list-disc list-inside font-medium leading-relaxed">
          <li>Baby can now sense light and is practicing making facial expressions.</li>
          <li>Stay well hydrated! Drink 8–10 glasses of water daily to support amniotic fluid.</li>
          <li>Gentle prenatal yoga or walking helps relieve lower back tension.</li>
        </ul>
      </div>
    </div>
  );
};
