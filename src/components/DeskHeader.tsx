import React from 'react';
import { ThemeConfig, PetCompanion, AppSettings } from '../types';
import {
  Bell,
  Palette,
  Lock,
  Baby,
  Settings,
  Sparkles,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';

interface DeskHeaderProps {
  theme: ThemeConfig;
  pet: PetCompanion;
  settings: AppSettings;
  viewStyle: 'scenic' | 'desk';
  onToggleViewStyle: () => void;
  onOpenTheme: () => void;
  onOpenReminders: () => void;
  onOpenSettings: () => void;
  onTogglePregnancy: () => void;
  onLockApp: () => void;
  onOpenAiChat?: () => void;
}

export const DeskHeader: React.FC<DeskHeaderProps> = ({
  theme,
  pet,
  settings,
  viewStyle,
  onToggleViewStyle,
  onOpenTheme,
  onOpenReminders,
  onOpenSettings,
  onTogglePregnancy,
  onLockApp,
  onOpenAiChat,
}) => {
  return (
    <header className={`px-4 pt-3 pb-3 border-b ${theme.borderCard} flex items-center justify-between transition-colors bg-white/60 backdrop-blur-md`}>
      {/* Brand & Mascot Greeting */}
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-2xl bg-white shadow-md flex items-center justify-center text-xl border border-pink-100/60 relative cursor-pointer hover:scale-105 transition-transform">
          <span>{pet.avatar}</span>
          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#FF6B8B] text-white text-[9px] font-bold flex items-center justify-center border border-white">
            ♥
          </span>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className={`font-black text-base font-['Fredoka'] tracking-tight ${theme.textPrimary}`}>
              cyclebliss
            </h1>
            {settings.isPregnancyMode && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFB74D] text-white flex items-center gap-1 shadow-xs animate-pulse">
                <Baby className="w-3 h-3" />
                Baby Mode
              </span>
            )}
          </div>
          <p className={`text-[11px] font-semibold ${theme.textSecondary}`}>
            Period & Cycle Wellness
          </p>
        </div>
      </div>

      {/* Action Toolbar Icons */}
      <div className="flex items-center gap-1.5">
        {/* Gemini AI Chat Quick Button */}
        {onOpenAiChat && (
          <button
            onClick={onOpenAiChat}
            title="Gemini AI Health Companion"
            className="p-2 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-500 text-white shadow-sm hover:scale-105 transition-transform cursor-pointer"
          >
            <Sparkles className="w-4 h-4 animate-spin [animation-duration:4s]" />
          </button>
        )}

        {/* Scenic vs Desk Mode Toggle */}
        <button
          onClick={onToggleViewStyle}
          title={viewStyle === 'scenic' ? 'Switch to Detailed Desk' : 'Switch to Scenic Wallpaper'}
          className="px-2.5 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 border border-pink-200 text-[#FF5376] text-xs font-black font-['Fredoka'] flex items-center gap-1 cursor-pointer transition-all shadow-xs"
        >
          {viewStyle === 'scenic' ? (
            <>
              <Layers className="w-3.5 h-3.5" />
              <span>Desk</span>
            </>
          ) : (
            <>
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Scenic</span>
            </>
          )}
        </button>

        {/* Theme Picker */}
        <button
          onClick={onOpenTheme}
          title="Change Theme & Pet"
          className={`p-2 rounded-xl ${theme.bgCard} border ${theme.borderCard} ${theme.textSecondary} ${theme.bgCardHover} transition-all cursor-pointer shadow-xs`}
        >
          <Palette className="w-4 h-4" />
        </button>

        {/* Reminders / Alarm */}
        <button
          onClick={onOpenReminders}
          title="Reminders & Alarms"
          className={`relative p-2 rounded-xl ${theme.bgCard} border ${theme.borderCard} ${theme.textSecondary} ${theme.bgCardHover} transition-all cursor-pointer shadow-xs`}
        >
          <Bell className="w-4 h-4" />
          {settings.remindPeriodEnabled && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF6B8B] ring-2 ring-white" />
          )}
        </button>

        {/* Lock App */}
        <button
          onClick={onLockApp}
          title="Keep it Secret (PIN Lock)"
          className={`p-2 rounded-xl ${theme.bgCard} border ${theme.borderCard} ${theme.textSecondary} ${theme.bgCardHover} transition-all cursor-pointer shadow-xs`}
        >
          <Lock className="w-4 h-4 text-[#FF6B8B]" />
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          title="Settings"
          className={`p-2 rounded-xl ${theme.bgCard} border ${theme.borderCard} ${theme.textSecondary} ${theme.bgCardHover} transition-all cursor-pointer shadow-xs`}
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
