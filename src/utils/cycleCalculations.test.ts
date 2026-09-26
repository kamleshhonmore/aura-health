import {
  formatDateStr,
  parseDateStr,
  calculateCycleStatus,
  generateMonthCalendar,
} from './cycleCalculations';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`TEST FAILED: ${message}`);
  }
}

console.log('Running Cycle Calculations Tests...');

// Test 1: Date formatting and parsing
const dateObj = new Date(2026, 8, 26); // Sep 26, 2026
const formatted = formatDateStr(dateObj);
assert(formatted === '2026-09-26', `Expected '2026-09-26', got '${formatted}'`);

const parsed = parseDateStr('2026-09-26');
assert(parsed.getFullYear() === 2026, 'Year match');
assert(parsed.getMonth() === 8, 'Month match (0-indexed)');
assert(parsed.getDate() === 26, 'Day match');

// Test 2: Period Day 1 calculation
const todayDay1 = new Date(2026, 8, 1); // Sep 1
const statusDay1 = calculateCycleStatus(todayDay1, '2026-09-01', 28, 5, 14);
assert(statusDay1.currentCycleDay === 1, 'Current cycle day should be 1');
assert(statusDay1.phase === 'period', 'Phase should be period');
assert(statusDay1.isPeriodToday === true, 'isPeriodToday should be true');

// Test 3: Ovulation Day calculation (Day 14 for 28-day cycle with 14-day luteal phase)
const todayOvulation = new Date(2026, 8, 14); // Sep 14
const statusOvulation = calculateCycleStatus(todayOvulation, '2026-09-01', 28, 5, 14);
assert(statusOvulation.currentCycleDay === 14, 'Current cycle day should be 14');
assert(statusOvulation.phase === 'ovulation', 'Phase should be ovulation');
assert(statusOvulation.conceptionChance === 'Peak', 'Conception chance should be Peak');

// Test 4: Luteal Phase calculation (Day 20)
const todayLuteal = new Date(2026, 8, 20); // Sep 20
const statusLuteal = calculateCycleStatus(todayLuteal, '2026-09-01', 28, 5, 14);
assert(statusLuteal.currentCycleDay === 20, 'Current cycle day should be 20');
assert(statusLuteal.phase === 'luteal', 'Phase should be luteal');

// Test 5: Month Calendar Generation
const calendar = generateMonthCalendar(2026, 8, '2026-09-01', 28, 5, 14);
assert(calendar.length >= 35, 'Calendar should generate at least 35 days');

console.log('✅ ALL CYCLE CALCULATION TESTS PASSED SUCCESSFULLY!');
