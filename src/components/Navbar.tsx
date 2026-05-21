"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LanguageSelector from '@/components/LanguageSelector';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { translate } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'home', href: '/' },
    { name: 'dashboard', href: '/dashboard' },
    { name: 'scan', href: '/upload' },
    { name: 'weather', href: '/weather' },
    { name: 'chat', href: '/chat' },
  ];

  return (
    <nav className={`fixed w-full z-50 top-0 start-0 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-sage-100 shadow-sm py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-tr from-leaf-400 to-emerald-400 p-2 rounded-xl text-white shadow-sm group-hover:scale-105 transition-transform">
              <Sprout size={24} />
            </div>
            <span className="font-bold text-2xl text-earth-800 tracking-tight">AgroVision</span>
          </Link>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1 bg-white/50 backdrop-blur-md px-2 py-1 rounded-full border border-sage-100 shadow-sm">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    pathname === item.href 
                      ? 'bg-leaf-50 text-leaf-600' 
                      : 'text-earth-500 hover:text-earth-800 hover:bg-sage-50'
                  }`}
                >
                  {translate(item.name)}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-3">
            <LanguageSelector />
            <Link href="/upload" className="bg-leaf-500 hover:bg-leaf-600 text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-[0_4px_14px_0_rgb(34,197,94,0.39)] hover:shadow-[0_6px_20px_rgba(34,197,94,0.23)] hover:-translate-y-0.5">
              {translate('scan')}
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-earth-500 hover:text-earth-800 focus:outline-none p-2 bg-white/50 backdrop-blur rounded-full border border-sage-100"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-b border-sage-100 overflow-hidden shadow-lg absolute w-full"
          >
            <div className="px-4 pt-2 pb-6 space-y-2 sm:px-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    pathname === item.href ? 'bg-leaf-50 text-leaf-600' : 'text-earth-600 hover:text-earth-900 hover:bg-sage-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {translate(item.name)}
                </Link>
              ))}
              <div className="pt-4 px-2 space-y-3">
                <div className="flex justify-center w-full">
                  <LanguageSelector />
                </div>
                <Link href="/upload" className="block text-center w-full bg-leaf-500 hover:bg-leaf-600 text-white px-6 py-3 rounded-full font-semibold transition-colors shadow-md">
                  {translate('scan')}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
