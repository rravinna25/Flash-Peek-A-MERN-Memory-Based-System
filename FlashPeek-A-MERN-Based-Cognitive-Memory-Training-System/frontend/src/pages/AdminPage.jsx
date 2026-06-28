import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Plus,
  Save,
  Trash2,
  Image as ImageIcon,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner';
import {
  createQuestion,
  fetchQuestions,
  deleteQuestion as deleteQuestionApi,
} from '../api/questions';

export default function AdminPage() {
  const [cards, setCards] = useState([]); // DB documents
  const [previewImage, setPreviewImage] = useState(false);
  const [loading, setLoading] = useState(false);

  // One image + deck
  const [imageUrl, setImageUrl] = useState('');
  const [deck, setDeck] = useState('children');

  // Multiple question blocks for this image
  const [questionBlocks, setQuestionBlocks] = useState([
    {
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
    },
  ]);

  // Load existing flashcards from backend
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchQuestions();
        setCards(data);
      } catch (err) {
        console.error('Error loading questions:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const updateQuestionField = (index, field, value) => {
    const updated = [...questionBlocks];
    updated[index] = { ...updated[index], [field]: value };
    setQuestionBlocks(updated);
  };

  const updateOption = (qIndex, optIndex, value) => {
    const updated = [...questionBlocks];
    const opts = [...updated[qIndex].options];
    opts[optIndex] = value;
    updated[qIndex].options = opts;
    setQuestionBlocks(updated);
  };

  const addQuestionBlock = () => {
    setQuestionBlocks((prev) => [
      ...prev,
      {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
      },
    ]);
  };

  const removeQuestionBlock = (index) => {
    if (questionBlocks.length === 1) {
      toast.error('At least one question is required');
      return;
    }
    setQuestionBlocks((prev) => prev.filter((_, i) => i !== index));
  };

  const saveFlashcardSet = async () => {
    if (!imageUrl.trim()) {
      toast.error('Please enter an image URL');
      return;
    }

    // Validate questions
    for (let i = 0; i < questionBlocks.length; i++) {
      const qb = questionBlocks[i];
      if (!qb.question.trim()) {
        toast.error(`Question ${i + 1} is empty`);
        return;
      }
      if (qb.options.some((o) => !o.trim())) {
        toast.error(`Please fill all options for question ${i + 1}`);
        return;
      }
    }

    const payload = {
      deck,
      imageUrl,
      questions: questionBlocks.map((qb) => ({
        question: qb.question,
        options: qb.options,
        correctAnswer: qb.correctAnswer,
      })),
    };

    try {
      setLoading(true);
      const saved = await createQuestion(payload);
      setCards((prev) => [...prev, saved]);
      toast.success('Flashcard set saved successfully!');

      // Reset form
      setImageUrl('');
      setDeck('children');
      setQuestionBlocks([
        { question: '', options: ['', '', '', ''], correctAnswer: 0 },
      ]);
      setPreviewImage(false);
    } catch (err) {
      console.error('Error saving flashcard set:', err);
      toast.error('Failed to save flashcard set');
    } finally {
      setLoading(false);
    }
  };

  const deleteCard = async (id) => {
    try {
      await deleteQuestionApi(id);
      setCards((prev) => prev.filter((c) => c._id !== id));
      toast.success('Flashcard set deleted');
    } catch (err) {
      console.error('Error deleting flashcard set:', err);
      toast.error('Failed to delete flashcard set');
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-slate-800 mb-4">Admin Panel</h1>
          <p className="text-slate-600">
            Create flashcard sets: one image with many questions
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* LEFT: Create Flashcard Set */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-8 shadow-xl border-teal-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-teal-500 p-2 rounded-lg">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-slate-800">Create New Flashcard Set</h2>
              </div>

              <div className="space-y-6">
                {/* Image URL */}
                <div>
                  <Label htmlFor="image" className="mb-2 block">
                    Image URL
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="image"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setPreviewImage((prev) => !prev)}
                      className="border-teal-200 hover:bg-teal-50"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                  {previewImage && imageUrl && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 rounded-lg overflow-hidden border border-slate-200"
                    >
                      <ImageWithFallback
                        src={imageUrl}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                      />
                    </motion.div>
                  )}
                </div>

                {/* Deck Selection */}
                <div>
                  <Label htmlFor="deck" className="mb-2 block">
                    Deck
                  </Label>
                  <select
                    id="deck"
                    value={deck}
                    onChange={(e) => setDeck(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  >
                    <option value="children">Children</option>
                    <option value="miscellaneous">Miscellaneous</option>
                  </select>
                </div>

                {/* Question Blocks */}
                <div>
                  <Label className="mb-3 block">
                    Questions for this Image
                  </Label>

                  <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
                    {questionBlocks.map((qb, index) => (
                      <div
                        key={index}
                        className="border border-slate-200 rounded-xl p-4 bg-slate-50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-slate-700">
                            Question {index + 1}
                          </span>
                          {questionBlocks.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeQuestionBlock(index)}
                              className="text-xs text-red-500 hover:underline"
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        <Textarea
                          placeholder="Enter question..."
                          value={qb.question}
                          onChange={(e) =>
                            updateQuestionField(
                              index,
                              'question',
                              e.target.value
                            )
                          }
                          rows={2}
                          className="mb-3"
                        />

                        <Label className="text-xs text-slate-600 mb-2 block">
                          Answer Options
                        </Label>
                        <div className="space-y-2">
                          {qb.options.map((opt, optIndex) => (
                            <div
                              key={optIndex}
                              className="flex gap-2 items-center"
                            >
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                                  qb.correctAnswer === optIndex
                                    ? 'bg-teal-500 text-white'
                                    : 'bg-slate-200 text-slate-600'
                                }`}
                              >
                                {optIndex + 1}
                              </div>
                              <Input
                                placeholder={`Option ${optIndex + 1}`}
                                value={opt}
                                onChange={(e) =>
                                  updateOption(
                                    index,
                                    optIndex,
                                    e.target.value
                                  )
                                }
                                className="flex-1"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuestionField(
                                    index,
                                    'correctAnswer',
                                    optIndex
                                  )
                                }
                                className={`p-2 rounded-lg transition-colors ${
                                  qb.correctAnswer === optIndex
                                    ? 'bg-teal-100 text-teal-600'
                                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                }`}
                                title="Mark as correct"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="mt-3 w-full"
                    onClick={addQuestionBlock}
                  >
                    + Add Another Question
                  </Button>
                </div>

                <Button
                  onClick={saveFlashcardSet}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                  size="lg"
                  disabled={loading}
                >
                  <Save className="w-5 h-5 mr-2" />
                  {loading ? 'Saving...' : 'Save Flashcard Set'}
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* RIGHT: List of Saved Flashcard Sets */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-8 shadow-xl border-teal-100">
              <h2 className="text-slate-800 mb-6">
                Created Flashcard Sets ({cards.length})
              </h2>

              {loading && cards.length === 0 ? (
                <p className="text-slate-500">Loading flashcards...</p>
              ) : cards.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">
                    No flashcard sets created yet
                  </p>
                  <p className="text-sm text-slate-400 mt-2">
                    Create your first set to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {cards.map((card) => (
                    <motion.div
                      key={card._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-teal-200 transition-all group"
                    >
                      <div className="flex gap-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200">
                          <ImageWithFallback
                            src={card.imageUrl}
                            alt="Card"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <p className="text-slate-800">
                                Deck:{' '}
                                <span className="font-semibold">
                                  {card.deck}
                                </span>
                              </p>
                              <p className="text-xs text-slate-500">
                                Questions: {card.questions.length}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => deleteCard(card._id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>

                          {/* Show first question as preview */}
                          {card.questions[0] && (
                            <p className="text-xs text-slate-600 line-clamp-2">
                              Example: {card.questions[0].question}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
