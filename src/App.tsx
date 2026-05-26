/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameState, OperationType } from './types';
import WelcomeScreen from './components/WelcomeScreen';
import GameScreen from './components/GameScreen';
import VictoryScreen from './components/VictoryScreen';
import GameOverScreen from './components/GameOverScreen';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('welcome');
  const [category, setCategory] = useState<OperationType>('mix');
  const [finalScore, setFinalScore] = useState<number>(0);
  const [targetScore, setTargetScore] = useState<number>(10);
  const [score, setScore] = useState<number>(0);

  const handleStartGame = (selectedCategory: OperationType, count: number) => {
    setCategory(selectedCategory);
    setTargetScore(count);
    setScore(0);
    setGameState('playing');
  };

  const handleVictory = (scoreReached: number) => {
    setFinalScore(scoreReached);
    setGameState('victory');
  };

  const handleGameOver = (scoreReached: number) => {
    setFinalScore(scoreReached);
    setGameState('gameover');
  };

  return (
    <div className="relative min-h-screen bg-slate-100 flex flex-col justify-between overflow-x-hidden font-sans">
      
      {/* Playful background blobs decoration */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-green-200/40 rounded-full mix-blend-multiply filter blur-3xl pointer-events-none -translate-x-12 -translate-y-12" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-sky-200/40 rounded-full mix-blend-multiply filter blur-3xl pointer-events-none translate-x-16 translate-y-16" />

      {/* Header bar */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-4 pt-4 pb-1 flex justify-between items-center select-none">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-md">
            🦖
          </div>
          <div>
            <span className="font-sans font-black text-slate-800 tracking-tight text-lg">DinoMath</span>
            <span className="text-[10px] block font-bold text-slate-400 uppercase tracking-widest leading-none">Come Números</span>
          </div>
        </div>
      </header>

      {/* Main Core Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-4 px-4">
        {gameState === 'welcome' && (
          <WelcomeScreen
            category={category}
            setCategory={setCategory}
            targetScore={targetScore}
            setTargetScore={setTargetScore}
            onStartGame={handleStartGame}
          />
        )}

        {gameState === 'playing' && (
          <GameScreen
            category={category}
            targetScore={targetScore}
            onVictory={handleVictory}
            onGameOver={handleGameOver}
            onBackToMenu={() => setGameState('welcome')}
          />
        )}

        {gameState === 'victory' && (
          <VictoryScreen
            score={finalScore}
            category={category}
            targetScore={targetScore}
            onRestart={() => setGameState('playing')}
            onBackToMenu={() => setGameState('welcome')}
            onChangeCategory={setCategory}
          />
        )}

        {gameState === 'gameover' && (
          <GameOverScreen
            score={finalScore}
            category={category}
            targetScore={targetScore}
            onRestart={() => setGameState('playing')}
            onBackToMenu={() => setGameState('welcome')}
            onChangeCategory={setCategory}
          />
        )}
      </main>
    </div>
  );
}
