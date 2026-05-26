export type GameState = 'welcome' | 'playing' | 'victory' | 'gameover';

export type OperationType = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'mix';

export interface Question {
  id: string;
  num1: number;
  num2: number;
  operator: '+' | '-' | '×' | '÷';
  correctAnswer: number;
  options: number[]; // Includes correct answer and near misses
}

export interface Bubble {
  id: string;
  value: number;
  x: number; // Percent width 0-100
  y: number; // Percent height 0-100
  speedX: number;
  speedY: number;
  size: number;
  isCorrect: boolean;
  popped: boolean;
  color: string;
}

export type DinoState = 'idle' | 'eating' | 'happy' | 'sad';
