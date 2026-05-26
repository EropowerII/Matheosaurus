import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { OperationType, Question, Bubble, DinoState } from '../types';
import { generateQuestion, shuffleArray } from '../utils/mathQuestions';
import Dinosaur from './Dinosaur';
import MathBubble from './MathBubble';
import { ArrowLeft, Volume2, VolumeX, RefreshCw, Star, Heart } from 'lucide-react';

// Custom prehistoric scenario background
import gameBackground from '@/assets/Dinosaur/Background.png';

interface GameScreenProps {
  category: OperationType;
  targetScore: number;
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

export default function GameScreen({ category, targetScore, onBackToMenu, onVictory, onGameOver }: GameScreenProps) {
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [question, setQuestion] = useState<Question>(generateQuestion(category));
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [dinoState, setDinoState] = useState<DinoState>('idle');
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(false);
  const [screenFlasher, setScreenFlasher] = useState<'red' | 'green' | null>(null);

  // Flying number states for feeding the dinosaur (targets are in pixel space relative to sandbox)
  const [flyingNumber, setFlyingNumber] = useState<{
    value: number;
    startX: number;
    startY: number;
    targetX?: number;
    targetY?: number;
  } | null>(null);

  // Reference container for bounds sizing
  const bubbleSandboxRef = useRef<HTMLDivElement>(null);
  const dinoRef = useRef<HTMLDivElement>(null);
  const alreadyReachedRef = useRef<boolean>(false);

  // Initialize bubbles for a new question
  useEffect(() => {
    const freshBubbles = question.options.map((option, idx) => {
      // Distribute starting coordinates cleanly around screen to avoid immediate overlap
      const startX = 10 + idx * 22 + (Math.random() * 6 - 3); // 10%, 32%, 54%, 76%
      const startY = 20 + (idx % 2) * 20 + Math.random() * 10;
      
      // Speed values in percent per tick
      const speedX = (Math.random() * 0.18 + 0.1) * (Math.random() > 0.5 ? 1 : -1);
      const speedY = (Math.random() * 0.14 + 0.08) * (Math.random() > 0.5 ? 1 : -1);

      return {
        id: `bubble-${idx}-${option}-${Math.random()}`,
        value: option,
        x: startX,
        y: startY,
        speedX,
        speedY,
        size: 78 + Math.floor(Math.random() * 14), // 78px - 92px
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

          // X bounce limits with maximum coverage (keep within 4% to 92% width bounds)
          if (nextX <= 4) {
            nextX = 4;
            nextSpeedX = Math.abs(b.speedX);
          } else if (nextX >= 92) {
            nextX = 92;
            nextSpeedX = -Math.abs(b.speedX);
          }

          // Y bounce limits (keep bubbles in generous screen area, between 15% and 82% height bounds)
          if (nextY <= 15) {
            nextY = 15;
            nextSpeedY = Math.abs(b.speedY);
          } else if (nextY >= 82) {
            nextY = 82;
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

      // Measure precise source and target coordinates on screen in pixel coordinates relative to sandbox
      let startPixelX = 0;
      let startPixelY = 0;
      if (bubbleSandboxRef.current) {
        const rect = bubbleSandboxRef.current.getBoundingClientRect();
        startPixelX = (clickedBubble.x / 100) * rect.width;
        startPixelY = (clickedBubble.y / 100) * rect.height;
      }

      let targetPixelX = window.innerWidth * 0.15; // default fallback
      let targetPixelY = window.innerHeight * 0.75; // default fallback
      if (dinoRef.current && bubbleSandboxRef.current) {
        const dinoRect = dinoRef.current.getBoundingClientRect();
        const sandboxRect = bubbleSandboxRef.current.getBoundingClientRect();
        // Since the dinosaur's mouth is located in the upper middle/right section of the Dino's container,
        // we map to 55% of the dino container's width and 35% of its height as the target point.
        targetPixelX = dinoRect.left - sandboxRect.left + (dinoRect.width * 0.55);
        targetPixelY = dinoRect.top - sandboxRect.top + (dinoRect.height * 0.35);
      }

      // Trigger food-flying sequence
      alreadyReachedRef.current = false;
      setFlyingNumber({
        value: clickedBubble.value,
        startX: startPixelX,
        startY: startPixelY,
        targetX: targetPixelX,
        targetY: targetPixelY
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
    if (alreadyReachedRef.current) return;
    alreadyReachedRef.current = true;

    setFlyingNumber(null);
    setDinoState('eating');
    playSynthSound('chew', muted);

    // Chewing sequence of exactly 1.4 seconds (matches webm length), then back to idle
    setTimeout(() => {
      setDinoState('idle'); // Skip happy stance - go straight to idle
      playSynthSound('success', muted);
      
      const newScore = score + 1;
      setScore(newScore);

      // Check for victory target
      if (newScore >= targetScore) {
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
        setQuestion(generateQuestion(category));
      }
    }, 1400);
  };

  // Skip / Regenerate current question (helpful if student gets stuck)
  const handleSkipQuestion = () => {
    if (isLocked) return;
    setQuestion(generateQuestion(category));
  };

  return (
    <div 
      className={`fixed inset-0 w-screen h-screen z-50 flex flex-col justify-between overflow-hidden transition-colors duration-300 ${
        screenFlasher === 'red' ? 'bg-red-500/20' : screenFlasher === 'green' ? 'bg-emerald-500/20' : ''
      }`}
      style={{
        backgroundImage: `url(${gameBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Force Horizontal Mode Overlay */}
      <div className="hidden portrait:flex fixed inset-0 z-[9999] bg-gradient-to-br from-slate-900 to-amber-950 flex-col items-center justify-center text-white p-6 text-center">
        <div className="animate-bounce text-6xl mb-4">🔄</div>
        <h2 className="text-2xl font-black tracking-tight mb-2">Por favor, gira tu pantalla</h2>
        <p className="text-sm text-yellow-100 max-w-xs leading-relaxed">
          DinoMath se disfruta mejor en modo horizontal. Gira tu dispositivo para comenzar la aventura.
        </p>
      </div>

      {/* HUD Top Bar panel */}
      <div id="game-hud" className="relative z-40 w-full bg-black/45 backdrop-blur-md p-4 flex items-center justify-between border-b border-white/10 shadow-lg">
        <button
          id="btn-quit"
          onClick={onBackToMenu}
          className="flex items-center gap-1.5 px-3.5 py-2 text-white bg-white/15 hover:bg-white/25 border border-white/20 hover:border-white/30 rounded-xl font-bold text-sm leading-none cursor-pointer transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Salir</span>
        </button>

        {/* Level Progression Indicator Bar */}
        <div className="flex-1 max-w-xs md:max-w-md mx-4 flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs text-white/90 font-extrabold px-1">
            <span>PROGRESO A LA META</span>
            <span className="text-emerald-300 font-extrabold">{score} / {targetScore} aciertos</span>
          </div>
          <div className="w-full h-3.5 bg-black/40 rounded-full border border-white/10 overflow-hidden p-0.5 shadow-inner">
            <motion.div
              style={{ width: `${Math.min(100, (score / targetScore) * 100)}%` }}
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
              transition={{ type: 'spring', damping: 15 }}
            />
          </div>
        </div>

        {/* Lives (Eggs representing 3 turns) and Audio Toggle */}
        <div className="flex items-center gap-3">
          {/* Speckled Dino Eggs lives indicator */}
          <div id="lives-indicator" className="flex gap-1.5 bg-black/25 border border-white/15 py-1.5 px-3 rounded-full mr-1 items-center">
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
            className="p-2 bg-white/10 border border-white/20 hover:bg-white/20 rounded-xl text-white cursor-pointer transition"
            title={muted ? 'Activar sonido' : 'Silenciar'}
          >
            {muted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-green-400" />}
          </button>
        </div>
      </div>

      {/* Floating Centered Math Slate Tablet (Clean UX floating over the background sky) */}
      <div className="absolute top-22 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 bg-amber-950/90 border-2 border-amber-800 px-5 py-2.5 rounded-2xl shadow-2xl shadow-black/80 backdrop-blur-md">
        <span className="text-[10px] uppercase font-black text-amber-400 tracking-widest hidden sm:inline mr-1">🦖 RESUELVE:</span>
        <div id="chalkboard-formula" className="text-3xl sm:text-4xl font-black text-stone-50 tracking-wide select-none">
          {question.num1} <span className="text-amber-400">{question.operator}</span> {question.num2} <span className="text-yellow-300">=</span> <span className="text-emerald-400 font-extrabold animate-pulse">?</span>
        </div>
        <button
          id="btn-skip"
          onClick={handleSkipQuestion}
          disabled={isLocked}
          className="ml-3 p-2 bg-amber-800 hover:bg-amber-700 active:bg-amber-900 border border-amber-700 text-amber-100 disabled:opacity-50 rounded-xl cursor-pointer transition-colors flex items-center justify-center shadow-md shadow-amber-950"
          title="Cambiar pregunta"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Full-Screen Absolute Interactive Sandbox Sky (Bubbles float here) */}
      <div
        id="bubble-sandbox"
        ref={bubbleSandboxRef}
        className="absolute inset-0 z-20 w-screen h-screen overflow-hidden"
      >
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
          {flyingNumber && flyingNumber.targetX !== undefined && flyingNumber.targetY !== undefined && (
            <motion.div
              key="food-num"
              initial={{
                x: flyingNumber.startX,
                y: flyingNumber.startY,
                scale: 1.3
              }}
              animate={{
                x: flyingNumber.targetX,
                y: flyingNumber.targetY,
                scale: [1.3, 1.4, 0.4]
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                duration: 1.1,
                ease: 'easeInOut'
              }}
              onAnimationComplete={handleNumberReachedDino}
              className="absolute left-0 top-0 z-50 select-none pointer-events-none w-16 h-16 rounded-full bg-gradient-to-r from-amber-300 to-yellow-500 border-4 border-white flex items-center justify-center text-slate-950 font-black text-2xl shadow-xl filter drop-shadow-md"
            >
              {flyingNumber.value}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dinosaur Character (Center aligned at the bottom) */}
      <div 
        ref={dinoRef} 
        className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 z-30 select-none pointer-events-none flex justify-center w-[300px] sm:w-[360px] md:w-[420px] lg:w-[460px] h-[300px] sm:h-[360px] md:h-[420px] lg:h-[460px]"
      >
        <Dinosaur state={dinoState} />
      </div>
    </div>
  );
}
