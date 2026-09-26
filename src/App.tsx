import React, { useState, useEffect } from 'react';
import {
  ThemeId,
  PetId,
  DayLog,
  CycleRecord,
  AppSettings,
  ThemeConfig,
} from './types';
import { themes } from './themes';
import { pets, defaultSettings, sampleCycles, sampleLogs } from './data';
import {
  calculateCycleStatus,
  formatDateStr,
} from './utils/cycleCalculations';

import { DeskHeader } from './components/DeskHeader';
import { StatusCard } from './components/StatusCard';
import { PetMascot } from './components/PetMascot';
import { WaterTracker } from './components/WaterTracker';
import { PillTracker } from './components/PillTracker';
import { QuickLogBar } from './components/QuickLogBar';
import { CalendarView } from './components/CalendarView';
import { ChartsView } from './components/ChartsView';
import { PregnancyModeView } from './components/PregnancyModeView';
import { ScenicCountdownView } from './components/ScenicCountdownView';
import { CategoryHub } from './components/CategoryHub';
import { AyurvedicHub } from './components/AyurvedicHub';
import { FutureBabyGenerator } from './components/FutureBabyGenerator';
import { ClinicalDiagnosticsHub } from './components/ClinicalDiagnosticsHub';
import { PerimenopauseScreen } from './components/PerimenopauseScreen';
import { GeminiChatbot } from './components/GeminiChatbot';

import { DailyLogModal } from './components/DailyLogModal';
import { ThemeModal } from './components/ThemeModal';
import { RemindersModal } from './components/RemindersModal';
import { PinLockModal } from './components/PinLockModal';
import { SettingsModal } from './components/SettingsModal';

import {
  Home,
  LayoutGrid,
  Leaf,
  Calendar as CalendarIcon,
  BarChart2,
  Sparkles,
  PlusCircle,
  Baby,
  MessageSquare,
  Bot,
  Activity,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';

function safeStorageLoad<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);
    if (typeof parsed === 'object' && parsed !== null) {
      return Array.isArray(fallback)
        ? (Array.isArray(parsed) ? (parsed as unknown as T) : fallback)
        : ({ ...fallback, ...parsed } as unknown as T);
    }
    return (parsed as T) ?? fallback;
  } catch (e) {
    console.warn(`Failed to parse localStorage key "${key}", falling back:`, e);
    return fallback;
  }
}

function computeLatestPeriodStart(logsMap: Record<string, DayLog>, cyclesList: CycleRecord[]): string {
  let latest = '2026-08-01';
  if (logsMap) {
    Object.entries(logsMap).forEach(([dateStr, log]) => {
      if (log?.isPeriod && dateStr > latest) {
        latest = dateStr;
      }
    });
  }
  if (cyclesList) {
    cyclesList.forEach((c) => {
      if (c?.startDate && c.startDate > latest) {
        latest = c.startDate;
      }
    });
  }
  return latest;
}

export function App() {
  const [settings, setSettings] = useState<AppSettings>(() =>
    safeStorageLoad('period_calendar_settings', defaultSettings)
  );

  const [logs, setLogs] = useState<Record<string, DayLog>>(() =>
    safeStorageLoad('period_calendar_logs', sampleLogs)
  );

  const [cycles, setCycles] = useState<CycleRecord[]>(() =>
    safeStorageLoad('period_calendar_cycles', sampleCycles)
  );

  const [lastPeriodStart, setLastPeriodStart] = useState<string>(() => {
    const loadedLogs = safeStorageLoad('period_calendar_logs', sampleLogs);
    const loadedCycles = safeStorageLoad('period_calendar_cycles', sampleCycles);
    return computeLatestPeriodStart(loadedLogs, loadedCycles);
  });

  const [activeTab, setActiveTab] = useState<
    'home' | 'hub' | 'ayurveda' | 'calendar' | 'charts' | 'pregnancy' | 'clinical' | 'babyai' | 'perimenopause' | 'aichat'
  >('home');
  const [homeViewStyle, setHomeViewStyle] = useState<'scenic' | 'desk'>('scenic');

  // Modals state
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logModalDate, setLogModalDate] = useState<string>(formatDateStr(new Date()));
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isRemindersModalOpen, setIsRemindersModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isPinSetupOpen, setIsPinSetupOpen] = useState(false);
  const [isAppLocked, setIsAppLocked] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('period_calendar_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('period_calendar_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('period_calendar_cycles', JSON.stringify(cycles));
  }, [cycles]);

  const currentTheme = themes[settings.theme] || themes.blossom;
  const currentPet = pets[settings.pet] || pets.kitty;

  const todayStr = formatDateStr(new Date());
  const todayLog = logs[todayStr];

  // Calculate live cycle status for today
  const cycleStatus = calculateCycleStatus(
    new Date(),
    lastPeriodStart,
    settings.cycleLength,
    settings.periodLength,
    settings.lutealLength
  );

  // Handlers for logging
  const handleSaveLog = (dateStr: string, log: DayLog) => {
    const nextLogs = { ...logs, [dateStr]: log };
    setLogs(nextLogs);

    // If marked as period, check if it updates lastPeriodStart
    if (log.isPeriod) {
      if (dateStr > lastPeriodStart) {
        setLastPeriodStart(dateStr);
      }
    }
  };

  const handleDeleteLog = (dateStr: string) => {
    const nextLogs = { ...logs };
    delete nextLogs[dateStr];
    setLogs(nextLogs);
  };

  const handleTogglePeriodToday = () => {
    const isCurrentlyPeriod = todayLog?.isPeriod;
    const updated: DayLog = {
      date: todayStr,
      isPeriod: !isCurrentlyPeriod,
      flow: !isCurrentlyPeriod ? 'medium' : 'none',
      symptoms: todayLog?.symptoms || [],
      moods: todayLog?.moods || [],
      intimacy: todayLog?.intimacy || ['none'],
      orgasms: todayLog?.orgasms || 0,
      pillTaken: todayLog?.pillTaken || false,
      waterGlasses: todayLog?.waterGlasses || 0,
      temperature: todayLog?.temperature,
      weight: todayLog?.weight,
      notes: todayLog?.notes || '',
    };
    handleSaveLog(todayStr, updated);
    if (!isCurrentlyPeriod) {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FF5376', '#FF758C', '#FF8FA3'],
      });
    }
  };

  const handleTogglePeriodOnDate = (dateStr: string) => {
    const existing = logs[dateStr];
    const isCurrentlyPeriod = existing?.isPeriod;
    const updated: DayLog = {
      date: dateStr,
      isPeriod: !isCurrentlyPeriod,
      flow: !isCurrentlyPeriod ? 'medium' : 'none',
      symptoms: existing?.symptoms || [],
      moods: existing?.moods || [],
      intimacy: existing?.intimacy || ['none'],
      orgasms: existing?.orgasms || 0,
      pillTaken: existing?.pillTaken || false,
      waterGlasses: existing?.waterGlasses || 0,
      temperature: existing?.temperature,
      weight: existing?.weight,
      notes: existing?.notes || '',
    };
    handleSaveLog(dateStr, updated);
  };

  const handleUpdateWaterGlasses = (count: number) => {
    const existing = todayLog || {
      date: todayStr,
      isPeriod: false,
      flow: 'none',
      symptoms: [],
      moods: [],
      intimacy: ['none'],
      orgasms: 0,
      pillTaken: false,
      waterGlasses: 0,
      notes: '',
    };
    const updated: DayLog = {
      ...existing,
      waterGlasses: count,
    };
    handleSaveLog(todayStr, updated);
  };

  const handleTogglePillToday = () => {
    const existing = todayLog || {
      date: todayStr,
      isPeriod: false,
      flow: 'none',
      symptoms: [],
      moods: [],
      intimacy: ['none'],
      orgasms: 0,
      pillTaken: false,
      waterGlasses: 0,
      notes: '',
    };
    const updated: DayLog = {
      ...existing,
      pillTaken: !existing.pillTaken,
      pillTime: !existing.pillTaken
        ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : undefined,
    };
    handleSaveLog(todayStr, updated);
  };

  const handleToggleQuickSymptom = (symId: string) => {
    const existing = todayLog || {
      date: todayStr,
      isPeriod: false,
      flow: 'none',
      symptoms: [],
      moods: [],
      intimacy: ['none'],
      orgasms: 0,
      pillTaken: false,
      waterGlasses: 0,
      notes: '',
    };
    const currentSyms = existing.symptoms || [];
    const nextSyms = currentSyms.includes(symId)
      ? currentSyms.filter((s) => s !== symId)
      : [...currentSyms, symId];
    const updated: DayLog = {
      ...existing,
      symptoms: nextSyms,
    };
    handleSaveLog(todayStr, updated);
  };

  const handleOpenLogModalForDate = (dateStr: string) => {
    setLogModalDate(dateStr);
    setIsLogModalOpen(true);
  };

  const handleUpdateSettings = (updated: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...updated }));
  };

  return (
    <div className={`min-h-screen ${currentTheme.bgMain} flex flex-col font-['Nunito'] antialiased transition-colors`}>
      {/* Mobile App Canvas Container */}
      <div className="w-full max-w-md mx-auto min-h-screen flex flex-col shadow-2xl relative bg-transparent pb-24">
        {/* Top App Header */}
        <DeskHeader
          theme={currentTheme}
          pet={currentPet}
          settings={settings}
          viewStyle={homeViewStyle}
          onToggleViewStyle={() =>
            setHomeViewStyle((prev) => (prev === 'scenic' ? 'desk' : 'scenic'))
          }
          onOpenTheme={() => setIsThemeModalOpen(true)}
          onOpenReminders={() => setIsRemindersModalOpen(true)}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onOpenAiChat={() => setActiveTab('aichat')}
          onTogglePregnancy={() => {
            const nextMode = !settings.isPregnancyMode;
            handleUpdateSettings({ isPregnancyMode: nextMode });
            if (nextMode) {
              setActiveTab('pregnancy');
              confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#FFB74D', '#FF8A65', '#FF80AB'],
              });
            } else {
              setActiveTab('home');
            }
          }}
          onLockApp={() => setIsAppLocked(true)}
        />

        {/* Main Tab Content View */}
        <main className="flex-1 p-3.5 overflow-x-hidden overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* TAB 1: HOME (Scenic or Desk) */}
            {activeTab === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="space-y-3.5"
              >
                {homeViewStyle === 'scenic' ? (
                  /* Scenic View matching Image 4 */
                  <ScenicCountdownView
                    status={cycleStatus}
                    theme={currentTheme}
                    pet={currentPet}
                    settings={settings}
                    todayLog={todayLog}
                    onOpenLogModal={() => handleOpenLogModalForDate(todayStr)}
                    onOpenTheme={() => setIsThemeModalOpen(true)}
                    onOpenSettings={() => setIsSettingsModalOpen(true)}
                    onTogglePeriodToday={handleTogglePeriodToday}
                    onOpenAiChat={() => setActiveTab('aichat')}
                  />
                ) : (
                  /* Classic Desk View */
                  <>
                    <StatusCard
                      status={cycleStatus}
                      theme={currentTheme}
                      onOpenLogModal={() => handleOpenLogModalForDate(todayStr)}
                      onTogglePeriodToday={handleTogglePeriodToday}
                      onOpenCalendar={() => setActiveTab('calendar')}
                    />

                    <PetMascot
                      pet={currentPet}
                      theme={currentTheme}
                      cyclePhase={cycleStatus.phase}
                      isWaterGoalReached={(todayLog?.waterGlasses || 0) >= settings.waterGoalGlasses}
                      onOpenPetSelector={() => setIsThemeModalOpen(true)}
                    />

                    <WaterTracker
                      currentGlasses={todayLog?.waterGlasses || 0}
                      goalGlasses={settings.waterGoalGlasses}
                      theme={currentTheme}
                      onUpdateGlasses={handleUpdateWaterGlasses}
                    />

                    <PillTracker
                      isTaken={todayLog?.pillTaken || false}
                      pillTime={todayLog?.pillTime}
                      cycleDay={cycleStatus.currentCycleDay}
                      theme={currentTheme}
                      onTogglePill={handleTogglePillToday}
                    />

                    <QuickLogBar
                      todayLog={todayLog}
                      theme={currentTheme}
                      onOpenLogModal={() => handleOpenLogModalForDate(todayStr)}
                      onToggleSymptom={handleToggleQuickSymptom}
                    />
                  </>
                )}
              </motion.div>
            )}

            {/* TAB 2: HUB ("Understand Your Body" matching Image 3) */}
            {activeTab === 'hub' && (
              <motion.div
                key="hub"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <CategoryHub
                  status={cycleStatus}
                  settings={settings}
                  theme={currentTheme}
                  todayLog={todayLog}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  onOpenLogModal={() => handleOpenLogModalForDate(todayStr)}
                />
              </motion.div>
            )}

            {/* TAB 3: AYURVEDA ("Ancient Remedies" matching Image 5 & Image 6) */}
            {activeTab === 'ayurveda' && (
              <motion.div
                key="ayurveda"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <AyurvedicHub />
              </motion.div>
            )}

            {/* TAB 4: CALENDAR */}
            {activeTab === 'calendar' && (
              <motion.div
                key="calendar"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <CalendarView
                  theme={currentTheme}
                  lastPeriodStart={lastPeriodStart}
                  cycleLength={settings.cycleLength}
                  periodLength={settings.periodLength}
                  lutealLength={settings.lutealLength}
                  logs={logs}
                  onSelectDate={(d) => setLogModalDate(d)}
                  onOpenLogModalForDate={handleOpenLogModalForDate}
                  onTogglePeriodOnDate={handleTogglePeriodOnDate}
                />
              </motion.div>
            )}

            {/* TAB 5: CHARTS / ANALYSIS */}
            {activeTab === 'charts' && (
              <motion.div
                key="charts"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <ChartsView
                  theme={currentTheme}
                  cycles={cycles}
                  logs={logs}
                  tempUnit={settings.tempUnit}
                  weightUnit={settings.weightUnit}
                />
              </motion.div>
            )}

            {/* TAB 10: CLINICAL AI */}
            {activeTab === 'clinical' && (
              <motion.div
                key="clinical"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <ClinicalDiagnosticsHub 
                  theme={currentTheme}
                  settings={settings}
                  todayLog={todayLog}
                  onUpdateSettings={handleUpdateSettings}
                  onOpenLogModal={() => handleOpenLogModalForDate(todayStr)}
                  onNavigateBack={() => setActiveTab('hub')}
                />
              </motion.div>
            )}

            {/* TAB 6: BABY AI / FUTURE BABY GENERATOR matching Image 1 */}
            {activeTab === 'babyai' && (
              <motion.div
                key="babyai"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <FutureBabyGenerator onBack={() => setActiveTab('hub')} />
              </motion.div>
            )}

            {/* TAB 7: PREGNANCY MODE */}
            {activeTab === 'pregnancy' && (
              <motion.div
                key="pregnancy"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <PregnancyModeView
                  settings={settings}
                  theme={currentTheme}
                  onUpdateDueDate={(newDue) => handleUpdateSettings({ pregnancyDueDate: newDue })}
                  onNavigateToBabyAI={() => setActiveTab('babyai')}
                />
              </motion.div>
            )}

            {/* TAB 8: PERI-MENOPAUSE CARE */}
            {activeTab === 'perimenopause' && (
              <motion.div
                key="perimenopause"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <PerimenopauseScreen
                  theme={currentTheme}
                  settings={settings}
                  onBack={() => setActiveTab('hub')}
                />
              </motion.div>
            )}

            {/* TAB 9: GEMINI AI MULTI-TURN CHATBOT */}
            {activeTab === 'aichat' && (
              <motion.div
                key="aichat"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <GeminiChatbot
                  theme={currentTheme}
                  cycleStatus={cycleStatus}
                  userSymptoms={todayLog?.symptoms || []}
                  userMoods={todayLog?.moods || []}
                  onNavigateToTab={(tab) => setActiveTab(tab)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Floating Quick Action Button for Instant Logging */}
        <div className="fixed bottom-20 right-1/2 translate-x-1/2 max-w-md w-full pointer-events-none flex justify-end px-4 z-40">
          <button
            onClick={() => handleOpenLogModalForDate(todayStr)}
            title="Quick Daily Log"
            className="pointer-events-auto p-3.5 rounded-full bg-gradient-to-r from-[#FF758C] to-[#FF7EB3] hover:from-[#FF6580] hover:to-[#FF6F9A] text-white shadow-xl shadow-pink-500/30 flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all border-2 border-white"
          >
            <PlusCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Modern Bottom Navigation Bar */}
        <nav
          className={`fixed bottom-0 left-1/2 -translate-x-1/2 max-w-md w-full ${currentTheme.bgCard} border-t ${currentTheme.borderCard} px-1 py-2 flex items-center justify-around z-40 shadow-xl backdrop-blur-lg`}
        >
          {/* Home */}
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center py-1 px-1.5 rounded-2xl transition-all cursor-pointer ${
              activeTab === 'home'
                ? 'text-[#FF5376] font-black scale-105'
                : `${currentTheme.textMuted} hover:${currentTheme.textSecondary}`
            }`}
          >
            <Home className={`w-4.5 h-4.5 ${activeTab === 'home' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] font-['Fredoka'] mt-0.5">Home</span>
          </button>

          {/* Calendar */}
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex flex-col items-center py-1 px-1.5 rounded-2xl transition-all cursor-pointer ${
              activeTab === 'calendar'
                ? 'text-[#FF5376] font-black scale-105'
                : `${currentTheme.textMuted} hover:${currentTheme.textSecondary}`
            }`}
          >
            <CalendarIcon className={`w-4.5 h-4.5 ${activeTab === 'calendar' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] font-['Fredoka'] mt-0.5">Calendar</span>
          </button>

          {/* Hub */}
          <button
            onClick={() => setActiveTab('hub')}
            className={`flex flex-col items-center py-1 px-1.5 rounded-2xl transition-all cursor-pointer ${
              activeTab === 'hub'
                ? 'text-[#FF5376] font-black scale-105'
                : `${currentTheme.textMuted} hover:${currentTheme.textSecondary}`
            }`}
          >
            <LayoutGrid className={`w-4.5 h-4.5 ${activeTab === 'hub' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] font-['Fredoka'] mt-0.5">Hub</span>
          </button>

          {/* AI Chat (Gemini) */}
          <button
            onClick={() => setActiveTab('aichat')}
            className={`flex flex-col items-center py-1 px-1.5 rounded-2xl transition-all cursor-pointer relative ${
              activeTab === 'aichat'
                ? 'text-purple-600 font-black scale-105'
                : `${currentTheme.textMuted} hover:${currentTheme.textSecondary}`
            }`}
          >
            <div className="relative">
              <Bot className={`w-4.5 h-4.5 ${activeTab === 'aichat' ? 'stroke-[2.5]' : ''}`} />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 animate-ping" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500" />
            </div>
            <span className="text-[10px] font-['Fredoka'] mt-0.5">AI Chat</span>
          </button>
        </nav>
      </div>

      {/* Daily Diary Modal */}
      <DailyLogModal
        isOpen={isLogModalOpen}
        dateStr={logModalDate}
        initialLog={logs[logModalDate]}
        theme={currentTheme}
        tempUnit={settings.tempUnit}
        weightUnit={settings.weightUnit}
        onClose={() => setIsLogModalOpen(false)}
        onSave={handleSaveLog}
        onDeleteLog={handleDeleteLog}
      />

      {/* Theme and Pet Picker Modal */}
      <ThemeModal
        isOpen={isThemeModalOpen}
        currentTheme={settings.theme}
        currentPet={settings.pet}
        themeConfig={currentTheme}
        onSelectTheme={(t) => handleUpdateSettings({ theme: t })}
        onSelectPet={(p) => handleUpdateSettings({ pet: p })}
        onClose={() => setIsThemeModalOpen(false)}
      />

      {/* Reminders & Alarms Modal */}
      <RemindersModal
        isOpen={isRemindersModalOpen}
        settings={settings}
        theme={currentTheme}
        onSaveSettings={handleUpdateSettings}
        onClose={() => setIsRemindersModalOpen(false)}
      />

      {/* App Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        settings={settings}
        theme={currentTheme}
        onSaveSettings={handleUpdateSettings}
        onOpenPinSetup={() => setIsPinSetupOpen(true)}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      {/* PIN Setup Modal */}
      {isPinSetupOpen && (
        <PinLockModal
          isOpen={isPinSetupOpen}
          isLockScreen={false}
          correctPin={settings.pinCode}
          onSuccess={() => {
            setIsPinSetupOpen(false);
            handleUpdateSettings({ pinLockEnabled: true });
          }}
          onClose={() => setIsPinSetupOpen(false)}
          onSaveNewPin={(newPin) => handleUpdateSettings({ pinCode: newPin, pinLockEnabled: true })}
        />
      )}

      {/* Active PIN Lock Screen */}
      {isAppLocked && (
        <PinLockModal
          isOpen={isAppLocked}
          isLockScreen={true}
          correctPin={settings.pinCode}
          onSuccess={() => setIsAppLocked(false)}
        />
      )}
    </div>
  );
}

export default App;
