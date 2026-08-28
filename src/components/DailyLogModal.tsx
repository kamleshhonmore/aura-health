import React, { useState, useEffect } from 'react';
import { DayLog, FlowLevel, IntimacyType, CervicalMucusType, ThemeConfig } from '../types';
import { symptomList, moodList } from '../data';
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
} from 'lucide-react';
import confetti from 'canvas-confetti';

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
    confetti({
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
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg max-h-[92vh] rounded-3xl bg-white shadow-2xl flex flex-col overflow-hidden border border-pink-100 animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#FF758C] to-[#FF7EB3] text-white flex items-center justify-between shrink-0">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-90">
              Daily Diary Log
            </span>
            <h3 className="text-base font-black font-['Fredoka']">{formattedHeaderDate}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-sm">
          {/* Section 1: Period Flow */}
          <div className="space-y-2">
            <label className="text-xs font-black font-['Fredoka'] text-[#4A2E35] flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-[#FF5376] fill-[#FF5376]" />
              Menstrual Period Flow
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {(['none', 'spotting', 'light', 'medium', 'heavy'] as FlowLevel[]).map((f) => {
                const isSelected = flow === f;
                return (
                  <button
                    key={f}
                    onClick={() => handleFlowSelect(f)}
                    className={`py-2 px-1 rounded-2xl text-xs font-bold font-['Fredoka'] capitalize flex flex-col items-center gap-1 transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#FF5376] text-white border-[#FF5376] shadow-sm scale-105'
                        : 'bg-[#FFF9FA] text-[#875C66] border-pink-100 hover:border-pink-300'
                    }`}
                  >
                    <span className="text-sm">
                      {f === 'none' ? '⚪' : f === 'spotting' ? '💧' : f === 'light' ? '🩸' : f === 'medium' ? '🩸🩸' : '🩸🩸🩸'}
                    </span>
                    <span className="text-[10px]">{f}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Symptoms */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black font-['Fredoka'] text-[#4A2E35] flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#FFB300]" />
                Symptoms ({selectedSymptoms.length})
              </label>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 text-[10px] font-bold">
                {(['all', 'body', 'skin', 'digestion'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSymptomTab(tab)}
                    className={`px-2 py-0.5 rounded-lg capitalize cursor-pointer transition-colors ${
                      symptomTab === tab ? 'bg-[#FF6B8B] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 border border-pink-50 rounded-2xl bg-[#FFFDFE]">
              {filteredSymptoms.map((sym) => {
                const isSelected = selectedSymptoms.includes(sym.id);
                return (
                  <button
                    key={sym.id}
                    onClick={() => handleToggleSymptom(sym.id)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold font-['Fredoka'] flex items-center gap-1.5 transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#FF6B8B] text-white border-[#FF6B8B] shadow-xs'
                        : 'bg-white text-[#5C454B] border-pink-100 hover:border-pink-300'
                    }`}
                  >
                    <span>{sym.emoji}</span>
                    <span>{sym.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Moods */}
          <div className="space-y-2">
            <label className="text-xs font-black font-['Fredoka'] text-[#4A2E35] flex items-center gap-1.5">
              <Smile className="w-4 h-4 text-[#AB47BC]" />
              Moods & Emotions ({selectedMoods.length})
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1 border border-pink-50 rounded-2xl bg-[#FFFDFE]">
              {moodList.map((m) => {
                const isSelected = selectedMoods.includes(m.id);
                return (
                  <button
                    key={m.id}
                    onClick={() => handleToggleMood(m.id)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold font-['Fredoka'] flex items-center gap-1.5 transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#AB47BC] text-white border-[#AB47BC] shadow-xs scale-105'
                        : 'bg-white text-[#5C454B] border-purple-100 hover:border-purple-300'
                    }`}
                  >
                    <span>{m.emoji}</span>
                    <span>{m.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Intimacy & Sex */}
          <div className="space-y-2">
            <label className="text-xs font-black font-['Fredoka'] text-[#4A2E35] flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-[#E91E63] fill-[#E91E63]" />
              Intimacy & Sexual Activity
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                { id: 'none', label: 'None', emoji: '🚫' },
                { id: 'protected', label: 'Protected', emoji: '🛡️' },
                { id: 'unprotected', label: 'Unprotected', emoji: '❤️' },
                { id: 'high_desire', label: 'High Desire', emoji: '🔥' },
              ].map((item) => {
                const isSelected = selectedIntimacy.includes(item.id as IntimacyType);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleToggleIntimacy(item.id as IntimacyType)}
                    className={`p-2 rounded-2xl text-xs font-bold font-['Fredoka'] flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#E91E63] text-white border-[#E91E63] shadow-xs'
                        : 'bg-[#FFF9FA] text-[#875C66] border-pink-100 hover:border-pink-300'
                    }`}
                  >
                    <span>{item.emoji}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Orgasm counter */}
            <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-[#FFF9FA] border border-pink-100">
              <span className="text-xs font-bold text-[#875C66] flex items-center gap-1">
                <span>✨</span> Orgasms
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOrgasms((prev) => Math.max(0, prev - 1))}
                  className="w-7 h-7 rounded-xl bg-white border border-pink-200 text-[#E91E63] flex items-center justify-center font-bold"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center font-black font-['Fredoka'] text-sm">{orgasms}</span>
                <button
                  onClick={() => setOrgasms((prev) => prev + 1)}
                  className="w-7 h-7 rounded-xl bg-white border border-pink-200 text-[#E91E63] flex items-center justify-center font-bold"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Section 5: Body Stats (BBT, Weight, Cervical Mucus) */}
          <div className="space-y-2">
            <label className="text-xs font-black font-['Fredoka'] text-[#4A2E35] flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#26A69A]" />
              Body Temperature & Weight
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Temperature */}
              <div className="p-3 rounded-2xl bg-[#FFF9FA] border border-pink-100 space-y-1">
                <label className="text-[11px] font-bold text-[#875C66] flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-[#FFB300]" /> Basal Temp (°{tempUnit})
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder={tempUnit === 'F' ? '98.2' : '36.8'}
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-pink-200 bg-white font-bold font-['Fredoka'] text-sm focus:outline-pink-400"
                />
              </div>

              {/* Weight */}
              <div className="p-3 rounded-2xl bg-[#FFF9FA] border border-pink-100 space-y-1">
                <label className="text-[11px] font-bold text-[#875C66] flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5 text-[#FF708F]" /> Weight ({weightUnit})
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder={weightUnit === 'kg' ? '58.0' : '128.0'}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-pink-200 bg-white font-bold font-['Fredoka'] text-sm focus:outline-pink-400"
                />
              </div>
            </div>

            {/* Cervical Mucus */}
            <div className="space-y-1 pt-1">
              <label className="text-[11px] font-bold text-[#875C66]">Cervical Mucus</label>
              <div className="grid grid-cols-5 gap-1">
                {(['dry', 'sticky', 'creamy', 'egg_white', 'watery'] as CervicalMucusType[]).map((muc) => {
                  const isSel = cervicalMucus === muc;
                  return (
                    <button
                      key={muc}
                      onClick={() => setCervicalMucus(isSel ? undefined : muc)}
                      className={`py-1.5 px-1 rounded-xl text-[10px] font-bold capitalize transition-colors cursor-pointer border ${
                        isSel
                          ? 'bg-[#26A69A] text-white border-[#26A69A]'
                          : 'bg-[#FFF9FA] text-[#875C66] border-pink-100 hover:border-teal-300'
                      }`}
                    >
                      {muc.replace('_', ' ')}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 6: Contraceptive Pill & Water */}
          <div className="grid grid-cols-2 gap-3">
            {/* Pill Toggle */}
            <div
              onClick={() => setPillTaken(!pillTaken)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                pillTaken ? 'bg-[#F3E5F5] border-[#AB47BC] text-[#6A1B9A]' : 'bg-[#FFF9FA] border-pink-100 text-[#875C66]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-[#AB47BC]" />
                <span className="text-xs font-black font-['Fredoka']">Pill Taken</span>
              </div>
              <div className={`w-5 h-5 rounded-lg flex items-center justify-center border ${pillTaken ? 'bg-[#AB47BC] text-white border-[#AB47BC]' : 'bg-white border-gray-300'}`}>
                {pillTaken && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>

            {/* Water Glasses */}
            <div className="p-3 rounded-2xl bg-[#E1F5FE] border border-[#B3E5FC] flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-[#0288D1]" />
                <span className="text-xs font-black font-['Fredoka'] text-[#0277BD]">
                  {waterGlasses * 250} ml
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setWaterGlasses((p) => Math.max(0, p - 1))}
                  className="w-6 h-6 rounded-lg bg-white text-[#0288D1] flex items-center justify-center font-bold"
                >
                  -
                </button>
                <button
                  onClick={() => setWaterGlasses((p) => Math.min(12, p + 1))}
                  className="w-6 h-6 rounded-lg bg-white text-[#0288D1] flex items-center justify-center font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Section 7: Secret Diary Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-black font-['Fredoka'] text-[#4A2E35] flex items-center gap-1.5">
              <span>📖</span> Secret Diary Notes
            </label>
            <textarea
              rows={3}
              placeholder="How are you feeling today? Write your personal notes, reflections or doctor notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 rounded-2xl border border-pink-200 bg-[#FFFDFE] font-medium text-xs text-[#4A2E35] focus:outline-pink-400 placeholder:text-[#B59199]"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-50 border-t border-pink-100 flex items-center justify-between shrink-0">
          {initialLog ? (
            <button
              onClick={() => {
                onDeleteLog(dateStr);
                onClose();
              }}
              className="px-3 py-2 rounded-xl text-xs font-bold text-[#E53935] hover:bg-red-50 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear Log
            </button>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-2xl text-xs font-bold text-[#875C66] hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-2xl bg-gradient-to-r from-[#FF758C] to-[#FF7EB3] hover:from-[#FF6580] hover:to-[#FF6F9A] text-white text-xs font-black font-['Fredoka'] flex items-center gap-1.5 shadow-md shadow-pink-200 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" /> Save Diary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
