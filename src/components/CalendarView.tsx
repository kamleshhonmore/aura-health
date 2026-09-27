import React, { useState } from 'react';
import { ThemeConfig, DayLog } from '../types';
import { generateMonthCalendar, formatDateStr } from '../utils/cycleCalculations';
import {
  ChevronLeft,
  ChevronRight,
  Droplets,
  Sparkles,
  Edit3,
} from 'lucide-react';
import { motion } from 'motion/react';

interface CalendarViewProps {
  theme: ThemeConfig;
  lastPeriodStart: string;
  cycleLength: number;
  periodLength: number;
  lutealLength: number;
  logs: Record<string, DayLog>;
  onSelectDate: (dateStr: string) => void;
  onOpenLogModalForDate: (dateStr: string) => void;
  onTogglePeriodOnDate: (dateStr: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  theme,
  lastPeriodStart,
  cycleLength,
  periodLength,
  lutealLength,
  logs,
  onSelectDate,
  onOpenLogModalForDate,
  onTogglePeriodOnDate,
}) => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-11
  const [selectedDateStr, setSelectedDateStr] = useState<string>(formatDateStr(today));

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleToday = () => {
    const now = new Date();
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    setSelectedDateStr(formatDateStr(now));
  };

  const calendarDays = generateMonthCalendar(
    viewYear,
    viewMonth,
    lastPeriodStart,
    cycleLength,
    periodLength,
    lutealLength,
    logs
  );

  const selectedDayInfo = calendarDays.find((d) => d.dateStr === selectedDateStr);
  const selectedLog = logs[selectedDateStr];

  return (
    <div className="space-y-4 font-['Nunito']">
      {/* Calendar Grid Card */}
      <div
        className={`p-5 rounded-[32px] ${theme.bgCard} border-2 ${theme.borderCard} shadow-xl transition-all space-y-4`}
      >
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <h2 className={`text-xl font-black font-['Fredoka'] ${theme.textPrimary}`}>
              {monthNames[viewMonth]} {viewYear}
            </h2>
            <button
              onClick={handleToday}
              className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-rose-100 text-rose-900 border border-rose-200 cursor-pointer hover:bg-rose-200 transition-colors"
            >
              Today
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handlePrevMonth} className="p-2 rounded-2xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={handleNextMonth} className="p-2 rounded-2xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Legend with High Contrast Ratios (>4.5:1) */}
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-gray-50 rounded-2xl border border-gray-200 gap-2">
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#FF5376]" /><span className="text-[10px] font-extrabold uppercase text-gray-800">Period</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /><span className="text-[10px] font-extrabold uppercase text-gray-800">Fertile</span></div>
          <div className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-amber-600" /><span className="text-[10px] font-extrabold uppercase text-gray-800">Ovulation</span></div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {calendarDays.map((day) => {
            const isSelected = day.dateStr === selectedDateStr;
            const isPeriod = day.log?.isPeriod;
            const isPredictedPeriod = !isPeriod && day.dayType === 'predicted_period';
            const isOvulation = day.dayType === 'ovulation';
            const isFertile = day.dayType === 'fertile';

            let cellBg = 'bg-white text-gray-900';
            let cellBorder = 'border-transparent';

            if (isPeriod) cellBg = 'bg-rose-500 text-white shadow-sm';
            else if (isPredictedPeriod) cellBg = 'bg-rose-50 text-rose-800 border-dashed border-rose-300';
            else if (isOvulation) cellBg = 'bg-amber-100 text-amber-950 border-amber-300';
            else if (isFertile) cellBg = 'bg-emerald-100 text-emerald-950 border-emerald-200';

            if (!day.isCurrentMonth) cellBg = 'opacity-25 bg-transparent text-gray-500';

            return (
              <button
                key={day.dateStr}
                onClick={() => { setSelectedDateStr(day.dateStr); onSelectDate(day.dateStr); }}
                className={`h-14 rounded-2xl flex flex-col items-center justify-between p-2 border-2 transition-all cursor-pointer ${cellBg} ${cellBorder} ${isSelected ? 'ring-4 ring-rose-500/30 border-rose-500 scale-105 z-10' : ''}`}
              >
                <div className="w-full flex items-center justify-between font-black text-xs">
                  <span className={day.isToday ? 'w-5 h-5 flex items-center justify-center rounded-full bg-rose-950 text-white font-extrabold' : ''}>{day.dayOfMonth}</span>
                  {isOvulation && <Sparkles className="w-3 h-3 text-amber-600" />}
                </div>
                <div className="h-2 flex gap-0.5">
                  {day.log?.pillTaken && <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />}
                  {day.log?.intimacy && day.log.intimacy[0] !== 'none' && <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Info Card - Dedicated Flex Container Header preventing overlap */}
      {selectedDayInfo && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-5 rounded-[32px] ${theme.bgCard} border-2 ${theme.borderCard} shadow-lg space-y-4`}>
          <div className="flex items-start justify-between gap-3 pb-2 border-b border-rose-100">
            <div className="flex-1 min-w-0 pr-1">
              <h3 className="text-lg font-black text-rose-950 leading-tight truncate">
                {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </h3>
              <span className="inline-block px-2.5 py-0.5 mt-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-100 text-rose-950 border border-rose-200 shrink-0">
                Cycle Day {selectedDayInfo.cycleDay} • {selectedDayInfo.conceptionChance} Chance
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onTogglePeriodOnDate(selectedDateStr)}
                title="Toggle Period Flow"
                className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm cursor-pointer transition-all ${selectedLog?.isPeriod ? 'bg-rose-500 text-white' : 'bg-white border border-rose-200 text-rose-600 hover:bg-rose-50'}`}
              >
                <Droplets className="w-5 h-5 fill-current" />
              </button>
              <button
                onClick={() => onOpenLogModalForDate(selectedDateStr)}
                title="Edit Day Log"
                className="w-11 h-11 rounded-2xl bg-rose-900 text-white shadow-sm flex items-center justify-center cursor-pointer hover:bg-rose-950 transition-colors"
              >
                <Edit3 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
               <label className="text-[10px] font-black text-gray-500 uppercase block mb-0.5">Flow</label>
               <span className="text-xs font-black text-rose-950 capitalize">{selectedLog?.flow || (selectedLog?.isPeriod ? 'Medium' : 'None')}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
               <label className="text-[10px] font-black text-gray-500 uppercase block mb-0.5">Intimacy</label>
               <span className="text-xs font-black text-rose-950 capitalize">{selectedLog?.intimacy && selectedLog.intimacy[0] !== 'none' ? selectedLog.intimacy[0].replace('_', ' ') : 'None'}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
               <label className="text-[10px] font-black text-gray-500 uppercase block mb-0.5">Meds</label>
               <span className="text-xs font-black text-rose-950">{selectedLog?.pillTaken ? 'Logged' : 'No'}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
               <label className="text-[10px] font-black text-gray-500 uppercase block mb-0.5">Water</label>
               <span className="text-xs font-black text-rose-950">{selectedLog?.waterGlasses ? selectedLog.waterGlasses * 250 : 0} ml</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
