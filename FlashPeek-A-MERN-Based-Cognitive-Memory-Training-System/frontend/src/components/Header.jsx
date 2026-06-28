import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain } from 'lucide-react';
import { motion } from 'motion/react';

export default function Header() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/play', label: 'Play' },
    { path: '/admin', label: 'Admin' },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-teal-100 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-teal-500 to-teal-600 p-2 rounded-xl shadow-lg"
            >
              <Brain className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <span className="text-slate-800 tracking-tight">FlashPeek</span>
              <p className="text-xs text-slate-500">
                Cognitive Memory System
              </p>
            </div>
          </Link>

          <nav className="flex gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-teal-500 text-white shadow-md'
                        : 'text-slate-600 hover:bg-teal-50'
                    }`}
                  >
                    {item.label}
                  </motion.div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
