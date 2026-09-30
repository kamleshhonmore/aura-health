import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Globe, Stethoscope } from 'lucide-react';

interface SplashProps {
  onFinish: () => void;
}

export const SplashWelcomeScreen: React.FC<SplashProps> = ({ onFinish }) => {
  const [phase, setPhase] = useState<1 | 2>(1);

  useEffect(() => {
    const phaseTimer = setTimeout(() => {
      setPhase(2);
    }, 1500);

    const finishTimer = setTimeout(() => {
      onFinish();
    }, 3200);

    return () => {
      clearTimeout(phaseTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  const gridDots = Array.from({ length: 24 });

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center p-6 font-['Nunito'] overflow-hidden select-none"
    >
      {/* Background Transition */}
      <motion.div
        animate={{
          background: phase === 1
            ? '#020617'
            : 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 30%, #ec4899 70%, #be185d 100%)',
        }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
        className="absolute inset-0"
      />

      {/* Phase 1: Expanding Grid Dots */}
      <AnimatePresence>
        {phase === 1 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-full max-w-md flex items-center justify-center">
              {gridDots.map((_, i) => {
                const offset = (i - 12) * 16;
                return (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, x: 0, opacity: 0 }}
                    animate={{
                      scale: [0, 1.2, 1],
                      x: offset * 3,
                      opacity: [0, 1, 0.6],
                    }}
                    transition={{
                      duration: 1.2,
                      ease: 'easeOut',
                      delay: i * 0.02,
                    }}
                    className={`absolute w-2.5 h-2.5 rounded-full ${
                      i % 2 === 0 ? 'bg-cyan-400 shadow-[0_0_12px_#22d3ee]' : 'bg-pink-500 shadow-[0_0_12px_#ec4899]'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Central 3D Medical Health Graphics (Globe + Heart + Stethoscope) */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {phase === 1 ? (
            <motion.div
              key="badge"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.4, opacity: 0, filter: 'blur(8px)' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="w-24 h-24 rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-600 shadow-[0_0_40px_rgba(244,63,94,0.6)] flex items-center justify-center border-2 border-pink-300/50"
            >
              <Heart className="w-10 h-10 text-white fill-white animate-pulse" />
            </motion.div>
          ) : (
            <motion.div
              key="3dscene"
              initial={{ scale: 0.5, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 220 }}
              className="relative flex items-center justify-center mb-6"
            >
              {/* 3D Health Illustration Container */}
              <div className="relative w-44 h-44 flex items-center justify-center">
                {/* Glowing Aura Ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/30 to-pink-500/30 blur-2xl animate-pulse" />

                {/* 3D Globe Representation */}
                <div className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-blue-600 via-sky-400 to-emerald-400 shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.5),0_15px_30px_rgba(0,0,0,0.4)] flex items-center justify-center animate-spin [animation-duration:20s]">
                  <Globe className="w-20 h-20 text-white/30" />
                </div>

                {/* 3D Floating Heart on top of Globe */}
                <motion.div
                  animate={{ scale: [1, 1.12, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                  className="absolute -top-2 -right-2 w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 via-red-500 to-pink-600 shadow-[0_10px_25px_rgba(244,63,94,0.6)] flex items-center justify-center border border-white/40 transform rotate-12"
                >
                  <Heart className="w-9 h-9 text-white fill-white drop-shadow-md" />
                </motion.div>

                {/* Stethoscope Accent Ring */}
                <div className="absolute -bottom-2 -left-2 w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-200 via-slate-400 to-slate-300 shadow-lg flex items-center justify-center border border-white/60 transform -rotate-12">
                  <Stethoscope className="w-7 h-7 text-slate-800" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 2: Fade in brand text */}
        <AnimatePresence>
          {phase === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
              className="text-center space-y-1.5"
            >
              <h1 className="text-4xl font-black font-['Fredoka'] tracking-wider text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
                Aura Health
              </h1>
              <p className="text-[11px] font-black uppercase tracking-[0.35em] text-pink-200 drop-shadow-sm">
                Clinical & Cycle Intelligence
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
