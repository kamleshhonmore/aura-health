import React, { useState, useEffect } from 'react';
import { AyurvedicConcern, AyurvedicRemedyItem } from '../data/ayurvedicData';
import {
  ArrowLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { fireCelebrationConfetti } from '../utils/confetti';

interface AyurvedicDetailModalProps {
  concern: AyurvedicConcern;
  onBack: () => void;
}

export const AyurvedicDetailModal: React.FC<AyurvedicDetailModalProps> = ({
  concern,
  onBack,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'remedy' | 'diet' | 'yoga' | 'lifestyle'>('remedy');
  const [expandedRemedyId, setExpandedRemedyId] = useState<string | null>(concern.remedies[0]?.id || null);
  const [showAllRemedies, setShowAllRemedies] = useState(false);

  // Brewing timer state
  const [brewTimerSeconds, setBrewTimerSeconds] = useState(300); // 5 mins
  const [isBrewing, setIsBrewing] = useState(false);

  useEffect(() => {
    let timer: any = null;
    if (isBrewing && brewTimerSeconds > 0) {
      timer = setInterval(() => {
        setBrewTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (brewTimerSeconds === 0 && isBrewing) {
      setIsBrewing(false);
      fireCelebrationConfetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 },
      });
    }
    return () => clearInterval(timer);
  }, [isBrewing, brewTimerSeconds]);

  const filteredRemedies = concern.remedies.filter((r) => {
    if (selectedCategory === 'remedy') return r.category === 'remedy';
    if (selectedCategory === 'diet') return r.category === 'diet';
    if (selectedCategory === 'yoga') return r.category === 'yoga';
    if (selectedCategory === 'lifestyle') return r.category === 'lifestyle';
    return true;
  });

  const displayedRemedies = showAllRemedies ? filteredRemedies : filteredRemedies.slice(0, 3);

  const formatTimer = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4 font-['Nunito'] animate-in fade-in duration-200">
      {/* Top Bar with Back Button matching Image 6 */}
      <div className="flex items-center gap-3 px-1 pt-1">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-2xl bg-white shadow-xs border border-pink-100 flex items-center justify-center text-[#593E46] hover:text-[#FF5376] cursor-pointer hover:scale-105 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E6C79]">
            Ayurvedic Care
          </span>
          <h2 className="text-base font-black font-['Fredoka'] text-[#2D1B2D]">
            {concern.title} Solutions
          </h2>
        </div>
      </div>

      {/* Concern Hero Banner matching Image 6 */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-[#FFF0F3] to-[#FFF8FA] border border-pink-100 shadow-sm flex items-center justify-between gap-4">
        <div className="flex-1 space-y-1">
          <h3 className="text-xl font-black font-['Fredoka'] text-[#FF5376]">
            {concern.title}
          </h3>
          <p className="text-xs font-semibold text-[#875C66] leading-relaxed">
            {concern.subtitle}
          </p>
        </div>

        <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md shrink-0 border-2 border-white">
          <img
            src={concern.avatarUrl}
            alt={concern.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Category Filter Chips matching Image 6 */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 px-1 scrollbar-none">
        {[
          { id: 'remedy', label: 'Remedy' },
          { id: 'diet', label: 'Diet Tip' },
          { id: 'yoga', label: 'Yoga Pose' },
          { id: 'lifestyle', label: 'Lifestyle' },
        ].map((tab) => {
          const active = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setSelectedCategory(tab.id as any);
                setExpandedRemedyId(null);
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-black font-['Fredoka'] whitespace-nowrap transition-all cursor-pointer ${
                active
                  ? 'bg-[#FF6584] text-white shadow-md shadow-pink-300'
                  : 'bg-white text-[#875C66] border border-pink-100 hover:bg-pink-50'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Remedies List Cards matching Image 6 */}
      <div className="space-y-3">
        {displayedRemedies.length === 0 ? (
          <div className="p-6 text-center bg-white rounded-3xl border border-pink-100 text-xs text-[#875C66]">
            More {selectedCategory} recommendations are coming for {concern.title}. Check other tabs!
          </div>
        ) : (
          displayedRemedies.map((remedy) => {
            const isExpanded = expandedRemedyId === remedy.id;
            return (
              <div
                key={remedy.id}
                className="rounded-3xl bg-white border border-pink-100 shadow-sm overflow-hidden transition-all"
              >
                {/* Header Row */}
                <div
                  onClick={() => setExpandedRemedyId(isExpanded ? null : remedy.id)}
                  className="p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-pink-50/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-2xl shadow-xs shrink-0">
                      <span>{remedy.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-black font-['Fredoka'] text-sm text-[#2D1B2D]">
                        {remedy.name}
                      </h4>
                      <p className="text-xs text-[#875C66] line-clamp-1">
                        {remedy.shortDesc}
                      </p>
                    </div>
                  </div>

                  <div className="text-[#FF5376]">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-pink-50 space-y-3 text-xs bg-[#FFFDFE] animate-in fade-in duration-200">
                    <p className="text-[#593E46] leading-relaxed">
                      {remedy.fullDesc}
                    </p>

                    {remedy.ingredients && remedy.ingredients.length > 0 && (
                      <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-100 space-y-1">
                        <span className="font-bold text-[11px] text-amber-900 uppercase tracking-wider block">
                          Ingredients Needed
                        </span>
                        <ul className="list-disc list-inside text-amber-800 space-y-0.5 font-medium">
                          {remedy.ingredients.map((ing, i) => (
                            <li key={i}>{ing}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {remedy.preparationSteps && remedy.preparationSteps.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="font-bold text-[11px] text-[#2D1B2D] uppercase tracking-wider block">
                          Preparation Steps
                        </span>
                        <ol className="list-decimal list-inside space-y-1 text-[#66464F] font-medium leading-relaxed">
                          {remedy.preparationSteps.map((step, i) => (
                            <li key={i}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {/* Dosage & Best Time */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {remedy.dosage && (
                        <div className="p-2.5 rounded-xl bg-pink-50 border border-pink-100">
                          <span className="text-[10px] font-bold text-[#FF5376] block uppercase">Recommended Dosage</span>
                          <span className="font-black font-['Fredoka'] text-xs text-[#2D1B2D]">{remedy.dosage}</span>
                        </div>
                      )}
                      {remedy.bestTime && (
                        <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-100">
                          <span className="text-[10px] font-bold text-[#7E57C2] block uppercase">Best Time</span>
                          <span className="font-black font-['Fredoka'] text-xs text-[#2D1B2D]">{remedy.bestTime}</span>
                        </div>
                      )}
                    </div>

                    {/* Brewing / Rest Timer */}
                    <div className="p-3 rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 border border-pink-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#FF5376]" />
                        <div>
                          <span className="text-[10px] font-bold text-[#FF5376] uppercase">Herbal Brew Timer</span>
                          <p className="font-black font-['Fredoka'] text-sm text-[#2D1B2D]">{formatTimer(brewTimerSeconds)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setIsBrewing(!isBrewing)}
                          className="px-3 py-1.5 rounded-xl bg-[#FF6584] text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                        >
                          <Play className="w-3 h-3" />
                          {isBrewing ? 'Pause' : 'Start Timer'}
                        </button>
                        <button
                          onClick={() => {
                            setIsBrewing(false);
                            setBrewTimerSeconds(300);
                          }}
                          className="p-1.5 rounded-xl bg-white border border-pink-200 text-[#875C66] cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* View More Remedy Button matching Image 6 */}
        {filteredRemedies.length > 3 && (
          <button
            onClick={() => setShowAllRemedies(!showAllRemedies)}
            className="w-full py-2.5 rounded-2xl bg-pink-50 hover:bg-pink-100 text-[#FF5376] font-black font-['Fredoka'] text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
          >
            {showAllRemedies ? 'View Less Remedy ⌃' : 'View More Remedy ⌵'}
          </button>
        )}
      </div>

      {/* Doctor Consultation Warning Card matching Image 6 */}
      <div className="p-4 rounded-3xl bg-teal-50/90 border border-teal-100 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-teal-700" />
            <h4 className="font-black font-['Fredoka'] text-xs text-teal-900">
              {concern.doctorAdvice.title}
            </h4>
          </div>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-teal-200">
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&auto=format&fit=crop&q=80"
              alt="Doctor"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <ul className="text-xs text-teal-800 space-y-1 list-disc list-inside font-medium leading-relaxed">
          {concern.doctorAdvice.warningPoints.map((point, idx) => (
            <li key={idx}>{point}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
