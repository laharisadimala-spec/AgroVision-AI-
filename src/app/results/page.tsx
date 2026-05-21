"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, ShieldCheck, Info, Leaf, 
  Droplets, Sprout, ArrowLeft, RefreshCw, CheckCircle2, Volume2, VolumeX
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useLanguage } from '@/context/LanguageContext';

export default function ResultsPage() {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<any>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const router = useRouter();
  const { translate, language } = useLanguage();

  useEffect(() => {
    setMounted(true);
    const storedData = localStorage.getItem('cropAnalysisData');
    if (storedData) {
      try {
        setData(JSON.parse(storedData));
      } catch (e) {
        console.error("Failed to parse data");
        router.push('/upload');
      }
    } else {
      router.push('/upload');
    }
  }, [router]);

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to set language based on selection
    if (language === 'hi') utterance.lang = 'hi-IN';
    else if (language === 'te') utterance.lang = 'te-IN';
    else if (language === 'ta') utterance.lang = 'ta-IN';
    else utterance.lang = 'en-US';

    utterance.onend = () => setIsSpeaking(false);
    
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const speakSummary = () => {
    if (!data) return;
    const textToSpeak = `${translate('disease')}: ${data.disease}. ${translate('treatment')}: ${data.treatment?.join(', ')}. ${translate('advisory')}: ${data.advisory}`;
    speakText(textToSpeak);
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (!mounted || !data) return null;

  return (
    <div className="min-h-screen bg-cream-50 font-sans text-earth-800 flex">
      <Sidebar />

      <main className="flex-1 lg:ml-[300px] p-4 sm:p-6 lg:p-10 relative overflow-hidden pb-24">
        
        <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] rounded-full bg-orange-100/40 blur-[100px] pointer-events-none animate-blob" />
        <div className="absolute bottom-[20%] left-[-10%] w-[30%] h-[30%] rounded-full bg-leaf-100/50 blur-[100px] pointer-events-none animate-blob" style={{ animationDelay: '2s' }} />

        <div className="mb-8 relative z-10">
          <Link href="/upload" className="inline-flex items-center text-earth-500 hover:text-earth-900 font-medium transition-colors mb-6 group">
            <div className="p-1.5 bg-white rounded-full mr-2 shadow-sm group-hover:shadow group-hover:-translate-x-1 transition-all">
              <ArrowLeft size={16} />
            </div>
            {translate('back_upload') || 'Back to Upload'}
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-earth-900 flex items-center gap-3">
                {translate('analysis_complete') || 'Analysis Complete'}
                <CheckCircle2 className="text-leaf-500" size={32} />
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={speakSummary}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all shadow-sm ${
                  isSpeaking ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                }`}
              >
                {isSpeaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
                {isSpeaking ? (translate('stop_audio') || 'Stop') : (translate('listen_advice') || 'Listen')}
              </button>
              <Link href="/upload" className="bg-white hover:bg-cream-100 text-earth-700 border border-sage-200 px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm transition-colors flex items-center gap-2">
                <RefreshCw size={16} />
                {translate('scan_another') || 'Scan Another'}
              </Link>
            </div>
          </div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10"
        >
          <div className="lg:col-span-1 space-y-6">
            <motion.div variants={itemVariants} className="glass-card p-4">
              {data.disease !== 'Healthy' ? (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-earth-100 relative shadow-inner">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={data.image} alt="Crop" className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-md shadow-sm">Your Scan</div>
                  </div>
                  <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-emerald-50 relative border-2 border-dashed border-emerald-200">
                    <div className="absolute inset-0 flex items-center justify-center flex-col text-emerald-400">
                      <Leaf size={32} className="mb-2 opacity-50" />
                      <span className="text-xs font-bold text-center px-4 leading-tight opacity-70">Healthy Reference Model</span>
                    </div>
                    <div className="absolute bottom-2 left-2 bg-emerald-500/80 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-md shadow-sm">{translate('healthy') || 'Healthy'} {data.plant}</div>
                  </div>
                </div>
              ) : (
                <div className="w-full aspect-square rounded-2xl overflow-hidden mb-4 bg-earth-100 relative shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={data.image} alt="Crop" className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-leaf-500 text-white p-2 rounded-full shadow-lg">
                    <CheckCircle2 size={24} />
                  </div>
                </div>
              )}

              <div className="space-y-4 mt-6">
                <div>
                  <p className="text-xs text-earth-500 uppercase tracking-wider font-bold mb-1">{translate('detected_plant') || 'Plant'}</p>
                  <p className="text-lg font-bold text-earth-900">{data.plant}</p>
                </div>
                
                <div className={`p-4 border rounded-2xl ${data.disease === 'Healthy' ? 'bg-leaf-50 border-leaf-100' : 'bg-orange-50 border-orange-100'}`}>
                  <p className={`text-xs uppercase tracking-wider font-bold mb-1 flex items-center gap-1 ${data.disease === 'Healthy' ? 'text-leaf-600' : 'text-orange-600'}`}>
                    {data.disease === 'Healthy' ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />} 
                    {translate('disease_found') || 'Status'}
                  </p>
                  <p className={`text-xl font-bold ${data.disease === 'Healthy' ? 'text-leaf-800' : 'text-orange-800'}`}>{data.disease}</p>
                  
                  {/* Severity Meter */}
                  {data.disease !== 'Healthy' && (
                    <div className="mt-4">
                      <div className="flex justify-between items-end mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-orange-700">Severity</span>
                        <span className="text-xs font-bold text-orange-900 bg-white px-2 py-0.5 rounded-full shadow-sm">{data.severity}</span>
                      </div>
                      <div className="w-full h-2 bg-orange-200/50 rounded-full overflow-hidden flex">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: data.severity === 'Low' ? '33%' : data.severity === 'Moderate' ? '66%' : '100%' }} 
                          transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                          className={`h-full ${data.severity === 'Low' ? 'bg-yellow-400' : data.severity === 'Moderate' ? 'bg-orange-500' : 'bg-red-500'}`}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-xs text-earth-500 uppercase tracking-wider font-bold">AI {translate('confidence') || 'Confidence'}</p>
                    <p className="text-sm font-bold text-leaf-600">{data.confidence}%</p>
                  </div>
                  <div className="w-full h-2.5 bg-sage-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${data.confidence}%` }} 
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-leaf-400 to-emerald-500 rounded-full relative"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="glass-panel p-6 rounded-3xl h-full border-t-4 border-t-red-400 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-50 text-red-500 rounded-xl">
                    <Info size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-earth-900">{translate('causes') || 'Causes'}</h3>
                </div>
                <ul className="space-y-4">
                  {data.causes?.map((cause: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-earth-700 font-medium text-base">
                      <span className="min-w-2 h-2 rounded-full bg-red-400 mt-2" />
                      <span>{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-panel p-6 rounded-3xl h-full border-t-4 border-t-leaf-500 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-leaf-50 text-leaf-600 rounded-xl">
                    <ShieldCheck size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-earth-900">{translate('treatment') || 'Treatment'}</h3>
                </div>
                <ul className="space-y-4">
                  {data.treatment?.map((rec: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-earth-700 font-medium text-base">
                      <span className="min-w-2 h-2 rounded-full bg-leaf-500 mt-2" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* AI Crop Care Timeline */}
            {data.timeline && data.timeline.length > 0 && (
              <motion.div variants={itemVariants} className="glass-panel p-6 sm:p-8 rounded-3xl border border-sage-200">
                <h3 className="text-2xl font-bold text-earth-900 mb-6 flex items-center gap-2">
                  <Sprout className="text-leaf-500" size={28} />
                  Care Timeline
                </h3>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-sage-300 before:to-transparent">
                  {data.timeline.map((step: any, idx: number) => (
                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-leaf-100 text-leaf-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        <CheckCircle2 size={20} />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-2xl shadow-sm border border-sage-100">
                        <time className="mb-1 text-sm font-bold text-leaf-600">{step.time}</time>
                        <p className="text-earth-700 font-medium">{step.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div variants={itemVariants} className="glass-panel p-6 sm:p-8 rounded-3xl">
              <h3 className="text-2xl font-bold text-earth-900 mb-6 flex items-center gap-2">
                <Leaf className="text-leaf-500" size={28} />
                {translate('prevention') || 'Prevention'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <ul className="space-y-4">
                    {data.prevention?.map((tip: string, idx: number) => (
                      <li key={idx} className="flex gap-3 text-earth-700 font-medium text-base bg-white/50 p-4 rounded-2xl border border-sage-100 shadow-sm">
                        <CheckCircle2 size={24} className="text-leaf-500 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-3xl border border-teal-100 h-full shadow-sm flex flex-col justify-center text-center">
                    <Droplets size={40} className="text-teal-600 mb-4 mx-auto" />
                    <p className="text-teal-900 font-bold text-lg leading-relaxed">
                      {data.advisory}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
