import onnxruntime as ort
import numpy as np

# --- 1. USER INPUT SECTION (Rotterdam v4 High-Risk Test) ---
AGE             = 28.0    # 14 - 50
MENARCHE_AGE    = 12.0    # 8 - 25
WEIGHT          = 85.0    # 30 - 250 kg
HEIGHT          = 160.0   # 100 - 220 cm
WAIST_CM        = 92.0    # 40 - 180 cm
HIP_CM          = 102.0   # 50 - 200 cm
CYCLE_LEN       = 52.0    # Irregular / Oligomenorrhea
CYCLE_STD       = 12.0    # High variance
MFG_HIRSUTISM   = 22.0    # High mFG score
ACNE            = 1.0     # Persistent acne
ALOPECIA        = 1.0     # Mild alopecia
ACANTHOSIS      = 1.0     # Acanthosis present
CONTRACEPTIVES  = 0.0     # Not on pill
INSULIN_SENS    = 0.0     # Not on Metformin
AMENORRHEA      = 0.0     # 1.0 = >90 days no period

# Optional Labs (-1.0 if unentered)
LH_FSH_RATIO    = -1.0
TESTOSTERONE    = -1.0
INSULIN         = -1.0
TSH             = -1.0

# --- 2. LOGIC SECTION ---
BMI = WEIGHT / ((HEIGHT / 100) ** 2)
WHR = WAIST_CM / HIP_CM
YEARS_POST_MENARCHE = max(0.0, AGE - MENARCHE_AGE)

# Cycle Flag Rules
if CONTRACEPTIVES == 1.0:
    mean_cycle = 28.0
    cycle_std = 0.5
    is_oligo = 0.0
    is_poly = 0.0
    is_amen = 0.0
else:
    mean_cycle = CYCLE_LEN
    cycle_std = CYCLE_STD
    is_amen = 1.0 if AMENORRHEA == 1.0 else 0.0
    is_oligo = 1.0 if (not is_amen and mean_cycle > 35) else 0.0
    is_poly = 1.0 if (not is_amen and mean_cycle < 21) else 0.0

model_path = 'android/app/src/main/assets/pcos_rotterdam_v4.onnx'

PHENOTYPES = [
    "Baseline (Non-PCOS)",
    "Phenotype A (Classic Complete)",
    "Phenotype B (Hyperandrogenic Anovulatory)",
    "Phenotype C (Ovulatory PCOS)",
    "Phenotype D (Non-Hyperandrogenic)"
]

try:
    opts = ort.SessionOptions()
    opts.log_severity_level = 3
    sess = ort.InferenceSession(model_path, sess_options=opts)
    input_name = sess.get_inputs()[0].name

    features = [
        AGE, YEARS_POST_MENARCHE, round(BMI, 1), round(WHR, 2),
        mean_cycle, cycle_std, is_oligo, is_poly, is_amen,
        MFG_HIRSUTISM, ACNE, ALOPECIA, ACANTHOSIS,
        CONTRACEPTIVES, INSULIN_SENS,
        LH_FSH_RATIO, TESTOSTERONE, INSULIN, TSH
    ]

    input_data = np.array([features], dtype=np.float32)
    outputs = sess.run(None, {input_name: input_data})

    probs = outputs[1][0] if len(outputs) > 1 else outputs[0][0]
    pred_index = int(np.argmax(probs))
    confidence = probs[pred_index] * 100
    pcos_prob = (1.0 - probs[0]) * 100

    print("\n" + "="*50)
    print(f"MASTER ROTTERDAM V4 DIAGNOSTIC RESULT")
    print("="*50)
    print(f"Profile: Age {int(AGE)} | BMI {BMI:.1f} | WHR {WHR:.2f}")
    print(f"Predicted Class: {pred_index} - {PHENOTYPES[pred_index]}")
    print(f"Total PCOS Risk Score: {pcos_prob:.2f}%")
    print(f"Model Confidence: {confidence:.1f}%")
    print("="*50)

except Exception as e:
    print(f"ONNX Session info: {e}")
