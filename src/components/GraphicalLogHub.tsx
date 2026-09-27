import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, Activity, Calendar, Shield, Zap, Smile, ArrowRight, Plus } from 'lucide-react';

interface GraphicalLogHubProps {
  onOpenLogModal: () => void;
  onNavigateTab: (tab: string) => void;
}

export const GraphicalLogHub: React.FC<GraphicalLogHubProps> = ({ onOpenLogModal, onNavigateTab }) => {
  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <div className="space-y-6 pb-8">
      {/* 1. Hero Floating Preview Carousel (Inspired by Screenshot 1 top structure) */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#F4EBE6] via-[#FAF3F0] to-[#EFECE6] p-6 shadow-xl border border-white/80 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C86D51]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center mb-6">
          <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 bg-white/80 text-[#C86D51] rounded-full shadow-xs">
            Daily Self-Care Routine
          </span>
          <h2 className="text-xl font-bold text-[#2C2A29] mt-2 font-['Fredoka']">
            Hormonal Equilibrium & Vitality
          </h2>
        </div>

        {/* Floating Overlapping Cards */}
        <div className="relative flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="min-w-[220px] bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">🧘‍♀️</span>
              <span className="text-[10px] font-bold text-[#4A7C59] bg-[#E8F0EC] px-2 py-0.5 rounded-full">Low Impact</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#2C2A29]">Follicular Yoga Flow</h4>
              <p className="text-[11px] text-[#7A7571]">15 min • Estrogen aligned</p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="min-w-[220px] bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">🍵</span>
              <span className="text-[10px] font-bold text-[#C86D51] bg-[#F4EBE6] px-2 py-0.5 rounded-full">Spearmint</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#2C2A29]">Androgen Balancing</h4>
              <p className="text-[11px] text-[#7A7571]">Morning ritual • Anti-inflammatory</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 2. Symptom SOS Quick Pills (Inspired by Screenshot 1 symptom bar) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-extrabold text-[#7A7571] uppercase tracking-wider">Symptom SOS & Quick Log</h3>
          <button onClick={onOpenLogModal} className="text-xs font-bold text-[#C86D51] flex items-center gap-1 hover:underline">
            <Plus className="w-3.5 h-3.5" /> Add / Edit
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {['Cramps', 'Bloating', 'Fatigue', 'Acne', 'Headache', 'Anxiety'].map((symptom) => (
            <button
              key={symptom}
              onClick={onOpenLogModal}
              className="px-4 py-2 bg-white rounded-full border border-[#EFECE6] text-xs font-semibold text-[#2C2A29] shadow-xs hover:border-[#C86D51] hover:text-[#C86D51] transition-all whitespace-nowrap"
            >
              {symptom}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Smooth Graphical Illustration Cards (Inspired by Screenshot 1 bottom grid & Screenshot 2 carousel) */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          whileHover={{ y: -3 }}
          onClick={onOpenLogModal}
          className="bg-gradient-to-br from-[#FDF2F2] to-[#FCE7F3] p-5 rounded-3xl border border-[#FAD2E1]/60 shadow-md cursor-pointer flex flex-col justify-between h-40"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center text-2xl shadow-xs">
            🌸
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#2C2A29]">Pain Relief Protocol</h4>
            <p className="text-[11px] text-[#7A7571] mt-0.5">Heat therapy & acupressure</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          onClick={onOpenLogModal}
          className="bg-gradient-to-br from-[#E8F0EC] to-[#E2ECE9] p-5 rounded-3xl border border-[#C6D8D0]/60 shadow-md cursor-pointer flex flex-col justify-between h-40"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center text-2xl shadow-xs">
            🍃
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#2C2A29]">Bloating & Digestion</h4>
            <p className="text-[11px] text-[#7A7571] mt-0.5">Herbal teas & low-FODMAP</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => onNavigateTab('charts')}
          className="bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A]/40 p-5 rounded-3xl border border-[#FCD34D]/50 shadow-md cursor-pointer flex flex-col justify-between h-40"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center text-2xl shadow-xs">
            ✨
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#2C2A29]">Energy & Mood Boost</h4>
            <p className="text-[11px] text-[#7A7571] mt-0.5">Circadian sunlight & adaptogens</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => onNavigateTab('calendar')}
          className="bg-gradient-to-br from-[#E0E7FF] to-[#EDE9FE] p-5 rounded-3xl border border-[#C7D2FE]/60 shadow-md cursor-pointer flex flex-col justify-between h-40"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center text-2xl shadow-xs">
            📊
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#2C2A29]">Reproductive Health</h4>
            <p className="text-[11px] text-[#7A7571] mt-0.5">Rotterdam & luteal tracking</p>
          </div>
        </motion.div>
      </div>

      {/* 4. Circular Gradient Icon Badges & For You Today (Inspired by Screenshot 2 structure) */}
      <div className="bg-white rounded-3xl p-6 shadow-md border border-[#EFECE6]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[#2C2A29]">For You Today</h3>
          <span className="text-xs font-semibold text-[#C86D51]">11/23 Daily Insights</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div
            onClick={onOpenLogModal}
            className="flex flex-col items-center text-center p-3 rounded-2xl bg-[#FAF8F5] border border-[#EFECE6] cursor-pointer hover:border-[#C86D51] transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#F4EBE6] to-[#E29578]/20 flex items-center justify-center text-xl mb-2 shadow-xs">
              📝
            </div>
            <span className="text-xs font-semibold text-[#2C2A29]">Log Symptom</span>
          </div>

          <div
            onClick={onOpenLogModal}
            className="flex flex-col items-center text-center p-3 rounded-2xl bg-[#FAF8F5] border border-[#EFECE6] cursor-pointer hover:border-[#C86D51] transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#E8F0EC] to-[#4A7C59]/20 flex items-center justify-center text-xl mb-2 shadow-xs">
              🩺
            </div>
            <span className="text-xs font-semibold text-[#2C2A29]">Pain & Relief</span>
          </div>

          <div
            onClick={() => onNavigateTab('calendar')}
            className="flex flex-col items-center text-center p-3 rounded-2xl bg-[#FAF8F5] border border-[#EFECE6] cursor-pointer hover:border-[#C86D51] transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#EDE9FE] to-[#7C3AED]/20 flex items-center justify-center text-xl mb-2 shadow-xs">
              🔄
            </div>
            <span className="text-xs font-semibold text-[#2C2A29]">Cycle Phase</span>
          </div>
        </div>
      </div>
    </div>
  );
};
