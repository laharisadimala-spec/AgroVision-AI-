import React from 'react';
import { Sprout, Twitter, Instagram, Linkedin, Github } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-sage-100 pt-16 pb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-leaf-50 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="bg-leaf-100 p-2 rounded-full text-leaf-600">
                <Sprout size={28} />
              </div>
              <span className="font-bold text-2xl text-earth-800 tracking-tight">AgroVision AI</span>
            </Link>
            <p className="text-earth-500 mb-6 leading-relaxed">
              Healthy Crops. Smarter Farming. Empowering farmers with AI-driven insights for sustainable agriculture.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-earth-400 hover:text-leaf-600 transition-colors p-2 bg-cream-50 rounded-full hover:bg-leaf-50">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-earth-400 hover:text-leaf-600 transition-colors p-2 bg-cream-50 rounded-full hover:bg-leaf-50">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-earth-400 hover:text-leaf-600 transition-colors p-2 bg-cream-50 rounded-full hover:bg-leaf-50">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-earth-400 hover:text-leaf-600 transition-colors p-2 bg-cream-50 rounded-full hover:bg-leaf-50">
                <Github size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-earth-800 mb-6 text-lg">Product</h4>
            <ul className="space-y-4">
              <li><Link href="/upload" className="text-earth-500 hover:text-leaf-600 transition-colors">Crop Analysis</Link></li>
              <li><Link href="/weather" className="text-earth-500 hover:text-leaf-600 transition-colors">Weather Insights</Link></li>
              <li><Link href="/chat" className="text-earth-500 hover:text-leaf-600 transition-colors">AI Assistant</Link></li>
              <li><Link href="/dashboard" className="text-earth-500 hover:text-leaf-600 transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-earth-800 mb-6 text-lg">Resources</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-earth-500 hover:text-leaf-600 transition-colors">Farming Guide</a></li>
              <li><a href="#" className="text-earth-500 hover:text-leaf-600 transition-colors">API Documentation</a></li>
              <li><a href="#" className="text-earth-500 hover:text-leaf-600 transition-colors">Community Forum</a></li>
              <li><a href="#" className="text-earth-500 hover:text-leaf-600 transition-colors">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-earth-800 mb-6 text-lg">Company</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-earth-500 hover:text-leaf-600 transition-colors">About Us</a></li>
              <li><a href="#" className="text-earth-500 hover:text-leaf-600 transition-colors">Careers</a></li>
              <li><a href="#" className="text-earth-500 hover:text-leaf-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-earth-500 hover:text-leaf-600 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          
        </div>
        
        <div className="border-t border-sage-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-earth-400 text-sm">
            &copy; {new Date().getFullYear()} AgroVision AI. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-earth-500 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-leaf-500 animate-pulse"></span>
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
