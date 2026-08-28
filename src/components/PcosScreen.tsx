import React, { useState } from 'react';
import { QuizQuestion, PcosAssessmentResult } from '../types';
import { rotterdamQuestions, defaultAssessmentResult } from '../data';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Stethoscope,
  Info,
  Sparkles,
  ClipboardList,
  MessageSquare
} from 'lucide-react';

interface PcosScreenProps {
  onBackToHome?: () => void;
}

export const PcosScreen: React.FC<PcosScreenProps> = () => {
  const [isTakingQuiz, setIsTakingQuiz] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [result, setResult] = useState<PcosAssessmentResult>(defaultAssessmentResult);

  const currentQuestion = rotterdamQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / rotterdamQuestions.length) * 100;
  const isLastQuestion = currentQuestionIndex === rotterdamQuestions.length - 1;

  const handleSelectOption = (question: QuizQuestion, optionId: string) => {
    if (question.isMultiSelect) {
      if (selectedOptionIds.includes(optionId)) {
        setSelectedOptionIds(selectedOptionIds.filter((id) => id !== optionId));
      } else {
        // If selecting none of these, clear others
        if (optionId === 'q2_o4') {
          setSelectedOptionIds(selectedOptionIds.filter((id) => !id.startsWith(question.id)).concat(optionId));
        } else {
          const filtered = selectedOptionIds.filter((id) => id !== 'q2_o4');
          setSelectedOptionIds([...filtered, optionId]);
        }
      }
    } else {
      const filtered = selectedOptionIds.filter((id) => !id.startsWith(question.id));
      setSelectedOptionIds([...filtered, optionId]);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < rotterdamQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = () => {
    // Calculate total score
    let score = 0;
    rotterdamQuestions.forEach((q) => {
      q.options.forEach((opt) => {
        if (selectedOptionIds.includes(opt.id)) {
          score += opt.score;
        }
      });
    });

    const finalScore = Math.min(100, Math.max(8, score));
    let level: 'Low' | 'Moderate' | 'Elevated' = 'Low';
    let summaryText = '';

    if (finalScore >= 55) {
      level = 'Elevated';
      summaryText = 'Multiple classic Rotterdam diagnostic phenotypes detected (menstrual irregularities, androgen excess symptoms, metabolic fluctuations). Comprehensive clinical endocrine evaluation is strongly indicated.';
    } else if (finalScore >= 30) {
      level = 'Moderate';
      summaryText = 'Moderate overlap with PCOS sub-phenotypes detected. May reflect metabolic sensitivity, subclinical hyperandrogenism, or post-pill cycle adjustment.';
    } else {
      level = 'Low';
      summaryText = 'Your reported cycle regularity and metabolic markers align with a standard physiological baseline with minimal androgenic indicators.';
    }

    setResult({
      ...result,
      riskScore: finalScore,
      riskLevel: level,
      summary: summaryText
    });

    setIsTakingQuiz(false);
  };

  const handleRetake = () => {
    setSelectedOptionIds([]);
    setCurrentQuestionIndex(0);
    setIsTakingQuiz(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {isTakingQuiz ? (
        /* Questionnaire View */
        <div className="bg-[#181B24] border border-white/8 rounded-3xl p-6 space-y-6 shadow-2xl">
          {/* Progress Header */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#E29587]">PCOS Clinical Assessment</span>
              <span className="text-[#8E97A8]">Step {currentQuestionIndex + 1} of {rotterdamQuestions.length}</span>
            </div>
            <div className="w-full h-1.5 bg-[#202430] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#E29587] to-[#E5C388] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Meta */}
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider bg-[#9CAF88]/15 text-[#9CAF88] border border-[#9CAF88]/30 mb-2">
              {currentQuestion.category}
            </span>
            <h2 className="text-lg font-bold text-white leading-snug">
              {currentQuestion.title}
            </h2>
            <p className="text-xs text-[#8E97A8] mt-1 leading-relaxed">
              {currentQuestion.explanation}
            </p>
            {currentQuestion.isMultiSelect && (
              <span className="text-[11px] text-[#E5C388] font-medium block mt-1">
                • Select all options that apply
              </span>
            )}
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQuestion.options.map((opt) => {
              const isSelected = selectedOptionIds.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(currentQuestion, opt.id)}
                  className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#E29587]/15 border-[#E29587] text-white shadow-md'
                      : 'bg-[#12141C] border-white/5 text-[#C4C9D6] hover:border-white/15'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 border shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-[#E29587] border-[#E29587] text-[#111318]'
                        : 'border-[#586072] bg-transparent'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <div className="text-sm font-semibold leading-tight">{opt.title}</div>
                    {opt.subtitle && (
                      <div className="text-xs text-[#8E97A8] mt-0.5 leading-normal">
                        {opt.subtitle}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex gap-3 pt-2">
            {currentQuestionIndex > 0 && (
              <button
                onClick={handlePrevious}
                className="flex-1 py-3 px-4 rounded-xl bg-[#202430] hover:bg-[#2A3040] text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>
            )}

            <button
              onClick={isLastQuestion ? handleSubmitQuiz : handleNext}
              className="flex-[2] py-3 px-4 rounded-xl bg-[#E29587] hover:bg-[#EAA194] text-[#111318] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-[#E29587]/20"
            >
              <span>{isLastQuestion ? 'Calculate Diagnostic Index' : 'Next Step'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="space-y-5">
          {/* Header Bar */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">PCOS Clinical Profile</h1>
              <p className="text-xs text-[#7E8799]">Rotterdam Consensus Consensus Stratification</p>
            </div>

            <button
              onClick={handleRetake}
              className="px-3 py-1.5 rounded-xl bg-[#202430] hover:bg-[#2A3040] text-[#E29587] text-xs font-semibold flex items-center gap-1.5 border border-white/8 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retake Assessment
            </button>
          </div>

          {/* 1. Score Breakdown Card */}
          <div className="p-6 bg-gradient-to-b from-[#1E222D] to-[#14161F] border border-white/10 rounded-3xl text-center space-y-4 shadow-xl">
            <span
              className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                result.riskLevel === 'Low'
                  ? 'bg-[#9CAF88]/20 text-[#9CAF88] border border-[#9CAF88]/40'
                  : result.riskLevel === 'Moderate'
                  ? 'bg-[#E5C388]/20 text-[#E5C388] border border-[#E5C388]/40'
                  : 'bg-[#E29587]/20 text-[#E29587] border border-[#E29587]/40'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              {result.riskLevel} Risk Profile ({result.riskScore}%)
            </span>

            <div className="text-5xl font-extrabold text-white tracking-tight">
              {result.riskScore}
              <span className="text-sm font-normal text-[#7E8799] ml-1">/ 100</span>
            </div>

            {/* Linear Progress Indicator */}
            <div className="w-full h-2.5 bg-[#202430] rounded-full overflow-hidden max-w-xs mx-auto">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  result.riskLevel === 'Low'
                    ? 'bg-[#9CAF88]'
                    : result.riskLevel === 'Moderate'
                    ? 'bg-[#E5C388]'
                    : 'bg-[#E29587]'
                }`}
                style={{ width: `${result.riskScore}%` }}
              />
            </div>

            <p className="text-xs text-[#9DA4B5] max-w-md mx-auto leading-relaxed">
              {result.summary}
            </p>
          </div>

          {/* 2. Rotterdam Consensus Diagnostic Match */}
          <div className="p-5 bg-[#181B24] border border-white/8 rounded-3xl space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <CheckCircle2 className="w-4 h-4 text-[#9CAF88]" />
              Rotterdam Diagnostic Criteria Evaluated
            </div>
            <div className="space-y-2">
              {result.rotterdamCriteriaMatched.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#12141C] text-xs text-[#C4C9D6]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9CAF88] mt-1.5 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Recommended Action Plan */}
          <div className="p-5 bg-[#181B24] border border-white/8 rounded-3xl space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <ClipboardList className="w-4 h-4 text-[#E29587]" />
              Evidence-Based Next Steps
            </div>
            <div className="space-y-2">
              {result.recommendedNextSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-[#12141C] border border-white/5">
                  <div className="w-5 h-5 rounded-full bg-[#E29587]/15 text-[#E29587] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <span className="text-xs text-[#9DA4B5] leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Questions for OB-GYN */}
          <div className="p-5 bg-[#181B24] border border-white/8 rounded-3xl space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <MessageSquare className="w-4 h-4 text-[#E5C388]" />
              Questions to Discuss With Your Doctor
            </div>
            <div className="space-y-2">
              {result.doctorDiscussionPoints.map((q, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-[#12141C] border border-white/5 text-xs text-[#C4C9D6] italic">
                  “{q}”
                </div>
              ))}
            </div>
          </div>

          {/* 5. Mandatory Medical Disclaimer */}
          <div className="p-4 bg-[#12141C] border border-white/5 rounded-2xl flex items-start gap-2.5 text-[11px] text-[#7E8799] leading-relaxed">
            <Info className="w-4 h-4 text-[#7E8799] shrink-0 mt-0.5" />
            <p>{result.disclaimer}</p>
          </div>
        </div>
      )}
    </div>
  );
};
