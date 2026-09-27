import React, { useState, useEffect } from 'react';
import { DayLog, FlowLevel, IntimacyType, CervicalMucusType, ThemeConfig } from '../types';
import { symptomList, moodList } from '../data';
import { SymptomIllustration } from './SymptomIllustration';
import { GraphicalFigureCard } from './GraphicalFigureCard';
import {
  X,
  Check,
  Heart,
  Droplets,
  Pill,
  Thermometer,
  Scale,
  Smile,
  Sparkles,
  Zap,
  Activity,
  Plus,
  Minus,
  Trash2,
  BookOpen,
  Layers,
} from 'lucide-react';
import { fireCelebrationConfetti } from '../utils/confetti';

interface DailyLogModalProps {
  isOpen: boolean;
  dateStr: string;
  initialLog?: DayLog;
  theme: ThemeConfig;
  tempUnit: 'F' | 'C';
  weightUnit: 'kg' | 'lbs';
  onClose: () => void;
  onSave: (dateStr: string, log: DayLog) => void;
  onDeleteLog: (dateStr: string) => void;
}

export const DailyLogModal: React.FC<DailyLogModalProps> = ({
  isOpen,
  dateStr,
  initialLog,
  theme,
  tempUnit,
  weightUnit,
  onClose,
  onSave,
  onDeleteLog,
}) => {
  const [isPeriod, setIsPeriod] = useState<boolean>(false);
  const [flow, setFlow] = useState<FlowLevel>('none');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [selectedIntimacy, setSelectedIntimacy] = useState<IntimacyType[]>(['none']);
  const [orgasms, setOrgasms] = useState<number>(0);
  const [pillTaken, setPillTaken] = useState<boolean>(false);
  const [waterGlasses, setWaterGlasses] = useState<number>(0);
  const [temperature, setTemperature] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [cervicalMucus, setCervicalMucus] = useState<CervicalMucusType | undefined>(undefined);
  const [notes, setNotes] = useState<string>('');
  const [symptomTab, setSymptomTab] = useState<'all' | 'body' | 'skin' | 'digestion'>('all');

  useEffect(() => {
    if (initialLog) {
      setIsPeriod(initialLog.isPeriod || false);
      setFlow(initialLog.flow || (initialLog.isPeriod ? 'medium' : 'none'));
      setSelectedSymptoms(initialLog.symptoms || []);
      setSelectedMoods(initialLog.moods || []);
      setSelectedIntimacy(initialLog.intimacy?.length ? initialLog.intimacy : ['none']);
      setOrgasms(initialLog.orgasms || 0);
      setPillTaken(initialLog.pillTaken || false);
      setWaterGlasses(initialLog.waterGlasses || 0);
      setTemperature(initialLog.temperature ? String(initialLog.temperature) : '');
      setWeight(initialLog.weight ? String(initialLog.weight) : '');
      setCervicalMucus(initialLog.cervicalMucus);
      setNotes(initialLog.notes || '');
    } else {
      setIsPeriod(false);
      setFlow('none');
      setSelectedSymptoms([]);
      setSelectedMoods([]);
      setSelectedIntimacy(['none']);
      setOrgasms(0);
      setPillTaken(false);
      setWaterGlasses(0);
      setTemperature('');
      setWeight('');
      setCervicalMucus(undefined);
      setNotes('');
    }
  }, [initialLog, dateStr, isOpen]);

  if (!isOpen) return null;

  const handleToggleSymptom = (id: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleToggleMood = (id: string) => {
    setSelectedMoods((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleToggleIntimacy = (type: IntimacyType) => {
    if (type === 'none') {
      setSelectedIntimacy(['none']);
      return;
    }
    setSelectedIntimacy((prev) => {
      const filtered = prev.filter((t) => t !== 'none');
      if (filtered.includes(type)) {
        const next = filtered.filter((t) => t !== type);
        return next.length === 0 ? ['none'] : next;
      }
      return [...filtered, type];
    });
  };

  const handleFlowSelect = (newFlow: FlowLevel) => {
    setFlow(newFlow);
    if (newFlow !== 'none') {
      setIsPeriod(true);
    } else {
      setIsPeriod(false);
    }
  };

  const handleSave = () => {
    const log: DayLog = {
      date: dateStr,
      isPeriod: isPeriod || flow !== 'none',
      flow,
      symptoms: selectedSymptoms,
      moods: selectedMoods,
      intimacy: selectedIntimacy,
      orgasms,
      pillTaken,
      waterGlasses,
      temperature: temperature ? parseFloat(temperature) : undefined,
      weight: weight ? parseFloat(weight) : undefined,
      cervicalMucus,
      notes: notes.trim(),
    };
    onSave(dateStr, log);
    fireCelebrationConfetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.6 },
    });
    onClose();
  };

  const filteredSymptoms = symptomList.filter((s) => {
    if (symptomTab === 'all') return true;
    return s.category === symptomTab;
  });

  const formattedHeaderDate = new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-[var(--z-modal-backdrop)] flex items-center justify-center p-3 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md max-h-[92vh] rounded-[32px] bg-[#FAF8F5] shadow-2xl flex flex-col overflow-hidden border border-stone-200 animate-in zoom-in-95 duration-200 relative z-[var(--z-modal-sheet)]">
        {/* Clean Alabaster Modal Header */}
        <div className="px-6 py-4 bg-white border-b border-stone-200 text-[#2C2A29] flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-stone-100 flex items-center justify-center text-[#C86D51]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#7A7571] block">
                Daily Activity & Log
              </span>
              <h3 className="text-base font-black font-['Fredoka'] tracking-wide text-[#2C2A29]">{formattedHeaderDate}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-[#2C2A29] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body with .modal-sheet-content */}
        <div className="p-5 modal-sheet-content space-y-5 text-sm">
          {/* Section 1: Period Flow */}
          <div className="space-y-2.5">
            <label className="text-xs font-black font-['Fredoka'] text-[#2C2A29] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-[#C86D51] fill-[#C86D51]" />
                Menstrual Flow Level
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F5EBE6] text-[#C86D51] capitalize border border-[#E8ACA0]">
                {flow}
              </span>
            </label>
            <div className="grid grid-cols-5 gap-2">
              {(['none', 'spotting', 'light', 'medium', 'heavy'] as FlowLevel[]).map((f) => {
                const isSelected = flow === f;
                return (
                  <button
                    key={f}
                    onClick={() => handleFlowSelect(f)}
                    className={`py-3.5 px-1 rounded-2xl text-[11px] font-bold font-['Fredoka'] capitalize flex flex-col items-center gap-2 transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#C86D51] text-white border-[#C86D51] shadow-md scale-105'
                        : 'bg-white text-[#7A7571] border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="h-6 flex items-center justify-center">
                      {f === 'none' ? <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-400" /> :
                       f === 'spotting' ? <div className="w-2.5 h-2.5 rounded-full bg-current" /> :
                       f === 'light' ? <Droplets className="w-4.5 h-4.5 fill-current" /> :
                       f === 'medium' ? <div className="flex -space-x-1.5"><Droplets className="w-4.5 h-4.5 fill-current" /><Droplets className="w-4.5 h-4.5 fill-current" /></div> :
                       <div className="flex -space-x-2"><Droplets className="w-4.5 h-4.5 fill-current" /><Droplets className="w-4.5 h-4.5 fill-current" /><Droplets className="w-4.5 h-4.5 fill-current" /></div>}
                    </div>
                    <span>{f}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Symptoms */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black font-['Fredoka'] text-[#2C2A29] flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#C86D51]" />
                Symptoms ({selectedSymptoms.length} Selected)
              </label>

              <div className="flex items-center gap-1 text-[10px] font-bold">
                {(['all', 'body', 'skin', 'digestion'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSymptomTab(tab)}
                    className={`px-2.5 py-1 rounded-lg capitalize cursor-pointer transition-colors ${
                      symptomTab === tab ? 'bg-[#C86D51] text-white' : 'bg-stone-200/60 text-[#7A7571] hover:bg-stone-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto p-1 bg-stone-50/50 rounded-3xl border border-stone-200">
              {filteredSymptoms.map((sym) => {
                const isSelected = selectedSymptoms.includes(sym.id);
                return (
                  <GraphicalFigureCard
                    key={sym.id}
                    id={sym.id}
                    title={sym.name}
                    isSelected={isSelected}
                    onClick={() => handleToggleSymptom(sym.id)}
                  />
                );
              })}
            </div>
          </div>

          {/* Section 3: Moods */}
          <div className="space-y-2.5">
            <label className="text-xs font-black font-['Fredoka'] text-[#2C2A29] flex items-center gap-1.5">
              <Smile className="w-4 h-4 text-[#7B6B8D]" />
              Emotional Spectrum ({selectedMoods.length} Selected)
            </label>
            <div className="grid grid-cols-2 gap-3 max-h-56 overflow-y-auto p-1 bg-stone-50/50 rounded-3xl border border-stone-200">
              {moodList.map((m) => {
                const isSelected = selectedMoods.includes(m.id);
                return (
                  <GraphicalFigureCard
                    key={m.id}
                    id={m.id}
                    title={m.name}
                    isSelected={isSelected}
                    onClick={() => handleToggleMood(m.id)}
                  />
                );
              })}
            </div>
          </div>

          {/* Section 4: Intimacy & Orgasms */}
          <div className="space-y-2.5">
            <label className="text-xs font-black font-['Fredoka'] text-[#2C2A29] flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-[#C86D51] fill-[#C86D51]" />
              Intimacy & Activity Tracking
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'none', label: 'None' },
                { id: 'protected', label: 'Protected' },
                { id: 'unprotected', label: 'Unprotected' },
                { id: 'high_desire', label: 'High Desire' },
              ].map((item) => {
                const isSelected = selectedIntimacy.includes(item.id as IntimacyType);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleToggleIntimacy(item.id as IntimacyType)}
                    className={`p-2.5 rounded-2xl text-xs font-bold font-['Fredoka'] flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#C86D51] text-white border-[#C86D51] shadow-xs'
                        : 'bg-white text-[#7A7571] border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white border border-stone-200">
              <span className="text-xs font-bold text-[#7A7571]">Orgasm Frequency</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setOrgasms((prev) => Math.max(0, prev - 1))}
                  className="w-7 h-7 rounded-xl bg-stone-100 border border-stone-300 text-[#C86D51] flex items-center justify-center font-bold shadow-xs cursor-pointer"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center font-black font-['Fredoka'] text-sm text-[#2C2A29]">{orgasms}</span>
                <button
                  onClick={() => setOrgasms((prev) => prev + 1)}
                  className="w-7 h-7 rounded-xl bg-stone-100 border border-stone-300 text-[#C86D51] flex items-center justify-center font-bold shadow-xs cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Section 5: Body Metrics */}
          <div className="space-y-2.5">
            <label className="text-xs font-black font-['Fredoka'] text-[#2C2A29] flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#5B8A72]" />
              Vital Signs & Metrics
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-white border border-stone-200 space-y-1">
                <label className="text-[11px] font-bold text-[#7A7571] flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-600" /> Basal Temp (°{tempUnit})
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder={tempUnit === 'F' ? '98.2' : '36.8'}
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 font-bold font-['Fredoka'] text-sm focus:outline-[#C86D51] text-[#2C2A29]"
                />
              </div>

              <div className="p-3 rounded-2xl bg-white border border-stone-200 space-y-1">
                <label className="text-[11px] font-bold text-[#7A7571] flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5 text-[#C86D51]" /> Weight ({weightUnit})
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder={weightUnit === 'kg' ? '58.0' : '128.0'}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 font-bold font-['Fredoka'] text-sm focus:outline-[#C86D51] text-[#2C2A29]"
                />
              </div>
            </div>
          </div>

          {/* Section 6: Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-black font-['Fredoka'] text-[#2C2A29] flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#C86D51]" />
              Clinical Notes & Reflections
            </label>
            <textarea
              rows={3}
              placeholder="Record any specific clinical observations or symptom notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3.5 rounded-2xl border border-stone-200 bg-white font-medium text-xs text-[#2C2A29] focus:outline-[#C86D51] placeholder:text-stone-400 shadow-inner"
            />
          </div>
        </div>

        {/* Modal Sticky Footer (Guaranteed above navigation dock & safe areas) */}
        <div className="modal-sticky-footer flex items-center justify-between shrink-0">
          {initialLog ? (
            <button
              onClick={() => {
                onDeleteLog(dateStr);
                onClose();
              }}
              className="px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear Log
            </button>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl text-xs font-bold text-[#7A7571] hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 rounded-2xl bg-[#C86D51] hover:bg-[#B05B41] text-white text-xs font-black font-['Fredoka'] flex items-center gap-2 shadow-md shadow-rose-900/10 cursor-pointer transition-all active:scale-[0.98]"
            >
              <Check className="w-4 h-4 stroke-[3]" /> Save Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
