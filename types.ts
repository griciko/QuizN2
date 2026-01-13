
export enum Category {
  HTTP = 'HTTP Status Codes',
  NETWORK = 'Networking',
  OS = 'Operating Systems',
  SECURITY = 'Cybersecurity'
}

export interface Question {
  id: string;
  category: Category;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizSession {
  category: Category;
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  userAnswers: number[];
  isCompleted: boolean;
}

export interface Feedback {
  score: number;
  total: number;
  summary: string;
  recommendations: string[];
}
