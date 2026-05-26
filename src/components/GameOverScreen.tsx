import React from 'react';
import { motion } from 'motion/react';
import Dinosaur from './Dinosaur';
import { AlertCircle, RefreshCw, Menu } from 'lucide-react';

interface GameOverScreenProps {
  score: number;
  category: string;
  onRestart: () => void;
  onBackToMenu: () => void;
}

export default function GameOverScreen({ score, category, onRestart, onBackToMenu }: GameOverScreenProps) {
  // Translate category codes
  const categoryNames: Record<string, string> = {
    addition: 'Sumas',
    subtraction: 'Restas',
    multiplication: 'Multiplicación',
    division: 'División',
    mix: 'Combinación'
  };

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-xl mx-auto py-8 px-4 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-red-100">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.1, 1] }}
        transition={{ duration: 0.5 }}
        className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 border border-red-200"
      >
        <AlertCircle className="w-10 h-10 text-red-500" />
      </motion.div>

      <motion.h1
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl font-extrabold text-red-600 tracking-tight"
      >
        ¡Buen intento!
      </motion.h1>

      <motion.p
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-slate-600 text-md mt-2 max-w-sm font-medium"
      >
        ¡Has practicado un montón! Tu dinosaurio está muy orgulloso de ti por esforzarte tanto en <span className="font-extrabold text-blue-600">{categoryNames[category] || 'Matemáticas'}</span>. ¡Cada intento te hace más sabio!
      </motion.p>

      {/* Crying Sad Dino */}
      <div className="w-full flex justify-center my-1">
        <Dinosaur state="sad" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-slate-50 border border-slate-150 rounded-2xl p-4 w-full flex items-center justify-around mb-8"
      >
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Aciertos logrados</span>
          <span className="text-3xl font-black text-rose-500">{score}</span>
        </div>
        <div className="w-px h-10 bg-slate-200" />
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Aciertos Meta</span>
          <span className="text-3xl font-black text-slate-600">20</span>
        </div>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <motion.button
          id="gameover-btn-restart"
          onClick={onRestart}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex-grow bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors"
        >
          <RefreshCw className="w-5 h-5 animate-spin-reverse-once" />
          <span>Intentar de Nuevo</span>
        </motion.button>

        <motion.button
          id="gameover-btn-menu"
          onClick={onBackToMenu}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex-grow bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-extrabold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <Menu className="w-5 h-5" />
          <span>Cambiar Operación</span>
        </motion.button>
      </div>
    </div>
  );
}
