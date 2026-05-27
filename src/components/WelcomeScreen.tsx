import React from 'react';
import { motion } from 'motion/react';
import { OperationType } from '../types';
import Dinosaur from './Dinosaur';
import { Plus, Minus, X, Percent, Shuffle, Trophy, Play } from 'lucide-react';

interface WelcomeScreenProps {
  category: OperationType;
  setCategory: (category: OperationType) => void;
  targetScore: number;
  setTargetScore: (targetScore: number) => void;
  onStartGame: (category: OperationType, questionsCount: number) => void;
}

export default function WelcomeScreen({
  category,
  setCategory,
  targetScore,
  setTargetScore,
  onStartGame,
}: WelcomeScreenProps) {
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
      icon: <Plus className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: 'bg-emerald-500 text-white',
      hoverColor: 'hover:bg-emerald-600'
    },
    {
      type: 'subtraction',
      label: 'Restas',
      desc: 'Restas divertidas',
      icon: <Minus className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: 'bg-rose-500 text-white',
      hoverColor: 'hover:bg-rose-600'
    },
    {
      type: 'multiplication',
      label: 'Multiplicación',
      desc: 'Tablas de multiplicar',
      icon: <X className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: 'bg-amber-500 text-white',
      hoverColor: 'hover:bg-amber-600'
    },
    {
      type: 'division',
      label: 'División',
      desc: 'Exactas y sencillas',
      icon: <Percent className="w-4 h-4 sm:w-5 sm:h-5" />,
      color: 'bg-indigo-500 text-white',
      hoverColor: 'hover:bg-indigo-600'
    },
    {
      type: 'mix',
      label: '¡Todo Mezclado!',
      desc: 'Operaciones combinadas',
      icon: <Shuffle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-900" />,
      color: 'bg-purple-300 text-purple-950 border border-purple-400',
      hoverColor: 'hover:bg-purple-400'
    }
  ];

  return (
    <div className="flex flex-col landscape:flex-row lg:flex-row items-stretch justify-center gap-2 md:gap-4 w-full max-w-5xl mx-auto py-1 px-4 select-none max-h-full overflow-hidden sm:overflow-visible my-auto">
      {/* Left side: Character Greeting & Title */}
      <div className="flex flex-col justify-between items-center text-center landscape:items-start landscape:text-left lg:items-start lg:text-left w-full landscape:w-[46%] bg-slate-50/60 backdrop-blur-md rounded-2xl p-3 md:p-4 border border-white/40 shadow-lg shrink-0">
        <div className="w-full">
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-slate-800 md:leading-tight uppercase"
          >
            ¡AYUDA AL <br />
            <span className="text-green-600">DINOSAURIO MATEO!</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-600 text-[10px] sm:text-xs md:text-sm mt-1 max-w-md leading-normal font-medium"
          >
            ¡Explota la burbuja correcta para alimentar a Mateo! Consigue <span className="text-green-600 font-extrabold">{targetScore} aciertos</span> sin acumular 3 errores.
          </motion.p>
        </div>

        {highScore > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', delay: 0.3 }}
            className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-lg px-2 py-0.5 mt-1 text-amber-800 font-bold text-[9px] sm:text-xs shadow-xs"
          >
            <Trophy className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span>Récord: {highScore} aciertos</span>
          </motion.div>
        )}

        {/* Character Display Spotlight - Unwrapped and significantly enlarged to stand out prominently */}
        <div className="relative w-full flex items-center justify-center h-28 landscape:h-24 sm:h-36 md:h-44 overflow-visible mt-2 select-none">
          <div className="transform scale-[0.45] landscape:scale-[0.36] sm:scale-[0.58] md:scale-[0.72] origin-center flex items-center justify-center shrink-0 z-0">
            <Dinosaur state="idle" />
          </div>
        </div>
      </div>

      {/* Right side: Operations Menu */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full landscape:w-[52%] bg-white/95 backdrop-blur-md rounded-2xl p-3 md:p-4 shadow-xl border border-slate-100 flex flex-col justify-between shrink-0"
      >
        <div>
          <h2 id="menu-title" className="text-[11px] sm:text-xs md:text-sm font-black text-slate-800 tracking-tight text-center md:text-left mb-1">
            Elige qué quieres practicar:
          </h2>

          {/* Category List - Balanced space-saving 2 column layout */}
          <div id="categories-grid" className="grid grid-cols-2 gap-1.5 mb-1.5">
            {categories.map((cat) => {
               const isSelected = category === cat.type;
               const isMix = cat.type === 'mix';
               return (
                 <button
                   key={cat.type}
                   id={`cat-${cat.type}`}
                   onClick={() => setCategory(cat.type)}
                   className={`relative flex items-center gap-1.5 px-2 py-1 landscape:py-0.5 rounded-lg text-left border transition-all cursor-pointer ${
                     isMix ? 'col-span-2' : ''
                   } ${
                     isSelected
                       ? 'border-green-500 bg-green-50/75 shadow-xs scale-[1.01]'
                       : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
                   }`}
                 >
                   <div className={`p-1 rounded-md flex items-center justify-center shadow-xs shrink-0 ${cat.color}`}>
                     {cat.icon}
                   </div>
                   <div className="min-w-0 flex-1">
                     <div className="font-extrabold text-slate-800 text-[10px] sm:text-xs leading-none truncate">
                       {cat.label}
                     </div>
                     <div className="text-[8px] text-slate-500 mt-0.5 hidden sm:block landscape:hidden md:block leading-none truncate">
                       {cat.desc}
                     </div>
                   </div>
                   {isSelected && (
                     <div className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-green-500 flex items-center justify-center text-white text-[8px] font-bold">
                       ✓
                     </div>
                   )}
                 </button>
               );
            })}
          </div>
        </div>

        {/* Question Count Selector */}
        <div className="mb-1.5">
          <h3 className="text-[9px] md:text-xs font-black text-slate-700 tracking-tight text-center md:text-left mb-1 uppercase">
            🎯 ¿Cuántos aciertos para ganar?
          </h3>
          <div className="grid grid-cols-3 gap-1.5">
            {[10, 15, 20].map((num) => {
              const isSelected = targetScore === num;
              return (
                <button
                  key={num}
                  type="button"
                  id={`qcount-${num}`}
                  onClick={() => setTargetScore(num)}
                  className={`py-1 px-1.5 rounded-lg border font-black text-center text-[9px] sm:text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'border-green-500 bg-green-50 text-green-700 shadow-xs scale-[1.01]'
                      : 'border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-150'
                  }`}
                >
                  {num} aciertos
                </button>
              );
            })}
          </div>
        </div>

        {/* Big Start Button */}
        <motion.button
          id="btn-play-now"
          onClick={() => onStartGame(category, targetScore)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black text-[10px] sm:text-xs py-1.5 sm:py-2 px-3 rounded-lg shadow-md border border-green-400 cursor-pointer flex items-center justify-center gap-1 transition-all mt-1"
        >
          <Play className="w-3 h-3 fill-white" />
          <span>¡INICIAR DESAFÍO!</span>
        </motion.button>
      </motion.div>
    </div>
  );
}
