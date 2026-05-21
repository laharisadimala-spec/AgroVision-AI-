"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Mic, MicOff, Volume2, VolumeX, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { useLanguage } from '@/context/LanguageContext';

type Message = {
  role: 'user' | 'model';
  content: string;
  isError?: boolean;
};

const AI_BUSY_MESSAGE = 'AI service is currently busy. Please try again shortly.';

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const { translate, language } = useLanguage();

  const suggestedQuestions = [
    translate('q_yellow_leaves') || 'Why are my leaves turning yellow?',
    translate('q_watering') || 'How often should I water crops?',
    translate('q_fertilizer') || 'What fertilizer should I use?',
    translate('q_fungal') || 'How to stop fungal disease?',
  ];

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setInput((prev) => prev + finalTranscript);
        }
      };

      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = () => setIsListening(false);
    }

    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (!recognitionRef.current) return;
    if (language === 'hi') recognitionRef.current.lang = 'hi-IN';
    else if (language === 'te') recognitionRef.current.lang = 'te-IN';
    else if (language === 'ta') recognitionRef.current.lang = 'ta-IN';
    else recognitionRef.current.lang = 'en-US';
  }, [language]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch {
          setIsListening(false);
        }
      } else {
        alert(translate('error_mic_support') || 'Microphone not supported in this browser.');
      }
    }
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    if (language === 'hi') utterance.lang = 'hi-IN';
    else if (language === 'te') utterance.lang = 'te-IN';
    else if (language === 'ta') utterance.lang = 'ta-IN';
    else utterance.lang = 'en-US';

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: messages
            .filter((m) => !m.isError)
            .map((m) => ({ role: m.role, parts: [{ text: m.content }] })),
          lang: language,
        }),
      });

      let data: Record<string, unknown>;
      try {
        data = await response.json();
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: 'model', content: AI_BUSY_MESSAGE, isError: true },
        ]);
        return;
      }

      if (!response.ok || !data.message) {
        const errorMsg =
          (data?.error as string) ||
          (response.status === 429
            ? AI_BUSY_MESSAGE
            : translate('error_chat') || AI_BUSY_MESSAGE);

        setMessages((prev) => [
          ...prev,
          { role: 'model', content: errorMsg, isError: true },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        { role: 'model', content: data.message as string },
      ]);
    } catch {
      // Network failure or other unhandled exception
      setMessages((prev) => [
        ...prev,
        { role: 'model', content: AI_BUSY_MESSAGE, isError: true },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 font-sans text-earth-800 flex">
      <Sidebar />

      <main className="flex-1 lg:ml-[300px] flex flex-col h-screen relative overflow-hidden">

        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-leaf-100/50 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-sage-100/50 blur-[120px] pointer-events-none" />

        {/* Header */}
        <div className="p-4 sm:p-6 pb-2 border-b border-sage-200 bg-white/50 backdrop-blur-xl z-10 sticky top-0 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-leaf-100 p-2.5 rounded-xl text-leaf-600">
              <Bot size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-earth-900">
                {translate('ai_assistant') || 'AI Assistant'}
              </h1>
              <p className="text-earth-500 font-medium text-sm">
                {translate('ai_desc') || 'Voice-enabled farming expert'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (isSpeaking) {
                window.speechSynthesis?.cancel();
                setIsSpeaking(false);
              }
            }}
            className={`p-3 rounded-full transition-colors ${isSpeaking ? 'bg-orange-100 text-orange-600' : 'bg-sage-100 text-earth-600'}`}
          >
            {isSpeaking ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 z-10 relative">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
              <div className="bg-leaf-100 p-6 rounded-full mb-6">
                <Sparkles size={48} className="text-leaf-600" />
              </div>
              <h2 className="text-3xl font-extrabold text-earth-900 mb-4">
                {translate('how_can_i_help') || 'How can I help your farm today?'}
              </h2>
              <p className="text-earth-600 text-lg mb-10">
                {translate('ask_anything') ||
                  'Ask about crop diseases, fertilizers, or weather impacts in your language.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(q)}
                    className="bg-white/80 backdrop-blur-md border border-sage-200 p-5 rounded-2xl text-left text-earth-700 font-medium hover:bg-leaf-50 hover:border-leaf-200 hover:text-leaf-700 transition-all shadow-sm"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 max-w-4xl mx-auto pb-4">
              <AnimatePresence initial={false}>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div
                      className={`shrink-0 p-3 rounded-2xl shadow-sm ${
                        msg.role === 'user'
                          ? 'bg-earth-100 text-earth-700'
                          : msg.isError
                          ? 'bg-amber-100 text-amber-600'
                          : 'bg-leaf-100 text-leaf-600'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        <User size={24} />
                      ) : msg.isError ? (
                        <AlertCircle size={24} />
                      ) : (
                        <Bot size={24} />
                      )}
                    </div>

                    <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`px-6 py-4 rounded-[24px] shadow-sm max-w-[85%] text-lg font-medium leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-earth-800 text-white rounded-tr-sm'
                            : msg.isError
                            ? 'bg-amber-50 border border-amber-200 text-amber-800 rounded-tl-sm'
                            : 'bg-white border border-sage-100 text-earth-800 rounded-tl-sm'
                        }`}
                      >
                        {msg.content}
                      </div>

                      {msg.role === 'model' && !msg.isError && (
                        <button
                          onClick={() => speakText(msg.content)}
                          className="mt-2 text-leaf-600 hover:text-leaf-800 bg-leaf-50 p-2 rounded-full transition-colors"
                        >
                          <Volume2 size={18} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Loading indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start gap-4"
                >
                  <div className="shrink-0 p-3 rounded-2xl bg-leaf-100 text-leaf-600 shadow-sm">
                    <Bot size={24} />
                  </div>
                  <div className="px-6 py-5 rounded-[24px] rounded-tl-sm bg-white border border-sage-100 shadow-sm flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-leaf-400 rounded-full animate-bounce" />
                    <div className="w-2.5 h-2.5 bg-leaf-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                    <div className="w-2.5 h-2.5 bg-leaf-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="p-4 sm:p-6 bg-white/80 backdrop-blur-xl border-t border-sage-200 z-10 pb-8 sm:pb-6">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative flex items-center gap-3">
            <button
              type="button"
              onClick={toggleListening}
              className={`shrink-0 p-5 rounded-full transition-all shadow-md flex items-center justify-center ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse shadow-red-500/40'
                  : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
              }`}
            >
              {isListening ? <MicOff size={28} /> : <Mic size={28} />}
            </button>

            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  isListening
                    ? translate('listening') || 'Listening…'
                    : translate('type_message') || 'Ask a farming question…'
                }
                className="w-full bg-sage-50 border-2 border-sage-200 focus:border-leaf-500 text-earth-800 rounded-full pl-6 pr-16 py-5 text-lg outline-none transition-colors shadow-inner"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-leaf-500 text-white rounded-full hover:bg-leaf-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
              >
                {isLoading ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
