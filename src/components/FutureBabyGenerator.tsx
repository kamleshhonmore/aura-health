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
  ArrowLeft,
  Camera,
  RotateCcw,
  Sliders,
  Sparkle,
} from 'lucide-react';
import { fireCelebrationConfetti } from '../utils/confetti';

interface FutureBabyGeneratorProps {
  onBack?: () => void;
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

interface BabyTraitOption {
  id: string;
  gender: 'girl' | 'boy' | 'any';
  name: string;
  url: string;
  eyeColor: string;
  smile: string;
  hair: string;
  temperament: string;
  traits: { label: string; value: string; icon: string }[];
}

const babyPossibilities: BabyTraitOption[] = [
  {
    id: 'b1',
    gender: 'any',
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
    gender: 'girl',
    name: 'Little Chloe',
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
    gender: 'boy',
    name: 'Little Oliver',
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
  },
  {
    id: 'b4',
    gender: 'girl',
    name: 'Little Sophia',
    url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&auto=format&fit=crop&q=80',
    eyeColor: 'Emerald Hazel (65% Mom)',
    smile: 'Sweet Gaze (70% Dad)',
    hair: 'Glossy Brunette Waves',
    temperament: 'Gentle soul with a spark of adventure 🌺',
    traits: [
      { label: 'Eyes', value: "Mom's Hazel Tint", icon: '👁️' },
      { label: 'Cheekbones', value: "Dad's High Contour", icon: '✨' },
      { label: 'Personality', value: 'Empathetic & Creative', icon: '🎨' },
    ]
  },
  {
    id: 'b5',
    gender: 'boy',
    name: 'Little Liam',
    url: 'https://images.unsplash.com/photo-1566004100631-35d015d6a491?w=400&auto=format&fit=crop&q=80',
    eyeColor: 'Deep Ocean Blue (50/50 Blend)',
    smile: 'Mischievous Grin (80% Dad)',
    hair: 'Soft Sandy Brown',
    temperament: 'Active energetic leader & sunshine smile 🚀',
    traits: [
      { label: 'Eyes', value: "Blended Ocean Blue", icon: '👁️' },
      { label: 'Smile', value: "Dad's Mischief Grin", icon: '✨' },
      { label: 'Personality', value: 'Bold Explorer', icon: '🌟' },
    ]
  }
];

export const FutureBabyGenerator: React.FC<FutureBabyGeneratorProps> = ({ onBack, onClose }) => {
  const [momPhoto, setMomPhoto] = useState(momAvatars[0].url);
  const [dadPhoto, setDadPhoto] = useState(dadAvatars[0].url);
  const [babyIndex, setBabyIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genderFilter, setGenderFilter] = useState<'any' | 'girl' | 'boy'>('any');
  const [momFeatureRatio, setMomFeatureRatio] = useState(50); // 50-50 balance
  const [showMomPicker, setShowMomPicker] = useState(false);
  const [showDadPicker, setShowDadPicker] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [customBabyName, setCustomBabyName] = useState('');

  // Filter possibilities based on gender
  const filteredBabies = babyPossibilities.filter(
    (b) => genderFilter === 'any' || b.gender === genderFilter || b.gender === 'any'
  );

  const currentBaby = filteredBabies[babyIndex % filteredBabies.length] || babyPossibilities[0];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setBabyIndex((prev) => prev + 1);
      setIsGenerating(false);
      fireCelebrationConfetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF758C', '#FF7EB3', '#B388FF', '#80D8FF', '#FFD54F'],
      });
    }, 1200);
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
    <div className="w-full max-w-md mx-auto space-y-4 font-['Nunito'] animate-in fade-in duration-200">
      {/* Top Header Bar with Back Button */}
      <div className="flex items-center justify-between px-1 pt-1">
        <div className="flex items-center gap-2">
          {(onBack || onClose) && (
            <button
              onClick={onBack || onClose}
              className="p-2 rounded-2xl bg-white shadow-xs border border-pink-100 text-[#593E46] hover:text-[#FF5376] cursor-pointer transition-colors"
              title="Back to Hub"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#FF758C] via-[#B388FF] to-[#80D8FF] flex items-center justify-center text-white shadow-xs font-black text-xs font-['Fredoka']">
              👶
            </div>
            <span className="text-lg font-black font-['Fredoka'] bg-gradient-to-r from-[#FF5376] to-[#7C4DFF] bg-clip-text text-transparent">
              Baby AI
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-pink-600 bg-pink-50 border border-pink-200 px-2.5 py-1 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-pink-500" />
            Genetics Blend v2
          </span>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="rounded-3xl bg-white/95 backdrop-blur-md p-5 border border-pink-100 shadow-xl space-y-5 relative overflow-hidden">
        {/* Soft Background Pastels */}
        <div className="absolute -top-10 -left-10 w-36 h-36 rounded-full bg-pink-200/40 blur-2xl pointer-events-none" />
        <div className="absolute top-1/2 -right-12 w-40 h-40 rounded-full bg-purple-200/40 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-32 h-32 rounded-full bg-cyan-100/40 blur-2xl pointer-events-none" />

        {/* Title & Description */}
        <div className="text-center space-y-1 relative z-10">
          <h2 className="text-2xl font-black font-['Fredoka'] text-[#2D1B2D]">
            Future Baby
            <span className="block text-2xl bg-gradient-to-r from-[#FF5376] to-[#7C4DFF] bg-clip-text text-transparent">
              Face & Trait Generator
            </span>
          </h2>
          <p className="text-xs text-[#875C66] font-medium max-w-xs mx-auto">
            Upload Mom & Dad photos to blend genetics and forecast future baby facial features & personality.
          </p>
        </div>

        {/* Parents Circular Pickers */}
        <div className="flex items-center justify-around relative z-10 pt-2">
          {/* Mom Circle */}
          <div className="flex flex-col items-center">
            <div className="relative group">
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
                <Camera className="w-3.5 h-3.5" />
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
            <span className="mt-2 text-xs font-black font-['Fredoka'] text-[#2D1B2D] flex items-center gap-1">
              <span>👩</span> Mom
            </span>
          </div>

          {/* Squiggly Connecting Arrow */}
          <div className="flex flex-col items-center justify-center px-1">
            <svg
              width="44"
              height="36"
              viewBox="0 0 44 36"
              fill="none"
              className="text-[#BA68C8] animate-pulse"
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
            <span className="text-[9px] font-black text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-full border border-purple-200 mt-1">
              AI Blend
            </span>
          </div>

          {/* Dad Circle */}
          <div className="flex flex-col items-center">
            <div className="relative group">
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
                <Camera className="w-3.5 h-3.5" />
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
            <span className="mt-2 text-xs font-black font-['Fredoka'] text-[#2D1B2D] flex items-center gap-1">
              <span>👨</span> Dad
            </span>
          </div>
        </div>

        {/* Mom Preset Drawer */}
        {showMomPicker && (
          <div className="p-3 bg-pink-50/90 rounded-2xl border border-pink-100 animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#FF5376]">Choose Mom's Photo / Preset:</span>
              <label className="text-[10px] font-bold text-pink-600 cursor-pointer hover:underline flex items-center gap-1">
                <Upload className="w-3 h-3" /> Upload Custom
                <input type="file" accept="image/*" onChange={handleUploadCustomMom} className="hidden" />
              </label>
            </div>
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
          <div className="p-3 bg-purple-50/90 rounded-2xl border border-purple-100 animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#7E57C2]">Choose Dad's Photo / Preset:</span>
              <label className="text-[10px] font-bold text-purple-600 cursor-pointer hover:underline flex items-center gap-1">
                <Upload className="w-3 h-3" /> Upload Custom
                <input type="file" accept="image/*" onChange={handleUploadCustomDad} className="hidden" />
              </label>
            </div>
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

        {/* Controls: Gender Selection & Genetic Blend Ratio */}
        <div className="space-y-3 pt-1">
          {/* Gender Filter Buttons */}
          <div className="flex items-center justify-between bg-pink-50/70 p-1.5 rounded-2xl border border-pink-100">
            <span className="text-[11px] font-bold text-[#875C66] px-2 flex items-center gap-1">
              <Baby className="w-3.5 h-3.5 text-pink-500" />
              Gender:
            </span>
            <div className="flex gap-1">
              {(['any', 'girl', 'boy'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGenderFilter(g)}
                  className={`px-3 py-1 rounded-xl text-xs font-black font-['Fredoka'] transition-all cursor-pointer ${
                    genderFilter === g
                      ? 'bg-white text-[#FF5376] shadow-xs border border-pink-200'
                      : 'text-[#875C66] hover:text-[#2D1B2D]'
                  }`}
                >
                  {g === 'any' ? '✨ Surprise' : g === 'girl' ? '👧 Girl' : '👦 Boy'}
                </button>
              ))}
            </div>
          </div>

          {/* Genetic Dominance Slider */}
          <div className="bg-purple-50/50 p-2.5 rounded-2xl border border-purple-100 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#593E46]">
              <span>Mom's Features: {momFeatureRatio}%</span>
              <span>Dad's Features: {100 - momFeatureRatio}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              value={momFeatureRatio}
              onChange={(e) => setMomFeatureRatio(Number(e.target.value))}
              className="w-full accent-pink-500 cursor-pointer h-2 bg-pink-200 rounded-lg appearance-none"
            />
          </div>
        </div>

        {/* Generated Baby Large Circle & Floating Emoji Stickers */}
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
              <div className="absolute inset-0 rounded-full bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center">
                <RefreshCw className="w-8 h-8 text-[#FF5376] animate-spin" />
                <span className="text-xs font-black font-['Fredoka'] text-[#FF5376] mt-2">
                  Blending Genetics...
                </span>
              </div>
            )}
          </div>

          {/* Baby Caption & Genetic Traits */}
          <div className="mt-3 text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-[#FF5376] text-xs font-black font-['Fredoka'] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              {customBabyName || currentBaby.name}
            </div>
            <p className="text-xs font-semibold text-[#875C66]">
              {currentBaby.temperament}
            </p>
          </div>
        </div>

        {/* Genetic Traits Accordion */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 rounded-2xl border border-pink-100 text-center">
          {currentBaby.traits.map((t, idx) => (
            <div key={idx} className="bg-white/90 rounded-xl p-2 shadow-2xs border border-pink-50">
              <span className="text-base block">{t.icon}</span>
              <span className="text-[10px] font-bold text-[#875C66] block uppercase tracking-wider">{t.label}</span>
              <span className="text-[11px] font-black font-['Fredoka'] text-[#2D1B2D] leading-tight block mt-0.5">
                {t.value}
              </span>
            </div>
          ))}
        </div>

        {/* Big "Generate Baby" Gradient Pill Button */}
        <div className="space-y-2.5">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-4 rounded-3xl bg-gradient-to-r from-[#FF6584] via-[#FF758C] to-[#8E54E9] hover:from-[#FF5277] hover:to-[#7E3FE4] text-white text-base font-black font-['Fredoka'] shadow-xl shadow-pink-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.98]"
          >
            <Sparkles className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Simulating Next Generation...' : 'Generate Next Combination'}
          </button>

          <div className="flex items-center justify-center gap-4 pt-1 text-xs">
            <button
              onClick={handleShare}
              className="font-bold text-[#7E57C2] hover:text-[#5C3E66] flex items-center gap-1 cursor-pointer"
            >
              {copiedShare ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600">Baby Portrait Card Copied!</span>
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
