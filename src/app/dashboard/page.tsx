"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, AlertCircle, Droplets, Leaf, Sprout, 
  Thermometer, TrendingUp, Sun, Wind, ChevronRight, UploadCloud 
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer
} from 'recharts';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [weather, setWeather] = useState<any>(null);
  const [locationName, setLocationName] = useState("California (Default)");
  const [recentScans, setRecentScans] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    
    // Load history
    const historyStr = localStorage.getItem('cropScanHistory');
    if (historyStr) {
      setRecentScans(JSON.parse(historyStr));
    } else {
      setRecentScans([
        { id: 1, crop: 'No scans yet', status: 'Healthy', time: 'Just now', color: 'text-emerald-500', bg: 'bg-emerald-50' }
      ]);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setLocationName("Your Farm");
          fetch(`/api/weather?lat=${lat}&lon=${lon}`)
            .then(res => res.json())
            .then(data => setWeather(data))
            .catch(err => console.error(err));
        },
        () => {
          fetch('/api/weather')
            .then(res => res.json())
            .then(data => setWeather(data));
        }
      );
    } else {
      fetch('/api/weather')
        .then(res => res.json())
        .then(data => setWeather(data));
    }
  }, []);

  const healthData = [
    { name: 'Mon', healthy: 80, infected: 20 },
    { name: 'Tue', healthy: 82, infected: 18 },
    { name: 'Wed', healthy: 85, infected: 15 },
    { name: 'Thu', healthy: 83, infected: 17 },
    { name: 'Fri', healthy: 89, infected: 11 },
    { name: 'Sat', healthy: 92, infected: 8 },
    { name: 'Sun', healthy: 95, infected: 5 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-cream-50 font-sans text-earth-800 flex">
      <Sidebar />

      <main className="flex-1 lg:ml-[300px] p-4 sm:p-6 lg:p-10 relative overflow-hidden">
        
        {/* Soft floating background gradients */}
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-leaf-100/60 blur-[120px] pointer-events-none animate-blob" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-sage-100/50 blur-[120px] pointer-events-none animate-blob" style={{ animationDelay: '2s' }} />

        <div className="mb-10 relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl font-extrabold tracking-tight text-earth-900">Farm Overview</h1>
            <p className="text-earth-500 font-medium mt-2 text-lg">Welcome back! Here is your crop health summary for {locationName}.</p>
          </motion.div>
          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/80 backdrop-blur-md border border-sage-200 px-6 py-2.5 rounded-full text-sm font-semibold text-earth-700 shadow-sm hover:shadow-md transition-all"
          >
            Generate Report
          </motion.button>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 relative z-10"
        >
          {/* Stat Cards */}
          <motion.div variants={itemVariants} className="glass-card p-6 group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-leaf-50 text-leaf-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Activity size={24} />
              </div>
              <span className="flex items-center text-xs font-semibold text-leaf-700 bg-leaf-100 px-3 py-1.5 rounded-full">
                <TrendingUp size={14} className="mr-1" /> +12%
              </span>
            </div>
            <p className="text-earth-500 text-sm font-medium">Total Crops Analyzed</p>
            <p className="text-4xl font-bold text-earth-900 mt-2">1,248</p>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card p-6 group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Leaf size={24} />
              </div>
              <span className="flex items-center text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-full">
                <TrendingUp size={14} className="mr-1" /> +5%
              </span>
            </div>
            <p className="text-earth-500 text-sm font-medium">Overall Crop Health</p>
            <p className="text-4xl font-bold text-earth-900 mt-2">92%</p>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card p-6 group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <AlertCircle size={24} />
              </div>
              <span className="flex items-center text-xs font-semibold text-orange-700 bg-orange-100 px-3 py-1.5 rounded-full">
                -2 Alerts
              </span>
            </div>
            <p className="text-earth-500 text-sm font-medium">Active Disease Alerts</p>
            <p className="text-4xl font-bold text-earth-900 mt-2">3</p>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-200/50 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-3 bg-sky-50 text-sky-500 rounded-2xl group-hover:rotate-12 transition-transform duration-300">
                <Sun size={24} />
              </div>
            </div>
            <p className="text-earth-500 text-sm font-medium relative z-10">Weather Condition</p>
            <div className="flex items-end gap-2 mt-2 relative z-10">
              <p className="text-4xl font-bold text-earth-900">{weather ? `${weather.temperature}°C` : '...'}</p>
              <p className="text-earth-500 font-medium pb-1">{weather ? weather.condition : 'Loading'}</p>
            </div>
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
                <h2 className="text-2xl font-bold text-earth-900">Crop Health Trends</h2>
                <select className="bg-white/80 border border-sage-200 text-earth-700 text-sm rounded-full px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-leaf-500/30 shadow-sm cursor-pointer hover:bg-white transition-colors">
                  <option>Last 7 Days</option>
                  <option>This Month</option>
                </select>
              </div>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={healthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorHealthy" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorInfected" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e3e5da" strokeOpacity={0.5} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8D6E63', fontSize: 13, fontWeight: 500 }} dy={15} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8D6E63', fontSize: 13, fontWeight: 500 }} dx={-10} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: '1px solid #e3e5da', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)' }}
                    />
                    <Area type="monotone" dataKey="healthy" stroke="#4CAF50" strokeWidth={3} fillOpacity={1} fill="url(#colorHealthy)" activeDot={{ r: 6, strokeWidth: 0, fill: '#4CAF50' }} />
                    <Area type="monotone" dataKey="infected" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorInfected)" activeDot={{ r: 6, strokeWidth: 0, fill: '#f97316' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-leaf-600 to-leaf-800 rounded-3xl p-8 shadow-xl shadow-leaf-600/20 text-white relative overflow-hidden group"
            >
              <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/10 rounded-tl-full pointer-events-none group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 rounded-full pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                    <Sprout size={24} />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">AI Farming Insights</h2>
                </div>
                <p className="text-leaf-50 max-w-2xl leading-relaxed mb-8 text-lg">
                  Based on current weather patterns and your recent scans, we recommend applying a preventative organic fungicide to your tomato crops within the next 48 hours to mitigate rising humidity risks.
                </p>
                <button className="bg-white text-leaf-800 px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:bg-cream-50 transition-all hover:-translate-y-1">
                  View Full Action Plan
                </button>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass-panel rounded-3xl p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-earth-900">Recent Scans</h2>
                <button className="text-leaf-600 hover:text-leaf-800 p-1 bg-leaf-50 rounded-full transition-colors">
                  <ChevronRight size={20} />
                </button>
              </div>
              <div className="space-y-3">
                {recentScans.map((scan, i) => (
                  <div key={scan.id || i} className="flex items-center p-3 hover:bg-white rounded-2xl transition-all cursor-pointer border border-transparent hover:border-sage-100 hover:shadow-sm group">
                    <div className={`p-3 rounded-2xl ${scan.status === 'Healthy' ? 'bg-emerald-50 text-emerald-500' : 'bg-orange-50 text-orange-500'} mr-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Leaf size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-earth-900">{scan.crop}</h4>
                      <p className="text-xs text-earth-500 font-medium mt-0.5">{scan.time}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                        scan.status === 'Healthy' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {scan.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-3.5 border-2 border-dashed border-sage-200 text-earth-600 rounded-2xl font-bold hover:bg-white hover:border-leaf-300 hover:text-leaf-600 transition-all flex items-center justify-center gap-2">
                <UploadCloud size={20} />
                Upload New Scan
              </button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="glass-panel rounded-3xl p-6"
            >
              <h2 className="text-xl font-bold text-earth-900 mb-6">Micro-Climate</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-sky-50/80 rounded-2xl border border-sky-100 hover:bg-sky-100 transition-colors">
                  <div className="flex items-center gap-3 text-sky-700">
                    <div className="p-2 bg-white rounded-xl shadow-sm"><Droplets size={18} /></div>
                    <span className="font-semibold">Soil Moisture</span>
                  </div>
                  <span className="font-bold text-sky-900 text-lg">42%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-teal-50/80 rounded-2xl border border-teal-100 hover:bg-teal-100 transition-colors">
                  <div className="flex items-center gap-3 text-teal-700">
                    <div className="p-2 bg-white rounded-xl shadow-sm"><Wind size={18} /></div>
                    <span className="font-semibold">Wind Speed</span>
                  </div>
                  <span className="font-bold text-teal-900 text-lg">12 km/h</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-orange-50/80 rounded-2xl border border-orange-100 hover:bg-orange-100 transition-colors">
                  <div className="flex items-center gap-3 text-orange-700">
                    <div className="p-2 bg-white rounded-xl shadow-sm"><Thermometer size={18} /></div>
                    <span className="font-semibold">Soil Temp</span>
                  </div>
                  <span className="font-bold text-orange-900 text-lg">18°C</span>
                </div>
              </div>
            </motion.div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
