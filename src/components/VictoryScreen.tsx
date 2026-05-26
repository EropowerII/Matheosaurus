import React from 'react';
import { motion } from 'motion/react';
import Dinosaur from './Dinosaur';
import { Trophy, RefreshCw, Menu, Star } from 'lucide-react';

interface VictoryScreenProps {
  score: number;
  category: string;
  onRestart: () => void;
  onBackToMenu: () => void;
}

export default function VictoryScreen({ score, category, onRestart, onBackToMenu }: VictoryScreenProps) {
  // Translate category codes
  const categoryNames: Record<string, string> = {
    addition: 'Sumas',
    subtraction: 'Restas',
    multiplication: 'Multiplicación',
    division: 'División',
    mix: 'Combinación'
  };

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-xl mx-auto py-8 px-4 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-yellow-200 relative overflow-hidden">
      {/* Sparkles / Confetti static effects container */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 text-yellow-400 animate-spin text-2xl">⭐</div>
        <div className="absolute top-20 right-12 text-teal-400 animate-pulse text-3xl">⭐</div>
        <div className="absolute bottom-20 left-16 text-pink-400 animate-bounce text-xl">✨</div>
        <div className="absolute bottom-12 right-20 text-indigo-400 animate-spin text-2xl">✨</div>
      </div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-4 border border-amber-300 shadow-md"
      >
        <Trophy className="w-12 h-12 text-amber-500 fill-amber-400" />
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-extrabold text-amber-600 tracking-tight"
      >
        ¡FELICIDADES CAMPEÓN!
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-slate-600 text-lg mt-2 max-w-md font-medium"
      >
        ¡Increíble! Lograste completar los <span className="font-extrabold text-green-600">20 aciertos</span> en la categoría de <span className="font-extrabold text-blue-600">{categoryNames[category] || 'Matemáticas'}</span>. ¡Eres un maestro de los números!
      </motion.p>

      {/* Jumping Happy Dino */}
      <div className="w-full flex justify-center my-2">
        <Dinosaur state="happy" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 w-full flex items-center justify-around mb-8"
      >
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Aciertos</span>
          <span className="text-2xl font-black text-amber-600">20 / 20</span>
        </div>
        <div className="w-px h-10 bg-yellow-200" />
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Dino-Recompensa</span>
          <span className="text-2xl font-black text-emerald-600 flex items-center gap-1">
            5 <Star className="w-5 h-5 fill-yellow-400 text-yellow-500" />
          </span>
        </div>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <motion.button
          id="victory-btn-restart"
          onClick={onRestart}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white font-extrabold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Volver a Jugar</span>
        </motion.button>

        <motion.button
          id="victory-btn-menu"
          onClick={onBackToMenu}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-extrabold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <Menu className="w-5 h-5" />
          <span>Cambiar Operación</span>
        </motion.button>
      </div>
    </div>
  );
}
