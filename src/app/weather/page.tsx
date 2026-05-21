"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  CloudRain, Wind, Sun, Thermometer, Droplets,
  MapPin, AlertTriangle, CheckCircle2, ShieldAlert, RefreshCw, WifiOff,
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';

type WeatherData = {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  advisory: string;
  forecast: { time: string; temp: number; rain: number }[];
};

export default function WeatherPage() {
  const [mounted, setMounted] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherError, setWeatherError] = useState(false);
  const [locationName, setLocationName] = useState('India (Default)');

  const fetchWeatherData = useCallback((lat?: number, lon?: number) => {
    setWeatherError(false);
    const url = lat && lon ? `/api/weather?lat=${lat}&lon=${lon}` : '/api/weather';

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: WeatherData) => {
        if (!data || typeof data.temperature === 'undefined') {
          throw new Error('Malformed response');
        }
        setWeather(data);
      })
      .catch((err) => {
        console.error('[weather page] Failed to load weather:', err?.message ?? err);
        setWeatherError(true);
      });
  }, []);

  useEffect(() => {
    setMounted(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationName('Your Local Farm');
          fetchWeatherData(position.coords.latitude, position.coords.longitude);
        },
        () => fetchWeatherData()
      );
    } else {
      fetchWeatherData();
    }
  }, [fetchWeatherData]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  if (!mounted) return null;

  // Full-page error state
  if (weatherError && !weather) {
    return (
      <div className="min-h-screen bg-cream-50 font-sans text-earth-800 flex">
        <Sidebar />
        <main className="flex-1 lg:ml-[300px] flex items-center justify-center p-10">
          <div className="text-center max-w-sm">
            <div className="bg-orange-100 p-5 rounded-full inline-flex mb-6">
              <WifiOff size={40} className="text-orange-500" />
            </div>
            <h2 className="text-2xl font-extrabold text-earth-900 mb-3">
              Weather Unavailable
            </h2>
            <p className="text-earth-500 mb-6">
              Could not load weather data. Please check your connection and try again.
            </p>
            <button
              onClick={() => fetchWeatherData()}
              className="inline-flex items-center gap-2 bg-leaf-500 text-white px-7 py-3 rounded-full font-bold shadow-md hover:bg-leaf-600 transition-colors"
            >
              <RefreshCw size={18} />
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Loading skeleton — show shimmer tiles until data arrives
  if (!weather) {
    return (
      <div className="min-h-screen bg-cream-50 font-sans text-earth-800 flex">
        <Sidebar />
        <main className="flex-1 lg:ml-[300px] p-4 sm:p-6 lg:p-10">
          <div className="mb-10 h-12 w-64 bg-sage-200/60 rounded-2xl animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass-card p-6 h-40 animate-pulse bg-sage-100/50 rounded-3xl" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 font-sans text-earth-800 flex">
      <Sidebar />

      <main className="flex-1 lg:ml-[300px] p-4 sm:p-6 lg:p-10 relative overflow-hidden">

        {/* Soft floating background gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-sky-200/40 blur-[120px] pointer-events-none animate-blob" />
        <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-100/40 blur-[120px] pointer-events-none animate-blob" style={{ animationDelay: '2s' }} />

        <div className="mb-10 relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-earth-900">
              Micro-Climate Insights
            </h1>
            <p className="text-earth-500 font-medium mt-2 flex items-center gap-2">
              <MapPin size={16} /> {locationName}
            </p>
          </div>
          <button
            onClick={() => fetchWeatherData()}
            className="bg-white/80 backdrop-blur-md border border-sage-200 px-6 py-2.5 rounded-full text-sm font-semibold text-earth-700 shadow-sm hover:shadow-md transition-all flex items-center gap-2"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        {/* Stale-data notice when a refresh attempt failed but we still have data */}
        {weatherError && (
          <div className="mb-6 relative z-10 bg-amber-50 border border-amber-200 text-amber-700 px-5 py-3 rounded-2xl flex items-center gap-3">
            <AlertTriangle size={18} className="shrink-0" />
            <span className="text-sm font-medium">
              Weather refresh failed — showing last known data.
            </span>
            <button
              onClick={() => fetchWeatherData()}
              className="ml-auto text-xs font-bold underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 relative z-10"
        >
          {/* Main Weather Card */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 bg-gradient-to-br from-sky-400 to-sky-600 rounded-3xl p-8 shadow-lg shadow-sky-500/20 text-white relative overflow-hidden group"
          >
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div>
                <p className="text-sky-100 font-medium mb-1">Current Weather</p>
                <h2 className="text-5xl font-bold">{weather.temperature}°C</h2>
                <p className="text-sky-100 text-lg mt-2">{weather.condition}</p>
              </div>
              <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl group-hover:rotate-12 transition-transform duration-300">
                <Sun size={48} className="text-yellow-300" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 border-t border-white/20 pt-6 relative z-10">
              <div>
                <p className="text-sky-100 text-sm mb-1">Humidity</p>
                <p className="font-bold text-xl">{weather.humidity}%</p>
              </div>
              <div>
                <p className="text-sky-100 text-sm mb-1">Wind</p>
                <p className="font-bold text-xl">{weather.windSpeed} km/h</p>
              </div>
              <div>
                <p className="text-sky-100 text-sm mb-1">UV Index</p>
                <p className="font-bold text-xl">6 (High)</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="glass-card p-6 flex flex-col justify-center items-center text-center group border-t-4 border-t-teal-400"
          >
            <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Droplets size={32} />
            </div>
            <h3 className="font-bold text-earth-900 text-lg mb-1">Irrigation</h3>
            <p className="text-earth-500 text-sm mb-4">{weather.advisory}</p>
            <span className="bg-teal-100 text-teal-800 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
              <CheckCircle2 size={14} /> See Advisory
            </span>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="glass-card p-6 flex flex-col justify-center items-center text-center group border-t-4 border-t-orange-400"
          >
            <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <ShieldAlert size={32} />
            </div>
            <h3 className="font-bold text-earth-900 text-lg mb-1">Disease Risk</h3>
            <p className="text-earth-500 text-sm mb-4">
              {weather.condition === 'Rainy' ? 'High humidity incoming.' : 'Risk is low currently.'}
            </p>
            <span className="bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
              <AlertTriangle size={14} />
              {weather.condition === 'Rainy' ? 'Fungal Risk Elevated' : 'No Immediate Risk'}
            </span>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">

          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-panel rounded-3xl p-6 sm:p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-earth-900">5-Day Forecast</h2>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={weather.forecast}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e3e5da" strokeOpacity={0.5} />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#8D6E63', fontSize: 13, fontWeight: 500 }} dy={15} />
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#8D6E63', fontSize: 13, fontWeight: 500 }} dx={-10} />
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#0ea5e9', fontSize: 13 }} dx={10} />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid #e3e5da', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }} />
                    <Area yAxisId="left" type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" />
                    <Area yAxisId="right" type="monotone" dataKey="rain" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorRain)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-panel rounded-3xl p-6"
            >
              <h2 className="text-xl font-bold text-earth-900 mb-6">Farming Advisory</h2>

              <div className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex gap-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-emerald-500 shrink-0 mt-0.5">
                    <Thermometer size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-earth-900 mb-1">Ideal for Spraying</h4>
                    <p className="text-sm text-earth-600">
                      Wind speeds are low ({weather.windSpeed} km/h). Safe to apply foliar fertilizers before 2 PM.
                    </p>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex gap-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-orange-500 shrink-0 mt-0.5">
                    <CloudRain size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-earth-900 mb-1">Expected Rainfall</h4>
                    <p className="text-sm text-earth-600">
                      {weather.condition === 'Rainy'
                        ? 'Rain expected. Delay harvesting activities until conditions improve.'
                        : 'Low rain probability. Good conditions for field operations.'}
                    </p>
                  </div>
                </div>

                <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 flex gap-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-sky-500 shrink-0 mt-0.5">
                    <Sun size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-earth-900 mb-1">Temperature Advisory</h4>
                    <p className="text-sm text-earth-600">
                      {weather.temperature > 35
                        ? `High heat (${weather.temperature}°C). Ensure adequate crop hydration.`
                        : `Temperature at ${weather.temperature}°C is within normal range.`}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </main>
    </div>
  );
}
