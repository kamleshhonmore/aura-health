import React, { useState } from 'react';
import { ThemeConfig, DayCalendarInfo, DayLog } from '../types';
import { generateMonthCalendar, formatDateStr } from '../utils/cycleCalculations';
import { symptomList, moodList } from '../data';
import {
  ChevronLeft,
  ChevronRight,
  Droplets,
  Heart,
  Pill,
  Sparkles,
  Edit3,
  Thermometer,
  Calendar as CalendarIcon,
  Info,
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
              className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-rose-50 text-rose-500 border border-rose-100"
            >
              Today
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handlePrevMonth} className="p-2 rounded-2xl bg-gray-50 text-gray-400"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={handleNextMonth} className="p-2 rounded-2xl bg-gray-50 text-gray-400"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between px-3 py-2 bg-gray-50/50 rounded-2xl border border-gray-100 gap-4">
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#FF5376]" /><span className="text-[9px] font-black uppercase text-gray-500">Period</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#81C784]" /><span className="text-[9px] font-black uppercase text-gray-500">Fertile</span></div>
          <div className="flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-amber-500" /><span className="text-[9px] font-black uppercase text-gray-500">Ovulation</span></div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {calendarDays.map((day) => {
            const isSelected = day.dateStr === selectedDateStr;
            const isPeriod = day.log?.isPeriod;
            const isPredictedPeriod = !isPeriod && day.dayType === 'predicted_period';
            const isOvulation = day.dayType === 'ovulation';
            const isFertile = day.dayType === 'fertile';

            let cellBg = 'bg-white text-rose-950';
            let cellBorder = 'border-transparent';

            if (isPeriod) cellBg = 'bg-rose-500 text-white shadow-md';
            else if (isPredictedPeriod) cellBg = 'bg-rose-50 text-rose-400 border-dashed border-rose-200';
            else if (isOvulation) cellBg = 'bg-amber-100 text-amber-700 border-amber-200';
            else if (isFertile) cellBg = 'bg-green-50 text-green-700 border-green-100';

            if (!day.isCurrentMonth) cellBg = 'opacity-20 bg-transparent text-gray-400';

            return (
              <button
                key={day.dateStr}
                onClick={() => { setSelectedDateStr(day.dateStr); onSelectDate(day.dateStr); }}
                className={`h-14 rounded-2xl flex flex-col items-center justify-between p-2 border-2 transition-all ${cellBg} ${cellBorder} ${isSelected ? 'border-rose-500 ring-4 ring-rose-500/10' : ''}`}
              >
                <div className="w-full flex items-center justify-between font-black text-xs">
                  <span className={day.isToday ? 'w-5 h-5 flex items-center justify-center rounded-full bg-rose-900 text-white' : ''}>{day.dayOfMonth}</span>
                  {isOvulation && <Sparkles className="w-2.5 h-2.5" />}
                </div>
                <div className="h-2 flex gap-0.5">
                  {day.log?.pillTaken && <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />}
                  {day.log?.intimacy && day.log.intimacy[0] !== 'none' && <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Info Card */}
      {selectedDayInfo && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-6 rounded-[32px] ${theme.bgCard} border-2 ${theme.borderCard} shadow-lg space-y-4`}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-black text-rose-950">{new Date(selectedDateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
              <p className="text-xs font-bold text-rose-400 uppercase tracking-widest mt-1">Cycle Day {selectedDayInfo.cycleDay} • {selectedDayInfo.conceptionChance} Chance</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onTogglePeriodOnDate(selectedDateStr)} className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md ${selectedLog?.isPeriod ? 'bg-rose-500 text-white' : 'bg-white border border-rose-100 text-rose-500'}`}><Droplets className="w-6 h-6" /></button>
              <button onClick={() => onOpenLogModalForDate(selectedDateStr)} className="w-12 h-12 rounded-2xl bg-rose-900 text-white shadow-md flex items-center justify-center"><Edit3 className="w-5 h-5" /></button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-3xl bg-gray-50 border border-gray-100">
               <label className="text-[9px] font-black text-gray-400 uppercase block mb-1">Flow</label>
               <span className="text-sm font-black text-rose-900 capitalize">{selectedLog?.flow || (selectedLog?.isPeriod ? 'Medium' : 'None')}</span>
            </div>
            <div className="p-4 rounded-3xl bg-gray-50 border border-gray-100">
               <label className="text-[9px] font-black text-gray-400 uppercase block mb-1">Intimacy</label>
               <span className="text-sm font-black text-rose-900 capitalize">{selectedLog?.intimacy && selectedLog.intimacy[0] !== 'none' ? selectedLog.intimacy[0] : 'None'}</span>
            </div>
            <div className="p-4 rounded-3xl bg-gray-50 border border-gray-100">
               <label className="text-[9px] font-black text-gray-400 uppercase block mb-1">Meds</label>
               <span className="text-sm font-black text-rose-900">{selectedLog?.pillTaken ? 'Logged' : 'No'}</span>
            </div>
            <div className="p-4 rounded-3xl bg-gray-50 border border-gray-100">
               <label className="text-[9px] font-black text-gray-400 uppercase block mb-1">Water</label>
               <span className="text-sm font-black text-rose-900">{selectedLog?.waterGlasses ? selectedLog.waterGlasses * 250 : 0} ml</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
