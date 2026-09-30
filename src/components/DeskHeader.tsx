import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
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
  X,
  User,
  Cloud,
  ShieldCheck,
  Check,
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <header className="px-4 pt-3 pb-3 border-b border-[#EAECEF] flex flex-col gap-2.5 transition-colors bg-white/95 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
      {/* 2. Brand Header & Profile Chip */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Top-Left Circular Badge Avatar - Click opens Navigation Drawer Slider */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            title="Open Side Menu Drawer"
            className="w-11 h-11 rounded-[18px] bg-gradient-to-tr from-[#FF5376] to-[#FF758C] p-[1.5px] shadow-md flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform"
          >
            <div className="w-full h-full bg-white rounded-[16.5px] flex items-center justify-center text-lg font-black text-[#FF5376]">
              {userEmail ? userEmail[0].toUpperCase() : 'A'}
            </div>
          </button>
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

      {/* 4. FULL-SCREEN SLIDE-OUT NAVIGATION DRAWER (Top Left Avatar Click) */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isDrawerOpen && (
            <div className="fixed inset-0 z-[9999] flex justify-start font-['Nunito'] text-[#1A1A24]">
              {/* Backdrop Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsDrawerOpen(false)}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
              />

              {/* Full Height Advanced Smooth Slide-out Sidebar Panel */}
              <motion.div
                initial={{ x: '-100%', opacity: 0.8 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '-100%', opacity: 0.8 }}
                transition={{ type: 'spring', damping: 30, stiffness: 320 }}
                className="relative w-80 max-w-[85vw] h-full bg-white/95 backdrop-blur-2xl flex flex-col shadow-[0_25px_60px_-15px_rgba(255,83,118,0.35)] z-10 overflow-hidden rounded-r-[36px] border-r border-rose-100/60"
              >
                {/* Drawer Header Banner */}
                <div className="p-6 bg-gradient-to-br from-[#FF5376] via-[#FF6584] to-[#E04365] text-white relative flex flex-col justify-between shadow-md shrink-0">
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-3.5 mt-2">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md p-1 border border-white/30 flex items-center justify-center shadow-lg shrink-0">
                      {userPhoto ? (
                        <img src={userPhoto} alt="User Avatar" className="w-full h-full rounded-xl object-cover" />
                      ) : (
                        <div className="w-full h-full bg-white rounded-xl flex items-center justify-center text-2xl font-black text-[#FF5376]">
                          {userEmail ? userEmail[0].toUpperCase() : 'A'}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-black text-lg leading-tight font-['Fredoka']">
                        AURA HEALTH
                      </h3>
                      <p className="text-xs text-rose-100 font-semibold truncate max-w-[170px]">
                        {userEmail || 'Guest User'}
                      </p>
                      <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-white/20 text-white border border-white/30 uppercase tracking-wider">
                        <Cloud className="w-3 h-3" />
                        {syncStatus === 'synced' ? 'Cloud Synced' : 'Local Mode'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Navigation Options List */}
                <div className="p-4 space-y-1 flex-1 overflow-y-auto">
                  <div className="px-3 py-2 text-[10px] font-black tracking-widest text-[#7E525E] uppercase">
                    Main Navigation & Features
                  </div>

                  {/* 1. Theme & Styling */}
                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      onOpenTheme();
                    }}
                    className="w-full p-3 rounded-2xl flex items-center justify-between hover:bg-rose-50 text-[#1A1A24] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-pink-100 text-[#FF5376] flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                        <Palette className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-black">App Themes & Aesthetics</div>
                        <div className="text-[10px] text-[#646478] font-medium">Custom color schemes</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  {/* 2. Reminders & Alerts */}
                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      onOpenReminders();
                    }}
                    className="w-full p-3 rounded-2xl flex items-center justify-between hover:bg-rose-50 text-[#1A1A24] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-black">Notifications & Reminders</div>
                        <div className="text-[10px] text-[#646478] font-medium">Cycle alerts & log prompts</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  {/* 3. PIN Lock & Security */}
                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      onLockApp();
                    }}
                    className="w-full p-3 rounded-2xl flex items-center justify-between hover:bg-rose-50 text-[#1A1A24] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-black">PIN Lock & Privacy</div>
                        <div className="text-[10px] text-[#646478] font-medium">Lock screen security</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  {/* 4. App Settings */}
                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      onOpenSettings();
                    }}
                    className="w-full p-3 rounded-2xl flex items-center justify-between hover:bg-rose-50 text-[#1A1A24] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                        <Settings className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-black">Cycle Settings & Prefs</div>
                        <div className="text-[10px] text-[#646478] font-medium">Period & cycle length</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  {/* 5. AI Health Assistant */}
                  {onOpenAiChat && (
                    <button
                      onClick={() => {
                        setIsDrawerOpen(false);
                        onOpenAiChat();
                      }}
                      className="w-full p-3 rounded-2xl flex items-center justify-between hover:bg-purple-50 text-[#1A1A24] transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-black">AI Health Assistant</div>
                          <div className="text-[10px] text-[#646478] font-medium">Chat & symptom insights</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  )}

                  {/* 6. Baby / Pregnancy Mode Toggle */}
                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      onTogglePregnancy();
                    }}
                    className="w-full p-3 rounded-2xl flex items-center justify-between hover:bg-amber-50 text-[#1A1A24] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                        <Baby className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-black">Pregnancy & Baby Mode</div>
                        <div className="text-[10px] text-[#646478] font-medium">
                          {settings.isPregnancyMode ? 'Active (Tap to disable)' : 'Inactive (Tap to enable)'}
                        </div>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      settings.isPregnancyMode ? 'bg-amber-500 border-amber-500 text-white' : 'border-slate-300'
                    }`}>
                      {settings.isPregnancyMode && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>

                  {/* 7. View Mode Switcher */}
                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      onToggleViewStyle();
                    }}
                    className="w-full p-3 rounded-2xl flex items-center justify-between hover:bg-slate-50 text-[#1A1A24] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                        {viewStyle === 'scenic' ? <Layers className="w-4 h-4 text-[#FF5376]" /> : <ImageIcon className="w-4 h-4 text-amber-600" />}
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-black">View Mode</div>
                        <div className="text-[10px] text-[#646478] font-medium">
                          {viewStyle === 'scenic' ? 'Scenic View' : 'Desk UI View'}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  {/* 8. Cloud Account */}
                  {onOpenAuth && (
                    <button
                      onClick={() => {
                        setIsDrawerOpen(false);
                        onOpenAuth();
                      }}
                      className="w-full p-3 rounded-2xl flex items-center justify-between hover:bg-blue-50 text-[#1A1A24] transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-black">Account & Cloud Backup</div>
                          <div className="text-[10px] text-[#646478] font-medium">Sync biometric records</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  )}
                </div>

                {/* Drawer Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/80 text-center space-y-1 shrink-0">
                  <div className="flex items-center justify-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>On-Device Privacy Protected</span>
                  </div>
                  <div className="text-[9px] text-slate-400 font-semibold">
                    Aura Health v2.4.0 (Rotterdam AI)
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </header>
  );
};
