function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`TEST FAILED: ${message}`);
  }
}

export function buildPcosInputVector(params: {
  age: number;
  weightKg: number;
  heightCm: number;
  cycleLength: number;
  periodDuration: number;
  sleepHours: number;
  restingHeartRate: number;
  screenTimeMins: number;
  acneSeverity: number;
  hirsutismSeverity: number;
  moodSwingsSeverity: number;
  sugarCravingsSeverity: number;
  fatigueSeverity: number;
  irregularCycles: boolean;
  pillTaken: boolean;
}): number[] {
  const safeAge = Math.max(12, Math.min(95, params.age));
  const safeWeight = Math.max(30, Math.min(300, params.weightKg));
  const safeHeight = Math.max(100, Math.min(220, params.heightCm));
  const bmi = Number((safeWeight / Math.pow(safeHeight / 100, 2)).toFixed(1));

  return [
    Number(safeAge),
    Number(safeWeight),
    Number(safeHeight),
    bmi,
    Number(params.cycleLength),
    Number(params.periodDuration),
    Number(params.sleepHours),
    Number(params.restingHeartRate),
    Number(params.screenTimeMins),
    Number(params.acneSeverity),
    Number(params.hirsutismSeverity),
    Number(params.moodSwingsSeverity),
    Number(params.sugarCravingsSeverity),
    Number(params.fatigueSeverity),
    params.irregularCycles ? 1.0 : 0.0,
    params.pillTaken ? 1.0 : 0.0,
  ];
}

console.log('Running ONNX Input Vector Assembly Tests...');

// Test 1: Standard baseline profile
const vector = buildPcosInputVector({
  age: 26,
  weightKg: 60,
  heightCm: 165,
  cycleLength: 28,
  periodDuration: 5,
  sleepHours: 8,
  restingHeartRate: 72,
  screenTimeMins: 180,
  acneSeverity: 2,
  hirsutismSeverity: 1,
  moodSwingsSeverity: 3,
  sugarCravingsSeverity: 2,
  fatigueSeverity: 2,
  irregularCycles: false,
  pillTaken: false,
});

assert(vector.length === 16, `Expected vector length 16, got ${vector.length}`);
assert(vector[0] === 26, 'Age = 26');
assert(vector[1] === 60, 'Weight = 60');
assert(vector[2] === 165, 'Height = 165');
const expectedBmi = Number((60 / Math.pow(165 / 100, 2)).toFixed(1));
assert(vector[3] === expectedBmi, `Expected BMI ${expectedBmi}, got ${vector[3]}`);
assert(vector[14] === 0.0, 'Irregular cycles = 0.0');
assert(vector[15] === 0.0, 'Pill taken = 0.0');

// Test 2: High risk profile
const highRiskVector = buildPcosInputVector({
  age: 28,
  weightKg: 85,
  heightCm: 160,
  cycleLength: 42,
  periodDuration: 7,
  sleepHours: 6,
  restingHeartRate: 85,
  screenTimeMins: 300,
  acneSeverity: 8,
  hirsutismSeverity: 7,
  moodSwingsSeverity: 8,
  sugarCravingsSeverity: 9,
  fatigueSeverity: 7,
  irregularCycles: true,
  pillTaken: false,
});

assert(highRiskVector[14] === 1.0, 'Irregular cycles = 1.0');
assert(highRiskVector[9] === 8, 'Acne severity = 8');

console.log('✅ ALL ONNX VECTOR ASSEMBLY TESTS PASSED SUCCESSFULLY!');
