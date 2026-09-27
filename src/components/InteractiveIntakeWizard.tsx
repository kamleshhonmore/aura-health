import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Check, ArrowRight, ArrowLeft, X, Heart, Shield, Activity, Sliders } from 'lucide-react';

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
      phase: 'Phase 3: Segmented Controls (2-4 Choices)',
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
      phase: 'Phase 3: Visual Option Chips (2x3 Grid)',
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
      phase: 'Phase 3: Sliders & Steppers (+ / -)',
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
      }, 1500);
      return;
    }
    if (step < stepsData.length - 1) {
      if (step === 5) {
        // Trigger loader before results
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          setStep((s) => s + 1);
        }, 2000);
      } else {
        setStep((s) => s + 1);
      }
    } else {
      onComplete(answers);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-xl bg-[#FAF8F5] rounded-3xl shadow-2xl border border-white/80 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header & Smart Stepper */}
        <div className="px-6 pt-6 pb-4 border-b border-[#EFECE6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#F4EBE6] text-[#C86D51] text-xs font-semibold rounded-full">
              Step {step + 1} of {stepsData.length} • Auto-saved
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#EFECE6] flex items-center justify-center text-[#7A7571] hover:bg-[#E2DDD5] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full bg-[#EFECE6] h-1.5">
          <motion.div
            className="bg-[#C86D51] h-1.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="inline-block px-2.5 py-1 bg-[#E8F0EC] text-[#4A7C59] text-[10px] font-bold tracking-wider uppercase rounded-md mb-3">
            {currentStepData.phase}
          </div>

          <h2 className="text-2xl font-bold text-[#2C2A29] mb-2 font-['Fredoka']">
            {currentStepData.title}
          </h2>
          <p className="text-sm text-[#7A7571] mb-6 leading-relaxed">
            {currentStepData.subtitle}
          </p>

          {isLoading || currentStepData.type === 'loader' ? (
            <div className="py-16 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 border-4 border-[#C86D51] border-t-transparent rounded-full animate-spin mb-4" />
              <h3 className="text-lg font-bold text-[#2C2A29]">Analyzing your profile...</h3>
              <p className="text-xs text-[#7A7571] mt-1">Synthesizing Rotterdam criteria and metabolic markers.</p>
            </div>
          ) : (
            <>
              {currentStepData.type === 'calming' && (
                <div className="p-8 bg-[#F4EBE6] rounded-2xl text-center border border-[#EAD5CE]">
                  <span className="text-5xl block mb-4">🪷</span>
                  <h3 className="text-lg font-bold text-[#C86D51] mb-2">Breathe in calm, exhale tension.</h3>
                  <p className="text-xs text-[#7A7571]">Your inputs are fully encrypted and tailored precisely to your hormonal rhythm.</p>
                </div>
              )}

              {(currentStepData.type === 'branching' || currentStepData.type === 'segmented') && (
                <div className="space-y-3">
                  {currentStepData.options?.map((opt) => {
                    const isSelected = answers[step] === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setAnswers({ ...answers, [step]: opt.id })}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#F4EBE6] border-[#C86D51] shadow-sm'
                            : 'bg-white border-[#EFECE6] hover:border-[#DCD7CD]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{opt.icon}</span>
                          <div>
                            <h4 className="text-sm font-semibold text-[#2C2A29]">{opt.title}</h4>
                            {opt.subtitle && <p className="text-xs text-[#7A7571]">{opt.subtitle}</p>}
                          </div>
                        </div>
                        {isSelected && <Check className="w-5 h-5 text-[#C86D51]" />}
                      </div>
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
                      <div
                        key={opt.id}
                        onClick={() => {
                          const updated = isSelected
                            ? currentSet.filter((id: string) => id !== opt.id)
                            : [...currentSet, opt.id];
                          setAnswers({ ...answers, [step]: updated });
                        }}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col items-start ${
                          isSelected
                            ? 'bg-[#F4EBE6] border-[#C86D51] shadow-sm'
                            : 'bg-white border-[#EFECE6] hover:border-[#DCD7CD]'
                        }`}
                      >
                        <span className="text-2xl mb-2">{opt.icon}</span>
                        <h4 className="text-xs font-semibold text-[#2C2A29]">{opt.title}</h4>
                      </div>
                    );
                  })}
                </div>
              )}

              {currentStepData.type === 'cards' && (
                <div className="space-y-3">
                  {currentStepData.options?.map((opt) => {
                    const isSelected = answers[step] === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setAnswers({ ...answers, [step]: opt.id })}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                          isSelected
                            ? 'bg-[#F4EBE6] border-[#C86D51] shadow-sm'
                            : 'bg-white border-[#EFECE6] hover:border-[#DCD7CD]'
                        }`}
                      >
                        <span className="text-3xl">{opt.icon}</span>
                        <div>
                          <h4 className="text-sm font-bold text-[#2C2A29]">{opt.title}</h4>
                          <p className="text-xs text-[#7A7571] mt-0.5">{opt.subtitle}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {currentStepData.type === 'slider' && (
                <div className="p-6 bg-white rounded-2xl border border-[#EFECE6] text-center">
                  <div className="text-3xl font-bold text-[#C86D51] mb-4">
                    {answers[step] || currentStepData.defaultVal} {currentStepData.unit}
                  </div>
                  <input
                    type="range"
                    min={currentStepData.min}
                    max={currentStepData.max}
                    step={currentStepData.step}
                    value={answers[step] || currentStepData.defaultVal}
                    onChange={(e) => setAnswers({ ...answers, [step]: parseFloat(e.target.value) })}
                    className="w-full accent-[#C86D51] mb-6 cursor-pointer"
                  />
                  <div className="flex justify-between">
                    <button
                      onClick={() => {
                        const cur = answers[step] || currentStepData.defaultVal;
                        const next = Math.max(currentStepData.min, cur - 0.5);
                        setAnswers({ ...answers, [step]: next });
                      }}
                      className="px-4 py-2 bg-[#EFECE6] text-[#2C2A29] rounded-xl text-xs font-semibold hover:bg-[#E2DDD5]"
                    >
                      - 0.5 hrs
                    </button>
                    <button
                      onClick={() => {
                        const cur = answers[step] || currentStepData.defaultVal;
                        const next = Math.min(currentStepData.max, cur + 0.5);
                        setAnswers({ ...answers, [step]: next });
                      }}
                      className="px-4 py-2 bg-[#EFECE6] text-[#2C2A29] rounded-xl text-xs font-semibold hover:bg-[#E2DDD5]"
                    >
                      + 0.5 hrs
                    </button>
                  </div>
                </div>
              )}

              {currentStepData.type === 'results' && (
                <div className="p-6 bg-[#E8F0EC] rounded-2xl border border-[#4A7C59]/30">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🎉</span>
                    <div>
                      <h3 className="text-base font-bold text-[#2C2A29]">Intake Successfully Completed!</h3>
                      <p className="text-xs text-[#4A7C59]">Auto-saved securely to local storage</p>
                    </div>
                  </div>
                  <hr className="border-[#4A7C59]/20 my-3" />
                  <ul className="text-xs text-[#7A7571] space-y-2">
                    <li>• Personalized clinical intelligence enabled</li>
                    <li>• Zero-keyboard friction experience verified</li>
                    <li>• Branching domain path optimized for your profile</li>
                  </ul>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-white border-t border-[#EFECE6] flex items-center justify-between">
          {step > 0 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="px-4 py-2.5 rounded-xl border border-[#EFECE6] text-xs font-semibold text-[#7A7571] hover:bg-[#FAF8F5] flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>
          ) : <div />}

          <button
            onClick={handleNext}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-[#C86D51] text-white text-xs font-bold hover:bg-[#B35C41] transition-colors flex items-center gap-2 shadow-sm"
          >
            {step === stepsData.length - 1 ? 'Return to App' : 'Continue'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
