import React, { useState } from 'react';
import { ayurvedicConcerns, AyurvedicConcern } from '../data/ayurvedicData';
import { AyurvedicDetailModal } from './AyurvedicDetailModal';
import {
  Search,
  Sparkles,
  Leaf,
  Flame,
  Heart,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';

export const AyurvedicHub: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConcern, setSelectedConcern] = useState<AyurvedicConcern | null>(null);

  // Filter concerns by title, subtitle, or remedies
  const filteredConcerns = ayurvedicConcerns.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.subtitle.toLowerCase().includes(q) ||
      c.remedies.some((r) => r.name.toLowerCase().includes(q) || r.shortDesc.toLowerCase().includes(q))
    );
  });

  if (selectedConcern) {
    return (
      <AyurvedicDetailModal
        concern={selectedConcern}
        onBack={() => setSelectedConcern(null)}
      />
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4 font-['Nunito'] animate-in fade-in duration-200">
      {/* Title Header matching Image 5 */}
      <div className="text-center space-y-1 px-2 pt-1">
        <h2 className="text-2xl font-black font-['Fredoka'] text-[#3E1F47] leading-tight">
          Discover Ancient
          <span className="block text-[#FF5376]">
            Ayurvedic Remedies
          </span>
          <span className="text-lg font-black text-[#6A397B] block font-['Fredoka']">
            For Wellness
          </span>
        </h2>
      </div>

      {/* Ayurvedic Wisdom Top Banner matching Image 5 */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-[#FFF5F7] via-[#FFF0F4] to-[#F3E5F5] border border-pink-100 shadow-sm flex items-center justify-between gap-3 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <span className="text-sm font-black font-['Fredoka'] text-[#FF5376] block">
            Ayurvedic Wisdom
          </span>
          <p className="text-xs font-semibold text-[#875C66] max-w-[180px] leading-relaxed">
            Embrace nature's path to good health and cycle harmony
          </p>
        </div>

        <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-md border-2 border-white/80">
          <img
            src="https://images.unsplash.com/photo-1617897903246-719242758050?w=200&auto=format&fit=crop&q=80"
            alt="Ayurvedic Herbs"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Search Input matching Image 5 */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search remedies, herbs, symptoms..."
          className="w-full px-4 py-3 pl-10 rounded-2xl bg-white border border-pink-200 text-xs font-semibold text-[#2D1B2D] placeholder-[#A0707D] focus:outline-none focus:ring-2 focus:ring-[#FF758C] shadow-xs"
        />
        <Search className="w-4 h-4 text-[#A0707D] absolute left-3.5 top-3.5" />
      </div>

      {/* Popular Concerns Grid Header matching Image 5 */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-black font-['Fredoka'] text-[#2D1B2D]">
          Popular Concerns
        </h3>
        <span className="text-[11px] font-bold text-[#FF758C]">
          9 Categories
        </span>
      </div>

      {/* 3-Column Concerns Grid matching Image 5 */}
      <div className="grid grid-cols-3 gap-3">
        {filteredConcerns.map((concern) => (
          <button
            key={concern.id}
            onClick={() => setSelectedConcern(concern)}
            className="flex flex-col items-center p-3 rounded-3xl bg-white border border-pink-100 hover:border-pink-300 shadow-sm hover:shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95 group text-center"
          >
            {/* Avatar / Icon Badge */}
            <div className={`w-14 h-14 rounded-2xl ${concern.colorBg} border border-pink-100/80 flex items-center justify-center text-2xl shadow-xs mb-2 relative overflow-hidden`}>
              <img
                src={concern.avatarUrl}
                alt={concern.title}
                className="w-full h-full object-cover rounded-2xl group-hover:scale-110 transition-transform"
              />
              <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-white text-xs flex items-center justify-center shadow-xs">
                {concern.iconEmoji}
              </span>
            </div>

            <span className="font-black font-['Fredoka'] text-xs text-[#2D1B2D] leading-tight block">
              {concern.title}
            </span>
          </button>
        ))}
      </div>

      {/* Dosha & Lifestyle Quick Card */}
      <div className="p-4 rounded-3xl bg-white border border-pink-100 shadow-sm space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <Leaf className="w-4 h-4 text-emerald-600" />
          <h4 className="font-black font-['Fredoka'] text-xs text-[#2D1B2D]">
            Ayurvedic Cycle Sync Philosophy
          </h4>
        </div>
        <p className="text-[#694852] leading-relaxed">
          Your menstrual cycle mirrors the three doshas: <strong>Vata</strong> governs menstrual shedding (flow), <strong>Kapha</strong> builds the follicular lining, and <strong>Pitta</strong> powers ovulation and thermal luteal energy.
        </p>
      </div>
    </div>
  );
};
