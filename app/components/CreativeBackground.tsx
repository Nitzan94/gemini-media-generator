'use client';

import { useEffect, useState } from 'react';

export default function CreativeBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Mouse move tracking (lightweight)
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Artistic gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 via-pink-50/30 via-orange-50/20 to-green-50/30" />
      
      {/* Paint splashes */}
      <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-gradient-to-br from-blue-200/20 to-purple-300/20 blur-xl animate-pulse" />
      <div className="absolute top-32 right-20 w-16 h-16 rounded-full bg-gradient-to-br from-orange-200/20 to-pink-300/20 blur-xl animate-pulse delay-300" />
      <div className="absolute bottom-20 left-20 w-24 h-24 rounded-full bg-gradient-to-br from-green-200/20 to-blue-300/20 blur-xl animate-pulse delay-700" />
      
      {/* Floating creative elements removed for performance */}

      {/* Mouse trail effect */}
      <div
        className="absolute w-6 h-6 rounded-full pointer-events-none transition-all duration-300"
        style={{
          left: `${mousePosition.x - 12}px`,
          top: `${mousePosition.y - 12}px`,
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
          transform: 'scale(1)',
        }}
      />

      {/* Brush stroke decorations */}
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="brushGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2"/>
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1"/>
          </linearGradient>
          <linearGradient id="brushGradient2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.2"/>
            <stop offset="100%" stopColor="#fb923c" stopOpacity="0.1"/>
          </linearGradient>
        </defs>
        
        {/* Artistic brush strokes */}
        <path
          d="M50,100 Q150,50 250,80 T450,100"
          stroke="url(#brushGradient1)"
          strokeWidth="8"
          fill="none"
          className="animate-pulse"
          strokeLinecap="round"
        />
        <path
          d="M100,300 Q200,250 300,280 T500,300"
          stroke="url(#brushGradient2)"
          strokeWidth="6"
          fill="none"
          className="animate-pulse delay-1000"
          strokeLinecap="round"
        />
      </svg>

      {/* Watercolor texture overlay */}
      <div 
        className="absolute inset-0 opacity-5 mix-blend-overlay"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, #3b82f6 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, #10b981 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, #fb923c 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 50%),
            radial-gradient(circle at 60% 40%, #fef08a 0%, transparent 50%)
          `,
        }}
      />
    </div>
  );
}