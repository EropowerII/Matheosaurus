import React from 'react';
import { motion } from 'motion/react';
import { OperationType } from '../types';
import Dinosaur from './Dinosaur';
import { Plus, Minus, X, Percent, Shuffle, Trophy, Play } from 'lucide-react';

interface WelcomeScreenProps {
  onStartGame: (category: OperationType) => void;
}

export default function WelcomeScreen({ onStartGame }: WelcomeScreenProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<OperationType>('mix');
  const [highScore, setHighScore] = React.useState<number>(0);

  React.useEffect(() => {
    const saved = localStorage.getItem('dino_math_high_score');
    if (saved) {
      setHighScore(parseInt(saved, 10));
    }
  }, []);

  const categories: { type: OperationType; label: string; desc: string; icon: React.ReactNode; color: string; hoverColor: string }[] = [
    {
      type: 'addition',
      label: 'Sumas',
      desc: 'Sumas de dos dígitos',
      icon: <Plus className="w-6 h-6" />,
      color: 'bg-emerald-500 text-white',
      hoverColor: 'hover:bg-emerald-600'
    },
    {
      type: 'subtraction',
      label: 'Restas',
      desc: 'Restas divertidas',
      icon: <Minus className="w-6 h-6" />,
      color: 'bg-rose-500 text-white',
      hoverColor: 'hover:bg-rose-600'
    },
    {
      type: 'multiplication',
      label: 'Multiplicación',
      desc: 'Tablas de multiplicar',
      icon: <X className="w-5 h-5" />,
      color: 'bg-amber-500 text-white',
      hoverColor: 'hover:bg-amber-600'
    },
    {
      type: 'division',
      label: 'División',
      desc: 'Exactas y sencillas',
      icon: <Percent className="w-5 h-5" />,
      color: 'bg-indigo-500 text-white',
      hoverColor: 'hover:bg-indigo-600'
    },
    {
      type: 'mix',
      label: '¡Todo Mezclado!',
      desc: 'Operaciones combinadas',
      icon: <Shuffle className="w-5 h-5 text-purple-900" />,
      color: 'bg-purple-300 text-purple-950 border border-purple-400',
      hoverColor: 'hover:bg-purple-400'
    }
  ];

  return (
    <div className="flex flex-col lg:flex-row items-stretch justify-between gap-5 w-full max-w-5xl mx-auto py-1 px-4 select-none">
      {/* Left side: Character Greeting & Title */}
      <div className="flex flex-col justify-between items-center text-center lg:items-start lg:text-left w-full lg:w-1/2 bg-slate-50/60 backdrop-blur-md rounded-3xl p-5 md:p-6 border border-white/40 shadow-lg">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl font-black tracking-tight text-slate-800 md:leading-tight uppercase"
          >
            ¡AYUDA AL <br />
            <span className="text-green-600">DINOSAURIO MATEO!</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-600 text-xs md:text-sm mt-2 max-w-md leading-relaxed font-medium"
          >
            ¡Resuelve operaciones matemáticas completando misiones! Explota la burbuja correcta para alimentar a Mateo. Consigue 20 aciertos antes de acumular 3 errores.
          </motion.p>
        </div>

        {highScore > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', delay: 0.3 }}
            className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-2.5 py-1 mt-2.5 text-amber-800 font-bold text-xs shadow-xs"
          >
            <Trophy className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Récord Actual: {highScore} aciertos</span>
          </motion.div>
        )}

        {/* Character Display Spotlight - Unobstructed and clear with smooth scaling */}
        <div className="relative w-full max-w-sm flex items-center justify-center bg-gradient-to-br from-emerald-100/40 to-green-100/35 rounded-2xl border border-green-200/50 p-1.5 h-44 sm:h-48 overflow-hidden mt-3 shadow-inner">
          <div className="absolute top-1.5 left-3 text-[9px] font-black tracking-widest text-green-700/60 uppercase">MATEO EL DINOSAURIO</div>
          <div className="absolute bottom-1 bg-green-500/10 text-green-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full z-10">ESTADO: LISTO PARA COMER</div>
          <div className="transform scale-[0.34] sm:scale-[0.38] md:scale-[0.42] lg:scale-[0.45] origin-center -mb-8 flex items-center justify-center shrink-0 z-0">
            <Dinosaur state="idle" />
          </div>
        </div>
      </div>

      {/* Right side: Operations Menu */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full lg:w-1/2 bg-white/95 backdrop-blur-md rounded-3xl p-5 md:p-6 shadow-xl border border-slate-100 flex flex-col justify-between"
      >
        <div>
          <h2 id="menu-title" className="text-base md:text-lg font-black text-slate-800 tracking-tight text-center md:text-left mb-3">
            Elige qué quieres practicar:
          </h2>

          {/* Category List - Balanced space-saving 2 column layout with Col-span-2 for Mixed */}
          <div id="categories-grid" className="grid grid-cols-2 gap-2 mb-4">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.type;
              const isMix = cat.type === 'mix';
              return (
                <button
                  key={cat.type}
                  id={`cat-${cat.type}`}
                  onClick={() => setSelectedCategory(cat.type)}
                  className={`relative flex items-center gap-2 px-3 py-2.5 rounded-xl text-left border-2 transition-all cursor-pointer ${
                    isMix ? 'col-span-2' : ''
                  } ${
                    isSelected
                      ? 'border-green-500 bg-green-50/75 shadow-xs scale-[1.01]'
                      : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg flex items-center justify-center shadow-xs shrink-0 ${cat.color}`}>
                    {cat.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-extrabold text-slate-800 text-xs md:text-sm leading-none truncate">
                      {cat.label}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                      {cat.desc}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 rounded-full bg-green-500 flex items-center justify-center text-white text-[9px] font-bold">
                      ✓
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Big Start Button */}
        <motion.button
          id="btn-play-now"
          onClick={() => onStartGame(selectedCategory)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black text-sm py-4 px-5 rounded-xl shadow-md border border-green-400 cursor-pointer flex items-center justify-center gap-2 transition-all mt-2"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>¡INICIAR DESAFÍO!</span>
        </motion.button>
      </motion.div>
    </div>
  );
}
