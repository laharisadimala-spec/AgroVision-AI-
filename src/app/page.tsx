"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, ShieldCheck, Sun, Sprout, ArrowRight, Camera, Smartphone, Globe } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';

export default function LandingPage() {
  const { translate } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-cream-50 font-sans text-earth-800 overflow-x-hidden">
      <Navbar />
      
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-leaf-100/50 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3 animate-blob" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sage-100/40 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/4 animate-blob" style={{ animationDelay: '2s' }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-leaf-50 border border-leaf-100 text-leaf-700 font-medium text-sm mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-leaf-500 animate-pulse"></span>
              AgroVision AI 2.0
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-earth-900 tracking-tight mb-6 leading-tight">
              {translate('tagline_1') || 'Healthy Crops.'}<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-leaf-500 to-emerald-400">{translate('tagline_2') || 'Smarter Farming.'}</span>
            </h1>
            <p className="text-xl md:text-2xl text-earth-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              {translate('hero_desc') || 'AI-powered crop disease detection and smart farming guidance for sustainable agriculture. In your language.'}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4">
              <Link href="/upload" className="w-full sm:w-auto flex items-center justify-center gap-3 bg-leaf-500 hover:bg-leaf-600 text-white px-8 py-5 rounded-full font-bold text-xl transition-all shadow-[0_8px_30px_rgb(34,197,94,0.3)] hover:-translate-y-1">
                <Camera size={28} />
                {translate('scan_crop') || 'Scan Crop Now'}
              </Link>
              <Link href="/chat" className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white hover:bg-cream-100 text-earth-800 border-2 border-sage-200 px-8 py-5 rounded-full font-bold text-xl transition-all shadow-sm hover:-translate-y-1">
                <Globe size={24} />
                {translate('ask_ai') || 'Ask AI Assistant'}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white relative z-10" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl font-bold text-earth-800 mb-4">{translate('features_title') || 'Farm Smarter, Not Harder'}</h2>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: Camera, title: translate('f1_title') || "Camera-First AI", desc: translate('f1_desc') || "Instantly scan leaves for diseases in seconds using your mobile camera.", color: "text-leaf-500", bg: "bg-leaf-50" },
              { icon: Globe, title: translate('f2_title') || "Your Language", desc: translate('f2_desc') || "Listen to advice in Telugu, Hindi, Tamil, and English with voice output.", color: "text-sky-500", bg: "bg-sky-50" },
              { icon: ShieldCheck, title: translate('f3_title') || "Sustainable Practices", desc: translate('f3_desc') || "Get organic treatment and weather advisories to protect your crops.", color: "text-emerald-500", bg: "bg-emerald-50" }
            ].map((feature, i) => (
              <motion.div key={i} variants={itemVariants} className="bg-cream-50/50 border border-sage-100 rounded-3xl p-8 hover:bg-white hover:shadow-xl hover:shadow-sage-100 transition-all duration-300 group">
                <div className={`w-16 h-16 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold text-earth-800 mb-3">{feature.title}</h3>
                <p className="text-earth-500 leading-relaxed text-lg">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-32 bg-earth-900 text-cream-50 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-leaf-500/20 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-10">{translate('ready_transform') || 'Ready to transform your farming?'}</h2>
          <Link href="/upload" className="inline-flex items-center justify-center gap-3 bg-leaf-500 hover:bg-leaf-600 text-white px-10 py-5 rounded-full font-bold text-2xl transition-all shadow-lg hover:-translate-y-1">
            <Camera size={28} />
            {translate('scan_crop') || 'Scan Crop Now'}
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
