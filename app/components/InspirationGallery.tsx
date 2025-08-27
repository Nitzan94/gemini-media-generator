'use client';

import { useState, useEffect } from 'react';
import { Lightbulb, Copy, Wand2, Star, Zap } from 'lucide-react';
import { playCopySound } from '../utils/sounds';

interface PromptExample {
  id: number;
  text: string;
  category: string;
  emoji: string;
  gradient: string;
}

export default function InspirationGallery() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const promptExamples: PromptExample[] = [
    {
      id: 1,
      text: "A magical floating castle in the clouds with rainbow bridges and golden light streaming through crystal windows",
      category: "fantasy",
      emoji: "🏰",
      gradient: "from-purple-400 to-pink-400"
    },
    {
      id: 2,
      text: "A cozy coffee shop inside a giant mushroom, with fairy lights and books scattered around steaming cups",
      category: "cozy",
      emoji: "🍄",
      gradient: "from-green-400 to-blue-400"
    },
    {
      id: 3,
      text: "Cyberpunk city at night with neon reflections on wet streets and flying cars leaving light trails",
      category: "futuristic",
      emoji: "🌃",
      gradient: "from-cyan-400 to-purple-400"
    },
    {
      id: 4,
      text: "Underwater garden with glowing jellyfish, coral trees, and mermaids tending to rainbow seaweed",
      category: "fantasy",
      emoji: "🧜‍♀️",
      gradient: "from-blue-400 to-teal-400"
    },
    {
      id: 5,
      text: "A vintage library with floating books, golden hour sunlight, and a cat sleeping on ancient scrolls",
      category: "cozy",
      emoji: "📚",
      gradient: "from-amber-400 to-orange-400"
    },
    {
      id: 6,
      text: "Robot artist painting a sunset on Mars with Earth visible in the purple sky",
      category: "futuristic",
      emoji: "🤖",
      gradient: "from-red-400 to-pink-400"
    }
  ];

  const categories = [
    { id: 'all', name: 'הכל', emoji: '✨' },
    { id: 'fantasy', name: 'פנטזיה', emoji: '🦄' },
    { id: 'cozy', name: 'נעים', emoji: '🏠' },
    { id: 'futuristic', name: 'עתידני', emoji: '🚀' }
  ];

  const filteredExamples = selectedCategory === 'all' 
    ? promptExamples 
    : promptExamples.filter(example => example.category === selectedCategory);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleCopyPrompt = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      playCopySound();
      // Show success feedback
    } catch (error) {
      console.log('Copy failed');
    }
  };

  return (
    <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      {/* Gallery Header */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 p-1 rounded-2xl mb-4">
          <div className="bg-white rounded-xl px-6 py-3 flex items-center gap-3">
            <Lightbulb className="w-6 h-6 text-yellow-500 animate-pulse" />
            <h2 className="text-xl font-display font-bold gradient-text">
              רעיונות לדוגמה
            </h2>
            <Star className="w-6 h-6 text-purple-500 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          רעיונות מדהימים שיעזרו לך להתחיל ✨ לחץ על כל רעיון להעתיק ולהתחיל ליצור!
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center mb-6 animate-fade-in animate-stagger-1">
        <div className="flex gap-2 p-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/50">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`
                px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 font-medium text-sm
                ${selectedCategory === category.id 
                  ? 'bg-primary-500 text-white shadow-lg scale-105' 
                  : 'text-gray-600 hover:bg-primary-50 hover:text-primary-600'
                }
              `}
            >
              <span className="text-lg">{category.emoji}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Examples Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in animate-stagger-2">
        {filteredExamples.map((example, index) => (
          <div
            key={example.id}
            className="group relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-card border border-white/50 hover:shadow-card-hover hover:scale-[1.02] transition-all duration-300 cursor-pointer"
            onClick={() => handleCopyPrompt(example.text)}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Category badge */}
            <div className={`absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-r ${example.gradient} rounded-full flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition-transform`}>
              {example.emoji}
            </div>

            {/* Prompt text */}
            <div className="pr-6">
              <p className="text-gray-700 leading-relaxed mb-4 group-hover:text-gray-800 transition-colors">
                {example.text}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Copy className="w-4 h-4" />
                <span>לחץ להעתקה</span>
              </div>
              <div className="flex-1" />
              <Wand2 className="w-5 h-5 text-primary-400 animate-pulse" />
            </div>

            {/* Hover glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-400/0 via-secondary-400/0 to-accent-400/0 group-hover:from-primary-400/10 group-hover:via-secondary-400/10 group-hover:to-accent-400/10 transition-all duration-300 pointer-events-none" />
            
            {/* Magic sparkles on hover */}
            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Floating encouragement */}
      <div className="text-center mt-8 animate-fade-in animate-stagger-3">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-400/20 to-blue-400/20 backdrop-blur-sm px-6 py-3 rounded-2xl border border-green-200/50">
          <span className="text-2xl animate-bounce">🎨</span>
          <span className="text-gray-600 font-medium">
            השראה זה רק ההתחלה - תן לדמיון שלך לעוף!
          </span>
          <span className="text-2xl animate-bounce delay-300">✨</span>
        </div>
      </div>
    </div>
  );
}