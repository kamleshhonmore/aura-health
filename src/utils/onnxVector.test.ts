import { buildPcosRotterdamVector } from './onnxVector';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`TEST FAILED: ${message}`);
  }
}

console.log('Running Rotterdam v4 ONNX Input Vector Assembly Tests...');

// Test 1: Standard baseline profile with missing labs
const vector = buildPcosRotterdamVector({
  age: 26,
  menarcheAge: 12,
  weightKg: 60,
  heightCm: 165,
  waistCm: 75,
  hipCm: 95,
  meanCycleLength: 28,
  cycleVarianceStd: 1.2,
  mfgHirsutismScore: 2,
  hormonalAcnePresent: false,
  androgenicAlopeciaStage: 0,
  acanthosisNigricansPresent: false,
  onContraceptives: false,
  onInsulinSensitizer: false,
});

assert(vector.length === 19, `Expected vector length 19, got ${vector.length}`);
assert(vector[0] === 26, 'Age = 26');
assert(vector[1] === 14, 'Years post menarche = 26 - 12 = 14');
const expectedBmi = Number((60 / Math.pow(1.65, 2)).toFixed(1));
assert(vector[2] === expectedBmi, `Expected BMI ${expectedBmi}, got ${vector[2]}`);
assert(vector[3] === 0.79, `Expected WHR 0.79, got ${vector[3]}`);
assert(vector[4] === 28, 'Mean cycle length = 28');
assert(vector[6] === 0.0, 'is_oligomenorrhea = 0.0');
assert(vector[7] === 0.0, 'is_polymenorrhea = 0.0');
assert(vector[8] === 0.0, 'is_amenorrhea = 0.0');
assert(vector[15] === -1.0, 'Missing LH/FSH ratio defaults to -1.0');
assert(vector[16] === -1.0, 'Missing Total Testosterone defaults to -1.0');
assert(vector[17] === -1.0, 'Missing Fasting Insulin defaults to -1.0');
assert(vector[18] === -1.0, 'Missing TSH defaults to -1.0');

// Test 2: Birth control override rule
const bcVector = buildPcosRotterdamVector({
  age: 24,
  menarcheAge: 13,
  weightKg: 58,
  heightCm: 162,
  meanCycleLength: 45, // Normally oligomenorrhea, but on BC!
  onContraceptives: true,
});

assert(bcVector[4] === 28.0, 'BC override: mean_cycle_length forced to 28.0');
assert(bcVector[5] === 0.5, 'BC override: cycle_variance_std forced to 0.5');
assert(bcVector[6] === 0.0, 'BC override: oligomenorrhea forced to 0.0');
assert(bcVector[7] === 0.0, 'BC override: polymenorrhea forced to 0.0');
assert(bcVector[8] === 0.0, 'BC override: amenorrhea forced to 0.0');
assert(bcVector[13] === 1.0, 'on_contraceptives = 1.0');

// Test 3: Oligomenorrhea flag (cycle > 35)
const oligoVector = buildPcosRotterdamVector({
  age: 28,
  weightKg: 80,
  heightCm: 160,
  meanCycleLength: 42,
  onContraceptives: false,
});

assert(oligoVector[6] === 1.0, 'Cycle 42 > 35 set oligomenorrhea = 1.0');
assert(oligoVector[7] === 0.0, 'Polymenorrhea = 0.0');
assert(oligoVector[8] === 0.0, 'Amenorrhea = 0.0');

// Test 4: Labs provided
const labsVector = buildPcosRotterdamVector({
  age: 29,
  weightKg: 70,
  heightCm: 165,
  lhFshRatio: 2.5,
  totalTestosterone: 65,
  fastingInsulin: 18.5,
  tsh: 2.1,
});

assert(labsVector[15] === 2.5, 'LH/FSH ratio = 2.5');
assert(labsVector[16] === 65, 'Total Testosterone = 65');
assert(labsVector[17] === 18.5, 'Fasting Insulin = 18.5');
assert(labsVector[18] === 2.1, 'TSH = 2.1');

console.log('✅ ALL ROTTERDAM V4 ONNX VECTOR ASSEMBLY TESTS PASSED SUCCESSFULLY!');
