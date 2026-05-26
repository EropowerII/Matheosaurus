import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { OperationType, Question, Bubble, DinoState } from '../types';
import { generateQuestion, shuffleArray } from '../utils/mathQuestions';
import Dinosaur from './Dinosaur';
import MathBubble from './MathBubble';
import { ArrowLeft, Volume2, VolumeX, RefreshCw, Star, Heart } from 'lucide-react';

interface GameScreenProps {
  category: OperationType;
  onVictory: (finalScore: number) => void;
  onGameOver: (finalScore: number) => void;
  onBackToMenu: () => void;
}

// Colors for the bubbles to make the screen visually lively
const BUBBLE_COLORS = ['teal', 'indigo', 'amber', 'rose', 'purple'];

// Procedural Web Audio API Sound Effects Synthesizer
const playSynthSound = (type: 'pop' | 'success' | 'chew' | 'sad', muted: boolean) => {
  if (muted) return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    if (type === 'pop') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } 
    else if (type === 'chew') {
      // Crunchy chew sound with two brief oscillators
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(140, ctx.currentTime);
      osc1.frequency.linearRampToValueAtTime(30, ctx.currentTime + 0.2);
      gain1.gain.setValueAtTime(0.15, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.2);

      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(120, ctx.currentTime);
        osc2.frequency.linearRampToValueAtTime(20, ctx.currentTime + 0.18);
        gain2.gain.setValueAtTime(0.12, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.18);
      }, 180);
    } 
    else if (type === 'success') {
      // Joyous upward arpeggio
      const notes = [440.00, 554.37, 659.25, 880.00]; // A4, C#5, E5, A5
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.10, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.15);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.18);
      });
    } 
    else if (type === 'sad') {
      // Sliding disappointed sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(105, ctx.currentTime + 0.45);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    }
  } catch (e) {
    // Fallback if browser security blocks Web Audio context initialization
  }
};

export default function GameScreen({ category, onBackToMenu, onVictory, onGameOver }: GameScreenProps) {
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [question, setQuestion] = useState<Question>(generateQuestion(category));
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [dinoState, setDinoState] = useState<DinoState>('idle');
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(false);
  const [screenFlasher, setScreenFlasher] = useState<'red' | 'green' | null>(null);

  // Flying number states for feeding the dinosaur
  const [flyingNumber, setFlyingNumber] = useState<{
    value: number;
    startX: number;
    startY: number;
  } | null>(null);

  // Reference container for bounds sizing
  const bubbleSandboxRef = useRef<HTMLDivElement>(null);

  // Initialize bubbles for a new question
  useEffect(() => {
    const freshBubbles = question.options.map((option, idx) => {
      // Distribute starting coordinates cleanly to avoid total immediate overlap
      const startX = 15 + idx * 22 + (Math.random() * 6 - 3); // 15%, 37%, 59%, 81%
      const startY = 10 + (idx % 2) * 20 + Math.random() * 10;
      
      // Speed values in percent per tick
      const speedX = (Math.random() * 0.2 + 0.1) * (Math.random() > 0.5 ? 1 : -1);
      const speedY = (Math.random() * 0.15 + 0.08) * (Math.random() > 0.5 ? 1 : -1);

      return {
        id: `bubble-${idx}-${option}-${Math.random()}`,
        value: option,
        x: startX,
        y: startY,
        speedX,
        speedY,
        size: 76 + Math.floor(Math.random() * 14), // 76px - 90px
        isCorrect: option === question.correctAnswer,
        popped: false,
        color: BUBBLE_COLORS[idx % BUBBLE_COLORS.length]
      };
    });

    setBubbles(freshBubbles);
    setIsLocked(false);
  }, [question]);

  // Bubble floating loop (running at ~45fps, every 22ms)
  useEffect(() => {
    if (isLocked) return;

    const interval = setInterval(() => {
      setBubbles((prev) =>
        prev.map((b) => {
          if (b.popped) return b;

          let nextX = b.x + b.speedX;
          let nextY = b.y + b.speedY;
          let nextSpeedX = b.speedX;
          let nextSpeedY = b.speedY;

          // X bounce limits (keep within 2% to 88% width bounds)
          if (nextX <= 2) {
            nextX = 2;
            nextSpeedX = Math.abs(b.speedX);
          } else if (nextX >= 88) {
            nextX = 88;
            nextSpeedX = -Math.abs(b.speedX);
          }

          // Y bounce limits (keep bubbles in upper "clouds" air, between 2% and 66% height bounds)
          if (nextY <= 2) {
            nextY = 2;
            nextSpeedY = Math.abs(b.speedY);
          } else if (nextY >= 66) {
            nextY = 66;
            nextSpeedY = -Math.abs(b.speedY);
          }

          return {
            ...b,
            x: nextX,
            y: nextY,
            speedX: nextSpeedX,
            speedY: nextSpeedY
          };
        })
      );
    }, 22);

    return () => clearInterval(interval);
  }, [isLocked]);

  // Handle a popped bubble
  const handlePopBubble = (clickedBubble: Bubble) => {
    if (isLocked) return;

    // Pop the bubble locally
    setBubbles((prev) =>
      prev.map((b) => (b.id === clickedBubble.id ? { ...b, popped: true } : b))
    );

    playSynthSound('pop', muted);

    if (clickedBubble.isCorrect) {
      // CORRECT ANSWER MECHANISM:
      setIsLocked(true);
      setScreenFlasher('green');
      setTimeout(() => setScreenFlasher(null), 300);

      // Trigger food-flying sequence
      setFlyingNumber({
        value: clickedBubble.value,
        startX: clickedBubble.x,
        startY: clickedBubble.y
      });
    } else {
      // INCORRECT ANSWER MECHANISM:
      // Subtract 1 from score (cannot go sub-zero) and deduct 1 life
      setScore((prev) => Math.max(0, prev - 1));
      setLives((prev) => {
        const nextLives = prev - 1;
        if (nextLives <= 0) {
          // Play sad chord and defer gameover trigger slightly for visceral feedback
          playSynthSound('sad', muted);
          setDinoState('sad');
          setTimeout(() => {
            onGameOver(score);
          }, 1500);
        }
        return nextLives;
      });

      if (lives - 1 > 0) {
        // Simple error sequence
        playSynthSound('sad', muted);
        setDinoState('sad');
        setScreenFlasher('red');
        setIsLocked(true);

        setTimeout(() => {
          setScreenFlasher(null);
          setDinoState('idle');
          setIsLocked(false);
        }, 1800);
      }
    }
  };

  // Flying number arrived at T-Rex's position
  const handleNumberReachedDino = () => {
    setFlyingNumber(null);
    setDinoState('eating');
    playSynthSound('chew', muted);

    // Chewing sequence (0.8 seconds), then celebrate
    setTimeout(() => {
      setDinoState('happy');
      playSynthSound('success', muted);
      
      const newScore = score + 1;
      setScore(newScore);

      // Check for victory target (20 points)
      if (newScore >= 20) {
        // Save matching highscore
        const currentHighScore = localStorage.getItem('dino_math_high_score');
        if (!currentHighScore || newScore > parseInt(currentHighScore, 10)) {
          localStorage.setItem('dino_math_high_score', newScore.toString());
        }

        setTimeout(() => {
          onVictory(newScore);
        }, 1200);
      } else {
        // Keep moving forward -> generate next math question
        setTimeout(() => {
          setDinoState('idle');
          setQuestion(generateQuestion(category));
        }, 1400);
      }
    }, 900);
  };

  // Skip / Regenerate current question (helpful if student gets stuck)
  const handleSkipQuestion = () => {
    if (isLocked) return;
    setQuestion(generateQuestion(category));
  };

  return (
    <div className={`relative flex flex-col justify-between w-full max-w-5xl mx-auto h-[620px] md:h-[680px] bg-sky-200/40 rounded-3xl overflow-hidden shadow-2xl border border-slate-100 transition-colors duration-300 ${
      screenFlasher === 'red' ? 'bg-red-400/40' : screenFlasher === 'green' ? 'bg-emerald-400/40' : ''
    }`}>
      {/* HUD Top Bar panel */}
      <div id="game-hud" className="relative z-10 w-full bg-white/80 backdrop-blur-md p-4 flex items-center justify-between border-b border-sky-100 shadow-xs">
        <button
          id="btn-quit"
          onClick={onBackToMenu}
          className="flex items-center gap-1.5 px-3.5 py-2 text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-xl font-bold text-sm leading-none cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Salir</span>
        </button>

        {/* Level Progression Indicator Bar */}
        <div className="flex-1 max-w-xs md:max-w-md mx-4 flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs text-slate-700 font-extrabold px-1">
            <span>PROGRESO A LA META</span>
            <span className="text-emerald-700">{score} / 20 aciertos</span>
          </div>
          <div className="w-full h-3.5 bg-slate-100 rounded-full border border-slate-200 overflow-hidden p-0.5 shadow-inner">
            <motion.div
              style={{ width: `${Math.min(100, (score / 20) * 100)}%` }}
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
              transition={{ type: 'spring', damping: 15 }}
            />
          </div>
        </div>

        {/* Lives (Eggs representing 3 turns) and Audio Toggle */}
        <div className="flex items-center gap-3">
          {/* Speckled Dino Eggs lives indicator */}
          <div id="lives-indicator" className="flex gap-1.5 bg-slate-100 border border-slate-250 py-1.5 px-3 rounded-full mr-1 items-center">
            {[0, 1, 2].map((idx) => {
              const intact = idx < lives;
              return (
                <div key={idx} className="relative w-7 h-8">
                  {intact ? (
                    // Beautiful Speckled Intact Green Dino Egg
                    <svg viewBox="0 0 100 120" className="w-full h-full filter drop-shadow-sm">
                      <defs>
                        <radialGradient id="egg-grad" cx="45%" cy="40%" r="60%">
                          <stop offset="0%" stopColor="#bbf7d0" />
                          <stop offset="40%" stopColor="#4ade80" />
                          <stop offset="100%" stopColor="#16a34a" />
                        </radialGradient>
                      </defs>
                      <ellipse cx="50" cy="65" rx="42" ry="52" fill="url(#egg-grad)" />
                      {/* Spots */}
                      <circle cx="34" cy="40" r="6" fill="#15803d" />
                      <circle cx="68" cy="54" r="5" fill="#15803d" />
                      <circle cx="48" cy="80" r="7" fill="#15803d" />
                      <circle cx="28" cy="74" r="4.5" fill="#15803d" />
                    </svg>
                  ) : (
                    // Broken, cracked Red Dino Egg (representing lost life)
                    <svg viewBox="0 0 100 120" className="w-full h-full opacity-40">
                      <ellipse cx="50" cy="65" rx="42" ry="52" fill="#ef4444" fillOpacity="0.25" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 3" />
                      {/* Cracks drawing */}
                      <path d="M 50 15 L 44 45 L 60 55 L 48 85 L 54 115" stroke="#ef4444" strokeWidth="3" fill="none" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>

          <button
            id="btn-audio-toggle"
            onClick={() => setMuted(!muted)}
            className="p-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-700 cursor-pointer"
            title={muted ? 'Activar sonido' : 'Silenciar'}
          >
            {muted ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5 text-green-600" />}
          </button>
        </div>
      </div>

      {/* Interactive Sandbox Sky (where bubbles operate) */}
      <div
        id="bubble-sandbox"
        ref={bubbleSandboxRef}
        className="relative flex-1 w-full bg-radial from-sky-100 to-sky-300 md:bg-radial text-slate-700 overflow-hidden"
      >
        {/* Soft floating background clouds cartoon */}
        <div className="absolute top-8 left-[10%] opacity-20 w-32 h-10 bg-white rounded-full filter blur-xs" />
        <div className="absolute top-24 right-[15%] opacity-2c w-40 h-12 bg-white rounded-full filter blur-xs" />
        <div className="absolute top-12 left-[44%] opacity-15 w-24 h-8 bg-white rounded-full filter blur-xs" />

        {/* Generate interactive floating bubbles */}
        <AnimatePresence>
          {bubbles.map((bubble) => (
            <MathBubble
              key={bubble.id}
              bubble={bubble}
              disabled={isLocked}
              onPop={handlePopBubble}
            />
          ))}
        </AnimatePresence>

        {/* Feeding animation floating correct answer indicator */}
        <AnimatePresence>
          {flyingNumber && (
            <motion.div
              key="food-num"
              initial={{
                left: `${flyingNumber.startX}%`,
                top: `${flyingNumber.startY}%`,
                scale: 1.3
              }}
              animate={{
                left: '18%', // Standard position above Dino's mouth coordinates
                top: '73%',
                scale: [1.3, 1.4, 0.4]
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                duration: 1.0,
                ease: 'easeIn'
              }}
              onAnimationComplete={handleNumberReachedDino}
              className="absolute z-30 select-none pointer-events-none w-16 h-16 rounded-full bg-radial from-amber-300 to-yellow-500 border-4 border-white flex items-center justify-center text-slate-950 font-black text-2xl shadow-xl filter drop-shadow-md"
            >
              {flyingNumber.value}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Prehistoric Interactive Floor (Dino left, Stone Slate blackboard right) */}
      <div id="game-floor" className="relative z-10 w-full h-56 md:h-64 bg-slate-800/50 backdrop-blur-md p-4/5 pt-3 flex items-end justify-between gap-4 border-t-4 border-green-500 shadow-inner">
        
        {/* Ground grass layered visual illustration */}
        <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-green-500 to-emerald-600 pointer-events-none" />
        <div className="absolute top-2.5 inset-x-0 h-1.5 bg-green-400 opacity-60 pointer-events-none" />

        {/* Left corner: Dinosaur character handler */}
        <div className="relative z-10 pb-2 w-1/3 max-w-[170px] flex justify-center ml-2 md:ml-6">
          <Dinosaur state={dinoState} />
        </div>

        {/* Center/Right corner: Prehistoric Slate stone slate math tablet */}
        <div className="relative z-10 flex-1 max-w-sm mr-2 md:mr-6 pb-2">
          <div className="bg-amber-950 border-4 border-amber-800 rounded-2xl shadow-2xl overflow-hidden">
            
            {/* Wooden frame outline */}
            <div className="bg-amber-800/80 text-amber-100 text-[11px] font-black tracking-widest px-3 py-1 text-center border-b border-amber-900 flex justify-between items-center">
              <span>🦕 PIZARRA DE OPERACIONES</span>
              
              {/* Skip current question button */}
              <button
                id="btn-skip"
                onClick={handleSkipQuestion}
                disabled={isLocked}
                className="px-2.5 py-0.5 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 rounded text-[10px] font-extrabold cursor-pointer transition-colors"
                title="Generar otro problema"
              >
                Cambiar Q
              </button>
            </div>

            {/* Slate Inner Chalk Blackboard */}
            <div className="bg-slate-900 p-4 min-h-[96px] md:min-h-[110px] flex flex-col justify-center items-center font-mono">
              <span className="text-[10px] tracking-widest font-black text-teal-400 opacity-80 uppercase mb-1">Resuelve:</span>
              
              {/* Math formula */}
              <div id="chalkboard-formula" className="text-4xl md:text-5xl font-black text-stone-50 text-center tracking-wide leading-none drop-shadow-md select-none">
                {question.num1} <span className="text-amber-400">{question.operator}</span> {question.num2} <span className="text-yellow-300">=</span> <span className="text-emerald-400 font-extrabold animate-pulse">?</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
