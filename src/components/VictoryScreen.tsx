import React from 'react';
import { motion } from 'motion/react';
import Dinosaur from './Dinosaur';
import { RefreshCw, Menu, Star, Trophy } from 'lucide-react';
import { OperationType } from '../types';

interface VictoryScreenProps {
  score: number;
  category: OperationType;
  targetScore: number;
  onRestart: () => void;
  onBackToMenu: () => void;
  onChangeCategory: (category: OperationType) => void;
}

export default function VictoryScreen({
  score,
  category,
  targetScore,
  onRestart,
  onBackToMenu,
  onChangeCategory,
}: VictoryScreenProps) {
  // Translate category codes
  const categoryNames: Record<string, string> = {
    addition: 'Sumas',
    subtraction: 'Restas',
    multiplication: 'Multiplicación',
    division: 'División',
    mix: 'Combinación',
  };

  const categories = [
    { type: 'addition' as OperationType, label: '+ Sumas' },
    { type: 'subtraction' as OperationType, label: '- Restas' },
    { type: 'multiplication' as OperationType, label: '× Multi' },
    { type: 'division' as OperationType, label: '÷ Division' },
    { type: 'mix' as OperationType, label: '🔀 Combinación' },
  ];

  return (
    <div className="flex flex-col items-center justify-between w-full max-w-lg mx-auto p-4 md:p-5 bg-gradient-to-b from-slate-900/95 via-slate-800/95 to-slate-950/98 text-white rounded-3xl shadow-2xl border-2 border-green-500/60 relative overflow-hidden select-none max-h-[85vh] sm:max-h-none">
      {/* Background visual effects */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-4 left-6 text-yellow-300 animate-pulse text-lg">⭐</div>
        <div className="absolute top-8 right-6 text-emerald-300 animate-pulse text-xl">✨</div>
        <div className="absolute bottom-16 left-6 text-pink-400 animate-bounce text-sm">✨</div>
        <div className="absolute bottom-4 right-8 text-indigo-300 animate-pulse text-lg">⭐</div>
        <div className="absolute inset-0 bg-radial-gradient from-emerald-500/10 to-transparent pointer-events-none" />
      </div>

      {/* Top Banner details */}
      <div className="relative z-10 w-full flex flex-col items-center mt-1">
        <div className="flex items-center gap-1.5 bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30 text-[10px] md:text-xs font-black tracking-widest text-green-300 uppercase">
          🏆 ¡OBJETIVO LOGRADO!
        </div>
      </div>

      {/* Hero Character & Flying Banners Overlay Container */}
      <div className="relative w-full h-44 sm:h-52 md:h-56 flex items-center justify-center shrink-0 my-1 overflow-visible z-10">
        {/* Animated Backlight Glow */}
        <div className="absolute w-24 h-24 sm:w-32 sm:h-32 bg-green-500/20 blur-2xl rounded-full animate-pulse" />

        {/* Big dinosaur scaled naturally for safe layout */}
        <div className="transform scale-[0.45] sm:scale-[0.52] md:scale-[0.58] origin-center z-10 flex items-center justify-center pointer-events-none">
          <Dinosaur state="happy" />
        </div>

        {/* Orbiting / Flying Golden Stars next to dinosaur */}
        <motion.div
          animate={{
            y: [0, -12, 0],
            x: [0, 8, -8, 0],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-8 right-10 text-yellow-300 drop-shadow-[0_2px_8px_rgba(234,179,8,0.8)] z-10"
        >
          <Star className="w-8 h-8 fill-yellow-300 text-yellow-500 animate-pulse" />
        </motion.div>

        <motion.div
          animate={{
            y: [0, 10, 0],
            x: [0, -6, 6, 0],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-6 left-10 text-amber-300 drop-shadow-[0_2px_6px_rgba(245,158,11,0.8)] z-10"
        >
          <Star className="w-6 h-6 fill-amber-300 text-amber-500" />
        </motion.div>

        {/* OVER THE DINOSAUR Floating Level Complete Banner */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0, y: 15 }}
          animate={{ scale: [0.8, 1.1, 1], opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="absolute bottom-1 sm:bottom-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none max-w-[95%]"
        >
          <div className="bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 text-slate-950 font-black text-2xl sm:text-3xl md:text-4xl tracking-widest uppercase py-2 px-6 sm:px-8 rounded-2xl shadow-2xl border-2 border-white/75 text-center drop-shadow-[0_5px_15px_rgba(234,179,8,0.6)] whitespace-nowrap">
            Misión Completa
          </div>
        </motion.div>
      </div>

      {/* Playful statistics tag */}
      <div className="relative z-10 mt-1 mb-2 text-center">
        <p className="text-yellow-100 text-[11px] md:text-xs font-bold bg-white/5 border border-white/10 rounded-full px-4 py-1 flex items-center gap-1 justify-center">
          ¡Alineaste <span className="text-green-400 font-extrabold">{score} aciertos</span> en la categoría <span className="text-blue-300 font-extrabold">{categoryNames[category]}</span>!
        </p>
      </div>

      {/* Interactive Selector to Change Operations */}
      <div className="relative z-10 w-full mb-3 shrink-0">
        <span className="block text-[9px] md:text-[10px] font-black tracking-widest text-slate-400 text-center mb-1.5 uppercase">
          🎯 ELIGE OPERACIÓN PARA EL PRÓXIMO NIVEL:
        </span>
        <div className="flex flex-wrap justify-center items-center gap-1 p-1 bg-black/40 rounded-xl border border-white/5 max-w-md mx-auto">
          {categories.map((cat) => {
            const isSelected = category === cat.type;
            return (
              <button
                key={cat.type}
                onClick={() => onChangeCategory(cat.type)}
                className={`px-2 py-1 rounded-lg text-[10px] md:text-xs font-extrabold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md scale-105 border border-green-400'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-transparent'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Prominent Action Buttons below */}
      <div className="relative z-10 flex flex-col sm:flex-row gap-2 w-full mt-1 shrink-0">
        <motion.button
          id="victory-btn-restart"
          onClick={onRestart}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg border border-green-400 cursor-pointer text-xs md:text-sm"
        >
          <RefreshCw className="w-4 h-4 animate-spin-reverse-once" />
          <span>¡REPETIR DESAFÍO!</span>
        </motion.button>

        <motion.button
          id="victory-btn-menu"
          onClick={onBackToMenu}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-slate-750 hover:bg-slate-700 border border-slate-600 text-slate-200 font-extrabold py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer text-xs md:text-sm"
        >
          <Menu className="w-4 h-4" />
          <span>Volver al Menú</span>
        </motion.button>
      </div>
    </div>
  );
}
