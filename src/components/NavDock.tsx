import React from 'react';
import { motion } from 'motion/react';
import { Home, Calendar, LayoutGrid, Bot } from 'lucide-react';

interface NavDockProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const NavDock: React.FC<NavDockProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'hub', label: 'Hub', icon: LayoutGrid },
    { id: 'aichat', label: 'AI Chat', icon: Bot },
  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 z-[500] flex justify-center px-4 pointer-events-none">
      <nav className="pointer-events-auto flex items-center gap-1 p-2 bg-white/80 backdrop-blur-xl border border-white/60 rounded-full shadow-lg shadow-black/5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (item.id === 'aichat' && activeTab === 'ai');
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id === 'ai' ? 'aichat' : item.id)}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-colors cursor-pointer select-none ${
                isActive ? 'text-white' : 'text-[#7A7571] hover:text-[#2C2A29]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeDockIndicator"
                  className="absolute inset-0 bg-[#C86D51] rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className="w-4 h-4 z-10" />
              {isActive && <span className="z-10 text-xs font-semibold font-['Fredoka']">{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
