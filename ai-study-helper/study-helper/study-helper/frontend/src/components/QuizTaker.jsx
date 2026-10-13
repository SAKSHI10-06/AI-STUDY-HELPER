import React, { useState, useMemo } from 'react';
import { CheckCircle, XCircle, Trophy, BarChart, AlertCircle, Play, ChevronRight, RefreshCw, Shuffle } from 'lucide-react';

const QuizTaker = ({ questions = [], onExit, darkMode = false }) => {
  const [gameState, setGameState] = useState('menu'); // menu, playing, result
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { questionIndex: optionIndex }
  const [activeQuestions, setActiveQuestions] = useState([]); // The specific 5 questions for this round
  
  // Configuration: How many questions per round?
  const QUESTIONS_PER_ROUND = 5;

  // Helper: Fisher-Yates Shuffle Algorithm
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startGame = (level) => {
    // 1. Filter by difficulty first (if needed)
    let pool = questions;
    if (level !== 'All') {
        pool = questions.filter(q => (q.difficulty || 'Medium') === level);
    }

    // 2. Shuffle the pool
    const shuffledPool = shuffleArray(pool);

    // 3. Slice to get random subset (ensure at least 5 if available, otherwise take all)
    // This logic ensures "new questions" every time if the pool is larger than 5
    const selectedQuestions = shuffledPool.slice(0, QUESTIONS_PER_ROUND);

    if (selectedQuestions.length === 0) {
        alert("No questions available for this difficulty level.");
        return;
    }

    setActiveQuestions(selectedQuestions);
    setGameState('playing');
    setCurrentQIndex(0);
    setUserAnswers({});
  };

  const handleOptionSelect = (optionIdx) => {
    setUserAnswers(prev => ({ ...prev, [currentQIndex]: optionIdx }));
    // Auto advance
    setTimeout(() => {
      if (currentQIndex < activeQuestions.length - 1) {
        setCurrentQIndex(prev => prev + 1);
      } else {
        setGameState('result');
      }
    }, 400);
  };

  const calculateResults = () => {
    let score = 0;
    const weakAreas = [];
    activeQuestions.forEach((q, idx) => {
      const userAns = userAnswers[idx];
      // Compare user index with answer index
      if (userAns === q.answer) score++;
      else weakAreas.push({
        question: q.question,
        correctAnswer: q.options[q.answer],
        userAnswer: q.options[userAns] || "Skipped"
      });
    });
    return { score, weakAreas };
  };

  // Theme Classes
  const bgCard = darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100';
  const textMain = darkMode ? 'text-white' : 'text-gray-800';
  const textSub = darkMode ? 'text-slate-400' : 'text-gray-500';

  // --- 1. MENU VIEW ---
  if (gameState === 'menu') {
    return (
      <div className={`p-10 rounded-[2rem] shadow-sm border text-center max-w-xl mx-auto ${bgCard}`}>
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${darkMode ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-50 text-indigo-500'}`}>
            <Shuffle className="w-10 h-10" />
        </div>
        <h2 className={`text-3xl font-bold mb-3 ${textMain}`}>Quiz Mode</h2>
        <p className={`${textSub} mb-8 leading-relaxed`}>
            We have <strong>{questions.length}</strong> questions in the bank. 
            <br/>Each round will select <strong>{QUESTIONS_PER_ROUND} random questions</strong>.
        </p>
        
        <div className="grid grid-cols-1 gap-4">
          {['Easy', 'Medium', 'Hard', 'All'].map(level => (
            <button 
                key={level} 
                onClick={() => startGame(level)} 
                className={`group relative p-5 rounded-2xl border-2 border-transparent ${darkMode ? 'bg-slate-700/50 hover:border-indigo-500/50' : 'bg-gray-50 hover:border-indigo-200'} transition-all text-left flex items-center justify-between`}
            >
              <div>
                  <span className={`block font-bold text-lg group-hover:text-indigo-500 ${textMain}`}>
                      {level === 'All' ? '🎲 Surprise Me (Random Mix)' : `${level} Challenge`}
                  </span>
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                      {level === 'All' ? `Selects ${QUESTIONS_PER_ROUND} from ${questions.length}` : 'Curated Random Set'}
                  </span>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${darkMode ? 'bg-slate-800 text-slate-400' : 'bg-white text-gray-300'} group-hover:text-indigo-500`}>
                  <Play size={20} fill="currentColor" />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // --- 2. RESULTS VIEW ---
  if (gameState === 'result') {
    const { score, weakAreas } = calculateResults();
    const total = activeQuestions.length;
    const percentage = Math.round((score / total) * 100);
    const rotation = (score / total) * 360;

    return (
      <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8">
        
        {/* Score Dashboard */}
        <div className={`p-8 rounded-[2.5rem] shadow-sm border mb-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${bgCard}`}>
            
            {/* Chart Area */}
            <div className="flex flex-col items-center justify-center relative">
                <div 
                    className="w-48 h-48 rounded-full flex items-center justify-center relative shadow-inner"
                    style={{
                        background: `conic-gradient(#6366f1 ${rotation}deg, ${darkMode ? '#1e293b' : '#f3f4f6'} 0deg)`
                    }}
                >
                    <div className={`w-36 h-36 rounded-full flex flex-col items-center justify-center z-10 shadow-sm ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                        <span className="text-4xl font-black text-indigo-500">{percentage}%</span>
                        <span className={`text-xs font-bold uppercase tracking-widest mt-1 ${textSub}`}>Accuracy</span>
                    </div>
                </div>
            </div>

            {/* Text Stats */}
            <div className="text-center md:text-left">
                <div className={`inline-block p-3 rounded-2xl mb-4 ${darkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-50 text-yellow-600'}`}>
                    <Trophy size={24} />
                </div>
                <h2 className={`text-3xl font-bold mb-2 ${textMain}`}>Round Complete!</h2>
                <p className={`${textSub} mb-6`}>You answered <strong className={textMain}>{score}</strong> out of <strong className={textMain}>{total}</strong> questions correctly.</p>
                
                <div className="flex gap-3 justify-center md:justify-start">
                    <button onClick={() => setGameState('menu')} className={`px-6 py-3 font-bold rounded-xl transition flex items-center gap-2 ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                        <RefreshCw size={18} /> New Round
                    </button>
                    <button onClick={onExit} className="px-6 py-3 bg-indigo-600 font-bold rounded-xl hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 transition">Finish Review</button>
                </div>
            </div>
        </div>

        {/* WEAKNESS DETECTION DASHBOARD */}
        {weakAreas.length > 0 && (
          <div className={`rounded-[2rem] shadow-sm border overflow-hidden ${darkMode ? 'bg-slate-900 border-red-900/30' : 'bg-white border-red-100'}`}>
            <div className={`p-6 border-b flex items-center gap-3 ${darkMode ? 'bg-red-900/20 border-red-900/30' : 'bg-red-50 border-red-100'}`}>
                 <AlertCircle className="text-red-500" />
                 <h3 className={`text-xl font-bold ${darkMode ? 'text-red-400' : 'text-red-900'}`}>Improvement Areas</h3>
                 <span className={`ml-auto px-3 py-1 rounded-full text-xs font-bold ${darkMode ? 'bg-red-900/40 text-red-300' : 'bg-white text-red-600'}`}>{weakAreas.length} Issues</span>
            </div>
            
            <div className="p-6 grid grid-cols-1 gap-4">
              {weakAreas.map((item, i) => (
                <div key={i} className={`p-5 rounded-2xl border transition-all ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-100'}`}>
                  <p className={`font-bold mb-3 text-lg ${textMain}`}>{item.question}</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 text-sm">
                    <div className={`flex-1 p-3 rounded-lg flex items-center gap-2 ${darkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-100/50 text-red-700'}`}>
                        <XCircle size={16} />
                        <span className="font-semibold">Your Answer:</span>
                        {item.userAnswer}
                    </div>
                    <div className={`flex-1 p-3 rounded-lg flex items-center gap-2 ${darkMode ? 'bg-green-900/20 text-green-300' : 'bg-green-100/50 text-green-700'}`}>
                        <CheckCircle size={16} />
                        <span className="font-semibold">Correct Answer:</span>
                        {item.correctAnswer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- 3. PLAYING VIEW ---
  const currentQ = activeQuestions[currentQIndex];

  if (!currentQ) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className={`mb-6 flex justify-between text-sm font-medium ${textSub}`}>
        <span>Question {currentQIndex + 1} / {activeQuestions.length}</span>
        <span className={`px-2 py-0.5 rounded text-white text-xs ${currentQ.difficulty === 'Easy' ? 'bg-green-500' : currentQ.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'}`}>{currentQ.difficulty || 'General'}</span>
      </div>
      <div className={`h-3 rounded-full mb-8 overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
        <div className="h-full bg-indigo-500 transition-all duration-500 ease-out" style={{ width: `${((currentQIndex + 1) / activeQuestions.length) * 100}%` }} />
      </div>
      
      <div className={`p-8 rounded-[2rem] shadow-sm border mb-6 relative overflow-hidden ${bgCard}`}>
        <h3 className={`text-xl font-bold mb-8 leading-relaxed relative z-10 ${textMain}`}>{currentQ.question}</h3>
        <div className="space-y-3 relative z-10">
          {currentQ.options.map((opt, idx) => (
            <button 
              key={idx} 
              onClick={() => handleOptionSelect(idx)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium flex items-center gap-4 group ${
                userAnswers[currentQIndex] === idx 
                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500' 
                : darkMode 
                    ? 'border-slate-700 text-slate-300 hover:border-indigo-500 hover:bg-slate-700' 
                    : 'border-gray-100 text-gray-600 hover:border-indigo-200 hover:bg-indigo-50'
              }`}
            >
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-colors ${
                  userAnswers[currentQIndex] === idx 
                  ? 'border-indigo-500 bg-indigo-500 text-white' 
                  : darkMode ? 'border-slate-600 text-slate-500' : 'border-gray-200 text-gray-400'
              }`}>
                  {String.fromCharCode(65 + idx)}
              </div>
              <span className="flex-1">{opt}</span>
              <ChevronRight size={16} className={`opacity-0 group-hover:opacity-100 transition-opacity ${userAnswers[currentQIndex] === idx ? 'text-indigo-500 opacity-100' : 'text-indigo-400'}`} />
            </button>
          ))}
        </div>
      </div>
      <div className="text-center">
        <button onClick={() => setGameState('menu')} className={`text-xs font-bold ${textSub} hover:underline`}>Quit to Menu</button>
      </div>
    </div>
  );
};

export default QuizTaker;