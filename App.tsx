
import React, { useState, useCallback } from 'react';
import { Category, Question, Feedback } from './types';
import { generateQuestions, generateFeedback } from './services/geminiService';
import CategoryCard from './components/CategoryCard';
import QuizUI from './components/QuizUI';
import { 
  GlobeAltIcon, 
  ServerIcon, 
  CpuChipIcon, 
  ShieldCheckIcon 
} from '@heroicons/react/24/outline';

// SVG Icons as React components for heroicons
const HTTPLogo = () => <GlobeAltIcon className="h-6 w-6" />;
const NetworkLogo = () => <ServerIcon className="h-6 w-6" />;
const OSLogo = () => <CpuChipIcon className="h-6 w-6" />;
const SecurityLogo = () => <ShieldCheckIcon className="h-6 w-6" />;

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'quiz' | 'results'>('home');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [results, setResults] = useState<{ score: number, feedback: Feedback | null } | null>(null);

  const startQuiz = async (category: Category) => {
    setIsLoading(true);
    setSelectedCategory(category);
    try {
      const generated = await generateQuestions(category);
      if (generated.length > 0) {
        setQuestions(generated);
        setView('quiz');
      } else {
        alert("Failed to generate questions. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error contacting Gemini. Ensure API Key is valid.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizComplete = async (score: number, answers: number[]) => {
    setIsLoading(true);
    setView('results');
    
    const performanceSummary = questions.map((q, idx) => ({
      question: q.question,
      correct: answers[idx] === q.correctAnswer
    }));

    try {
      const feedback = await generateFeedback(selectedCategory!, score, questions.length, performanceSummary);
      setResults({ score, feedback });
    } catch (err) {
      console.error(err);
      setResults({ score, feedback: null });
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setView('home');
    setQuestions([]);
    setResults(null);
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2" onClick={reset} role="button">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-200">
              <span className="text-xl font-bold">Q</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">QuizNexus</span>
          </div>
          <div className="hidden space-x-8 md:flex">
            <a href="#" className="text-sm font-semibold text-slate-600 transition-colors hover:text-blue-600">Leaderboard</a>
            <a href="#" className="text-sm font-semibold text-slate-600 transition-colors hover:text-blue-600">Practice</a>
            <a href="#" className="text-sm font-semibold text-slate-600 transition-colors hover:text-blue-600">Resources</a>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {isLoading && (
          <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
            <h3 className="text-lg font-semibold text-slate-900">Consulting Gemini...</h3>
            <p className="text-slate-500">Preparing your personalized assessment</p>
          </div>
        )}

        {view === 'home' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-16 text-center">
              <h1 className="mb-6 text-5xl font-black tracking-tight text-slate-900 sm:text-6xl">
                Master the <span className="text-blue-600">Digital Realm.</span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-600">
                Test your proficiency in computer science fundamentals with AI-generated dynamic assessments and adaptive feedback.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <CategoryCard 
                category={Category.HTTP} 
                description="REST, Status Codes, Methods, and Header semantics."
                icon={<HTTPLogo />}
                onSelect={startQuiz}
                disabled={isLoading}
              />
              <CategoryCard 
                category={Category.NETWORK} 
                description="TCP/IP, OSI Layers, Routing, and Protocols."
                icon={<NetworkLogo />}
                onSelect={startQuiz}
                disabled={isLoading}
              />
              <CategoryCard 
                category={Category.OS} 
                description="Kernels, Processes, Threads, Memory Management."
                icon={<OSLogo />}
                onSelect={startQuiz}
                disabled={isLoading}
              />
              <CategoryCard 
                category={Category.SECURITY} 
                description="Encryption, Vulnerabilities, Auth, and Protocols."
                icon={<SecurityLogo />}
                onSelect={startQuiz}
                disabled={isLoading}
              />
            </div>

            <section className="mt-24 rounded-3xl bg-slate-900 p-12 text-white">
              <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                <div>
                  <h2 className="mb-6 text-3xl font-bold">Powered by Advanced AI</h2>
                  <p className="mb-8 text-lg text-slate-400">
                    Our platform uses Gemini 3 Flash to ensure every question is fresh, relevant, and challenging. 
                    Get insights that go beyond just a score.
                  </p>
                  <ul className="space-y-4 text-slate-300">
                    <li className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                      Dynamic difficulty scaling
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                      Detailed conceptual explanations
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                      Personalized learning paths
                    </li>
                  </ul>
                </div>
                <div className="relative">
                  <div className="aspect-video rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-1 shadow-2xl">
                    <div className="h-full w-full rounded-xl bg-slate-900 flex items-center justify-center">
                       <div className="text-center">
                          <div className="mb-2 text-4xl font-bold">10/10</div>
                          <div className="text-sm text-slate-400">Genius Level</div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {view === 'quiz' && (
          <div className="animate-in zoom-in-95 duration-500">
            <QuizUI 
              questions={questions} 
              category={selectedCategory!} 
              onComplete={handleQuizComplete}
              onCancel={reset}
            />
          </div>
        )}

        {view === 'results' && results && (
          <div className="mx-auto max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="mb-12 text-center">
              <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <span className="text-4xl font-black">{results.score}</span>
                <span className="text-xl text-blue-400">/{questions.length}</span>
              </div>
              <h2 className="mb-2 text-3xl font-bold text-slate-900">Test Completed</h2>
              <p className="text-slate-500">You've successfully finished the {selectedCategory} assessment.</p>
            </div>

            {results.feedback && (
              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                  <h3 className="mb-4 text-xl font-bold text-slate-900">AI Analysis</h3>
                  <p className="leading-relaxed text-slate-600">
                    {results.feedback.summary}
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                    <h4 className="mb-4 font-bold text-slate-900">Key Takeaways</h4>
                    <ul className="space-y-4">
                      {results.feedback.recommendations.map((rec, i) => (
                        <li key={i} className="flex gap-3 text-sm text-slate-600">
                          <span className="font-bold text-blue-600">{i + 1}.</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col justify-center rounded-3xl bg-blue-600 p-8 text-white">
                    <h4 className="mb-2 text-lg font-bold">Ready for the next challenge?</h4>
                    <p className="mb-6 text-sm text-blue-100">Try a different topic to round out your expertise.</p>
                    <button 
                      onClick={reset}
                      className="w-full rounded-xl bg-white py-3 font-bold text-blue-600 transition-transform hover:scale-105"
                    >
                      Return to Dashboard
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <button 
              onClick={reset}
              className="mt-12 w-full text-sm font-semibold text-slate-400 hover:text-slate-600"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </main>

      <footer className="mt-24 border-t border-slate-200 bg-white py-12 text-center text-slate-500">
        <p className="text-sm">© 2024 QuizNexus. Built with Gemini 3 for Computer Science Excellence.</p>
      </footer>
    </div>
  );
};

export default App;
