export interface PcosRotterdamInputs {
  age: number; // Feature 0: 14.0 - 50.0
  menarcheAge?: number; // Needed for Feature 1: age - age_at_first_period
  yearsPostMenarche?: number;
  weightKg: number; // Feature 2: weight / (height_m ^ 2)
  heightCm: number;
  waistCm?: number; // Feature 3: waist / hip
  hipCm?: number;
  waistToHipRatio?: number;
  meanCycleLength?: number; // Feature 4
  cycleVarianceStd?: number; // Feature 5
  isAmenorrhea?: boolean; // Feature 8
  mfgHirsutismScore?: number; // Feature 9: 0.0 - 36.0
  hormonalAcnePresent?: boolean; // Feature 10
  androgenicAlopeciaStage?: number; // Feature 11: 0.0, 1.0, 2.0
  acanthosisNigricansPresent?: boolean; // Feature 12
  onContraceptives?: boolean; // Feature 13
  onInsulinSensitizer?: boolean; // Feature 14
  lhFshRatio?: number | null; // Feature 15
  totalTestosterone?: number | null; // Feature 16
  fastingInsulin?: number | null; // Feature 17
  tsh?: number | null; // Feature 18
}

export const ROTTERDAM_PHENOTYPES = [
  {
    index: 0,
    name: 'Baseline (Non-PCOS)',
    features: 'None',
    description: 'Healthy / Low Risk. Criteria for PCOS not met.',
    riskLevel: 'low' as const,
  },
  {
    index: 1,
    name: 'Phenotype A (Classic Complete)',
    features: 'Hyperandrogenism + Anovulation + Polycystic Ovaries',
    description: 'Complete PCOS profile. Highest metabolic & insulin resistance risk.',
    riskLevel: 'high' as const,
  },
  {
    index: 2,
    name: 'Phenotype B (Hyperandrogenic Anovulatory)',
    features: 'Hyperandrogenism + Anovulation',
    description: 'Irregular cycles with high male hormone signs, normal ovary morphology.',
    riskLevel: 'high' as const,
  },
  {
    index: 3,
    name: 'Phenotype C (Ovulatory PCOS)',
    features: 'Hyperandrogenism + Polycystic Ovaries',
    description: 'Regular monthly cycles, but high androgen levels and/or cysts present.',
    riskLevel: 'moderate' as const,
  },
  {
    index: 4,
    name: 'Phenotype D (Non-Hyperandrogenic)',
    features: 'Anovulation + Polycystic Ovaries',
    description: 'Irregular cycles and cysts, but completely normal male hormone levels.',
    riskLevel: 'moderate' as const,
  },
];

/**
 * Builds the exact 19-element Float32 array required by pcos_rotterdam_v4.onnx.
 * Enforces all clinical rules:
 * Rule 1: Missing labs set to -1.0
 * Rule 2: Oral contraceptive overrides (forces cycle 28.0, variance 0.5, clears flags)
 * Rule 3: Mutual exclusivity for cycle flags (oligomenorrhea, polymenorrhea, amenorrhea)
 */
export function buildPcosRotterdamVector(inputs: PcosRotterdamInputs): number[] {
  const vector = new Array<number>(19);

  const age = Math.max(14.0, Math.min(50.0, inputs.age || 25.0));
  const menarcheAge = Math.max(8.0, Math.min(25.0, inputs.menarcheAge ?? 12.0));
  const yearsPostMenarche = inputs.yearsPostMenarche ?? Math.max(0.0, age - menarcheAge);

  const weight = Math.max(30.0, Math.min(250.0, inputs.weightKg || 60.0));
  const heightM = Math.max(1.0, Math.min(2.5, (inputs.heightCm || 165.0) / 100.0));
  const bmi = Number((weight / Math.pow(heightM, 2)).toFixed(1));

  const waistCm = inputs.waistCm ?? 80.0;
  const hipCm = inputs.hipCm ?? 95.0;
  const whr = inputs.waistToHipRatio ?? (hipCm > 0 ? Number((waistCm / hipCm).toFixed(2)) : 0.85);

  const isOnBC = inputs.onContraceptives ? 1.0 : 0.0;

  vector[0] = age;
  vector[1] = yearsPostMenarche;
  vector[2] = bmi;
  vector[3] = whr;

  // Rule 2 & Rule 3: Cycle Flag Logic
  if (isOnBC === 1.0) {
    vector[4] = 28.0;
    vector[5] = 0.5;
    vector[6] = 0.0;
    vector[7] = 0.0;
    vector[8] = 0.0;
  } else {
    const cycle = inputs.meanCycleLength ?? 28.0;
    vector[4] = cycle;
    vector[5] = inputs.cycleVarianceStd ?? 1.0;

    if (inputs.isAmenorrhea) {
      vector[6] = 0.0;
      vector[7] = 0.0;
      vector[8] = 1.0;
    } else if (cycle > 35) {
      vector[6] = 1.0;
      vector[7] = 0.0;
      vector[8] = 0.0;
    } else if (cycle < 21) {
      vector[6] = 0.0;
      vector[7] = 1.0;
      vector[8] = 0.0;
    } else {
      vector[6] = 0.0;
      vector[7] = 0.0;
      vector[8] = 0.0;
    }
  }

  vector[9] = Math.max(0.0, Math.min(36.0, inputs.mfgHirsutismScore ?? 0.0));
  vector[10] = inputs.hormonalAcnePresent ? 1.0 : 0.0;
  vector[11] = Math.max(0.0, Math.min(2.0, inputs.androgenicAlopeciaStage ?? 0.0));
  vector[12] = inputs.acanthosisNigricansPresent ? 1.0 : 0.0;
  vector[13] = isOnBC;
  vector[14] = inputs.onInsulinSensitizer ? 1.0 : 0.0;

  // Rule 1: Lab Values (Pass -1.0 if not provided/entered)
  vector[15] = (inputs.lhFshRatio !== undefined && inputs.lhFshRatio !== null && inputs.lhFshRatio >= 0) ? inputs.lhFshRatio : -1.0;
  vector[16] = (inputs.totalTestosterone !== undefined && inputs.totalTestosterone !== null && inputs.totalTestosterone >= 0) ? inputs.totalTestosterone : -1.0;
  vector[17] = (inputs.fastingInsulin !== undefined && inputs.fastingInsulin !== null && inputs.fastingInsulin >= 0) ? inputs.fastingInsulin : -1.0;
  vector[18] = (inputs.tsh !== undefined && inputs.tsh !== null && inputs.tsh >= 0) ? inputs.tsh : -1.0;

  return vector;
}
