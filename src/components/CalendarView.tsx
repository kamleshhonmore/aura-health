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
  Scale,
  Thermometer,
  FileText,
  Calendar as CalendarIcon,
} from 'lucide-react';

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
    <div className="space-y-4">
      {/* Calendar Card */}
      <div
        className={`p-4 rounded-3xl ${theme.bgCard} border ${theme.borderCard} ${theme.shadowColor} shadow-md transition-all space-y-3`}
      >
        {/* Month Navigation */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h2 className={`text-lg font-black font-['Fredoka'] ${theme.textPrimary}`}>
              {monthNames[viewMonth]} {viewYear}
            </h2>
            <button
              onClick={handleToday}
              className="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-[#FFF0F3] text-[#FF6B8B] hover:bg-[#FFE0E6] transition-colors cursor-pointer"
            >
              Today
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-xl hover:bg-pink-50 text-[#875C66] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-xl hover:bg-pink-50 text-[#875C66] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Legend Ribbon */}
        <div className="flex items-center justify-between text-[10px] font-bold text-[#875C66] px-1 py-1.5 bg-[#FFF9FA] rounded-xl border border-pink-50 overflow-x-auto gap-2">
          <div className="flex items-center gap-1 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5376]" />
            <span>Period</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#81C784]" />
            <span>Fertile</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-xs">🌟</span>
            <span>Ovulation</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full border border-dashed border-[#FF8DA1]" />
            <span>Forecast</span>
          </div>
        </div>

        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 text-center font-bold text-[11px] text-[#A88B93] pb-1 border-b border-pink-50">
          <span className="text-[#FF6B8B]">Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span className="text-[#FF6B8B]">Sat</span>
        </div>

        {/* Calendar Day Cells Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day) => {
            const isSelected = day.dateStr === selectedDateStr;
            const hasLog = !!day.log;
            const isPeriod = day.log?.isPeriod;
            const isPredictedPeriod = !isPeriod && day.dayType === 'predicted_period';
            const isOvulation = day.dayType === 'ovulation';
            const isFertile = day.dayType === 'fertile';
            const hasIntimacy = day.log?.intimacy && day.log.intimacy.length > 0 && day.log.intimacy[0] !== 'none';
            const hasPill = day.log?.pillTaken;
            const hasNotes = day.log?.notes && day.log.notes.trim().length > 0;

            // Styling based on day category
            let cellBg = 'hover:bg-pink-50/70 text-[#4A2E35]';
            let circleBorder = '';

            if (isPeriod) {
              cellBg = 'bg-[#FF5376] text-white shadow-xs';
            } else if (isPredictedPeriod) {
              cellBg = 'bg-[#FFF0F3] text-[#E91E63] border border-dashed border-[#FF8DA1]';
            } else if (isOvulation) {
              cellBg = 'bg-gradient-to-br from-[#FFF8E1] to-[#FFE082] text-[#F57F17] border border-[#FFD54F]';
            } else if (isFertile) {
              cellBg = 'bg-[#E8F8F0] text-[#2E7D32] border border-[#A5D6A7]';
            }

            if (!day.isCurrentMonth) {
              cellBg = 'opacity-35 text-[#B59199] bg-transparent';
            }

            if (isSelected) {
              circleBorder = 'ring-2 ring-[#FF2A6D] ring-offset-2';
            }

            return (
              <button
                key={day.dateStr}
                onClick={() => {
                  setSelectedDateStr(day.dateStr);
                  onSelectDate(day.dateStr);
                }}
                className={`h-13 rounded-2xl flex flex-col items-center justify-between p-1 transition-all cursor-pointer relative ${cellBg} ${circleBorder}`}
              >
                {/* Top: Day Number & Ovulation/Fertile Icon */}
                <div className="w-full flex items-center justify-between text-[11px] font-black font-['Fredoka'] px-0.5">
                  <span className={day.isToday ? 'px-1 rounded bg-[#FF6B8B] text-white font-extrabold' : ''}>
                    {day.dayOfMonth}
                  </span>
                  {isOvulation && <span className="text-[10px] leading-none">🌟</span>}
                  {isFertile && !isOvulation && <span className="text-[9px] leading-none">🌸</span>}
                  {isPeriod && <span className="text-[9px] leading-none">🩸</span>}
                </div>

                {/* Bottom Badges: Intimacy, Pill, Note, Flow dots */}
                <div className="flex items-center gap-0.5 h-3">
                  {hasIntimacy && <Heart className={`w-2.5 h-2.5 ${isPeriod ? 'fill-white text-white' : 'fill-[#E91E63] text-[#E91E63]'}`} />}
                  {hasPill && <Pill className={`w-2.5 h-2.5 ${isPeriod ? 'text-white' : 'text-[#8E24AA]'}`} />}
                  {hasNotes && <FileText className={`w-2.5 h-2.5 ${isPeriod ? 'text-white' : 'text-[#FFB300]'}`} />}
                  {day.log?.waterGlasses && day.log.waterGlasses >= 8 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#29B6F6]" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Inspector Card */}
      {selectedDayInfo && (
        <div
          className={`p-4 rounded-3xl ${theme.bgCard} border ${theme.borderCard} ${theme.shadowColor} shadow-md space-y-3 transition-all`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black font-['Fredoka'] text-[#4A2E35]">
                  {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                {selectedDayInfo.isToday && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF6B8B] text-white">
                    Today
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-[#875C66] mt-0.5">
                Cycle Day {selectedDayInfo.cycleDay} • Conception Chance: {selectedDayInfo.conceptionChance}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onTogglePeriodOnDate(selectedDateStr)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-['Fredoka'] transition-colors cursor-pointer ${
                  selectedLog?.isPeriod
                    ? 'bg-[#FF5376] text-white'
                    : 'bg-[#FFF0F3] text-[#FF5376] hover:bg-[#FFE0E6]'
                }`}
              >
                {selectedLog?.isPeriod ? '🩸 Period Logged' : '+ Period'}
              </button>

              <button
                onClick={() => onOpenLogModalForDate(selectedDateStr)}
                className="p-2 rounded-xl bg-[#FF6B8B] text-white hover:bg-[#E91E63] transition-colors cursor-pointer shadow-sm"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Details Pill Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
            {/* Flow */}
            <div className="p-2.5 rounded-2xl bg-[#FFF9FA] border border-pink-100 flex flex-col">
              <span className="text-[10px] font-bold text-[#875C66]">Period Flow</span>
              <span className="font-black font-['Fredoka'] text-[#4A2E35] capitalize">
                {selectedLog?.flow && selectedLog.flow !== 'none' ? selectedLog.flow : selectedLog?.isPeriod ? 'Medium' : 'None'}
              </span>
            </div>

            {/* Intimacy */}
            <div className="p-2.5 rounded-2xl bg-[#FFF9FA] border border-pink-100 flex flex-col">
              <span className="text-[10px] font-bold text-[#875C66]">Intimacy</span>
              <span className="font-black font-['Fredoka'] text-[#4A2E35] capitalize truncate">
                {selectedLog?.intimacy && selectedLog.intimacy.length > 0 && selectedLog.intimacy[0] !== 'none'
                  ? selectedLog.intimacy[0].replace('_', ' ')
                  : 'None'}
              </span>
            </div>

            {/* Pill */}
            <div className="p-2.5 rounded-2xl bg-[#FFF9FA] border border-pink-100 flex flex-col">
              <span className="text-[10px] font-bold text-[#875C66]">Pill Status</span>
              <span className="font-black font-['Fredoka'] text-[#4A2E35]">
                {selectedLog?.pillTaken ? 'Taken ✅' : 'Not Logged'}
              </span>
            </div>

            {/* Water */}
            <div className="p-2.5 rounded-2xl bg-[#FFF9FA] border border-pink-100 flex flex-col">
              <span className="text-[10px] font-bold text-[#875C66]">Water</span>
              <span className="font-black font-['Fredoka'] text-[#4A2E35]">
                {selectedLog?.waterGlasses ? `${selectedLog.waterGlasses * 250} ml` : '0 ml'}
              </span>
            </div>
          </div>

          {/* Symptoms & Moods Display */}
          {((selectedLog?.symptoms && selectedLog.symptoms.length > 0) ||
            (selectedLog?.moods && selectedLog.moods.length > 0)) && (
            <div className="pt-2 border-t border-pink-50 space-y-2">
              {selectedLog?.symptoms && selectedLog.symptoms.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold text-[#875C66] uppercase mr-1">Symptoms:</span>
                  {selectedLog.symptoms.map((sId) => {
                    const sym = symptomList.find((s) => s.id === sId);
                    return sym ? (
                      <span key={sId} className="px-2 py-0.5 rounded-lg bg-[#FCE4EC] text-[#C2185B] text-[11px] font-bold">
                        {sym.emoji} {sym.name}
                      </span>
                    ) : null;
                  })}
                </div>
              )}

              {selectedLog?.moods && selectedLog.moods.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold text-[#875C66] uppercase mr-1">Moods:</span>
                  {selectedLog.moods.map((mId) => {
                    const m = moodList.find((item) => item.id === mId);
                    return m ? (
                      <span key={mId} className="px-2 py-0.5 rounded-lg bg-[#EDE7F6] text-[#512DA8] text-[11px] font-bold">
                        {m.emoji} {m.name}
                      </span>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          )}

          {/* Secret Diary Note */}
          {selectedLog?.notes && selectedLog.notes.trim().length > 0 && (
            <div className="p-3 rounded-2xl bg-[#FFFDE7] border border-[#FFF59D] text-xs text-[#5D4037] font-medium flex items-start gap-2">
              <span className="text-sm">📖</span>
              <p className="flex-1 italic leading-relaxed">{selectedLog.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
