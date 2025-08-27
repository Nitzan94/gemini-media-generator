'use client';

import { useState, useEffect } from 'react';
import { 
  Target, 
  Layers, 
  Compass, 
  FileText, 
  Camera, 
  RotateCcw, 
  Wand2, 
  Zap, 
  Star,
  Heart,
  Sparkles
} from 'lucide-react';

interface PromptElement {
  id: number;
  name: string;
  icon: any;
  description: string;
  example: string;
  color: string;
  gradient: string;
  delay: number;
}

export default function CreativeToolsShowcase() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTool, setActiveTool] = useState<number | null>(null);
  const [sparkles, setSparkles] = useState<Array<{id: number, x: number, y: number}>>([]);

  const promptElements: PromptElement[] = [
    {
      id: 1,
      name: "נושא וקונטקסט",
      icon: Target,
      description: "הגדירו את הנושא הראשי והרקע",
      example: "חתול (נושא) יושב על חלון (קונטקסט)",
      color: "blue-500",
      gradient: "from-blue-400 to-cyan-400",
      delay: 0
    },
    {
      id: 2,
      name: "סגנון וגישה",
      icon: Layers,
      description: "בחרו סגנון אמנותי או ויזואלי",
      example: "סקיצה, ציור שמן, צילום, אנימציה",
      color: "slate-700",
      gradient: "from-slate-800 to-slate-950",
      delay: 100
    },
    {
      id: 3,
      name: "הוראות ברורות",
      icon: FileText,
      description: "כתבו הוראות מפורטות וספציפיות",
      example: "צרו תמונה של... במקום רק 'תמונה'",
      color: "green-500",
      gradient: "from-green-400 to-teal-400",
      delay: 200
    },
    {
      id: 4,
      name: "שפה תיאורית",
      icon: Sparkles,
      description: "השתמשו בשמות תואר מפורטים",
      example: "אישה צעירה בשמלה אדומה רצה",
      color: "amber-700",
      gradient: "from-amber-500 to-orange-600",
      delay: 300
    },
    {
      id: 5,
      name: "זווית ומסגור",
      icon: Camera,
      description: "ציינו זווית המצלמה והרכב התמונה",
      example: "זווית רחבה, מאקרו, מבט מלמעלה",
      color: "rose-700",
      gradient: "from-rose-500 to-red-600",
      delay: 400
    },
    {
      id: 6,
      name: "שיפור איטרטיבי",
      icon: RotateCcw,
      description: "שפרו בהדרגה עד לתוצאה מושלמת",
      example: "התחילו פשוט ואז הוסיפו פרטים",
      color: "indigo-500",
      gradient: "from-indigo-400 to-purple-400",
      delay: 500
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1500);
    
    // Generate random sparkles
    const sparkleInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newSparkle = {
          id: Date.now(),
          x: Math.random() * 100,
          y: Math.random() * 100
        };
        setSparkles(prev => [...prev.slice(-4), newSparkle]);
        
        // Remove sparkle after animation
        setTimeout(() => {
          setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
        }, 2000);
      }
    }, 1000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(sparkleInterval);
    };
  }, []);

  const handleToolHover = (toolId: number) => {
    setActiveTool(toolId);
  };

  const handleToolLeave = () => {
    setActiveTool(null);
  };

  return (
    <div className={`relative transition-all duration-1000 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    }`}>
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 p-1 rounded-2xl mb-4">
          <div className="bg-white rounded-xl px-6 py-3 flex items-center gap-3">
            <Compass className="w-6 h-6 text-blue-500 animate-bounce" />
            <h2 className="text-xl font-display font-bold gradient-text">
              6 יסודות לפרומפט מושלם
            </h2>
            <Zap className="w-6 h-6 text-yellow-500 animate-pulse" />
          </div>
        </div>
        <p className="text-gray-600 max-w-3xl mx-auto mb-6">
          המדריך של גוגל ליצירת פרומפטים יעילים עם Gemini AI 🎯 רחפו על כל יסוד כדי ללמוד איך להשתמש בו ✨
        </p>
      </div>

      {/* Elements Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {promptElements.map((element) => {
          const IconComponent = element.icon;
          const isActive = activeTool === element.id;
          
          return (
            <div
              key={element.id}
              className={`
                group relative bg-white/95 backdrop-blur-sm rounded-2xl p-4 
                shadow-card border border-white/50 hover:shadow-card-hover 
                hover:scale-105 transition-all duration-300 cursor-pointer
                ${isActive ? 'scale-105 shadow-card-hover' : ''}
              `}
              onMouseEnter={() => handleToolHover(element.id)}
              onMouseLeave={handleToolLeave}
              style={{ animationDelay: `${element.delay}ms` }}
            >
              {/* Element Icon */}
              <div className={`
                w-16 h-16 rounded-full bg-gradient-to-r ${element.gradient} 
                flex items-center justify-center mb-4 mx-auto
                group-hover:rotate-12 group-hover:scale-110 transition-all duration-300
                ${isActive ? 'rotate-12 scale-110' : ''}
              `}>
                <IconComponent className="w-8 h-8 text-white" />
              </div>

              {/* Element Name */}
              <h3 className="text-lg font-bold text-gray-800 text-center group-hover:text-gray-900">
                {element.name}
              </h3>

              {/* Hover Glow Effect */}
              <div className={`
                absolute inset-0 rounded-2xl bg-gradient-to-r ${element.gradient} 
                opacity-0 group-hover:opacity-10 transition-all duration-300 pointer-events-none
              `} />

              {/* Active Pulse */}
              {isActive && (
                <div className={`
                  absolute inset-0 rounded-2xl bg-gradient-to-r ${element.gradient} 
                  opacity-20 animate-pulse pointer-events-none
                `} />
              )}

              {/* Sparkles */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <Star className={`w-4 h-4 text-${element.color} animate-ping`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Element Showcase */}
      {activeTool && (
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50 animate-fade-in">
          <div className="flex items-start gap-4">
            <div className={`
              w-12 h-12 rounded-full bg-gradient-to-r 
              ${promptElements.find(t => t.id === activeTool)?.gradient} 
              flex items-center justify-center animate-bounce flex-shrink-0
            `}>
              {(() => {
                const element = promptElements.find(t => t.id === activeTool);
                if (!element) return null;
                const IconComponent = element.icon;
                return <IconComponent className="w-6 h-6 text-white" />;
              })()}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {promptElements.find(t => t.id === activeTool)?.name}
              </h3>
              <p className="text-gray-600 mb-3">
                {promptElements.find(t => t.id === activeTool)?.description}
              </p>
              <div className="bg-white/80 rounded-lg p-3 border border-gray-200">
                <p className="text-xs text-gray-500 mb-1 font-medium">דוגמה מפורטת:</p>
                <p className="text-sm text-gray-700 italic">
                  "{promptElements.find(t => t.id === activeTool)?.example}"
                </p>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Target className="w-5 h-5 text-blue-400 animate-pulse" />
              <Sparkles className="w-5 h-5 text-yellow-400 animate-spin" />
            </div>
          </div>
        </div>
      )}

      {/* Floating Sparkles */}
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute pointer-events-none animate-ping"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            animationDuration: '2s',
          }}
        >
          <Star className="w-3 h-3 text-yellow-400 fill-current" />
        </div>
      ))}

      {/* Encouraging Message */}
      <div className="text-center mt-8">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 backdrop-blur-sm px-6 py-3 rounded-2xl border border-emerald-200/50">
          <span className="text-2xl animate-bounce">🎯</span>
          <span className="text-gray-600 font-medium">
            עכשיו אתם מוכנים לכתוב פרומפטים מושלמים! בואו ניצור יחד ✨
          </span>
          <span className="text-2xl animate-bounce delay-300">🚀</span>
        </div>
      </div>
    </div>
  );
}