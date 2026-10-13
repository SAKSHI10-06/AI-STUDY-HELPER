import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCw, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

const FlashcardViewer = ({ cards = [], darkMode = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset viewer state when new cards are loaded
  useEffect(() => {
    console.debug('FlashcardViewer: cards changed length=', cards?.length);
    setIsFlipped(false);
    setCurrentIndex(0);
  }, [cards]);

  // Safety check for empty data
  if (!cards || cards.length === 0) {
    return (
      <div className={`text-center py-20 rounded-3xl border-2 border-dashed ${darkMode ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
        <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
        <p>No flashcards generated for this set.</p>
      </div>
    );
  }

  // Guard currentIndex against out-of-range values
  const safeIndex = Math.max(0, Math.min(currentIndex, cards.length - 1));
  const currentCard = cards[safeIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((prev) => (prev + 1) % cards.length), 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length), 150);
  };

  // Dynamic classes based on darkMode prop
  const cardBg = darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-indigo-50';
  const textColor = darkMode ? 'text-slate-100' : 'text-slate-800';
  const subTextColor = darkMode ? 'text-slate-400' : 'text-gray-400';
  const btnBg = darkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-white hover:bg-indigo-50 text-indigo-600';

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto">
      
      {/* 3D Card Container */}
      <div 
        className="w-full h-96 relative perspective-1000 cursor-pointer group" 
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="w-full h-full relative preserve-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* --- FRONT SIDE (Question) --- */}
          <div 
            className={`absolute w-full h-full backface-hidden border-2 rounded-[2rem] shadow-xl flex flex-col items-center justify-center p-12 text-center transition-all ${cardBg}`}
            style={{ backfaceVisibility: 'hidden' }}
          >
             <div className={`absolute top-8 left-8 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${darkMode ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}>
                Question
             </div>
             
             <h3 className={`text-2xl md:text-3xl font-bold leading-snug ${textColor}`}>
                {currentCard.front}
             </h3>

             <div className={`absolute bottom-8 text-sm flex items-center gap-2 transition-colors ${subTextColor} group-hover:text-indigo-500`}>
                <RotateCw size={16} /> Click to flip
             </div>
          </div>

          {/* --- BACK SIDE (Answer) --- */}
          <div 
            className="absolute w-full h-full backface-hidden rounded-[2rem] shadow-xl flex flex-col items-center justify-center p-12 text-center bg-gradient-to-br from-indigo-600 to-violet-700 text-white"
            style={{ 
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden'
            }}
          >
             <div className="absolute top-8 left-8 bg-white/20 text-indigo-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Answer
             </div>

             <p className="text-xl md:text-2xl font-medium leading-relaxed">
                {currentCard.back}
             </p>
          </div>
        </motion.div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-6 mt-10">
        <button 
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          className={`p-4 rounded-full shadow-lg border border-transparent transition-all active:scale-95 ${btnBg}`}
        >
          <ChevronLeft size={24} />
        </button>

        <span className={`font-mono font-bold px-4 py-2 rounded-lg ${darkMode ? 'bg-slate-800 text-slate-400' : 'bg-gray-100 text-gray-500'}`}>
          {safeIndex + 1} / {cards.length}
        </span>

        <button 
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          className={`p-4 rounded-full shadow-lg border border-transparent transition-all active:scale-95 ${btnBg}`}
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default FlashcardViewer;