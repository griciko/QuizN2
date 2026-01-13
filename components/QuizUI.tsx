
import React, { useState } from 'react';
import { Question, Category } from '../types';

interface QuizUIProps {
  questions: Question[];
  category: Category;
  onComplete: (score: number, answers: number[]) => void;
  onCancel: () => void;
}

const QuizUI: React.FC<QuizUIProps> = ({ questions, category, onComplete, onCancel }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleNext = () => {
    if (selectedOption === null) return;

    const newAnswers = [...userAnswers, selectedOption];
    setUserAnswers(newAnswers);
    setSelectedOption(null);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      const score = newAnswers.reduce((acc, ans, idx) => {
        return ans === questions[idx].correctAnswer ? acc + 1 : acc;
      }, 0);
      onComplete(score, newAnswers);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{category}</h2>
          <p className="text-sm text-slate-500">Question {currentIndex + 1} of {questions.length}</p>
        </div>
        <button 
          onClick={onCancel}
          className="text-sm font-medium text-slate-400 hover:text-slate-600"
        >
          Exit Quiz
        </button>
      </div>

      <div className="mb-8 h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div 
          className="h-full bg-blue-600 transition-all duration-300" 
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h3 className="mb-8 text-2xl font-medium leading-relaxed text-slate-800">
          {currentQuestion.question}
        </h3>

        <div className="grid gap-4">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedOption(idx)}
              className={`group flex items-center justify-between rounded-xl border-2 p-4 text-left transition-all ${
                selectedOption === idx 
                ? 'border-blue-500 bg-blue-50 shadow-md' 
                : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg border text-sm font-bold ${
                  selectedOption === idx 
                  ? 'border-blue-500 bg-blue-500 text-white' 
                  : 'border-slate-200 bg-white text-slate-400'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className={`font-medium ${selectedOption === idx ? 'text-blue-900' : 'text-slate-700'}`}>
                  {option}
                </span>
              </div>
              {selectedOption === idx && (
                <div className="h-4 w-4 rounded-full bg-blue-500 ring-4 ring-blue-100" />
              )}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={selectedOption === null}
          className="mt-8 w-full rounded-xl bg-slate-900 py-4 font-bold text-white transition-all hover:bg-slate-800 disabled:opacity-30"
        >
          {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
        </button>
      </div>
    </div>
  );
};

export default QuizUI;
