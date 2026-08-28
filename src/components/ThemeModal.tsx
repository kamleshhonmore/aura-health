import React from 'react';
import { ThemeId, PetId, ThemeConfig } from '../types';
import { themes } from '../themes';
import { pets } from '../data';
import { X, Check, Palette, Sparkles, Heart } from 'lucide-react';

interface ThemeModalProps {
  isOpen: boolean;
  currentTheme: ThemeId;
  currentPet: PetId;
  themeConfig: ThemeConfig;
  onSelectTheme: (themeId: ThemeId) => void;
  onSelectPet: (petId: PetId) => void;
  onClose: () => void;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({
  isOpen,
  currentTheme,
  currentPet,
  themeConfig,
  onSelectTheme,
  onSelectPet,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden border border-pink-100 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#FF758C] to-[#FF7EB3] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            <h3 className="text-base font-black font-['Fredoka']">Themes & Pet Companions</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5 text-sm max-h-[80vh] overflow-y-auto">
          {/* Theme Selector */}
          <div className="space-y-2.5">
            <label className="text-xs font-black font-['Fredoka'] text-[#4A2E35] flex items-center gap-1.5">
              <span>🎨</span> Choose App Skin Theme
            </label>
            <div className="grid grid-cols-1 gap-2">
              {Object.values(themes).map((t) => {
                const isSelected = t.id === currentTheme;
                return (
                  <button
                    key={t.id}
                    onClick={() => onSelectTheme(t.id)}
                    className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#FF6B8B] bg-[#FFF2F5] shadow-xs scale-[1.01]'
                        : 'border-gray-200 hover:border-pink-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{t.emoji}</span>
                      <div>
                        <span className="font-black font-['Fredoka'] text-xs text-[#4A2E35]">
                          {t.name}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/10"
                            style={{ backgroundColor: t.accentPink }}
                          />
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/10"
                            style={{ backgroundColor: t.accentGreen }}
                          />
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/10"
                            style={{ backgroundColor: t.accentGold }}
                          />
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="w-6 h-6 rounded-full bg-[#FF6B8B] text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pet Companion Selector */}
          <div className="space-y-2.5 pt-2 border-t border-pink-50">
            <label className="text-xs font-black font-['Fredoka'] text-[#4A2E35] flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-[#FF6B8B] fill-[#FF6B8B]" />
              Choose Desk Mascot Pet
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(pets).map((p) => {
                const isSelected = p.id === currentPet;
                return (
                  <button
                    key={p.id}
                    onClick={() => onSelectPet(p.id)}
                    className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#FF6B8B] bg-[#FFF2F5] shadow-xs scale-105'
                        : 'border-gray-200 hover:border-pink-200 bg-white'
                    }`}
                  >
                    <span className="text-3xl">{p.avatar}</span>
                    <span className="font-black font-['Fredoka'] text-xs text-[#4A2E35]">
                      {p.name}
                    </span>
                    <span className="text-[10px] text-[#875C66] line-clamp-1">{p.personality}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-pink-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-2xl bg-gradient-to-r from-[#FF758C] to-[#FF7EB3] text-white text-xs font-black font-['Fredoka'] cursor-pointer shadow-md"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
