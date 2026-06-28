import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  Eye,
  Zap,
  Trophy,
  ArrowRight,
  MessageSquare,
  MousePointer,
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export default function HomePage() {
  const steps = [
    {
      icon: <Eye className="w-6 h-6" />,
      title: 'Peek at Image',
      description:
        'An image appears for a few seconds. Focus and memorize the details!',
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: 'Answer Question',
      description:
        'The card flips to reveal a question based on what you saw.',
    },
    {
      icon: <MousePointer className="w-6 h-6" />,
      title: 'Select Option',
      description:
        'Choose the correct answer from the multiple choice options.',
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: 'Earn Points',
      description:
        'Get it right to score points! Wrong answers move to the next card.',
    },
  ];

  const floatingCards = [
    { delay: 0, duration: 3, y: 20 },
    { delay: 0.5, duration: 3.5, y: 30 },
    { delay: 1, duration: 4, y: 25 },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] overflow-hidden">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block"
            >
              <span className="bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm tracking-wide">
                Cognitive Memory Training
              </span>
            </motion.div>

            <h1 className="text-slate-800">
              Welcome to{' '}
              <span className="text-teal-600">FlashPeek</span>
            </h1>

            <p className="text-slate-600 text-lg leading-relaxed">
              See it, think it, guess it!
              Look at the picture and test your memory with cool, fast questions!
              Every question helps you boost your brain power while having fun.
              Are you ready to spot, remember, and win the challenge?
            </p>

            <div className="flex gap-4 pt-4">
              <Link to="/play">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                >
                  Start Playing <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>

              <motion.a
                href="#how-to-play"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-slate-700 px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all border border-slate-200"
              >
                How to Play
              </motion.a>
            </div>
          </motion.div>

          {/* Right - Floating Cards Animation */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative h-[400px] hidden lg:block"
          >
            {floatingCards.map((card, index) => (
              <motion.div
                key={index}
                animate={{
                  y: [0, card.y, 0],
                  rotate: [0, index * 2, 0],
                }}
                transition={{
                  duration: card.duration,
                  repeat: Infinity,
                  delay: card.delay,
                  ease: 'easeInOut',
                }}
                className="absolute"
                style={{
                  left: `${index * 25}%`,
                  top: `${index * 15}%`,
                }}
              >
                <div className="w-56 h-72 bg-white rounded-2xl shadow-2xl overflow-hidden border border-teal-100">
                  <ImageWithFallback
                    src={
                      index === 0
                        ? 'https://images.unsplash.com/photo-1597434429739-2574d7e06807?auto=format&fit=crop&w=800&q=80'
                        : index === 1
                        ? 'https://images.unsplash.com/photo-1602455891694-02f0fc9facba?auto=format&fit=crop&w=800&q=80'
                        : 'https://images.unsplash.com/photo-1513563326940-e76e4641069e?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={`Card ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How to Play Section */}
      <section
        id="how-to-play"
        className="bg-white/50 backdrop-blur-sm py-16 mt-12"
      >
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-slate-800 mb-4">How to Play</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Follow these simple steps to start training your cognitive
              memory
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-teal-50"
              >
                <div className="bg-gradient-to-br from-teal-500 to-teal-600 w-14 h-14 rounded-xl flex items-center justify-center text-white mb-4 shadow-md">
                  {step.icon}
                </div>
                <div className="bg-teal-100 text-teal-700 w-8 h-8 rounded-full flex items-center justify-center mb-3">
                  {index + 1}
                </div>
                <h3 className="text-slate-800 mb-2">{step.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50"></div>

          <div className="relative z-10">
            <Zap className="w-16 h-16 text-white mx-auto mb-4" />
            <h2 className="text-white mb-4">
              Ready to Challenge Your Mind?
            </h2>
            <p className="text-teal-50 mb-8 max-w-2xl mx-auto text-lg">
              Test your cognitive abilities and improve your memory
              retention with FlashPeek
            </p>
            <Link to="/play">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-teal-600 px-10 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all inline-flex items-center gap-2"
              >
                Start Game Now <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
