import React, { useState } from 'react';
import {
  Upload,
  Pencil,
  Sparkles,
  RefreshCw,
  Heart,
  Baby,
  Smile,
  Download,
  Share2,
  Bell,
  Check,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FutureBabyGeneratorProps {
  onClose?: () => void;
}

const momAvatars = [
  { id: 'm1', name: 'Brunette Grace', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80' },
  { id: 'm2', name: 'Blonde Sun', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80' },
  { id: 'm3', name: 'Amber Wave', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
  { id: 'm4', name: 'Silk Glow', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80' },
];

const dadAvatars = [
  { id: 'd1', name: 'Bearded Alex', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80' },
  { id: 'd2', name: 'Classic Leo', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' },
  { id: 'd3', name: 'Smile Noah', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80' },
  { id: 'd4', name: 'Gentle Ben', url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80' },
];

const babyPossibilities = [
  {
    id: 'b1',
    gender: 'Sweet Angel',
    name: 'Little Maya / Leo',
    url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&auto=format&fit=crop&q=80',
    eyeColor: 'Hazel Brown (75% Mom)',
    smile: 'Warm Dimples (85% Dad)',
    hair: 'Soft Wavy Auburn',
    temperament: 'Cheerful & curious explorer 🌟',
    traits: [
      { label: 'Eyes', value: "Mom's Deep Hazel", icon: '👁️' },
      { label: 'Smile', value: "Dad's Dimpled Grin", icon: '✨' },
      { label: 'Personality', value: 'Playful & Loving', icon: '💖' },
    ]
  },
  {
    id: 'b2',
    gender: 'Golden Sunshine',
    name: 'Little Chloe / Oliver',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
    eyeColor: 'Almond Honey (60% Dad)',
    smile: 'Radiant Beam (90% Mom)',
    hair: 'Fine Golden Silk',
    temperament: 'Calm sleeper & musical listener 🎵',
    traits: [
      { label: 'Eyes', value: "Dad's Honey Brown", icon: '👁️' },
      { label: 'Smile', value: "Mom's Bright Sparkle", icon: '✨' },
      { label: 'Personality', value: 'Peaceful Dreamer', icon: '🌙' },
    ]
  },
  {
    id: 'b3',
    gender: 'Joyful Gaze',
    name: 'Little Sophia / Liam',
    url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&auto=format&fit=crop&q=80',
    eyeColor: 'Warm Chestnut (70% Mom)',
    smile: 'Playful Laugh (80% Dad)',
    hair: 'Dark Velvety Curls',
    temperament: 'Giggle machine & very observant 🎈',
    traits: [
      { label: 'Eyes', value: "Mom's Expressive Gaze", icon: '👁️' },
      { label: 'Smile', value: "Dad's Joyful Laugh", icon: '✨' },
      { label: 'Personality', value: 'Bubbly & Friendly', icon: '☀️' },
    ]
  }
];

export const FutureBabyGenerator: React.FC<FutureBabyGeneratorProps> = ({ onClose }) => {
  const [momPhoto, setMomPhoto] = useState(momAvatars[0].url);
  const [dadPhoto, setDadPhoto] = useState(dadAvatars[0].url);
  const [babyIndex, setBabyIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genderFilter, setGenderFilter] = useState<'any' | 'girl' | 'boy'>('any');
  const [showMomPicker, setShowMomPicker] = useState(false);
  const [showDadPicker, setShowDadPicker] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const currentBaby = babyPossibilities[babyIndex % babyPossibilities.length];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setBabyIndex((prev) => prev + 1);
      setIsGenerating(false);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF758C', '#FF7EB3', '#B388FF', '#80D8FF'],
      });
    }, 1100);
  };

  const handleUploadCustomMom = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMomPhoto(url);
      setShowMomPicker(false);
    }
  };

  const handleUploadCustomDad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setDadPhoto(url);
      setShowDadPicker(false);
    }
  };

  const handleShare = () => {
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4 font-['Nunito']">
      {/* App Header Bar matching Image 1 */}
      <div className="flex items-center justify-between px-2 pt-1">
        <div className="flex items-center gap-1.5">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#FF758C] via-[#B388FF] to-[#80D8FF] flex items-center justify-center text-white shadow-xs font-black text-xs font-['Fredoka']">
            F
          </div>
          <span className="text-lg font-black font-['Fredoka'] bg-gradient-to-r from-[#FF5376] to-[#7C4DFF] bg-clip-text text-transparent">
            FemFlow
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            title="Notifications"
            className="w-9 h-9 rounded-2xl bg-white shadow-xs border border-pink-100 flex items-center justify-center text-[#593E46] hover:text-[#FF5376] cursor-pointer"
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="rounded-3xl bg-white/90 backdrop-blur-md p-5 border border-pink-100 shadow-xl space-y-5 relative overflow-hidden">
        {/* Soft Background Pastels */}
        <div className="absolute -top-10 -left-10 w-36 h-36 rounded-full bg-pink-200/40 blur-2xl pointer-events-none" />
        <div className="absolute top-1/2 -right-12 w-40 h-40 rounded-full bg-purple-200/40 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-32 h-32 rounded-full bg-cyan-100/40 blur-2xl pointer-events-none" />

        {/* Title */}
        <div className="text-center space-y-1 relative z-10">
          <h2 className="text-2xl font-black font-['Fredoka'] text-[#2D1B2D]">
            Future Baby
            <span className="block text-2xl bg-gradient-to-r from-[#FF5376] to-[#7C4DFF] bg-clip-text text-transparent">
              Generator
            </span>
          </h2>
          <p className="text-xs text-[#875C66] font-medium">
            Mix facial features and see your future baby with AI prediction
          </p>
        </div>

        {/* Parents Circular Pickers (Matching Image 1) */}
        <div className="flex items-center justify-around relative z-10 pt-2">
          {/* Mom Circle */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[#FF758C] to-[#FF8FA3] shadow-md">
                <img
                  src={momPhoto}
                  alt="Mom"
                  className="w-full h-full object-cover rounded-full bg-pink-50"
                />
              </div>

              {/* Upload Button */}
              <label
                title="Upload Mom's Photo"
                className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-tr from-[#FF758C] to-[#BA68C8] text-white flex items-center justify-center cursor-pointer shadow-md hover:scale-110 active:scale-95 transition-all border-2 border-white"
              >
                <Upload className="w-3.5 h-3.5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadCustomMom}
                  className="hidden"
                />
              </label>

              {/* Edit/Presets Button */}
              <button
                onClick={() => setShowMomPicker(!showMomPicker)}
                title="Select Preset Avatar"
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-tr from-[#AB47BC] to-[#BA68C8] text-white flex items-center justify-center cursor-pointer shadow-md hover:scale-110 active:scale-95 transition-all border-2 border-white"
              >
                <Pencil className="w-3 h-3" />
              </button>
            </div>
            <span className="mt-2 text-xs font-black font-['Fredoka'] text-[#2D1B2D]">Mom</span>
          </div>

          {/* Squiggly Connecting Arrow */}
          <div className="flex flex-col items-center justify-center px-1">
            <svg
              width="44"
              height="36"
              viewBox="0 0 44 36"
              fill="none"
              className="text-[#5C3E66] animate-pulse"
            >
              <path
                d="M4 10C16 2 28 20 22 28C18 34 32 30 40 18"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M34 16L40 18L38 24"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Dad Circle */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[#7E57C2] to-[#B388FF] shadow-md">
                <img
                  src={dadPhoto}
                  alt="Dad"
                  className="w-full h-full object-cover rounded-full bg-purple-50"
                />
              </div>

              {/* Upload Button */}
              <label
                title="Upload Dad's Photo"
                className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-tr from-[#7E57C2] to-[#B388FF] text-white flex items-center justify-center cursor-pointer shadow-md hover:scale-110 active:scale-95 transition-all border-2 border-white"
              >
                <Upload className="w-3.5 h-3.5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadCustomDad}
                  className="hidden"
                />
              </label>

              {/* Edit/Presets Button */}
              <button
                onClick={() => setShowDadPicker(!showDadPicker)}
                title="Select Preset Avatar"
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-tr from-[#5C6BC0] to-[#7E57C2] text-white flex items-center justify-center cursor-pointer shadow-md hover:scale-110 active:scale-95 transition-all border-2 border-white"
              >
                <Pencil className="w-3 h-3" />
              </button>
            </div>
            <span className="mt-2 text-xs font-black font-['Fredoka'] text-[#2D1B2D]">Dad</span>
          </div>
        </div>

        {/* Mom Preset Drawer */}
        {showMomPicker && (
          <div className="p-3 bg-pink-50/80 rounded-2xl border border-pink-100 animate-in fade-in duration-200">
            <span className="text-[11px] font-bold text-[#FF5376] block mb-2">Choose Mom's Look:</span>
            <div className="flex gap-2 justify-center">
              {momAvatars.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setMomPhoto(m.url);
                    setShowMomPicker(false);
                  }}
                  className={`w-12 h-12 rounded-full overflow-hidden border-2 cursor-pointer transition-transform hover:scale-105 ${
                    momPhoto === m.url ? 'border-[#FF5376] scale-105 ring-2 ring-pink-300' : 'border-transparent'
                  }`}
                >
                  <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Dad Preset Drawer */}
        {showDadPicker && (
          <div className="p-3 bg-purple-50/80 rounded-2xl border border-purple-100 animate-in fade-in duration-200">
            <span className="text-[11px] font-bold text-[#7E57C2] block mb-2">Choose Dad's Look:</span>
            <div className="flex gap-2 justify-center">
              {dadAvatars.map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    setDadPhoto(d.url);
                    setShowDadPicker(false);
                  }}
                  className={`w-12 h-12 rounded-full overflow-hidden border-2 cursor-pointer transition-transform hover:scale-105 ${
                    dadPhoto === d.url ? 'border-[#7E57C2] scale-105 ring-2 ring-purple-300' : 'border-transparent'
                  }`}
                >
                  <img src={d.url} alt={d.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Generated Baby Large Circle & Floating Emoji Stickers (Matching Image 1) */}
        <div className="flex flex-col items-center justify-center relative py-2">
          {/* Floating cute emoji stickers */}
          <div className="absolute -left-2 top-6 w-9 h-9 rounded-full bg-rose-100/90 border border-rose-200 flex items-center justify-center text-lg shadow-sm animate-bounce-subtle">
            ❤️
          </div>
          <div className="absolute -right-2 top-8 w-9 h-9 rounded-full bg-amber-100/90 border border-amber-200 flex items-center justify-center text-lg shadow-sm animate-bounce-subtle" style={{ animationDelay: '0.4s' }}>
            👶
          </div>
          <div className="absolute -right-1 bottom-4 w-9 h-9 rounded-full bg-emerald-100/90 border border-emerald-200 flex items-center justify-center text-lg shadow-sm animate-bounce-subtle" style={{ animationDelay: '0.8s' }}>
            🥰
          </div>
          <div className="absolute -left-1 bottom-2 w-8 h-8 rounded-full bg-sky-100/90 border border-sky-200 flex items-center justify-center text-base shadow-sm animate-bounce-subtle" style={{ animationDelay: '1.2s' }}>
            ✨
          </div>

          {/* Central Baby Portrait */}
          <div className="relative">
            <div className={`w-44 h-44 rounded-full p-2 bg-gradient-to-tr from-[#FF758C] via-[#BA68C8] to-[#64B5F6] shadow-xl ${isGenerating ? 'animate-spin' : ''}`}>
              <div className="w-full h-full rounded-full overflow-hidden bg-white p-1">
                <img
                  src={currentBaby.url}
                  alt="Generated Baby"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>

            {isGenerating && (
              <div className="absolute inset-0 rounded-full bg-white/70 backdrop-blur-xs flex flex-col items-center justify-center">
                <RefreshCw className="w-8 h-8 text-[#FF5376] animate-spin" />
                <span className="text-xs font-black font-['Fredoka'] text-[#FF5376] mt-2">
                  Blending Genetics...
                </span>
              </div>
            )}
          </div>

          {/* Baby Caption & Genetic Traits */}
          <div className="mt-3 text-center space-y-1">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-100 text-[#FF5376] text-xs font-black font-['Fredoka']">
              <Sparkles className="w-3.5 h-3.5" />
              {currentBaby.name}
            </div>
            <p className="text-xs font-semibold text-[#875C66]">
              {currentBaby.temperament}
            </p>
          </div>
        </div>

        {/* Genetic Traits Accordion */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 rounded-2xl border border-pink-100 text-center">
          {currentBaby.traits.map((t, idx) => (
            <div key={idx} className="bg-white/80 rounded-xl p-2 shadow-xs">
              <span className="text-base block">{t.icon}</span>
              <span className="text-[10px] font-bold text-[#875C66] block uppercase tracking-wider">{t.label}</span>
              <span className="text-[11px] font-black font-['Fredoka'] text-[#2D1B2D] leading-tight block mt-0.5">
                {t.value}
              </span>
            </div>
          ))}
        </div>

        {/* Big "Generate Baby" Gradient Pill Button (Matching Image 1) */}
        <div className="space-y-2">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-4 rounded-3xl bg-gradient-to-r from-[#FF6584] via-[#FF758C] to-[#8E54E9] hover:from-[#FF5277] hover:to-[#7E3FE4] text-white text-base font-black font-['Fredoka'] shadow-xl shadow-pink-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.98]"
          >
            <Sparkles className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Simulating Next Generation...' : 'Generate Baby'}
          </button>

          <div className="flex items-center justify-center gap-4 pt-1 text-xs">
            <button
              onClick={handleShare}
              className="font-bold text-[#7E57C2] hover:text-[#5C3E66] flex items-center gap-1 cursor-pointer"
            >
              {copiedShare ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600">Baby Card Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Future Baby</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
