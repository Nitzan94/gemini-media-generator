'use client';

import { useState, useEffect } from 'react';
import { Palette, Sparkles, Heart } from 'lucide-react';

export default function ArtistPalette() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);

  const colors = [
    { name: 'Creative Blue', color: '#3b82f6', hex: '#3b82f6' },
    { name: 'Artistic Green', color: '#10b981', hex: '#10b981' },
    { name: 'Warm Orange', color: '#fb923c', hex: '#fb923c' },
    { name: 'Magic Purple', color: '#8b5cf6', hex: '#8b5cf6' },
    { name: 'Sunshine Yellow', color: '#fef08a', hex: '#fef08a' },
    { name: 'Gentle Pink', color: '#fbcfe8', hex: '#fbcfe8' },
  ];

  const creativeTips = [
    "💡 Try describing colors in your prompts!",
    "🌈 Mix different art styles together",
    "✨ Add emotions to make it magical",
    "🎨 Think about lighting and mood",
    "🔮 Let your imagination run wild!",
    "🎪 Combine unexpected elements"
  ];

  useEffect(() => {
    // Show palette after a short delay
    const timer = setTimeout(() => setIsVisible(true), 2000);
    
    // Cycle through creative tips
    const tipInterval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % creativeTips.length);
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearInterval(tipInterval);
    };
  }, [creativeTips.length]);

  return (
    <>
      {/* Floating Artist Palette */}
      <div 
        className={`fixed top-20 right-6 z-30 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
        }`}
      >
        <div className="relative group">
          {/* Palette background */}
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-xl border-2 border-gray-100 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            {/* Palette icon in center */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <Palette className="w-8 h-8 text-gray-600 animate-bounce" />
              
              {/* Color dots around palette */}
              {colors.map((color, index) => {
                const angle = (index * 60) - 90; // Start from top
                const radius = 28;
                const x = Math.cos(angle * Math.PI / 180) * radius;
                const y = Math.sin(angle * Math.PI / 180) * radius;
                
                return (
                  <div
                    key={color.name}
                    className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md hover:scale-125 transition-all duration-300 cursor-pointer"
                    style={{
                      backgroundColor: color.color,
                      transform: `translate(${x}px, ${y}px)`,
                    }}
                    title={color.name}
                  />
                );
              })}
            </div>
          </div>

          {/* Palette tooltip */}
          <div className="absolute -left-48 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
            <div className="bg-gray-900/90 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap">
              🎨 Artist&apos;s Palette
              <div className="text-xs text-gray-300 mt-1">Colors for inspiration!</div>
            </div>
          </div>
        </div>
      </div>

      {/* Creative Tips Bubble */}
      <div 
        className={`fixed bottom-20 left-6 z-30 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'
        }`}
      >
        <div className="relative">
          {/* Tip bubble */}
          <div className="bg-gradient-to-r from-purple-500/90 to-pink-500/90 backdrop-blur-sm text-white px-6 py-4 rounded-2xl shadow-xl max-w-xs">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Sparkles className="w-6 h-6 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
              </div>
              <div className="font-medium text-sm">
                {creativeTips[currentTip]}
              </div>
            </div>
            
            {/* Speech bubble tail */}
            <div className="absolute -bottom-2 left-6 w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rotate-45" />
          </div>
        </div>
      </div>

      {/* Floating brush strokes */}
      <div className={`fixed top-1/3 left-10 z-20 transition-all duration-2000 ${
        isVisible ? 'opacity-60 translate-x-0' : 'opacity-0 -translate-x-full'
      }`}>
        <div className="relative animate-pulse">
          {/* Large brush stroke */}
          <div className="w-24 h-2 bg-gradient-to-r from-blue-400/30 to-transparent rounded-full transform rotate-12" />
          <div className="w-16 h-2 bg-gradient-to-r from-green-400/30 to-transparent rounded-full transform -rotate-6 mt-2" />
          <div className="w-20 h-2 bg-gradient-to-r from-orange-400/30 to-transparent rounded-full transform rotate-3 mt-2" />
        </div>
      </div>

      {/* Heart love reaction */}
      <div className={`fixed top-1/2 right-20 z-20 transition-all duration-3000 ${
        isVisible ? 'opacity-80 translate-y-0' : 'opacity-0 translate-y-full'
      }`}>
        <div className="relative">
          <Heart className="w-8 h-8 text-red-400/60 animate-bounce fill-current" />
          <div className="absolute -top-2 -right-2 text-xl animate-ping">✨</div>
        </div>
      </div>
    </>
  );
}