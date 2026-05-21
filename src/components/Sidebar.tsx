"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, UploadCloud, CloudSun, 
  MessageSquare, Settings, Menu, X, Sprout, Home, Globe
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const { translate, language, setLanguage } = useLanguage();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navItems = [
    { name: translate('home') || 'Home', icon: Home, href: '/' },
    { name: translate('dashboard') || 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: translate('scan') || 'Upload Crop', icon: UploadCloud, href: '/upload' },
    { name: translate('weather') || 'Weather Advisory', icon: CloudSun, href: '/weather' },
    { name: translate('chat') || 'AI Assistant', icon: MessageSquare, href: '/chat' },
    { name: translate('settings') || 'Settings', icon: Settings, href: '#' },
  ];

  const toggleLanguage = () => {
    const langs = ['en', 'hi', 'te', 'ta'] as const;
    const currentIndex = langs.indexOf(language);
    const nextIndex = (currentIndex + 1) % langs.length;
    setLanguage(langs[nextIndex]);
  };

  const sidebarContent = (
    <div className="flex-1 bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-6 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] shadow-sage-200/50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-leaf-100/50 rounded-full blur-[40px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
      <div className="flex items-center gap-3 mb-10 pl-2 relative z-10">
        <div className="bg-gradient-to-tr from-leaf-400 to-emerald-400 p-2 rounded-xl text-white shadow-sm">
          <Sprout size={28} />
        </div>
        <span className="font-bold text-2xl text-earth-900 tracking-tight">AgroVision</span>
      </div>
      <nav className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar relative z-10">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-medium transition-all duration-300 group ${
                isActive 
                  ? 'bg-leaf-500 text-white shadow-[0_4px_14px_0_rgb(34,197,94,0.39)]' 
                  : 'text-earth-500 hover:bg-white hover:text-earth-900 hover:shadow-sm'
              }`}
            >
              <item.icon 
                size={22} 
                className={`transition-colors ${isActive ? 'text-white' : 'text-earth-400 group-hover:text-leaf-500'}`} 
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="mt-4 relative z-10">
         <button 
          onClick={toggleLanguage}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-sage-50 hover:bg-sage-100 border border-sage-200 rounded-2xl transition-colors text-earth-700 font-medium"
        >
          <div className="flex items-center gap-2">
            <Globe size={18} className="text-earth-500" />
            Language
          </div>
          <span className="bg-white px-2 py-1 rounded-md shadow-sm text-sm uppercase font-bold text-leaf-600">
            {language}
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 left-6 z-50 p-2 bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-sage-100 text-earth-600 hover:text-leaf-600 lg:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop Sidebar - Always rendered but hidden on mobile via CSS */}
      <aside className="fixed top-0 left-0 z-40 h-screen w-72 lg:w-[300px] p-4 lg:p-6 hidden lg:flex flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar - Animated */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed top-0 left-0 z-40 h-screen w-72 p-4 flex flex-col lg:hidden"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-earth-900/20 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}
