import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw } from 'lucide-react';
import { fetchQuestions } from '../api/questions';
import { ImageWithFallback } from '../figma/ImageWithFallback';

const IMAGE_TIME = 15; // seconds

export default function PlayPage() {
  const [phase, setPhase] = useState('selectDeck'); 
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [secondsLeft, setSecondsLeft] = useState(IMAGE_TIME);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);

  // IMAGE TIMER
  useEffect(() => {
    if (phase !== 'showingImage') return;
    if (secondsLeft <= 0) {
      setPhase('asking');
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, secondsLeft]);

  const startDeck = async (deckId) => {
    try {
      setPhase('loading');
      setSelectedDeck(deckId);

      const data = await fetchQuestions(deckId);
      if (!data.length) {
        alert('No flashcards available in this deck.');
        setPhase('selectDeck');
        return;
      }

      setCards(data);
      setCurrentCardIndex(0);
      setCurrentQuestionIndex(0);
      setSecondsLeft(IMAGE_TIME);
      setSelectedOption(null);
      setScore(0);

      setPhase('showingImage');
    } catch (err) {
      console.error(err);
      alert('Failed to load deck.');
      setPhase('selectDeck');
    }
  };

  const currentCard = cards[currentCardIndex];
  const currentQuestion =
    currentCard && currentCard.questions[currentQuestionIndex];

  const handleOptionClick = (optIndex) => {
    if (!currentQuestion || selectedOption !== null) return;

    setSelectedOption(optIndex);

    const correct = optIndex === currentQuestion.correctAnswer;
    if (correct) setScore((prev) => prev + 10);

    setTimeout(() => {
      // next question inside same card
      if (currentQuestionIndex + 1 < currentCard.questions.length) {
        setCurrentQuestionIndex((q) => q + 1);
        setSelectedOption(null);
      } else {
        // move to next card
        if (currentCardIndex + 1 < cards.length) {
          setCurrentCardIndex((c) => c + 1);
          setCurrentQuestionIndex(0);
          setSelectedOption(null);
          setSecondsLeft(IMAGE_TIME);
          setPhase('showingImage');
        } else {
          setPhase('finished');
        }
      }
    }, 1500);
  };

  const restart = () => {
    setPhase('selectDeck');
    setCards([]);
    setCurrentCardIndex(0);
    setCurrentQuestionIndex(0);
    setSecondsLeft(IMAGE_TIME);
    setSelectedOption(null);
    setScore(0);
  };

  // --- UI PHASES ---

  if (phase === 'selectDeck') {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4 text-slate-800">
          Choose a Deck
        </h1>
        <div className="grid gap-6 mt-8 max-w-md mx-auto">
          <button
            className="py-4 bg-blue-500 text-white rounded-xl"
            onClick={() => startDeck('children')}
          >
            Children Deck
          </button>
          <button
            className="py-4 bg-purple-500 text-white rounded-xl"
            onClick={() => startDeck('miscellaneous')}
          >
            Miscellaneous Deck
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'loading') {
    return <p className="text-center mt-20 text-slate-600">Loading…</p>;
  }

  if (!currentCard) {
    return (
      <div className="text-center mt-20">
        <p>No flashcards found.</p>
        <button onClick={restart}>Go Back</button>
      </div>
    );
  }

  if (phase === 'finished') {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <Trophy className="w-16 h-16 mx-auto text-teal-500" />
        <h2 className="text-2xl font-semibold mt-4">Round Complete!</h2>
        <p className="mt-2 text-slate-600">
          Final Score:{' '}
          <span className="text-3xl text-teal-600 font-bold">{score}</span>
        </p>
        <button
          onClick={restart}
          className="mt-6 py-3 px-6 bg-teal-500 hover:bg-teal-600 text-white rounded-xl"
        >
          Play Again
        </button>
      </div>
    );
  }

  // --- MAIN SLIDE UI ---

  return (
    <div className="container mx-auto px-6 py-10 max-w-4xl">

      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-slate-700 font-semibold">
          Score: <span className="text-teal-600">{score}</span>
        </p>
        <p className="text-slate-500">
          Card {currentCardIndex + 1}/{cards.length}
        </p>
        <button
          onClick={restart}
          className="text-slate-600 hover:text-slate-800 flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> Restart
        </button>
      </div>

      <div className="relative h-[420px] w-full overflow-hidden rounded-3xl">

        <AnimatePresence mode="wait">

          {/* IMAGE PHASE */}
          {phase === 'showingImage' && (
            <motion.div
              key={`image-${currentCardIndex}`}
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -400, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 bg-white rounded-3xl shadow-xl overflow-hidden"
            >
              <ImageWithFallback
                src={currentCard.imageUrl}
                alt="Flashcard"
                className="w-full h-full object-contain bg-black"
              />

              <div className="absolute bottom-0 inset-x-0 bg-black/50 p-4 text-center text-white">
                Memorize the image — <b>{secondsLeft}s left</b>
              </div>
            </motion.div>
          )}

          {/* QUESTION PHASE */}
          {phase === 'asking' && currentQuestion && (
            <motion.div
              key={`q-${currentCardIndex}-${currentQuestionIndex}`}
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -400, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 bg-white rounded-3xl shadow-xl p-6 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  {currentQuestion.question}
                </h2>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQuestion.options.map((opt, i) => {
                    const correct = currentQuestion.correctAnswer;

                    let style =
                      'border border-slate-300 bg-white hover:bg-slate-100';
                    if (selectedOption !== null) {
                      if (i === correct) {
                        style = 'border-green-600 bg-green-100';
                      } else if (i === selectedOption) {
                        style = 'border-red-600 bg-red-100';
                      }
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => handleOptionClick(i)}
                        disabled={selectedOption !== null}
                        className={`rounded-xl p-4 text-left transition ${style}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              <p className="text-right text-sm text-slate-500">
                Q {currentQuestionIndex + 1}/{currentCard.questions.length}
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
