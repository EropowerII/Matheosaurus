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
    <div className="flex flex-col lg:flex-row items-center justify-between gap-8 w-full max-w-5xl mx-auto py-4 px-4">
      {/* Left side: Character Greeting & Title */}
      <div className="flex flex-col items-center text-center lg:items-start lg:text-left w-full lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full font-bold text-sm mb-4 border border-green-200 shadow-sm"
        >
          🦖 ¡Aprende jugando! (Edades 8 - 12)
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl font-black tracking-tight text-slate-800 md:leading-tight"
        >
          ¡Dinosaurio <br />
          <span className="text-green-600">Come Números!</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-600 text-md md:text-lg mt-4 max-w-md"
        >
          Resuelve los problemas matemáticos y explota la burbuja con la respuesta correcta. 
          ¡Tu dinosaurio se comerá las respuestas ganadoras! Consigue 20 puntos para ganar, pero cuidado: ¡3 errores y termina la partida!
        </motion.p>

        {highScore > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', delay: 0.3 }}
            className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 mt-6 text-amber-800 font-bold shadow-xs"
          >
            <Trophy className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span>Puntaje Máximo: {highScore} aciertos</span>
          </motion.div>
        )}

        {/* Display the dinosaur idle avatar */}
        <div className="mt-2 w-full flex justify-center lg:justify-start">
          <Dinosaur state="idle" />
        </div>
      </div>

      {/* Right side: Operations Menu */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full lg:w-1/2 bg-white/95 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100 flex flex-col justify-between"
      >
        <h2 id="menu-title" className="text-xl md:text-2xl font-black text-slate-800 tracking-tight text-center md:text-left mb-6">
          Elige qué quieres practicar:
        </h2>

        {/* Category List */}
        <div id="categories-grid" className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.type;
            return (
              <button
                key={cat.type}
                id={`cat-${cat.type}`}
                onClick={() => setSelectedCategory(cat.type)}
                className={`relative flex items-center gap-3 p-4 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-green-500 bg-green-50/70 shadow-md scale-[1.02]'
                    : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className={`p-2.5 rounded-xl flex items-center justify-center shadow-xs ${cat.color}`}>
                  {cat.icon}
                </div>
                <div>
                  <div className="font-extrabold text-slate-800 text-sm md:text-base leading-none">
                    {cat.label}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {cat.desc}
                  </div>
                </div>
                {isSelected && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-[10px] font-bold">
                    ✓
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Big Start Button */}
        <motion.button
          id="btn-play-now"
          onClick={() => onStartGame(selectedCategory)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black text-lg py-5.5 px-6 rounded-2xl shadow-lg border border-green-400 cursor-pointer flex items-center justify-center gap-3.5 transition-all"
        >
          <Play className="w-6 h-6 fill-white" />
          <span>¡EMPEZAR A JUGAR!</span>
        </motion.button>
      </motion.div>
    </div>
  );
}
