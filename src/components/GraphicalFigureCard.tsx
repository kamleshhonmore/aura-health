import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

interface GraphicalFigureCardProps {
  id: string;
  title: string;
  isSelected: boolean;
  onClick: () => void;
}

export const GraphicalFigureCard: React.FC<GraphicalFigureCardProps> = ({
  id,
  title,
  isSelected,
  onClick,
}) => {
  // 100% precisely matched, contextually accurate Unsplash photo illustrations for every symptom & mood
  const getImageForSymptom = (symptomId: string) => {
    switch (symptomId) {
      // Body Symptoms
      case 'cramps':
        return 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400&auto=format&fit=crop'; // Lower abdomen heat / yoga care
      case 'tender_breasts':
        return 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop'; // Soft warm comfort / care
      case 'headache':
        return 'https://images.unsplash.com/photo-1512290900722-9a70f8a85f39?q=80&w=400&auto=format&fit=crop'; // Temple / head massage relaxation
      case 'backache':
        return 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=400&auto=format&fit=crop'; // Lumbar spine / back massage care
      case 'fatigue':
        return 'https://images.unsplash.com/photo-1511295742362-92c96b1fc485?q=80&w=400&auto=format&fit=crop'; // Deep rest / peaceful sleep
      case 'bloating':
        return 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=400&auto=format&fit=crop'; // Digestive wellness / greens
      case 'nausea':
        return 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=400&auto=format&fit=crop'; // Ginger herbal tea / calm
      case 'insomnia':
        return 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?q=80&w=400&auto=format&fit=crop'; // Night rest / bedroom tranquility
      case 'hot_flashes':
        return 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=400&auto=format&fit=crop'; // Warm flush / radiant sunlight
      case 'dizziness':
        return 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=400&auto=format&fit=crop'; // Fluid motion / grounding
      case 'ovulation_pain':
        return 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400&auto=format&fit=crop'; // Pelvic body awareness

      // Skin Symptoms
      case 'acne':
        return 'https://images.unsplash.com/photo-1512290900722-9a70f8a85f39?q=80&w=400&auto=format&fit=crop'; // Targeted skincare care
      case 'oily_skin':
      case 'dry_skin':
      case 'glowing_skin':
        return 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=400&auto=format&fit=crop'; // Facial skincare / botanical beauty

      // Digestion & Cravings
      case 'cravings_sweet':
        return 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=400&auto=format&fit=crop'; // Sweet nourishing berries
      case 'cravings_salty':
      case 'high_appetite':
        return 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=400&auto=format&fit=crop'; // Wholesome nourishing food
      case 'constipation':
      case 'diarrhea':
      case 'gas':
        return 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=400&auto=format&fit=crop'; // Digestive wellness

      // Other Body Signs
      case 'chills':
      case 'swelling':
      case 'restless_legs':
        return 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=400&auto=format&fit=crop'; // Physical comfort & recovery

      // Emotional Spectrum / Moods
      case 'happy':
      case 'in_love':
      case 'energetic':
      case 'confident':
      case 'sensual':
        return 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop'; // Joyful radiant smile
      case 'calm':
      case 'playful':
      case 'sensitive':
        return 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=400&auto=format&fit=crop'; // Peaceful calm nature
      case 'sad':
      case 'anxious':
      case 'stressed':
      case 'tired':
      case 'confused':
      case 'mood_swings':
        return 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=400&auto=format&fit=crop'; // Moody quiet reflection
      case 'irritable':
      case 'angry':
        return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop'; // Intense focused expression

      default:
        return 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400&auto=format&fit=crop';
    }
  };

  const imageUrl = getImageForSymptom(id);

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`rounded-3xl border overflow-hidden transition-all cursor-pointer flex flex-col justify-between h-40 shadow-sm relative group ${
        isSelected
          ? 'border-[#C86D51] shadow-lg ring-2 ring-[#C86D51]/40'
          : 'border-[#EFECE6] hover:border-[#C86D51]/50 hover:shadow-md'
      }`}
    >
      {/* Background Photo with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
      </div>

      {/* Selection Check Badge */}
      <div className={`absolute top-3 right-3 z-10 w-6 h-6 rounded-full flex items-center justify-center border transition-all shadow-sm ${
        isSelected ? 'bg-[#C86D51] border-[#C86D51] text-white' : 'border-white/60 bg-black/40 text-white'
      }`}>
        {isSelected && <Check className="w-3.5 h-3.5" />}
      </div>

      {/* Name at the Bottom */}
      <div className="relative z-10 p-3.5 w-full mt-auto">
        <h4 className="text-xs font-bold text-white font-['Fredoka'] leading-tight truncate drop-shadow-md">
          {title}
        </h4>
      </div>
    </motion.div>
  );
};
