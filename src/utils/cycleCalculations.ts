import { DayCalendarInfo, DayLog, CycleRecord } from '../types';

export function formatDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseDateStr(str: string): Date {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export interface CycleStatus {
  currentCycleDay: number;
  totalCycleDays: number;
  periodLength: number;
  phase: 'period' | 'follicular' | 'fertile' | 'ovulation' | 'luteal';
  phaseTitle: string;
  daysUntilNextPeriod: number;
  daysUntilOvulation: number;
  conceptionChance: 'Low' | 'Medium' | 'High' | 'Peak';
  conceptionPercent: number;
  isPeriodToday: boolean;
  nextPeriodDate: string;
  predictedOvulationDate: string;
}

export function calculateCycleStatus(
  todayDate: Date,
  lastPeriodStart: string,
  cycleLength: number = 28,
  periodLength: number = 5,
  lutealLength: number = 14
): CycleStatus {
  const lastStart = parseDateStr(lastPeriodStart);
  const diffMs = todayDate.getTime() - lastStart.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Current cycle day (1-indexed)
  const currentCycleDay = ((diffDays % cycleLength) + cycleLength) % cycleLength + 1;
  const ovulationDay = cycleLength - lutealLength; // e.g. 28 - 14 = 14

  const nextPeriodDateObj = new Date(lastStart);
  const cyclesPassed = Math.floor(diffDays / cycleLength);
  nextPeriodDateObj.setDate(lastStart.getDate() + (cyclesPassed + 1) * cycleLength);
  const nextPeriodDate = formatDateStr(nextPeriodDateObj);

  const daysUntilNextPeriod = Math.max(0, cycleLength - currentCycleDay + 1);
  const daysUntilOvulation = ovulationDay - currentCycleDay;

  const ovDateObj = new Date(lastStart);
  ovDateObj.setDate(lastStart.getDate() + cyclesPassed * cycleLength + (ovulationDay - 1));
  const predictedOvulationDate = formatDateStr(ovDateObj);

  let phase: 'period' | 'follicular' | 'fertile' | 'ovulation' | 'luteal' = 'follicular';
  let phaseTitle = 'Follicular Phase';
  let conceptionChance: 'Low' | 'Medium' | 'High' | 'Peak' = 'Low';
  let conceptionPercent = 8;
  const isPeriodToday = currentCycleDay <= periodLength;

  if (currentCycleDay <= periodLength) {
    phase = 'period';
    phaseTitle = `Period Day ${currentCycleDay}`;
    conceptionChance = 'Low';
    conceptionPercent = 3;
  } else if (currentCycleDay === ovulationDay) {
    phase = 'ovulation';
    phaseTitle = 'Ovulation Day 🌟';
    conceptionChance = 'Peak';
    conceptionPercent = 33;
  } else if (currentCycleDay >= ovulationDay - 5 && currentCycleDay <= ovulationDay + 1) {
    phase = 'fertile';
    phaseTitle = 'Fertile Window 🌸';
    const dist = Math.abs(currentCycleDay - ovulationDay);
    if (dist <= 1) {
      conceptionChance = 'High';
      conceptionPercent = 28;
    } else {
      conceptionChance = 'Medium';
      conceptionPercent = 18;
    }
  } else if (currentCycleDay > ovulationDay + 1) {
    phase = 'luteal';
    phaseTitle = 'Luteal Phase';
    conceptionChance = 'Low';
    conceptionPercent = 4;
  }

  return {
    currentCycleDay,
    totalCycleDays: cycleLength,
    periodLength,
    phase,
    phaseTitle,
    daysUntilNextPeriod,
    daysUntilOvulation,
    conceptionChance,
    conceptionPercent,
    isPeriodToday,
    nextPeriodDate,
    predictedOvulationDate,
  };
}

export function generateMonthCalendar(
  year: number,
  month: number, // 0-11
  lastPeriodStart: string,
  cycleLength: number = 28,
  periodLength: number = 5,
  lutealLength: number = 14,
  logs: Record<string, DayLog> = {}
): DayCalendarInfo[] {
  const result: DayCalendarInfo[] = [];
  const firstDayOfMonth = new Date(year, month, 1);
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const todayStr = formatDateStr(new Date());
  const lastStart = parseDateStr(lastPeriodStart);
  const ovulationCycleDay = cycleLength - lutealLength; // e.g. 14

  // Previous month padding
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const prevMonthDate = new Date(year, month - 1, dayNum);
    const dateStr = formatDateStr(prevMonthDate);
    const dayInfo = getDayDetails(prevMonthDate, dateStr, dayNum, month - 1, year, false, todayStr, lastStart, cycleLength, periodLength, ovulationCycleDay, logs);
    result.push(dayInfo);
  }

  // Current month days
  for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
    const currentDate = new Date(year, month, dayNum);
    const dateStr = formatDateStr(currentDate);
    const dayInfo = getDayDetails(currentDate, dateStr, dayNum, month, year, true, todayStr, lastStart, cycleLength, periodLength, ovulationCycleDay, logs);
    result.push(dayInfo);
  }

  // Next month padding to fill 42 cells (6 rows) or 35 cells
  const remaining = (7 - (result.length % 7)) % 7;
  for (let dayNum = 1; dayNum <= remaining; dayNum++) {
    const nextMonthDate = new Date(year, month + 1, dayNum);
    const dateStr = formatDateStr(nextMonthDate);
    const dayInfo = getDayDetails(nextMonthDate, dateStr, dayNum, month + 1, year, false, todayStr, lastStart, cycleLength, periodLength, ovulationCycleDay, logs);
    result.push(dayInfo);
  }

  return result;
}

function getDayDetails(
  date: Date,
  dateStr: string,
  dayOfMonth: number,
  month: number,
  year: number,
  isCurrentMonth: boolean,
  todayStr: string,
  lastStart: Date,
  cycleLength: number,
  periodLength: number,
  ovulationCycleDay: number,
  logs: Record<string, DayLog>
): DayCalendarInfo {
  const isToday = dateStr === todayStr;
  const log = logs[dateStr];

  // Calculate cycle day relative to last period start
  const diffMs = date.getTime() - lastStart.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const cycleDay = ((diffDays % cycleLength) + cycleLength) % cycleLength + 1;

  let dayType: 'period' | 'predicted_period' | 'fertile' | 'ovulation' | 'standard' | 'luteal' = 'standard';
  let conceptionChance: 'Low' | 'Medium' | 'High' | 'Peak' = 'Low';

  if (log?.isPeriod) {
    dayType = 'period';
  } else if (cycleDay <= periodLength) {
    dayType = 'predicted_period';
    conceptionChance = 'Low';
  } else if (cycleDay === ovulationCycleDay) {
    dayType = 'ovulation';
    conceptionChance = 'Peak';
  } else if (cycleDay >= ovulationCycleDay - 5 && cycleDay <= ovulationCycleDay + 1) {
    dayType = 'fertile';
    conceptionChance = cycleDay >= ovulationCycleDay - 2 && cycleDay <= ovulationCycleDay ? 'High' : 'Medium';
  } else if (cycleDay > ovulationCycleDay + 1) {
    dayType = 'luteal';
    conceptionChance = 'Low';
  }

  return {
    dateStr,
    dayOfMonth,
    month,
    year,
    isCurrentMonth,
    isToday,
    cycleDay,
    dayType,
    conceptionChance,
    log,
  };
}
