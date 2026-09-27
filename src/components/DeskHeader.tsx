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
  Activity,
  ChevronRight,
  Wifi,
  Battery,
  Signal,
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
  onSearchClick?: () => void;
  onOpenAuth?: () => void;
  userEmail?: string | null;
  userPhoto?: string | null;
  syncStatus?: 'synced' | 'syncing' | 'offline' | 'local';
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
  onOpenAuth,
  userEmail,
  userPhoto,
  syncStatus = 'local',
}) => {
  return (
    <header className="px-4 pt-2.5 pb-3 border-b border-[#EAECEF] flex flex-col gap-2.5 transition-colors bg-white/95 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
      {/* 1. Top Status Bar */}
      <div className="flex items-center justify-between text-[11px] font-semibold text-[#646478] px-1 font-mono">
        <div className="flex items-center gap-1.5">
          <span>12:35</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-sans font-bold">5G</span>
        </div>
        <div className="flex items-center gap-2">
          <Signal className="w-3.5 h-3.5 text-slate-600" />
          <Wifi className="w-3.5 h-3.5 text-slate-600" />
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-slate-700">88%</span>
            <Battery className="w-4 h-4 text-slate-600" />
          </div>
        </div>
      </div>

      {/* 2. Brand Header & Profile Chip */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-[18px] bg-gradient-to-tr from-[#FF5376] to-[#FF758C] p-[1.5px] shadow-md flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white rounded-[16.5px] flex items-center justify-center text-lg font-black text-[#FF5376]">
              A
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-lg font-['Fredoka'] tracking-wide text-[#1A1A24]">
                AURA HEALTH
              </h1>
              {settings.isPregnancyMode && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                  <Baby className="w-3 h-3" />
                  Baby Mode
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#646478] font-semibold tracking-tight">
              Clinical & Cycle Intelligence
            </p>
          </div>
        </div>

        {/* User Account / Sync Status Chip */}
        <button
          onClick={onOpenAuth || onOpenTheme}
          title="Account & Database Sync Settings"
          className="px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-[#EAECEF] text-[#1A1A24] text-xs font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
        >
          {userPhoto ? (
            <img src={userPhoto} alt="User" className="w-5 h-5 rounded-full object-cover border border-[#FF5376]" />
          ) : userEmail ? (
            <div className="w-5 h-5 rounded-full bg-[#FF5376] text-white text-[10px] flex items-center justify-center font-bold">
              {userEmail[0].toUpperCase()}
            </div>
          ) : (
            <Activity className="w-3.5 h-3.5 text-[#FF5376]" />
          )}
          <span className="max-w-[85px] truncate">
            {userEmail ? (syncStatus === 'synced' ? 'Synced' : 'Cloud') : 'Guest'}
          </span>
          <ChevronRight className="w-3 h-3 text-[#646478]" />
        </button>
      </div>

      {/* 3. Quick Utility Toolbar */}
      <div className="flex items-center justify-between pt-0.5">
        <div className="flex items-center gap-1.5">
          {onOpenAiChat && (
            <button
              onClick={onOpenAiChat}
              title="AI Health Assistant"
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold shadow-sm hover:scale-105 transition-transform flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 animate-spin [animation-duration:3s]" />
              <span>AI Assistant</span>
            </button>
          )}

          <button
            onClick={onToggleViewStyle}
            title={viewStyle === 'scenic' ? 'Switch to Desk' : 'Switch to Scenic'}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[#1A1A24] text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
          >
            {viewStyle === 'scenic' ? (
              <>
                <Layers className="w-3.5 h-3.5 text-[#FF5376]" />
                <span>Desk UI</span>
              </>
            ) : (
              <>
                <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                <span>Scenic</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenTheme}
            title="Themes"
            className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-[#EAECEF] text-[#646478] transition-all cursor-pointer shadow-xs"
          >
            <Palette className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onOpenReminders}
            title="Reminders"
            className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-[#EAECEF] text-[#646478] transition-all cursor-pointer relative shadow-xs"
          >
            <Bell className="w-3.5 h-3.5" />
            {settings.remindPeriodEnabled && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF5376] ring-1 ring-white" />
            )}
          </button>

          <button
            onClick={onLockApp}
            title="PIN Lock"
            className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-[#EAECEF] text-[#FF5376] transition-all cursor-pointer shadow-xs"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onOpenSettings}
            title="Settings"
            className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-[#EAECEF] text-[#646478] transition-all cursor-pointer shadow-xs"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
