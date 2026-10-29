import React from 'react';
import { motion } from 'motion/react';
import { Home, Calendar, LayoutGrid, Leaf, Stethoscope, ShieldAlert } from 'lucide-react';

interface NavDockProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole?: string;
}

export const NavDock: React.FC<NavDockProps> = ({ activeTab, onTabChange, userRole }) => {
  const navItems = [
    { id: 'home', label: 'Cycle', icon: Home },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'ayurveda', label: 'Ayurveda', icon: Leaf },
    { id: 'doctors', label: 'Doctors', icon: Stethoscope },
    { id: 'hub', label: 'Hub', icon: LayoutGrid },
  ];

  return (
    <div className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] left-0 right-0 z-[500] flex justify-center px-4 pointer-events-none">
      <nav className="pointer-events-auto flex items-center gap-1 p-1.5 sm:p-2 bg-white/90 backdrop-blur-xl border border-white/80 rounded-full shadow-lg shadow-black/8 touch-manipulation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (item.id === 'aichat' && activeTab === 'ai');
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id === 'ai' ? 'aichat' : item.id)}
              className={`relative flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all active:scale-95 cursor-pointer select-none ${
                isActive ? 'text-white' : 'text-[#7A7571] hover:text-[#2C2A29]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeDockIndicator"
                  className="absolute inset-0 bg-[#C86D51] rounded-full shadow-md shadow-[#C86D51]/30"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className="w-4 h-4 z-10 shrink-0" />
              {isActive && <span className="z-10 text-[11px] sm:text-xs font-semibold font-['Fredoka'] whitespace-nowrap">{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
