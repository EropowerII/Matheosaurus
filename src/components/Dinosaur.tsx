import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DinoState } from '../types';

interface DinosaurProps {
  state: DinoState;
}

export default function Dinosaur({ state }: DinosaurProps) {
  const [blink, setBlink] = useState(false);

  // Periodic blinking eyes for natural idle feel
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 200);
    }, 4000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Munching crumbs/particles for eating animation
  const [crumbs, setCrumbs] = useState<{ id: number; x: number; y: number; scale: number }[]>([]);
  useEffect(() => {
    if (state === 'eating') {
      const interval = setInterval(() => {
        setCrumbs((prev) => [
          ...prev,
          {
            id: Math.random(),
            x: Math.random() * 40 + 110, // Around the mouth area (approx x: 130)
            y: Math.random() * 20 + 90,   // Around the mouth area (approx y: 100)
            scale: Math.random() * 0.6 + 0.4
          }
        ].slice(-10)); // limit crumbs count
      }, 150);
      return () => clearInterval(interval);
    } else {
      setCrumbs([]);
    }
  }, [state]);

  // Tear drops for sad animation
  const [tears, setTears] = useState<{ id: number; x: number; y: number }[]>([]);
  useEffect(() => {
    if (state === 'sad') {
      const interval = setInterval(() => {
        setTears((prev) => [
          ...prev,
          {
            id: Math.random(),
            x: 85, // Left tear canal
            y: 75
          },
          {
            id: Math.random(),
            x: 105, // Right tear canal (adjust as layout goes)
            y: 75
          }
        ].slice(-8));
      }, 400);
      return () => clearInterval(interval);
    } else {
      setTears([]);
    }
  }, [state]);

  // Determine animations per skeletal/transform group
  // 1. Jump animation for happy dino
  const bodyJumpVariants = {
    idle: { y: 0 },
    eating: { y: [0, -3, 0], transition: { repeat: Infinity, duration: 0.3 } },
    happy: { 
      y: [0, -25, 0, -20, 0],
      transition: { duration: 1, ease: "easeOut" }
    },
    sad: { 
      x: [0, -3, 3, -3, 3, -3, 3, 0],
      y: 3,
      transition: { duration: 0.5 }
    }
  };

  // 2. Head tilting variants
  const headVariants = {
    idle: { rotate: 0 },
    eating: { rotate: [0, -5, 0], transition: { repeat: Infinity, duration: 0.3 } },
    happy: { rotate: [0, 8, -8, 0], transition: { duration: 1 } },
    sad: { rotate: 12, y: 5 }
  };

  // 3. Chewing/munching lower jaw motion
  const jawVariants = {
    idle: { rotate: 0, y: 0 },
    eating: { 
      y: [0, 16, 0],
      transition: { repeat: Infinity, duration: 0.25, ease: "easeInOut" } 
    },
    happy: { rotate: 0, y: 3 },
    sad: { rotate: -5, y: 1 }
  };

  // 4. Arm movements
  const armsVariants = {
    idle: { rotate: [0, 10, 0], transition: { repeat: Infinity, duration: 2, ease: "easeInOut" } },
    eating: { rotate: [10, 30, 10], transition: { repeat: Infinity, duration: 0.4 } },
    happy: { y: [-2, -22, -2], rotate: [0, -60, 0], transition: { duration: 0.8, repeat: 1 } },
    sad: { rotate: -15, y: 5, transition: { duration: 0.5 } }
  };

  // 5. Tail wagging
  const tailVariants = {
    idle: { rotate: [0, -12, 12, 0], transition: { repeat: Infinity, duration: 3, ease: "easeInOut" } },
    eating: { rotate: [0, -5, 5, 0], transition: { repeat: Infinity, duration: 0.6 } },
    happy: { rotate: [0, -30, 30, -30, 0], transition: { duration: 1 } },
    sad: { rotate: -25, transition: { duration: 0.5 } }
  };

  return (
    <div id="dinosaur-canvas-container" className="relative flex flex-col items-center justify-center w-full max-w-sm h-64 md:h-80 select-none">
      {/* Dynamic particles / Speech Bubbles or effects */}
      <div className="absolute top-0 flex flex-col items-center pointer-events-none">
        <AnimatePresence>
          {state === 'happy' && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.5 }}
              animate={{ opacity: 1, y: -20, scale: 1.2 }}
              exit={{ opacity: 0 }}
              className="text-yellow-400 text-3xl font-bold flex gap-1 filter drop-shadow-md"
            >
              <span>⭐</span>
              <span>¡RRIQUÍSIMO!</span>
              <span>💚</span>
            </motion.div>
          )}
          {state === 'sad' && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.5 }}
              animate={{ opacity: 1, y: -10, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-red-500 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-lg border border-red-300 flex items-center gap-1"
            >
              <span>😢</span>
              <span>¡Uy! ¡Casi!</span>
            </motion.div>
          )}
          {state === 'eating' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: [1, 1.1, 1] }}
              exit={{ opacity: 0 }}
              className="text-amber-600 dark:text-amber-400 font-extrabold tracking-widest text-lg"
            >
              ¡ÑAM ÑAM!
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SVG Dinosaur Rendering */}
      <motion.svg
        viewBox="0 0 200 220"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl"
        animate={state}
        variants={bodyJumpVariants}
      >
        {/* Shadow underneath */}
        <ellipse cx="100" cy="195" rx="55" ry="12" fill="#000000" fillOpacity="0.2" className="transition-all duration-300" />

        {/* Tail group */}
        <motion.path
          d="M 65 130 C 25 130, 5 155, 12 175 C 15 185, 30 185, 40 170 C 50 155, 70 152, 75 145"
          fill="#4ade80"
          variants={tailVariants}
          originX="0.32"
          originY="0.66"
        />
        {/* Tail spikes */}
        <motion.path
          d="M 18 165 C 10 158, 12 153, 20 155"
          fill="#fb923c"
          variants={tailVariants}
          originX="0.32"
          originY="0.66"
        />

        {/* Dinosaur Spikes (Back) */}
        <path d="M 62 105 L 50 112 L 64 121 Z" fill="#f97316" />
        <path d="M 63 125 L 51 133 L 64 142 Z" fill="#f97316" />
        <path d="M 65 145 L 55 152 L 67 159 Z" fill="#f97316" />

        {/* Massive back body & feet */}
        {/* Left Leg */}
        <ellipse cx="80" cy="180" rx="14" ry="16" fill="#22c55e" />
        <path d="M 69 188 Q 80 196 91 188 Q 80 186 69 188" fill="#15803d" />
        {/* Right Leg (frontmost) */}
        <ellipse cx="115" cy="182" rx="15" ry="16" fill="#4ade80" />
        <path d="M 103 191 Q 115 198 127 191 Q 115 189 103 191" fill="#16a34a" />

        {/* Dino main thick body */}
        <path d="M 63 105 C 55 135, 62 175, 95 175 C 122 175, 128 150, 115 125 C 105 110, 80 100, 63 105" fill="#4ade80" />
        {/* Soft yellow egg belly */}
        <path d="M 90 120 C 78 135, 82 170, 95 170 C 115 170, 118 150, 108 130 C 100 120, 95 118, 90 120" fill="#fef08a" />

        {/* Arms group */}
        <motion.g
          variants={armsVariants}
          originX="0.5"
          originY="0.62"
        >
          {/* Left arm (background) */}
          <path d="M 72 135 C 62 135, 54 125, 52 130" stroke="#16a34a" strokeWidth="6" strokeLinecap="round" fill="none" />
          {/* Right arm (foreground) */}
          <path d="M 108 138 C 118 138, 126 130, 129 135" stroke="#22c55e" strokeWidth="8" strokeLinecap="round" fill="none" />
          {/* Tiny claws */}
          <circle cx="129" cy="135" r="2.5" fill="#f8fafc" />
          <circle cx="127" cy="138" r="2.5" fill="#f8fafc" />
        </motion.g>

        {/* Head and Jaw group */}
        {/* This group manages the mouth animation by dividing the face into two pieces or pivoting the jaw */}
        <motion.g
          variants={headVariants}
          originX="0.45"
          originY="0.45"
        >
          {/* Back head spikes */}
          <path d="M 72 60 L 60 52 L 75 44 Z" fill="#f97316" />
          <path d="M 70 80 L 58 74 L 72 68 Z" fill="#f97316" />

          {/* Core Head (Upper side of jaw) */}
          {/* We define a custom skull shape with big cheerful snout */}
          <path d="M 70 95 C 65 65, 80 40, 115 40 C 145 40, 160 55, 150 85 C 144 95, 125 95, 120 95 C 100 95, 80 95, 70 95" fill="#4ade80" />

          {/* Nostril hole */}
          <circle cx="140" cy="72" r="3" fill="#16a34a" />

          {/* Dynamic Animated Eyes */}
          {state === 'sad' ? (
            // Sad teardrop-shaped eyes
            <g>
              {/* Eye left */}
              <ellipse cx="92" cy="68" rx="8" ry="10" fill="#f8fafc" />
              <path d="M 90 68 Q 94 62 98 68 Z" fill="#38bdf8" />
              <circle cx="94" cy="70" r="3" fill="#0f172a" stroke="#ffffff" strokeWidth="0.5" />
              <ellipse cx="112" cy="68" rx="8" ry="10" fill="#f8fafc" />
              <circle cx="110" cy="70" r="3" fill="#0f172a" stroke="#ffffff" strokeWidth="0.5" />
              {/* Sad downtrend eyebrows */}
              <path d="M 86 56 Q 92 60 98 56" stroke="#16a34a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 106 56 Q 112 60 118 56" stroke="#16a34a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </g>
          ) : state === 'happy' ? (
            // Overwhelming joy eyes (Happy arcs "^ ^")
            <g>
              <path d="M 88 72 Q 95 62 102 72" stroke="#15803d" strokeWidth="4.5" fill="none" strokeLinecap="round" />
              <path d="M 110 72 Q 117 62 124 72" stroke="#15803d" strokeWidth="4.5" fill="none" strokeLinecap="round" />
            </g>
          ) : (
            // Regular/Idle eyes with blinking
            <g>
              {blink ? (
                // Blinking closed eye line
                <g>
                  <path d="M 88 68 Q 96 68 104 68" stroke="#15803d" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                  <path d="M 108 68 Q 116 68 124 68" stroke="#15803d" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                </g>
              ) : (
                // Open big cute eyes
                <>
                  <g>
                    <ellipse cx="96" cy="66" rx="9" ry="11" fill="#f8fafc" />
                    <circle cx="100" cy="66" r="5" fill="#0f172a" />
                    <circle cx="102" cy="63" r="2" fill="#ffffff" /> {/* pupillar spark */}
                  </g>
                  <g>
                    <ellipse cx="116" cy="66" rx="9" ry="11" fill="#f8fafc" />
                    <circle cx="114" cy="66" r="5" fill="#0f172a" />
                    <circle cx="116" cy="63" r="2" fill="#ffffff" />
                  </g>
                  {/* Happy small eyebrows */}
                  <path d="M 90 52 Q 96 48 102 52" stroke="#16a34a" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <path d="M 110 52 Q 116 48 122 52" stroke="#16a34a" strokeWidth="2" fill="none" strokeLinecap="round" />
                </>
              )}
            </g>
          )}

          {/* Cute Rosy Cheeks */}
          <ellipse cx="88" cy="78" rx="6" ry="4" fill="#fca5a5" fillOpacity="0.75" />
          <ellipse cx="124" cy="78" rx="6" ry="4" fill="#fca5a5" fillOpacity="0.75" />

          {/* Lower Jaw (animated group) */}
          <motion.g
            variants={jawVariants}
            originX="0.45"
            originY="0.48"
          >
            {/* The actual mouth inside color (dark maroon) */}
            <path d="M 92 94 C 92 114, 138 114, 138 94 Z" fill="#991b1b" />

            {/* Tongue */}
            <path d="M 105 102 C 105 110, 125 110, 125 102 Z" fill="#f43f5e" />

            {/* Little white dinosaur teeth inside mouth */}
            <polygon points="98,94 102,99 106,94" fill="#f8fafc" />
            <polygon points="108,94 112,99 116,94" fill="#f8fafc" />
            <polygon points="118,94 122,99 126,94" fill="#f8fafc" />
            <polygon points="128,94 132,99 136,94" fill="#f8fafc" />

            {/* Lower jaw bone overlay */}
            <path d="M 85 95 C 85 118, 142 118, 142 95 L 85 95" fill="#4ade80" />
          </motion.g>

          {/* Upper teeth row overlay (to keep styling neat) */}
          <polygon points="100,94 103,90 106,94" fill="#f8fafc" />
          <polygon points="109,94 112,90 115,94" fill="#f8fafc" />
          <polygon points="118,94 121,90 124,94" fill="#f8fafc" />
          <polygon points="127,94 130,90 133,94" fill="#f8fafc" />
        </motion.g>

        {/* Falling tear particles */}
        <AnimatePresence>
          {tears.map((tear) => (
            <motion.circle
              key={tear.id}
              cx={tear.x}
              cy={tear.y}
              r="4"
              fill="#0ea5e9"
              initial={{ y: 0, opacity: 0.8, scale: 0.8 }}
              animate={{ y: [0, 50, 80], opacity: [0.8, 0.8, 0], scale: [0.8, 1, 0.5] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: 'easeIn' }}
            />
          ))}
        </AnimatePresence>

        {/* Dynamic Eating munch crumbs */}
        <AnimatePresence>
          {crumbs.map((crumb) => (
            <motion.circle
              key={crumb.id}
              cx={crumb.x}
              cy={crumb.y}
              r="3"
              fill="#fcd34d"
              initial={{ y: -5, opacity: 1, scale: crumb.scale }}
              animate={{
                y: [0, 30, 45],
                x: [crumb.x, crumb.x + (Math.random() * 30 - 15)],
                opacity: [1, 1, 0],
                rotate: [0, 180]
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            />
          ))}
        </AnimatePresence>
      </motion.svg>
    </div>
  );
}
