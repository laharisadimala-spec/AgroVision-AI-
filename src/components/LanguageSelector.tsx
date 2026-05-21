"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' }
  ];

  const currentLang = languages.find(l => l.code === language) || languages[0];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white/80 backdrop-blur-md border border-sage-200 px-4 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all text-earth-700 font-medium text-sm md:text-base"
      >
        <Globe size={18} className="text-leaf-600" />
        <span>{currentLang.nativeName}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-xl border border-sage-100 overflow-hidden z-50"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code as any);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors hover:bg-sage-50 ${
                  language === lang.code ? 'text-leaf-700 bg-leaf-50' : 'text-earth-700'
                }`}
              >
                {lang.nativeName}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
