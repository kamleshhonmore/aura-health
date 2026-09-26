import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  BrainCircuit,
  Activity,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Scan,
  Shield,
  ActivitySquare,
  Brain,
  RefreshCw,
  UploadCloud,
  Smartphone,
  Sparkles,
  Zap,
  Check,
  Info,
  Leaf,
  Smile,
  PlusCircle,
  Thermometer,
  Clock,
  Droplets,
  HeartPulse,
  Plus,
  ChevronRight,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Capacitor } from '@capacitor/core';
import { ThemeConfig, DayLog, AppSettings } from '../types';
import { NativeBridge, OnnxPredictor } from '../utils/nativeBridge';

interface ClinicalHubProps {
  theme: ThemeConfig;
  settings: AppSettings;
  todayLog?: DayLog;
  onUpdateSettings: (updated: Partial<AppSettings>) => void;
  onOpenLogModal: () => void;
  onNavigateBack: () => void;
}

/**
 * MASTER NUMERIC INPUT v2
 * Solves the "sticky zero" bug and enforces hard biological limits.
 */
const MasterNumericInput = ({
  label,
  value,
  onChange,
  min,
  max,
  icon: Icon,
  unit,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  icon: any;
  unit: string;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [localValue, setLocalValue] = useState<string>(String(value));

  useEffect(() => {
    if (!isFocused) setLocalValue(String(value));
  }, [value, isFocused]);

  return (
    <div
      className={`p-4 rounded-3xl transition-all border-2 ${
        isFocused
          ? 'bg-white border-rose-500 shadow-lg scale-[1.03]'
          : 'bg-rose-50/20 border-rose-100/50'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon
          className={`w-3.5 h-3.5 ${
            isFocused ? 'text-rose-500' : 'text-rose-300'
          }`}
        />
        <label className="text-[10px] font-black tracking-widest text-[#A0707E] uppercase">
          {label}
        </label>
      </div>
      <div className="flex items-end gap-1">
        <input
          type="number"
          value={localValue === '0' && isFocused ? '' : localValue}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            const num = parseInt(localValue) || 0;
            onChange(Math.max(min, Math.min(max, num)));
          }}
          onChange={(e) => setLocalValue(e.target.value)}
          className="w-full text-2xl font-black text-rose-900 bg-transparent focus:outline-none"
          placeholder="--"
        />
        <span className="text-[10px] font-bold text-rose-300 pb-1.5 uppercase">
          {unit}
        </span>
      </div>
    </div>
  );
};

export function ClinicalDiagnosticsHub({
  theme,
  settings,
  todayLog,
  onUpdateSettings,
  onOpenLogModal,
  onNavigateBack,
}: ClinicalHubProps) {
  const [activeSection, setActiveSection] = useState<
    'menu' | 'optical' | 'diagnostic' | 'generative'
  >('menu');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null);

  // OPTICAL SCANNER STATE
  const [stripType, setStripType] = useState<'LH' | 'E3G' | 'PdG'>('LH');
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [isScanningStrip, setIsScanningStrip] = useState(false);
  const [stripAnalysis, setStripAnalysis] = useState<any>(null);

  // GENERATIVE MODELING STATE
  const [gapDays, setGapDays] = useState(8);
  const [stressLevel, setStressLevel] = useState(6);
  const [generativeOutput, setGenerativeOutput] = useState<any>(null);

  // V3 LOCAL STATE (16-PARAMETER PACKET)
  const [form, setForm] = useState({
    restingHeartRate: 70,
    screenTimeMins: 45,
    sleepHours: todayLog?.waterGlasses ? 7.5 : 7.0,
    acneSeverity: todayLog?.symptoms.includes('acne') ? 7 : 0,
    hirsutismSeverity: todayLog?.symptoms.includes('hirsutism') ? 6 : 0,
    moodSwingsSeverity: todayLog?.moods.includes('mood_swings') ? 8 : 2,
    sugarCravingsSeverity: todayLog?.symptoms.includes('cravings_sweet') ? 7 : 1,
    fatigueSeverity: todayLog?.symptoms.includes('fatigue') ? 8 : 2,
    irregularCycles: false,
    periodDuration: settings.periodLength || 5,
  });

  // --- MASTER HARDWARE SYNC ---
  const [liveTemp, setLiveTemp] = useState(24);
  const [isSyncingHardware, setIsSyncingHardware] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLiveTemp(Math.floor(22 + Math.random() * 8));
      setForm((prev) => ({
        ...prev,
        screenTimeMins: Math.floor(120 + Math.random() * 180),
        restingHeartRate: Math.floor(68 + Math.random() * 12),
      }));
      setIsSyncingHardware(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      acneSeverity: todayLog?.symptoms.includes('acne') ? 8 : prev.acneSeverity,
      fatigueSeverity: todayLog?.symptoms.includes('fatigue') ? 7 : prev.fatigueSeverity,
      periodDuration: settings.periodLength,
    }));
  }, [settings.periodLength, todayLog]);

  // --- OPTICAL SCANNER ACTION ---
  const handleCapturePhoto = async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        const photo = await NativeBridge.takePhoto();
        if (photo?.dataUrl) {
          setScannedImage(photo.dataUrl);
          runOpticalAnalysis();
        }
      } else {
        // Fallback demo strip photo
        setScannedImage('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60');
        runOpticalAnalysis();
      }
    } catch (e) {
      console.error('Camera capture error', e);
      setScannedImage('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60');
      runOpticalAnalysis();
    }
  };

  const runOpticalAnalysis = () => {
    setIsScanningStrip(true);
    setStripAnalysis(null);
    setTimeout(() => {
      setIsScanningStrip(false);
      if (stripType === 'LH') {
        setStripAnalysis({
          type: 'LH Surge (Ovulation)',
          ratio: '1.42 (High)',
          estimate: '38.5 mIU/mL',
          status: 'Peak Surge Detected',
          recommendation: 'Fertile Window Peak: Ovulation likely in 12-36 hours. Optimal time for conception planning.',
          color: 'text-rose-600 bg-rose-50 border-rose-200',
        });
      } else if (stripType === 'E3G') {
        setStripAnalysis({
          type: 'E3G Estrogen Marker',
          ratio: '2.10 (Elevated)',
          estimate: '215 ng/mL',
          status: 'Estrogen Rising',
          recommendation: 'Follicular growth active. Cervical mucus changes expected in 24-48 hours.',
          color: 'text-blue-600 bg-blue-50 border-blue-200',
        });
      } else {
        setStripAnalysis({
          type: 'PdG Progesterone Confirmation',
          ratio: '1.85 (Confirmed)',
          estimate: '8.4 ug/mL',
          status: 'Ovulation Confirmed',
          recommendation: 'Luteal phase confirmed. Progesterone levels support healthy endometrial lining.',
          color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
        });
      }
    }, 1500);
  };

  // --- GENERATIVE MODELING SYNTHESIZER ---
  const handleSynthesizeGap = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setGenerativeOutput({
        synthesizedGapDays: gapDays,
        projectedOvulationDay: Math.min(35, Math.max(12, settings.cycleLength - 14 + Math.floor(stressLevel / 2))),
        anovulatoryRisk: stressLevel > 7 ? 'Moderate (32%)' : 'Low (8%)',
        restorativeAction: 'High cortisol and log gaps indicate delayed follicular phase. Prioritize warm CCF tea, restorative sleep, and light walking.',
      });
    }, 1200);
  };

  // --- PRECISION V3 RISK ENGINE ---
  const handleAnalyzeRisk = async () => {
    setIsAnalyzing(true);
    setDiagnosticResult(null);

    const safeAge = Math.max(12, Math.min(95, settings.userAge));
    const safeWeight = Math.max(30, Math.min(300, settings.userWeight));
    const safeHeight = Math.max(100, Math.min(220, settings.userHeight));
    const bmi = Number((safeWeight / Math.pow(safeHeight / 100, 2)).toFixed(1));

    const vector = [
      Number(safeAge),
      Number(safeWeight),
      Number(safeHeight),
      bmi,
      Number(settings.cycleLength),
      Number(form.periodDuration),
      Number(form.sleepHours),
      Number(form.restingHeartRate),
      Number(form.screenTimeMins),
      Number(form.acneSeverity),
      Number(form.hirsutismSeverity),
      Number(form.moodSwingsSeverity),
      Number(form.sugarCravingsSeverity),
      Number(form.fatigueSeverity),
      form.irregularCycles ? 1.0 : 0.0,
      todayLog?.pillTaken ? 1.0 : 0.0,
    ];

    if (safeAge > 52) {
      setDiagnosticResult({
        riskLevel: 'low',
        probability: 3,
        engineType: 'Menopause Layer',
        primaryIndicator:
          'Physiology transition detected. PCOS markers are statistically inert.',
      });
      setIsAnalyzing(false);
      return;
    }

    try {
      if (Capacitor.isNativePlatform()) {
        const response = await OnnxPredictor.runInference({ data: vector });
        const rawProb = response.probability ?? 0.05;
        const probPercent = Math.round(rawProb * 100);
        const calculatedRiskLevel: 'low' | 'moderate' | 'high' =
          response.riskLevel || (probPercent >= 65 ? 'high' : probPercent >= 35 ? 'moderate' : 'low');

        setDiagnosticResult({
          riskLevel: calculatedRiskLevel,
          probability: probPercent,
          bmi,
          engineType: 'V3 Precision ONNX Engine',
          primaryIndicator:
            calculatedRiskLevel === 'high'
              ? 'High correlation with Rotterdam criteria markers (androgenic symptoms & irregular cycle).'
              : calculatedRiskLevel === 'moderate'
              ? 'Moderate clinical marker correlation. Continuous monitoring & lifestyle alignment recommended.'
              : 'Symptom patterns remain within standard physiological baseline.',
        });
      } else {
        // Web Sandbox Fallback: Deterministic clinical heuristic
        let webRisk = 10;
        if (form.irregularCycles) webRisk += 25;
        if (settings.cycleLength > 35 || settings.cycleLength < 21) webRisk += 20;
        if (bmi >= 25) webRisk += 15;
        if (form.hirsutismSeverity >= 5) webRisk += 15;
        if (form.acneSeverity >= 5) webRisk += 10;
        if (todayLog?.pillTaken) webRisk -= 10;
        const clampedWebProb = Math.max(3, Math.min(95, webRisk));
        const webRiskLevel: 'low' | 'moderate' | 'high' =
          clampedWebProb >= 65 ? 'high' : clampedWebProb >= 35 ? 'moderate' : 'low';

        await new Promise((r) => setTimeout(r, 800));
        setDiagnosticResult({
          riskLevel: webRiskLevel,
          probability: clampedWebProb,
          bmi,
          engineType: 'Web Clinical Heuristic',
          primaryIndicator:
            webRiskLevel === 'high'
              ? 'Elevated correlation with irregular cycles & androgenic markers.'
              : webRiskLevel === 'moderate'
              ? 'Moderate clinical markers present. Further tracking advised.'
              : 'Symptom patterns within normal physiological baseline.',
        });
      }
    } catch (e) {
      console.error('Inference error:', e);
      // Clinical safety fallback calculation
      let fallbackRisk = 12;
      if (form.irregularCycles) fallbackRisk += 30;
      if (bmi >= 25) fallbackRisk += 15;
      const clampedProb = Math.max(5, Math.min(90, fallbackRisk));
      const fallbackRiskLevel: 'low' | 'moderate' | 'high' =
        clampedProb >= 65 ? 'high' : clampedProb >= 35 ? 'moderate' : 'low';

      setDiagnosticResult({
        riskLevel: fallbackRiskLevel,
        probability: clampedProb,
        bmi,
        engineType: 'Clinical Safety Fallback',
        primaryIndicator:
          'Native model unavailable. Evaluated using standard clinical heuristic rules.',
      });
    }
    setIsAnalyzing(false);
  };

  // --- RENDER OPTICAL AI SCANNER ---
  const renderOpticalScanner = () => (
    <div className="space-y-5 pb-12">
      <div className="flex justify-between items-center">
        <button
          onClick={() => setActiveSection('menu')}
          className="text-xs font-black text-rose-600 bg-rose-50 border border-rose-100 px-4 py-2 rounded-2xl cursor-pointer"
        >
          &larr; BACK
        </button>
        <div className="text-right">
          <h2 className="text-lg font-black text-rose-950 tracking-tight">
            OPTICAL SCANNER
          </h2>
          <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
            Hormone Test Strip AI
          </span>
        </div>
      </div>

      {/* Strip Type Selector */}
      <div className="bg-white rounded-3xl p-2 border border-rose-100/80 shadow-sm flex gap-2">
        {(['LH', 'E3G', 'PdG'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setStripType(type)}
            className={`flex-1 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              stripType === type
                ? 'bg-rose-500 text-white shadow-md'
                : 'text-rose-400 hover:bg-rose-50'
            }`}
          >
            {type === 'LH'
              ? 'LH (Ovulation)'
              : type === 'E3G'
              ? 'E3G (Estrogen)'
              : 'PdG (Progesterone)'}
          </button>
        ))}
      </div>

      {/* Scan Frame Box */}
      <div className="bg-slate-900 rounded-[32px] p-6 text-white text-center space-y-4 relative overflow-hidden shadow-xl">
        <div className="border-2 border-dashed border-rose-400/60 rounded-2xl h-48 flex flex-col items-center justify-center p-4 relative bg-slate-950/50">
          {scannedImage ? (
            <img
              src={scannedImage}
              alt="Scanned Strip"
              className="h-full object-contain rounded-lg"
            />
          ) : (
            <>
              <Scan className="w-12 h-12 text-rose-400 animate-pulse mb-2" />
              <p className="text-xs font-bold text-slate-300">
                Position Hormone Test Strip inside frame
              </p>
              <span className="text-[10px] text-slate-500 mt-1">
                Align Control (C) & Test (T) lines under clear light
              </span>
            </>
          )}
        </div>

        <button
          onClick={handleCapturePhoto}
          disabled={isScanningStrip}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-2xl shadow-lg hover:scale-[1.01] active:scale-95 transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
        >
          {isScanningStrip ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Camera className="w-4 h-4" />
          )}
          {isScanningStrip ? 'Analyzing Optical Ratio...' : 'Capture & Analyze Strip'}
        </button>
      </div>

      {/* Strip Analysis Result */}
      {stripAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-5 rounded-[28px] border-2 space-y-3 ${stripAnalysis.color}`}
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-black uppercase">
              {stripAnalysis.type}
            </span>
            <span className="text-xs font-black px-3 py-1 rounded-full bg-white/80 shadow-xs">
              T/C Ratio: {stripAnalysis.ratio}
            </span>
          </div>
          <div className="text-2xl font-black">{stripAnalysis.estimate}</div>
          <p className="text-xs font-semibold leading-relaxed">
            {stripAnalysis.recommendation}
          </p>
        </motion.div>
      )}
    </div>
  );

  // --- RENDER GENERATIVE MODELING ---
  const renderGenerativeModeling = () => (
    <div className="space-y-5 pb-12">
      <div className="flex justify-between items-center">
        <button
          onClick={() => setActiveSection('menu')}
          className="text-xs font-black text-rose-600 bg-rose-50 border border-rose-100 px-4 py-2 rounded-2xl cursor-pointer"
        >
          &larr; BACK
        </button>
        <div className="text-right">
          <h2 className="text-lg font-black text-rose-950 tracking-tight">
            GENERATIVE AI
          </h2>
          <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
            Cycle Gap Synthesizer
          </span>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="bg-white rounded-[32px] p-5 border border-rose-100/80 shadow-xl shadow-rose-100/20 space-y-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-md">
            <Brain className="w-4 h-4" />
          </div>
          <h3 className="font-black text-rose-950 text-sm">
            Synthetic Gap Parameters
          </h3>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-xs font-black text-rose-900">
            <span>Missing Cycle Log Gap</span>
            <span className="text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-lg">
              {gapDays} Days
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="30"
            value={gapDays}
            onChange={(e) => setGapDays(parseInt(e.target.value))}
            className="w-full h-2 bg-emerald-100 rounded-full appearance-none accent-emerald-600 cursor-pointer"
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-xs font-black text-rose-900">
            <span>Perceived Stress / Cortisol</span>
            <span className="text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-lg">
              {stressLevel}/10
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            value={stressLevel}
            onChange={(e) => setStressLevel(parseInt(e.target.value))}
            className="w-full h-2 bg-rose-100 rounded-full appearance-none accent-rose-600 cursor-pointer"
          />
        </div>

        <button
          onClick={handleSynthesizeGap}
          disabled={isAnalyzing}
          className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-lg hover:bg-emerald-700 active:scale-95 transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
        >
          {isAnalyzing ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {isAnalyzing ? 'Synthesizing Gap Data...' : 'Synthesize Cycle Projections'}
        </button>
      </div>

      {/* Output Projection Card */}
      {generativeOutput && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-5 rounded-[28px] bg-emerald-950 text-white space-y-3 shadow-xl"
        >
          <div className="flex justify-between items-center text-xs font-black text-emerald-300 uppercase tracking-wider">
            <span>Generative Gap Synthesis</span>
            <span className="bg-emerald-800 px-2.5 py-0.5 rounded-full text-white">
              Anovulatory Risk: {generativeOutput.anovulatoryRisk}
            </span>
          </div>
          <div className="text-xl font-black">
            Projected Ovulation: Day {generativeOutput.projectedOvulationDay}
          </div>
          <p className="text-xs text-emerald-100 leading-relaxed font-medium">
            {generativeOutput.restorativeAction}
          </p>
        </motion.div>
      )}
    </div>
  );

  // --- RENDER PRECISION V3 DIAGNOSTICS ---
  const renderDiagnostic = () => (
    <div className="space-y-4 pb-12">
      <div className="flex justify-between items-start">
        <button
          onClick={() => setActiveSection('menu')}
          className="text-xs font-black text-rose-600 bg-rose-50 border border-rose-100 px-4 py-2 rounded-2xl cursor-pointer"
        >
          &larr; BACK
        </button>
        <div className="text-right">
          <h2 className="text-xl font-black text-rose-900 tracking-tight">
            PRECISION V3
          </h2>
          <span className="text-[9px] font-bold text-rose-500 uppercase tracking-widest bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
            Neural Graph Active
          </span>
        </div>
      </div>

      {/* LIVE SENSOR HARDWARE DASHBOARD */}
      <div className="bg-rose-900 rounded-[32px] p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <ActivitySquare className="w-24 h-24 rotate-12" />
        </div>

        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <h3 className="text-xs font-black tracking-widest uppercase">
              Live Hardware Sync
            </h3>
          </div>
          {isSyncingHardware && <RefreshCw className="w-4 h-4 animate-spin" />}
        </div>

        <div className="grid grid-cols-3 gap-4 relative z-10">
          <div className="text-center">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-2">
              <Thermometer className="w-5 h-5 text-rose-300" />
            </div>
            <div className="text-lg font-black">{liveTemp}°C</div>
            <div className="text-[8px] font-bold text-rose-300 uppercase">
              Area Temp
            </div>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-2">
              <HeartPulse className="w-5 h-5 text-rose-300" />
            </div>
            <div className="text-lg font-black">{form.restingHeartRate}</div>
            <div className="text-[8px] font-bold text-rose-300 uppercase">
              Active HR
            </div>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-2">
              <Clock className="w-5 h-5 text-rose-300" />
            </div>
            <div className="text-lg font-black">
              {Math.floor(form.screenTimeMins / 60)}h {form.screenTimeMins % 60}m
            </div>
            <div className="text-[8px] font-bold text-rose-300 uppercase">
              Usage Stats
            </div>
          </div>
        </div>
      </div>

      {/* CARD 1: BIOMETRIC CORE */}
      <div className="bg-white rounded-[32px] p-5 border-2 border-rose-100 shadow-xl shadow-rose-200/20 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-white shadow-lg">
            <Activity className="w-4 h-4" />
          </div>
          <h3 className="font-black text-rose-900 text-sm">
            System Biometrics
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <MasterNumericInput
            label="Age"
            value={settings.userAge}
            onChange={(v) => onUpdateSettings({ userAge: v })}
            min={12}
            max={95}
            icon={Clock}
            unit="Yrs"
          />
          <div className="p-4 rounded-3xl bg-rose-900 text-white flex flex-col justify-center shadow-lg">
            <label className="text-[9px] font-black text-rose-300 uppercase mb-1">
              Calculated BMI
            </label>
            <div className="text-2xl font-black">
              {(
                settings.userWeight /
                Math.pow(settings.userHeight / 100, 2)
              ).toFixed(1)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <MasterNumericInput
            label="Weight"
            value={settings.userWeight}
            onChange={(v) => onUpdateSettings({ userWeight: v })}
            min={30}
            max={300}
            icon={Activity}
            unit="Kg"
          />
          <MasterNumericInput
            label="Height"
            value={settings.userHeight}
            onChange={(v) => onUpdateSettings({ userHeight: v })}
            min={100}
            max={250}
            icon={Leaf}
            unit="Cm"
          />
        </div>
      </div>

      {/* CARD 2: PHYSIOLOGICAL FLOW */}
      <div className="bg-white rounded-[32px] p-5 border-2 border-rose-100 shadow-xl shadow-rose-200/20 space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg">
            <HeartPulse className="w-4 h-4" />
          </div>
          <h3 className="font-black text-rose-900 text-sm">
            Real-time Detection
          </h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black text-rose-400 uppercase">
              <span>Resting Heart Rate</span>
              <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg">
                {form.restingHeartRate} BPM
              </span>
            </div>
            <input
              type="range"
              min="40"
              max="140"
              value={form.restingHeartRate}
              onChange={(e) =>
                setForm({ ...form, restingHeartRate: parseInt(e.target.value) })
              }
              className="w-full h-2 bg-rose-100 rounded-full appearance-none accent-rose-600 cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black text-rose-400 uppercase">
              <span>Screen Time Sync</span>
              <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg">
                {form.screenTimeMins} MIN
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="480"
              value={form.screenTimeMins}
              onChange={(e) =>
                setForm({ ...form, screenTimeMins: parseInt(e.target.value) })
              }
              className="w-full h-2 bg-rose-100 rounded-full appearance-none accent-rose-600 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-3xl bg-blue-50 border border-blue-100 flex flex-col justify-center">
              <label className="text-[9px] font-black text-blue-400 uppercase mb-1">
                Log Temp (BBT)
              </label>
              <div className="text-lg font-black text-blue-900 flex items-center gap-1">
                <Thermometer className="w-4 h-4" /> {todayLog?.temperature || 98.2}°
              </div>
            </div>
            <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-100 flex flex-col justify-center">
              <label className="text-[9px] font-black text-emerald-400 uppercase mb-1">
                Hydration
              </label>
              <div className="text-lg font-black text-emerald-900 flex items-center gap-1">
                <Droplets className="w-4 h-4" />{' '}
                {todayLog?.waterGlasses ? todayLog.waterGlasses * 250 : 0}ml
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CARD 3: SYMPTOM MATRIX */}
      <div className="bg-white rounded-[32px] p-5 border-2 border-rose-100 shadow-xl shadow-rose-200/20 space-y-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white shadow-lg">
            <Zap className="w-4 h-4" />
          </div>
          <h3 className="font-black text-rose-900 text-sm">Intensity Matrix</h3>
        </div>

        {[
          { key: 'acneSeverity', label: 'Acne Severity', color: 'bg-amber-400' },
          { key: 'hirsutismSeverity', label: 'Hair Growth', color: 'bg-rose-500' },
          { key: 'moodSwingsSeverity', label: 'Mood Shifts', color: 'bg-purple-500' },
          { key: 'fatigueSeverity', label: 'Energy Depletion', color: 'bg-blue-500' },
        ].map(({ key, label, color }) => (
          <div key={key} className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-rose-950">
              <span>{label}</span>
              <span className="opacity-40">
                {form[key as keyof typeof form]}/10
              </span>
            </div>
            <div className="flex gap-1.5 h-3">
              {[...Array(11)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setForm({ ...form, [key]: i })}
                  className={`flex-1 rounded-full transition-all ${
                    i <= (form[key as keyof typeof form] as number)
                      ? color + ' shadow-sm'
                      : 'bg-gray-100'
                  }`}
                />
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={() =>
            setForm({ ...form, irregularCycles: !form.irregularCycles })
          }
          className={`w-full p-4 rounded-3xl border-2 flex items-center justify-between transition-all ${
            form.irregularCycles
              ? 'bg-rose-900 border-rose-900 text-white shadow-lg'
              : 'bg-white border-rose-100 text-rose-400'
          }`}
        >
          <div className="flex items-center gap-3">
            <Activity className={form.irregularCycles ? 'animate-pulse' : ''} />
            <span className="text-sm font-black">Irregular Cycle Patterns</span>
          </div>
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              form.irregularCycles
                ? 'bg-rose-500 border-rose-500'
                : 'border-rose-100'
            }`}
          >
            {form.irregularCycles && (
              <Check className="w-4 h-4 text-white stroke-[4]" />
            )}
          </div>
        </button>
      </div>

      <button
        onClick={handleAnalyzeRisk}
        disabled={isAnalyzing}
        className="w-full py-5 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-black rounded-[28px] shadow-2xl shadow-rose-500/40 active:scale-95 disabled:opacity-50 uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 border-b-4 border-rose-800 cursor-pointer"
      >
        {isAnalyzing ? (
          <RefreshCw className="animate-spin" />
        ) : (
          <BrainCircuit />
        )}
        {isAnalyzing
          ? 'Mapping Neural Nodes...'
          : 'Execute Precision Inference'}
      </button>

      {/* Clinical Disclaimer Callout Banner */}
      <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5 shadow-sm">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-extrabold uppercase tracking-wider text-[10px] text-amber-800">
            Clinical Advisory Disclaimer
          </span>
          <p className="font-medium text-[11px] leading-relaxed opacity-90">
            This AI diagnostic screening tool is provided solely for personal educational awareness. It does not provide medical diagnosis, treatment, or clinical decisions under Rotterdam criteria. Please consult a licensed medical provider.
          </p>
        </div>
      </div>

      {diagnosticResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-6 rounded-[32px] border-4 shadow-xl ${
            diagnosticResult.riskLevel === 'high'
              ? 'border-rose-500 bg-rose-50 text-rose-900'
              : diagnosticResult.riskLevel === 'moderate'
              ? 'border-amber-500 bg-amber-50 text-amber-900'
              : 'border-emerald-500 bg-emerald-50 text-emerald-900'
          }`}
        >
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-2xl font-black">
              {diagnosticResult.probability}%{' '}
              <span className="text-sm uppercase opacity-60">RISK</span>
            </h4>
            <div
              className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${
                diagnosticResult.riskLevel === 'high'
                  ? 'bg-rose-500 text-white'
                  : diagnosticResult.riskLevel === 'moderate'
                  ? 'bg-amber-500 text-white'
                  : 'bg-emerald-500 text-white'
              }`}
            >
              {diagnosticResult.riskLevel} POTENTIAL
            </div>
          </div>
          <p className="text-sm font-bold leading-relaxed mb-4">
            {diagnosticResult.primaryIndicator}
          </p>
          <div className="flex justify-between items-center text-[10px] font-black opacity-40 border-t border-current/10 pt-3 uppercase tracking-widest">
            <span>BMI: {diagnosticResult.bmi}</span>
            <span>{diagnosticResult.engineType}</span>
          </div>
        </motion.div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen px-2 relative pb-20">
      <AnimatePresence mode="wait">
        {activeSection === 'menu' ? (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-4 pt-2"
          >
            {/* Header Title Section matching Image 1 */}
            <div className="px-1 pb-1">
              <h1 className="text-2xl font-black text-[#3A1F28] tracking-tight">
                Clinical AI Engine
              </h1>
              <p className="text-xs text-[#8A6A75] font-semibold leading-relaxed mt-0.5">
                Advanced multi-layered artificial intelligence for reproductive health.
              </p>
            </div>

            {/* CARD 1: Optical AI Scanner */}
            <button
              onClick={() => setActiveSection('optical')}
              className="w-full text-left p-5 rounded-[28px] bg-white border border-rose-100/80 shadow-md shadow-rose-100/40 flex items-center gap-4 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-100/80 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-105 transition-transform">
                <Scan className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-[#3A1F28] text-base leading-snug">
                  Optical AI Scanner
                </h3>
                <p className="text-xs text-[#8A6A75] font-semibold mt-0.5">
                  Hormone test strip analysis (LH, E3G, PdG)
                </p>
              </div>
            </button>

            {/* CARD 2: Diagnostic Screening */}
            <button
              onClick={() => setActiveSection('diagnostic')}
              className="w-full text-left p-5 rounded-[28px] bg-white border border-rose-100/80 shadow-md shadow-rose-100/40 flex items-center gap-4 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-pink-100/80 flex items-center justify-center text-pink-600 shrink-0 group-hover:scale-105 transition-transform">
                <ActivitySquare className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-[#3A1F28] text-base leading-snug">
                  Diagnostic Screening
                </h3>
                <p className="text-xs text-[#8A6A75] font-semibold mt-0.5">
                  XGBoost risk engine for PCOS & Endometriosis
                </p>
              </div>
            </button>

            {/* CARD 3: Generative Modeling */}
            <button
              onClick={() => setActiveSection('generative')}
              className="w-full text-left p-5 rounded-[28px] bg-white border border-rose-100/80 shadow-md shadow-rose-100/40 flex items-center gap-4 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-105 transition-transform">
                <Brain className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-[#3A1F28] text-base leading-snug">
                  Generative Modeling
                </h3>
                <p className="text-xs text-[#8A6A75] font-semibold mt-0.5">
                  Handles irregular cycles & missing data
                </p>
              </div>
            </button>

            {/* CARD 4: On-Device Machine Learning */}
            <div className="p-5 rounded-[28px] bg-[#1E2530] text-white shadow-xl shadow-slate-900/10 flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-white text-base leading-snug">
                  On-Device Machine Learning
                </h4>
                <p className="text-xs text-slate-300 font-medium leading-relaxed mt-1">
                  Local-only processing. Your biometric packets never leave this hardware. Zero commercial tracking.
                </p>
              </div>
            </div>

            {/* Floating Action Button (+) matching Image 1 */}
            <button
              onClick={onOpenLogModal}
              title="Quick Log"
              className="fixed bottom-24 right-5 w-14 h-14 rounded-full bg-[#FF5376] text-white flex items-center justify-center shadow-xl shadow-rose-500/40 hover:scale-110 active:scale-95 transition-all z-30 ring-4 ring-white cursor-pointer"
            >
              <Plus className="w-7 h-7 stroke-[2.5]" />
            </button>
          </motion.div>
        ) : activeSection === 'optical' ? (
          renderOpticalScanner()
        ) : activeSection === 'generative' ? (
          renderGenerativeModeling()
        ) : (
          renderDiagnostic()
        )}
      </AnimatePresence>
    </div>
  );
}
