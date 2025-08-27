'use client';

import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { setSoundsEnabled } from '../utils/sounds';

export default function SoundControl() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Load sound preference from localStorage
    const savedSetting = localStorage.getItem('creativeSoundsEnabled');
    if (savedSetting !== null) {
      const enabled = savedSetting === 'true';
      setSoundEnabled(enabled);
      setSoundsEnabled(enabled);
    }
    
    // Show control after delay
    const timer = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const toggleSound = () => {
    const newSetting = !soundEnabled;
    setSoundEnabled(newSetting);
    setSoundsEnabled(newSetting);
    localStorage.setItem('creativeSoundsEnabled', newSetting.toString());
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-1000 ${
      isVisible ? 'opacity-80 translate-y-0' : 'opacity-0 translate-y-full'
    }`}>
      <button
        onClick={toggleSound}
        className={`
          w-14 h-14 rounded-full backdrop-blur-sm border-2 border-white/50
          flex items-center justify-center transition-all duration-300 hover:scale-110
          ${soundEnabled 
            ? 'bg-gradient-to-r from-green-400/90 to-blue-400/90 text-white shadow-lg' 
            : 'bg-gray-400/90 text-white shadow-md'
          }
        `}
        title={soundEnabled ? 'כבה אפקטי קול' : 'הפעל אפקטי קול'}
      >
        {soundEnabled ? (
          <Volume2 className="w-6 h-6" />
        ) : (
          <VolumeX className="w-6 h-6" />
        )}
      </button>
      
      {/* Tooltip */}
      <div className={`
        absolute -left-32 top-1/2 transform -translate-y-1/2 
        opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none
        bg-gray-900/90 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap
      `}>
        {soundEnabled ? 'כבה אפקטי קול' : 'הפעל אפקטי קול'}
      </div>
      
      {/* Sound waves animation when enabled */}
      {soundEnabled && (
        <div className="absolute inset-0 rounded-full pointer-events-none">
          <div className="absolute inset-0 rounded-full bg-green-400/20 animate-ping" />
          <div className="absolute inset-2 rounded-full bg-blue-400/20 animate-ping delay-300" />
        </div>
      )}
    </div>
  );
}