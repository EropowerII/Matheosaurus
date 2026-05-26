import React from 'react';
import { motion } from 'motion/react';
import { Bubble } from '../types';

interface MathBubbleProps {
  key?: string;
  bubble: Bubble;
  onPop: (bubble: Bubble) => void;
  disabled: boolean;
}

export default function MathBubble({ bubble, onPop, disabled }: MathBubbleProps) {
  // Pastel glossy bubble gradients
  const bubbleColors: Record<string, { bg: string, border: string, text: string, highlight: string }> = {
    teal: {
      bg: 'bg-radial from-teal-300/60 to-teal-500/80',
      border: 'border-teal-300/70',
      text: 'text-teal-980',
      highlight: 'bg-teal-100/40'
    },
    indigo: {
      bg: 'bg-radial from-indigo-300/60 to-indigo-500/80',
      border: 'border-indigo-300/70',
      text: 'text-indigo-980',
      highlight: 'bg-indigo-100/40'
    },
    amber: {
      bg: 'bg-radial from-amber-300/60 to-amber-500/80',
      border: 'border-amber-300/70',
      text: 'text-amber-980',
      highlight: 'bg-amber-100/40'
    },
    rose: {
      bg: 'bg-radial from-rose-300/60 to-rose-500/80',
      border: 'border-rose-300/70',
      text: 'text-rose-980',
      highlight: 'bg-rose-100/40'
    },
    purple: {
      bg: 'bg-radial from-purple-300/60 to-purple-500/80',
      border: 'border-purple-300/70',
      text: 'text-purple-980',
      highlight: 'bg-purple-100/40'
    }
  };

  const styleSet = bubbleColors[bubble.color] || bubbleColors.teal;

  return (
    <motion.button
      id={`bubble-${bubble.id}`}
      style={{
        left: `${bubble.x}%`,
        top: `${bubble.y}%`,
        width: `${bubble.size}px`,
        height: `${bubble.size}px`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: bubble.popped ? 0 : 1, opacity: bubble.popped ? 0 : 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: disabled ? 1 : 1.12, y: -2 }}
      whileTap={{ scale: disabled ? 1 : 0.85 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={() => {
        if (!disabled && !bubble.popped) {
          onPop(bubble);
        }
      }}
      disabled={disabled || bubble.popped}
      className={`absolute select-none cursor-pointer rounded-full backdrop-blur-[2px] border-2 shadow-inner focus:outline-none flex items-center justify-center font-bold text-2xl tracking-tight transition-shadow active:shadow-md ${styleSet.bg} ${styleSet.border} ${styleSet.text}`}
    >
      {/* Gloss reflection shine top-left */}
      <div className={`absolute top-[12%] left-[12%] w-[25%] h-[25%] rounded-full rotate-[-45deg] ${styleSet.highlight}`} />
      
      {/* Value label */}
      <span className="drop-shadow-[0_2px_4px_rgba(255,255,255,0.7)] text-slate-850 font-black font-sans pointer-events-none text-2xl md:text-3xl">
        {bubble.value}
      </span>
      
      {/* Tiny secondary sparkle inside bubble */}
      <div className="absolute bottom-[18%] right-[18%] w-[12%] h-[12%] rounded-full bg-white/20" />
    </motion.button>
  );
}
