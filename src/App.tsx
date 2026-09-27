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
import { NavDock } from './components/NavDock';
import { SleekSymptomLogger } from './components/SleekSymptomLogger';
import { InteractiveIntakeWizard } from './components/InteractiveIntakeWizard';

import { DailyLogModal } from './components/DailyLogModal';
import { ThemeModal } from './components/ThemeModal';
import { RemindersModal } from './components/RemindersModal';
import { PinLockModal } from './components/PinLockModal';
import { SettingsModal } from './components/SettingsModal';

import {
  Home,
  LayoutGrid,
  Calendar as CalendarIcon,
  Bot,
  PlusCircle,
} from 'lucide-react';
import { fireCelebrationConfetti } from './utils/confetti';
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
  const [homeViewStyle, setHomeViewStyle] = useState<'scenic' | 'desk'>('desk');

  // Modals state
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logModalDate, setLogModalDate] = useState<string>(formatDateStr(new Date()));
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isRemindersModalOpen, setIsRemindersModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isPinSetupOpen, setIsPinSetupOpen] = useState(false);
  const [isAppLocked, setIsAppLocked] = useState(false);
  const [isInteractiveWizardOpen, setIsInteractiveWizardOpen] = useState(false);

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
      fireCelebrationConfetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FF5376', '#10B981', '#F59E0B'],
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
    <div className={`min-h-screen ${currentTheme.bgMain} flex flex-col font-['Nunito'] antialiased transition-colors text-[#1A1A24]`}>
      {/* Mobile App Frame Container */}
      <div className="w-full max-w-md mx-auto min-h-screen flex flex-col shadow-2xl relative bg-[#F8F9FC] pb-24 border-x border-[#EAECEF]">
        {/* Top Header */}
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
          onSearchClick={() => setActiveTab('hub')}
          onTogglePregnancy={() => {
            const nextMode = !settings.isPregnancyMode;
            handleUpdateSettings({ isPregnancyMode: nextMode });
            if (nextMode) {
              setActiveTab('pregnancy');
              fireCelebrationConfetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#F59E0B', '#FF5376', '#7C3AED'],
              });
            } else {
              setActiveTab('home');
            }
          }}
          onLockApp={() => setIsAppLocked(true)}
        />

        {/* Main Tab Content View */}
        <main className="flex-1 p-4 overflow-x-hidden overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="space-y-4"
              >
                {homeViewStyle === 'scenic' ? (
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
                  <>
                    <StatusCard
                      status={cycleStatus}
                      theme={currentTheme}
                      onOpenLogModal={() => handleOpenLogModalForDate(todayStr)}
                      onTogglePeriodToday={handleTogglePeriodToday}
                      onOpenCalendar={() => setActiveTab('calendar')}
                    />

                    {/* Interactive Wellness Intake Flow Banner */}
                    <div
                      onClick={() => setIsInteractiveWizardOpen(true)}
                      className="p-4 bg-gradient-to-r from-[#F4EBE6] to-[#FAF3F0] rounded-2xl border border-[#C86D51]/30 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#C86D51] flex items-center justify-center text-white text-xl">
                          🪷
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#2C2A29]">Interactive Wellness Intake Flow</h4>
                          <p className="text-xs text-[#7A7571]">Calming intro, branching logic, visual chips & zero typing</p>
                        </div>
                      </div>
                      <span className="text-[#C86D51] font-bold text-sm">→</span>
                    </div>

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

                    <SleekSymptomLogger
                      currentPhase={
                        cycleStatus.phase === 'period'
                          ? 'Period'
                          : cycleStatus.phase === 'fertile' || cycleStatus.phase === 'ovulation'
                          ? 'Follicular'
                          : 'Luteal'
                      }
                      todayLog={todayLog}
                      theme={currentTheme}
                      onToggleSymptom={handleToggleQuickSymptom}
                      onOpenLogModal={() => handleOpenLogModalForDate(todayStr)}
                    />
                  </>
                )}
              </motion.div>
            )}

            {activeTab === 'hub' && (
              <motion.div
                key="hub"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
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

            {activeTab === 'ayurveda' && (
              <motion.div
                key="ayurveda"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <AyurvedicHub />
              </motion.div>
            )}

            {activeTab === 'calendar' && (
              <motion.div
                key="calendar"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
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

            {activeTab === 'charts' && (
              <motion.div
                key="charts"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
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

            {activeTab === 'clinical' && (
              <motion.div
                key="clinical"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
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

            {activeTab === 'babyai' && (
              <motion.div
                key="babyai"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <FutureBabyGenerator onBack={() => setActiveTab('hub')} />
              </motion.div>
            )}

            {activeTab === 'pregnancy' && (
              <motion.div
                key="pregnancy"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <PregnancyModeView
                  settings={settings}
                  theme={currentTheme}
                  onUpdateDueDate={(newDue) => handleUpdateSettings({ pregnancyDueDate: newDue })}
                  onNavigateToBabyAI={() => setActiveTab('babyai')}
                />
              </motion.div>
            )}

            {activeTab === 'perimenopause' && (
              <motion.div
                key="perimenopause"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <PerimenopauseScreen
                  theme={currentTheme}
                  settings={settings}
                  onBack={() => setActiveTab('hub')}
                />
              </motion.div>
            )}

            {activeTab === 'aichat' && (
              <motion.div
                key="aichat"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
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

        {/* Floating Glassmorphic Navigation Dock */}
        {!(isLogModalOpen || isThemeModalOpen || isRemindersModalOpen || isSettingsModalOpen || isPinSetupOpen || isAppLocked) && (
          <NavDock
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab === 'ai' ? 'aichat' : (tab as any))}
          />
        )}
      </div>

      {/* Modals */}
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

      <ThemeModal
        isOpen={isThemeModalOpen}
        currentTheme={settings.theme}
        currentPet={settings.pet}
        themeConfig={currentTheme}
        onSelectTheme={(t) => handleUpdateSettings({ theme: t })}
        onSelectPet={(p) => handleUpdateSettings({ pet: p })}
        onClose={() => setIsThemeModalOpen(false)}
      />

      <RemindersModal
        isOpen={isRemindersModalOpen}
        settings={settings}
        theme={currentTheme}
        onSaveSettings={handleUpdateSettings}
        onClose={() => setIsRemindersModalOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        settings={settings}
        theme={currentTheme}
        onSaveSettings={handleUpdateSettings}
        onOpenPinSetup={() => setIsPinSetupOpen(true)}
        onClose={() => setIsSettingsModalOpen(false)}
      />

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

      {isAppLocked && (
        <PinLockModal
          isOpen={isAppLocked}
          isLockScreen={true}
          correctPin={settings.pinCode}
          onSuccess={() => setIsAppLocked(false)}
        />
      )}

      <InteractiveIntakeWizard
        isOpen={isInteractiveWizardOpen}
        onClose={() => setIsInteractiveWizardOpen(false)}
        onComplete={(data) => console.log('Intake completed:', data)}
      />
    </div>
  );
}

export default App;
