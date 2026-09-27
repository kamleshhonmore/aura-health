import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

interface GraphicalCardProps {
  id: string;
  title: string;
  subtitle?: string;
  isSelected: boolean;
  onClick: () => void;
  category?: string;
}

export const GraphicalSymptomCard: React.FC<GraphicalCardProps> = ({
  id,
  title,
  subtitle,
  isSelected,
  onClick,
}) => {
  // Render gorgeous medium-sized graphical vector figures based on ID
  const renderFigure = () => {
    switch (id) {
      case 'cramps':
        return (
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5376]/20 to-[#FF85A1]/40 flex items-center justify-center text-[#FF5376] shadow-sm">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <div className="absolute inset-0 rounded-2xl border border-[#FF5376]/40 animate-pulse" />
          </div>
        );
      case 'tender_breasts':
        return (
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#C86D51]/20 to-[#E29578]/40 flex items-center justify-center text-[#C86D51] shadow-sm">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </div>
        );
      case 'headache':
        return (
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#7B6B8D]/20 to-[#9D8CB0]/40 flex items-center justify-center text-[#7B6B8D] shadow-sm">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 3v18M3 12h18" />
            </svg>
          </div>
        );
      case 'bloating':
        return (
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#4A7C59]/20 to-[#81C784]/40 flex items-center justify-center text-[#4A7C59] shadow-sm">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="12" cy="12" rx="9" ry="6" />
              <path d="M12 6v12" />
            </svg>
          </div>
        );
      case 'acne':
      case 'oily_skin':
      case 'dry_skin':
      case 'glowing_skin':
        return (
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#10B981]/20 to-[#6EE7B7]/40 flex items-center justify-center text-[#10B981] shadow-sm">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#C86D51]/20 to-[#E29578]/40 flex items-center justify-center text-[#C86D51] shadow-sm">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
        );
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`p-3.5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between h-32 shadow-xs ${
        isSelected
          ? 'bg-gradient-to-br from-[#F4EBE6] to-[#FAF3F0] border-[#C86D51] shadow-md ring-2 ring-[#C86D51]/30'
          : 'bg-white border-[#EFECE6] hover:border-[#C86D51]/50 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between">
        {renderFigure()}
        <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
          isSelected ? 'bg-[#C86D51] border-[#C86D51] text-white' : 'border-stone-300 bg-transparent'
        }`}>
          {isSelected && <Check className="w-3 h-3" />}
        </div>
      </div>
      <div>
        <h4 className="text-xs font-bold text-[#2C2A29] font-['Fredoka'] truncate">{title}</h4>
        {subtitle && <p className="text-[10px] text-[#7A7571] truncate">{subtitle}</p>}
      </div>
    </motion.div>
  );
};
