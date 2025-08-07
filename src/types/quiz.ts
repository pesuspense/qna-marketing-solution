export interface Question {
  id: number;
  text: string;
  options: QuestionOption[];
  allowMultiple?: boolean;
}

export interface QuestionOption {
  id: string;
  text: string;
  value: string;
}

export interface QuizAnswer {
  questionId: number;
  answer: string;
}

export interface MarketingSolution {
  id: string;
  name: string;
  description: string;
  category: string;
  conditions: string[];
  benefits: string[];
  estimatedCost: string;
  timeline: string;
}

export interface QuizResult {
  answers: QuizAnswer[];
  recommendedSolution: MarketingSolution;
  name: string;
  phone: string;
} 