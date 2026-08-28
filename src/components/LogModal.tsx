import React, { useState } from 'react';
import { DailyLogData } from '../types';
import { X, Check, Droplets, Zap, Smile, Sparkles, Moon, Thermometer, FileText } from 'lucide-react';

interface LogModalProps {
  initialData: DailyLogData;
  onClose: () => void;
  onSave: (data: DailyLogData) => void;
}

export const LogModal: React.FC<LogModalProps> = ({ initialData, onClose, onSave }) => {
  const [log, setLog] = useState<DailyLogData>(initialData);

  const flows = ['None', 'Spotting', 'Light', 'Medium', 'Heavy'];
  const moods = ['Calm', 'Joyful', 'Anxious', 'Irritable', 'Fatigued', 'Brain Fog'];
  const skinStates = ['Clear & Radiant', 'Mild Oiliness', 'Jawline Hormonal Breakouts', 'Dry/Sensitive'];
  const cervicalFluids = ['Dry / Sticky', 'Creamy / Lotion', 'Egg White (Highly Fertile)', 'Watery'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(log);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#181B24] border border-white/10 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-white/8 flex items-center justify-between sticky top-0 bg-[#181B24]/95 backdrop-blur-md z-10">
          <div>
            <h2 className="text-base font-bold text-white">Log Daily Physiological Markers</h2>
            <p className="text-xs text-[#7E8799]">Day 8 • Follicular Phase Entry</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#202430] hover:bg-[#2A3040] text-[#7E8799] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Menstrual Flow */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-[#C4C9D6] mb-2">
              <Droplets className="w-3.5 h-3.5 text-[#E29587]" />
              Menstrual Flow Intensity
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {flows.map((f) => (
                <button
                  type="button"
                  key={f}
                  onClick={() => setLog({ ...log, flow: f })}
                  className={`py-2 text-[11px] rounded-xl font-medium border transition-all ${
                    log.flow === f
                      ? 'bg-[#E29587] text-[#111318] border-[#E29587] font-bold shadow-sm'
                      : 'bg-[#12141C] text-[#8E97A8] border-white/5 hover:border-white/15'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Cramp Severity Slider */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <label className="flex items-center gap-1.5 font-semibold text-[#C4C9D6]">
                <Zap className="w-3.5 h-3.5 text-[#E5C388]" />
                Pelvic Cramp Severity
              </label>
              <span className="font-bold text-[#E5C388]">{log.crampsSeverity} / 10</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={log.crampsSeverity}
              onChange={(e) => setLog({ ...log, crampsSeverity: parseInt(e.target.value) })}
              className="w-full h-2 bg-[#202430] rounded-lg appearance-none cursor-pointer accent-[#E5C388]"
            />
          </div>

          {/* Energy Level Slider */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <label className="flex items-center gap-1.5 font-semibold text-[#C4C9D6]">
                <Zap className="w-3.5 h-3.5 text-[#9CAF88]" />
                Vitality & Physical Energy
              </label>
              <span className="font-bold text-[#9CAF88]">{log.energyLevel} / 10</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={log.energyLevel}
              onChange={(e) => setLog({ ...log, energyLevel: parseInt(e.target.value) })}
              className="w-full h-2 bg-[#202430] rounded-lg appearance-none cursor-pointer accent-[#9CAF88]"
            />
          </div>

          {/* Mood Selector */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-[#C4C9D6] mb-2">
              <Smile className="w-3.5 h-3.5 text-[#E5C388]" />
              Dominant Emotional State
            </label>
            <div className="grid grid-cols-3 gap-2">
              {moods.map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setLog({ ...log, mood: m })}
                  className={`py-2 px-2 text-xs rounded-xl font-medium border transition-all text-center ${
                    log.mood === m
                      ? 'bg-[#E5C388] text-[#111318] border-[#E5C388] font-bold shadow-sm'
                      : 'bg-[#12141C] text-[#8E97A8] border-white/5 hover:border-white/15'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Skin / Acne Condition */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-[#C4C9D6] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#F2ADA0]" />
              Dermatological & Skin Clarity
            </label>
            <div className="space-y-1.5">
              {skinStates.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setLog({ ...log, skinCondition: s })}
                  className={`w-full py-2 px-3 text-xs rounded-xl font-medium border text-left flex items-center justify-between transition-all ${
                    log.skinCondition === s
                      ? 'bg-[#E29587]/15 text-[#F2ADA0] border-[#E29587] font-semibold'
                      : 'bg-[#12141C] text-[#8E97A8] border-white/5 hover:border-white/15'
                  }`}
                >
                  <span>{s}</span>
                  {log.skinCondition === s && <Check className="w-3.5 h-3.5 text-[#E29587]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Cervical Fluid & BBT */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-[#C4C9D6] mb-1.5">
                <Thermometer className="w-3.5 h-3.5 text-[#9CAF88]" />
                Basal Body Temp (°F)
              </label>
              <input
                type="number"
                step="0.1"
                value={log.basalBodyTemp}
                onChange={(e) => setLog({ ...log, basalBodyTemp: parseFloat(e.target.value) || 97.8 })}
                className="w-full py-2 px-3 bg-[#12141C] border border-white/8 rounded-xl text-xs text-white focus:outline-none focus:border-[#9CAF88]"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-[#C4C9D6] mb-1.5">
                <Moon className="w-3.5 h-3.5 text-[#E5C388]" />
                Sleep Duration (hrs)
              </label>
              <input
                type="number"
                step="0.5"
                value={log.sleepHours}
                onChange={(e) => setLog({ ...log, sleepHours: parseFloat(e.target.value) || 8 })}
                className="w-full py-2 px-3 bg-[#12141C] border border-white/8 rounded-xl text-xs text-white focus:outline-none focus:border-[#E5C388]"
              />
            </div>
          </div>

          {/* Cervical Mucus Selector */}
          <div>
            <label className="text-[11px] font-semibold text-[#C4C9D6] mb-1.5 block">
              Cervical Mucus / Fertile Biomarker
            </label>
            <select
              value={log.cervicalMucus}
              onChange={(e) => setLog({ ...log, cervicalMucus: e.target.value })}
              className="w-full py-2.5 px-3 bg-[#12141C] border border-white/8 rounded-xl text-xs text-white focus:outline-none focus:border-[#E29587]"
            >
              {cervicalFluids.map((fluid) => (
                <option key={fluid} value={fluid} className="bg-[#181B24] text-white">
                  {fluid}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-[#C4C9D6] mb-1.5">
              <FileText className="w-3.5 h-3.5 text-[#7E8799]" />
              Personal Daily Reflections
            </label>
            <textarea
              rows={2}
              value={log.notes}
              onChange={(e) => setLog({ ...log, notes: e.target.value })}
              placeholder="Add personal notes, dietary triggers, or lifestyle observations..."
              className="w-full p-3 bg-[#12141C] border border-white/8 rounded-xl text-xs text-white placeholder-[#586072] focus:outline-none focus:border-white/20 resize-none"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#E29587] hover:bg-[#EAA194] text-[#111318] font-bold text-sm transition-all shadow-lg shadow-[#E29587]/20 cursor-pointer flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              Save Physiological Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
