"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Image as ImageIcon, X, AlertCircle, Leaf, Loader2, ArrowRight, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useLanguage } from '@/context/LanguageContext';

/** Milliseconds to wait before showing a "taking longer than usual" hint. */
const SLOW_HINT_DELAY = 12_000;

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSlowHint, setIsSlowHint] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isQuotaError, setIsQuotaError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const slowHintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const { translate, language } = useLanguage();

  const clearSlowTimer = () => {
    if (slowHintTimer.current) {
      clearTimeout(slowHintTimer.current);
      slowHintTimer.current = null;
    }
  };

  const processFile = (selectedFile: File) => {
    setError(null);
    setIsQuotaError(false);
    if (!selectedFile.type.startsWith('image/')) {
      setError(translate('error_invalid_image') || 'Please upload a valid image file.');
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.onerror = () => {
      setError('Failed to read the image file. Please try again.');
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    setIsQuotaError(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if (!preview) return;

    setIsAnalyzing(true);
    setIsSlowHint(false);
    setError(null);
    setIsQuotaError(false);

    // Show a "taking longer than usual" hint after SLOW_HINT_DELAY ms
    slowHintTimer.current = setTimeout(() => setIsSlowHint(true), SLOW_HINT_DELAY);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: preview, lang: language }),
      });

      let data: Record<string, unknown>;
      try {
        data = await response.json();
      } catch {
        throw new Error('AI service is currently busy. Please try again shortly.');
      }

      if (!response.ok) {
        const isQuota = response.status === 429;
        setIsQuotaError(isQuota);
        throw new Error(
          (data?.error as string) ||
            'AI service is currently busy. Please try again shortly.'
        );
      }

      // Store result and image in localStorage for the results page
      const newScan = {
        id: Date.now(),
        crop: (data.plant as string) || 'Unknown Crop',
        status: (data.disease as string) || 'Analyzed',
        time: new Date().toLocaleTimeString(),
        data,
        image: preview,
      };

      try {
        localStorage.setItem('cropAnalysisData', JSON.stringify({ ...data, image: preview }));
        const historyStr = localStorage.getItem('cropScanHistory');
        const history: unknown[] = historyStr ? JSON.parse(historyStr) : [];
        (history as unknown[]).unshift(newScan);
        localStorage.setItem('cropScanHistory', JSON.stringify((history as unknown[]).slice(0, 10)));
      } catch {
        // localStorage may be unavailable in some browsers — silently ignore
      }

      router.push('/results');
    } catch (err: unknown) {
      const msg =
        (err as Error)?.message || 'AI service is currently busy. Please try again shortly.';
      setError(msg);
    } finally {
      clearSlowTimer();
      setIsSlowHint(false);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 font-sans text-earth-800 flex">
      <Sidebar />

      <main className="flex-1 lg:ml-[300px] p-4 sm:p-6 lg:p-10 relative overflow-hidden flex flex-col items-center justify-center min-h-screen">

        <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] rounded-full bg-leaf-200/40 blur-[120px] pointer-events-none animate-blob" />
        <div className="absolute bottom-[10%] left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-100/40 blur-[120px] pointer-events-none animate-blob" style={{ animationDelay: '2s' }} />

        <div className="relative z-10 w-full max-w-xl mx-auto">
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center justify-center p-3 bg-leaf-100 text-leaf-600 rounded-full mb-4 shadow-sm"
            >
              <Leaf size={28} />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-extrabold tracking-tight text-earth-900 mb-2"
            >
              {translate('scan_title') || 'Scan Crop'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-earth-500 text-lg max-w-sm mx-auto"
            >
              {translate('scan_desc') || 'Take a clear photo of the leaf'}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-4 sm:p-6 shadow-xl shadow-sage-200/30 w-full rounded-[32px]"
          >
            <AnimatePresence mode="wait">
              {/* Error banner */}
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`mb-6 border px-4 py-3 rounded-xl flex items-start gap-3 ${
                    isQuotaError
                      ? 'bg-amber-50 border-amber-200 text-amber-700'
                      : 'bg-red-50 border-red-200 text-red-600'
                  }`}
                >
                  <AlertCircle size={20} className="shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="font-medium text-sm">{error}</span>
                    {isQuotaError && (
                      <p className="text-xs mt-1 opacity-80">
                        The AI quota has been reached. Please wait a moment and try again.
                      </p>
                    )}
                  </div>
                  {/* Retry button shown only when an image is already selected */}
                  {preview && !isAnalyzing && (
                    <button
                      onClick={handleAnalyze}
                      className="shrink-0 flex items-center gap-1 text-xs font-bold bg-white border border-current px-3 py-1.5 rounded-full hover:opacity-80 transition-opacity"
                    >
                      <RefreshCw size={12} />
                      Retry
                    </button>
                  )}
                </motion.div>
              )}

              {/* Slow-hint banner */}
              {isAnalyzing && isSlowHint && !error && (
                <motion.div
                  key="slow"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl flex items-center gap-3"
                >
                  <Loader2 size={18} className="animate-spin shrink-0" />
                  <span className="text-sm font-medium">
                    Taking a bit longer than usual… AI is working hard. Please wait.
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {!preview ? (
              <div className="flex flex-col gap-4">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  ref={cameraInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />

                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="w-full bg-leaf-500 text-white rounded-3xl p-10 flex flex-col items-center justify-center gap-4 hover:bg-leaf-600 transition-colors shadow-lg"
                >
                  <div className="bg-white/20 p-6 rounded-full backdrop-blur-md">
                    <Camera size={48} className="text-white" />
                  </div>
                  <span className="text-2xl font-bold">{translate('open_camera') || 'Open Camera'}</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-white text-earth-700 border-2 border-sage-200 rounded-3xl p-6 flex items-center justify-center gap-3 hover:bg-sage-50 transition-colors shadow-sm"
                >
                  <ImageIcon size={24} className="text-earth-500" />
                  <span className="text-lg font-bold">{translate('choose_gallery') || 'Choose from Gallery'}</span>
                </button>
              </div>
            ) : (
              <div className="relative">
                <div className="relative h-[60vh] max-h-[500px] w-full rounded-2xl overflow-hidden shadow-inner border border-sage-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="Crop preview" className="w-full h-full object-cover" />

                  {!isAnalyzing && (
                    <button
                      onClick={clearFile}
                      className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-earth-800 p-3 rounded-full shadow-lg hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <X size={24} />
                    </button>
                  )}
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className={`w-full py-5 rounded-full font-bold text-xl transition-all shadow-lg flex items-center justify-center gap-3 ${
                      isAnalyzing
                        ? 'bg-leaf-600 text-white cursor-not-allowed opacity-90'
                        : 'bg-leaf-500 hover:bg-leaf-600 text-white hover:scale-[1.02]'
                    }`}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 size={28} className="animate-spin" />
                        {isSlowHint
                          ? 'Still analyzing…'
                          : translate('analyzing') || 'Analyzing…'}
                      </>
                    ) : (
                      <>
                        {translate('analyze_now') || 'Analyze Crop'}
                        <ArrowRight size={24} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
