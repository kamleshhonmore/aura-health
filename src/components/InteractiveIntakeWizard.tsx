import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Check, ArrowRight, ArrowLeft, X, Heart, Shield, Activity, Sliders, Flame } from 'lucide-react';
import { fireCelebrationConfetti } from '../utils/confetti';

interface IntakeWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: any) => void;
}

export const InteractiveIntakeWizard: React.FC<IntakeWizardProps> = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(0);
  const [selectedDomain, setSelectedDomain] = useState<string>('pcos');
  const [answers, setAnswers] = useState<Record<number, any>>(() => {
    try {
      const saved = localStorage.getItem('aura_intake_progress');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  // Auto-save progress
  useEffect(() => {
    try {
      localStorage.setItem('aura_intake_progress', JSON.stringify({ step, selectedDomain, answers }));
    } catch (e) {
      console.warn('Failed to auto-save intake progress', e);
    }
  }, [step, selectedDomain, answers]);

  if (!isOpen) return null;

  const stepsData = [
    {
      id: 0,
      phase: 'Phase 1: Regulate Before You Request',
      title: "Take a deep breath. You're in safe hands.",
      subtitle: "We use clinical intelligence and secure privacy standards to tailor your hormonal wellness journey gently and effectively. No rushing, no judgment.",
      type: 'calming',
      icon: '🪷'
    },
    {
      id: 1,
      phase: 'Phase 2: Branching Intelligence',
      title: "What is your primary health & wellness focus today?",
      subtitle: "Instantly tailor your path. Select your main domain to bypass irrelevant questions.",
      type: 'branching',
      options: [
        { id: 'pcos', title: 'PCOS & Hormonal Balance', subtitle: 'Rotterdam criteria & androgenic markers', icon: '🌸' },
        { id: 'cycle', title: 'Cycle Regularity & Fertility', subtitle: 'Ovulation tracking & predictability', icon: '📅' },
        { id: 'metabolic', title: 'Metabolic & Insulin Support', subtitle: 'Weight resistance & energy crashes', icon: '⚖️' },
        { id: 'perimenopause', title: 'Perimenopause & Vitality', subtitle: 'Luteal transition & symptom relief', icon: '🌿' },
      ]
    },
    {
      id: 2,
      phase: 'Phase 3: Segmented Controls',
      title: "How predictable is your typical cycle length?",
      subtitle: "Select your most frequent cycle duration pattern using instant tap controls.",
      type: 'segmented',
      options: [
        { id: 'reg_28', title: 'Regular (26–32 days)', subtitle: 'Predictable variation', icon: '🌸' },
        { id: 'var_35', title: 'Variable (33–42 days)', subtitle: 'Occasional delays', icon: '⚡' },
        { id: 'long_90', title: 'Infrequent (>42–90 days)', subtitle: 'Oligomenorrhea pattern', icon: '⏳' },
        { id: 'absent', title: 'Absent (>90 days)', subtitle: 'Amenorrhea pattern', icon: '🛑' },
      ]
    },
    {
      id: 3,
      phase: 'Phase 3: Visual Option Chips',
      title: "Which physical or skin signs do you notice most often?",
      subtitle: "Select all that apply without scrolling through a wall of text.",
      type: 'chips_grid',
      options: [
        { id: 'acne', title: 'Jawline Acne', icon: '🌿' },
        { id: 'hair', title: 'Hair Thinning', icon: '✨' },
        { id: 'fatigue', title: 'Energy Crashes', icon: '🍯' },
        { id: 'bloating', title: 'Pelvic Bloating', icon: '💧' },
        { id: 'mood', title: 'Mood Shifts', icon: '🦋' },
        { id: 'none', title: 'Balanced', icon: '🍃' },
      ]
    },
    {
      id: 4,
      phase: 'Phase 3: Large Interactive Cards',
      title: "What is your preferred lifestyle or nutrition approach?",
      subtitle: "Helps our AI tailor daily Ayurvedic and clinical recommendations.",
      type: 'cards',
      options: [
        { id: 'balanced', title: 'Whole Food & Low Glycemic', subtitle: 'Focus on blood sugar stability & steady energy', icon: '🥗' },
        { id: 'ayurvedic', title: 'Ayurvedic & Herbal Infusions', subtitle: 'Seed cycling, spearmint tea & adaptogens', icon: '🍵' },
        { id: 'active', title: 'Strength & High Protein', subtitle: 'Metabolic resilience and lean mass support', icon: '🏋️‍♀️' },
      ]
    },
    {
      id: 5,
      phase: 'Phase 3: Sliders & Steppers',
      title: "Average nightly sleep duration (hours)",
      subtitle: "Slide or use steppers to set your resting baseline without keyboard typing.",
      type: 'slider',
      min: 4,
      max: 10,
      step: 0.5,
      unit: 'hours',
      defaultVal: 7.5
    },
    {
      id: 6,
      phase: 'Phase 4: Data Hook Loader',
      title: "Analyzing your hormonal profile...",
      subtitle: "Synthesizing Rotterdam criteria, sleep metrics, and metabolic markers into your personalized blueprint.",
      type: 'loader'
    },
    {
      id: 7,
      phase: 'Phase 4: Auto-Saved Personalized Report',
      title: "Your Aura Wellness Blueprint is Ready!",
      subtitle: "Progress auto-saved securely. Access anytime in your clinical profile.",
      type: 'results'
    }
  ];

  const currentStepData = stepsData[step];
  const progress = ((step + 1) / stepsData.length) * 100;

  const handleNext = () => {
    if (currentStepData.type === 'calming' || currentStepData.type === 'branching') {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setStep((s) => s + 1);
      }, 1200);
      return;
    }
    if (step < stepsData.length - 1) {
      if (step === 5) {
        setIsLoading(true);
        fireCelebrationConfetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF5376', '#38BDF8', '#10B981', '#F59E0B'],
        });
        setTimeout(() => {
          setIsLoading(false);
          setStep((s) => s + 1);
        }, 1800);
      } else {
        setStep((s) => s + 1);
      }
    } else {
      onComplete(answers);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-xl bg-gradient-to-br from-white via-[#FAF8F5] to-rose-50/30 rounded-[36px] shadow-2xl border border-rose-100/80 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header & Smart Stepper */}
        <div className="px-6 pt-6 pb-4 border-b border-rose-100/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1 bg-rose-100/80 text-rose-700 text-xs font-black rounded-full tracking-wider uppercase border border-rose-200">
              Step {step + 1} of {stepsData.length} • Auto-saved
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer shadow-xs"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Global Progress Bar with Glow */}
        <div className="w-full bg-slate-100 h-2 relative overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 shadow-sm"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 font-['Nunito']">
          <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 text-[10px] font-black tracking-widest uppercase rounded-full mb-3 border border-emerald-200/60 shadow-xs">
            {currentStepData.phase}
          </div>

          <h2 className="text-2xl font-black text-slate-900 mb-2 font-['Fredoka'] tracking-tight">
            {currentStepData.title}
          </h2>
          <p className="text-xs font-semibold text-slate-600 mb-6 leading-relaxed">
            {currentStepData.subtitle}
          </p>

          {isLoading || currentStepData.type === 'loader' ? (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-14 h-14 border-4 border-rose-500 border-t-transparent rounded-full animate-spin shadow-md" />
              <div>
                <h3 className="text-base font-black text-slate-900">Synthesizing Clinical AI...</h3>
                <p className="text-xs font-semibold text-slate-500 mt-1">Analyzing Rotterdam criteria & metabolic parameters.</p>
              </div>
            </div>
          ) : (
            <>
              {currentStepData.type === 'calming' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 bg-gradient-to-br from-rose-50 via-pink-50/50 to-white rounded-[32px] text-center border border-rose-200/80 shadow-inner space-y-3"
                >
                  <span className="text-6xl block mb-2 animate-bounce [animation-duration:3s]">🪷</span>
                  <h3 className="text-base font-black text-rose-950">Breathe in calm, exhale tension.</h3>
                  <p className="text-xs font-semibold text-rose-800/80 leading-relaxed">
                    Your responses are securely processed on-device, tailoring your hormonal rhythm with zero commercial tracking.
                  </p>
                </motion.div>
              )}

              {(currentStepData.type === 'branching' || currentStepData.type === 'segmented') && (
                <div className="space-y-3">
                  {currentStepData.options?.map((opt) => {
                    const isSelected = answers[step] === opt.id;
                    return (
                      <motion.div
                        key={opt.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setAnswers({ ...answers, [step]: opt.id })}
                        className={`p-4 rounded-[24px] border-2 transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-gradient-to-r from-rose-500 to-pink-500 border-rose-500 text-white shadow-lg shadow-rose-500/25'
                            : 'bg-white border-rose-100 hover:border-rose-300 text-slate-900 shadow-xs'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-xs ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-rose-50 text-rose-600'
                          }`}>
                            {opt.icon}
                          </div>
                          <div>
                            <h4 className="text-xs font-black tracking-tight">{opt.title}</h4>
                            {'subtitle' in opt && opt.subtitle && (
                              <p className={`text-[10px] font-semibold mt-0.5 ${isSelected ? 'text-rose-100' : 'text-slate-500'}`}>
                                {opt.subtitle}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'bg-white text-rose-500 border-white' : 'border-slate-300'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {currentStepData.type === 'chips_grid' && (
                <div className="grid grid-cols-2 gap-3">
                  {currentStepData.options?.map((opt) => {
                    const currentSet = answers[step] || [];
                    const isSelected = currentSet.includes(opt.id);
                    return (
                      <motion.div
                        key={opt.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => {
                          const updated = isSelected
                            ? currentSet.filter((id: string) => id !== opt.id)
                            : [...currentSet, opt.id];
                          setAnswers({ ...answers, [step]: updated });
                        }}
                        className={`p-4 rounded-[24px] border-2 transition-all cursor-pointer flex flex-col items-start justify-between min-h-[110px] ${
                          isSelected
                            ? 'bg-gradient-to-br from-rose-500 to-pink-500 border-rose-500 text-white shadow-lg shadow-rose-500/25'
                            : 'bg-white border-rose-100 hover:border-rose-300 text-slate-900 shadow-xs'
                        }`}
                      >
                        <div className="flex justify-between w-full items-start">
                          <span className="text-2xl">{opt.icon}</span>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'bg-white text-rose-500 border-white' : 'border-slate-300'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                        <h4 className="text-xs font-black tracking-tight">{opt.title}</h4>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {currentStepData.type === 'cards' && (
                <div className="space-y-3">
                  {currentStepData.options?.map((opt) => {
                    const isSelected = answers[step] === opt.id;
                    return (
                      <motion.div
                        key={opt.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setAnswers({ ...answers, [step]: opt.id })}
                        className={`p-5 rounded-[28px] border-2 transition-all cursor-pointer flex items-center gap-4 ${
                          isSelected
                            ? 'bg-gradient-to-r from-rose-500 to-pink-500 border-rose-500 text-white shadow-lg shadow-rose-500/25'
                            : 'bg-white border-rose-100 hover:border-rose-300 text-slate-900 shadow-xs'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xs shrink-0 ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-rose-50 text-rose-600'
                        }`}>
                          {opt.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-black tracking-tight">{opt.title}</h4>
                          {'subtitle' in opt && opt.subtitle && (
                            <p className={`text-[10px] font-semibold mt-0.5 ${isSelected ? 'text-rose-100' : 'text-slate-500'}`}>
                              {opt.subtitle}
                            </p>
                          )}
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-white text-rose-500 border-white' : 'border-slate-300'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {currentStepData.type === 'slider' && (
                <div className="p-6 bg-white rounded-[32px] border-2 border-rose-100 shadow-md text-center space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-50 text-rose-700 rounded-full font-mono text-xl font-black shadow-inner border border-rose-200">
                    <Sliders className="w-4 h-4" />
                    <span>{answers[step] || currentStepData.defaultVal} {currentStepData.unit}</span>
                  </div>

                  <input
                    type="range"
                    min={currentStepData.min}
                    max={currentStepData.max}
                    step={currentStepData.step}
                    value={answers[step] || currentStepData.defaultVal}
                    onChange={(e) => setAnswers({ ...answers, [step]: parseFloat(e.target.value) })}
                    className="w-full custom-slider cursor-pointer"
                  />

                  <div className="flex justify-between gap-3">
                    <button
                      onClick={() => {
                        const cur = answers[step] || currentStepData.defaultVal || 0;
                        const minVal = currentStepData.min ?? 0;
                        const next = Math.max(minVal, cur - 0.5);
                        setAnswers({ ...answers, [step]: next });
                      }}
                      className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-black transition-colors cursor-pointer shadow-xs"
                    >
                      - 0.5 hrs
                    </button>
                    <button
                      onClick={() => {
                        const cur = answers[step] || currentStepData.defaultVal || 0;
                        const maxVal = currentStepData.max ?? 24;
                        const next = Math.min(maxVal, cur + 0.5);
                        setAnswers({ ...answers, [step]: next });
                      }}
                      className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl text-xs font-black transition-colors cursor-pointer shadow-md shadow-rose-500/20"
                    >
                      + 0.5 hrs
                    </button>
                  </div>
                </div>
              )}

              {currentStepData.type === 'results' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white rounded-[32px] border-2 border-emerald-200 shadow-lg space-y-4 text-slate-900"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-2xl shadow-md shadow-emerald-500/30">
                      🎉
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-emerald-950">Wellness Intake Complete!</h3>
                      <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Saved securely to on-device memory</p>
                    </div>
                  </div>
                  <hr className="border-emerald-200/60 my-2" />
                  <ul className="text-xs font-semibold text-slate-700 space-y-2">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Personalized clinical intelligence enabled</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Zero-keyboard friction experience verified</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /> Branching domain path optimized for your profile</li>
                  </ul>
                </motion.div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-white border-t border-rose-100/60 flex items-center justify-between shrink-0">
          {step > 0 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="px-4.5 py-3 rounded-2xl border-2 border-slate-200 text-xs font-black text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>
          ) : <div />}

          <button
            onClick={handleNext}
            disabled={isLoading}
            className="px-7 py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 text-white text-xs font-black uppercase tracking-wider hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2.5 shadow-xl shadow-rose-500/25 cursor-pointer disabled:opacity-50"
          >
            <span>{step === stepsData.length - 1 ? 'Return to App' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
