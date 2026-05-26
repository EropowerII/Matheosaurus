import { Question, OperationType } from '../types';

// Fast stable custom shuffle
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generateQuestion(type: OperationType): Question {
  let num1 = 0;
  let num2 = 0;
  let operator: '+' | '-' | '×' | '÷' = '+';
  let correctAnswer = 0;

  // Decide current operator if 'mix' is selected
  let currentType = type;
  if (type === 'mix') {
    const types: Exclude<OperationType, 'mix'>[] = ['addition', 'subtraction', 'multiplication', 'division'];
    currentType = types[Math.floor(Math.random() * types.length)];
  }

  switch (currentType) {
    case 'addition':
      operator = '+';
      // Addition suitable for 8-12: double digits up to 80
      num1 = Math.floor(Math.random() * 50) + 10; // 10-59
      num2 = Math.floor(Math.random() * 40) + 5;  // 5-44
      correctAnswer = num1 + num2;
      break;

    case 'subtraction':
      operator = '-';
      // Subtraction: positive results, double digits
      num1 = Math.floor(Math.random() * 60) + 20; // 20-79
      num2 = Math.floor(Math.random() * (num1 - 5)) + 5; // 5 to num1-1 (guarantees >= 5 result)
      correctAnswer = num1 - num2;
      break;

    case 'multiplication':
      operator = '×';
      // Multiplication: tables 2 to 12
      num1 = Math.floor(Math.random() * 11) + 2; // 2-12
      num2 = Math.floor(Math.random() * 11) + 2; // 2-12
      correctAnswer = num1 * num2;
      break;

    case 'division':
      operator = '÷';
      // Division: reverse multiplication so result is always dynamic integer
      num2 = Math.floor(Math.random() * 9) + 2; // Divisor (2-10)
      correctAnswer = Math.floor(Math.random() * 11) + 2; // Quotient (2-12)
      num1 = num2 * correctAnswer; // Dividend
      break;
  }

  // Generate educational near-miss incorrect answers
  const candidates = new Set<number>();
  
  // 1. Off-by-one or off-by-two
  candidates.add(correctAnswer + 1);
  if (correctAnswer - 1 > 0) candidates.add(correctAnswer - 1);
  candidates.add(correctAnswer + 2);
  if (correctAnswer - 2 > 0) candidates.add(correctAnswer - 2);

  // 2. Ten-frame errors (+10 / -10)
  candidates.add(correctAnswer + 10);
  if (correctAnswer - 10 > 0) candidates.add(correctAnswer - 10);

  // 3. For multiplication/division, offer neighboring table answers
  if (operator === '×') {
    candidates.add(num1 * (num2 + 1));
    if (num2 - 1 > 1) candidates.add(num1 * (num2 - 1));
    candidates.add((num1 + 1) * num2);
    if (num1 - 1 > 1) candidates.add((num1 - 1) * num2);
  } else if (operator === '÷') {
    candidates.add(correctAnswer + num2);
    if (correctAnswer - num2 > 0) candidates.add(correctAnswer - num2);
  }

  // 4. Tens value swap (e.g. 43 -> 34)
  if (correctAnswer >= 12 && correctAnswer <= 99) {
    const tens = Math.floor(correctAnswer / 10);
    const units = correctAnswer % 10;
    const swapped = units * 10 + tens;
    if (swapped !== correctAnswer && swapped > 0) {
      candidates.add(swapped);
    }
  }

  // Filter out the actual correct answer and invalid numbers (<= 0)
  const filteredCandidates = Array.from(candidates).filter(
    val => val !== correctAnswer && val > 0 && val < 200
  );

  // Pick 3 random distractors
  const distractors = shuffleArray(filteredCandidates).slice(0, 3);

  // If there are not enough distractors (due to edge cases), fill with random numbers nearby
  while (distractors.length < 3) {
    const offset = Math.floor(Math.random() * 15) + 3;
    const sign = Math.random() > 0.5 ? 1 : -1;
    const fill = correctAnswer + offset * sign;
    if (fill > 0 && fill !== correctAnswer && !distractors.includes(fill)) {
      distractors.push(fill);
    }
  }

  // Total 4 options: correct choice + 3 distractors
  const options = shuffleArray([correctAnswer, ...distractors]);

  return {
    id: Math.random().toString(36).substring(2, 9),
    num1,
    num2,
    operator,
    correctAnswer,
    options
  };
}
