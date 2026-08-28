import React, { useState } from 'react';
import { PredictiveDay, TrendPoint } from '../types';
import { samplePredictiveDays, sampleTrends } from '../data';
import { Calendar, TrendingUp, Sparkles, Activity, CheckCircle2, ChevronRight } from 'lucide-react';

export const InsightsScreen: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>('OCT');
  const [selectedDay, setSelectedDay] = useState<PredictiveDay | null>(
    samplePredictiveDays.find((d) => d.type === 'TODAY') || samplePredictiveDays[13]
  );

  const months = ['OCT', 'NOV', 'DEC', 'JAN'];
  const filteredDays = samplePredictiveDays.filter((d) => d.monthName === selectedMonth);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Insights & Trends</h1>
          <p className="text-xs text-[#7E8799]">90-Day Predictive Forecasting & Biomarkers</p>
        </div>

        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#9CAF88]/15 border border-[#9CAF88]/30 text-[#9CAF88] text-xs font-semibold">
          <Activity className="w-3.5 h-3.5" />
          94% Regularity
        </div>
      </div>

      {/* Month Switcher Tabs */}
      <div className="grid grid-cols-4 gap-2">
        {months.map((m) => (
          <button
            key={m}
            onClick={() => setSelectedMonth(m)}
            className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              selectedMonth === m
                ? 'bg-[#E29587] text-[#111318] border-[#E29587] shadow-md shadow-[#E29587]/20 font-bold'
                : 'bg-[#181B24] text-[#8E97A8] border-white/8 hover:border-white/15'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* 90-Day Predictive Calendar Grid Card */}
      <div className="p-5 bg-[#181B24] border border-white/8 rounded-3xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between text-xs font-semibold text-white">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#E29587]" />
            <span>October 2026 Cycle Map</span>
          </div>
          <span className="text-[11px] text-[#7E8799]">28-Day Pattern</span>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-[#586072]">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
            <div key={idx} className="py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {filteredDays.map((day) => {
            const isSelected = selectedDay?.dateString === day.dateString;
            let bgClass = 'bg-[#12141C] text-[#8E97A8] border-white/5';
            let dotColor = '';

            if (day.type === 'PERIOD_LOGGED') {
              bgClass = 'bg-[#E29587]/20 text-[#F2ADA0] border-[#E29587]/40';
              dotColor = 'bg-[#E29587]';
            } else if (day.type === 'PERIOD_PREDICTED') {
              bgClass = 'bg-[#E29587]/10 text-[#F2ADA0] border-dashed border-[#E29587]/30';
              dotColor = 'bg-[#E29587]/70';
            } else if (day.type === 'OVULATION_PEAK') {
              bgClass = 'bg-[#9CAF88]/20 text-[#BED3A9] border-[#9CAF88]/40';
              dotColor = 'bg-[#9CAF88]';
            } else if (day.type === 'FERTILE_WINDOW') {
              bgClass = 'bg-[#E5C388]/15 text-[#F5DBA8] border-[#E5C388]/30';
              dotColor = 'bg-[#E5C388]';
            } else if (day.type === 'TODAY') {
              bgClass = 'bg-[#202430] text-white border-white/30 ring-1 ring-[#9CAF88]';
            }

            if (isSelected) {
              bgClass += ' ring-2 ring-[#E29587] scale-105 z-10';
            }

            return (
              <button
                key={day.dateString}
                onClick={() => setSelectedDay(day)}
                className={`h-11 rounded-xl border flex flex-col items-center justify-center relative transition-all cursor-pointer ${bgClass}`}
              >
                <span className="text-xs font-semibold leading-none">{day.dayOfMonth}</span>
                {dotColor && <span className={`w-1.5 h-1.5 rounded-full ${dotColor} mt-1`} />}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5 text-[10px] text-[#8E97A8]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#E29587]" />
            <span>Period</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#E5C388]" />
            <span>Fertile</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#9CAF88]" />
            <span>Ovulation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#586072]" />
            <span>Follicular/Luteal</span>
          </div>
        </div>
      </div>

      {/* Selected Day Info Card */}
      {selectedDay && (
        <div className="p-4 bg-[#181B24] border border-white/8 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E29587]/15 text-[#E29587] font-bold text-xs flex items-center justify-center border border-[#E29587]/30">
              D{selectedDay.cycleDay}
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                {selectedDay.dateString} • Cycle Day {selectedDay.cycleDay}
              </div>
              <div className="text-[11px] text-[#8E97A8] mt-0.5">
                {selectedDay.symptomNotes || 'Normal follicular balance. No high severity symptoms recorded.'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Historical Correlation Curve Chart */}
      <div className="p-5 bg-[#181B24] border border-white/8 rounded-3xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#E5C388]" />
            <h3 className="text-sm font-semibold text-white">Energy vs Cramp Severity Curve</h3>
          </div>
        </div>

        {/* SVG Curve Chart */}
        <div className="relative w-full h-36 pt-2">
          <svg viewBox="0 0 320 120" className="w-full h-full overflow-visible">
            {/* Grid lines */}
            <line x1="0" y1="30" x2="320" y2="30" stroke="#202430" strokeWidth="1" strokeDasharray="3,3" />
            <line x1="0" y1="60" x2="320" y2="60" stroke="#202430" strokeWidth="1" strokeDasharray="3,3" />
            <line x1="0" y1="90" x2="320" y2="90" stroke="#202430" strokeWidth="1" strokeDasharray="3,3" />

            {/* Energy Curve (Green / Gold) */}
            <path
              d="M 10 90 Q 50 70, 90 20 T 170 15 T 250 45 T 310 85"
              fill="none"
              stroke="#9CAF88"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Cramps Curve (Blush Rose) */}
            <path
              d="M 10 20 Q 50 60, 90 105 T 170 110 T 250 80 T 310 25"
              fill="none"
              stroke="#E29587"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Data points */}
            <circle cx="10" cy="90" r="4" fill="#9CAF88" />
            <circle cx="90" cy="20" r="4" fill="#9CAF88" />
            <circle cx="170" cy="15" r="4" fill="#9CAF88" />
            <circle cx="310" cy="85" r="4" fill="#9CAF88" />

            <circle cx="10" cy="20" r="4" fill="#E29587" />
            <circle cx="90" cy="105" r="4" fill="#E29587" />
            <circle cx="310" cy="25" r="4" fill="#E29587" />
          </svg>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 text-xs font-semibold">
          <div className="flex items-center gap-2 text-[#9CAF88]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#9CAF88]" />
            <span>Energy Index</span>
          </div>
          <div className="flex items-center gap-2 text-[#E29587]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E29587]" />
            <span>Cramp Intensity</span>
          </div>
        </div>
      </div>

      {/* Clinical Cycle Metrics Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3.5 bg-[#181B24] border border-white/8 rounded-2xl space-y-1">
          <span className="text-[10px] text-[#7E8799] uppercase font-semibold">Avg Cycle</span>
          <div className="text-base font-bold text-white">28 Days</div>
          <div className="text-[10px] text-[#9CAF88]">±2d variation</div>
        </div>

        <div className="p-3.5 bg-[#181B24] border border-white/8 rounded-2xl space-y-1">
          <span className="text-[10px] text-[#7E8799] uppercase font-semibold">Avg Period</span>
          <div className="text-base font-bold text-white">5 Days</div>
          <div className="text-[10px] text-[#9CAF88]">Normal duration</div>
        </div>

        <div className="p-3.5 bg-[#181B24] border border-white/8 rounded-2xl space-y-1">
          <span className="text-[10px] text-[#7E8799] uppercase font-semibold">Ovulation</span>
          <div className="text-base font-bold text-white">Day 14</div>
          <div className="text-[10px] text-[#E5C388]">High confidence</div>
        </div>
      </div>
    </div>
  );
};
