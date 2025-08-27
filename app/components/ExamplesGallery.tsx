'use client';

import { useState } from 'react';
import { 
  Eye, 
  Sparkles,
  Camera,
  Palette,
  X,
  ZoomIn
} from 'lucide-react';

interface ExamplePair {
  id: number;
  name: string;
  prompt: string;
  image1: string;
  image2: string;
  category: string;
  description: string;
}

export default function ExamplesGallery() {
  const [selectedExample, setSelectedExample] = useState<number | null>(null);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  const examples: ExamplePair[] = [
    {
      id: 1,
      name: "דמויות עקביות",
      prompt: "יצירת בננה עם אפקטים מיוחדים ואווירה קסומה",
      image1: "/examples/banana1.png",
      image2: "/examples/banana2.png",
      category: "אובייקטים",
      description: ""
    },
    {
      id: 2,
      name: "שימוש יצירתי",
      prompt: "דולפין שוחה בסביבה עירונית עתידנית מדהימה",
      image1: "/examples/buildingdolphin1.png",
      image2: "/examples/buildingdolphin2.png",
      category: "סוריאליזם",
      description: ""
    },
    {
      id: 3,
      name: "שינוי רקע",
      prompt: "הגדרת רקע חדש תוך שמירה על הדמות הראשית",
      image1: "/examples/changeback2.jpg",
      image2: "/examples/changeback1.jpg",
      category: "עריכה",
      description: ""
    },
    {
      id: 4,
      name: "החלפת סצנה",
      prompt: "אדם בזירת קרקס - שינוי סגנון ותלבושת",
      image1: "/examples/elcaraz1.png",
      image2: "/examples/elcaraz2.png",
      category: "טרנספורמציה",
      description: ""
    }
  ];

  const handleExampleClick = (id: number) => {
    setSelectedExample(selectedExample === id ? null : id);
  };

  const openFullScreen = (imageSrc: string) => {
    setFullScreenImage(imageSrc);
  };

  const closeFullScreen = () => {
    setFullScreenImage(null);
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 p-1 rounded-2xl mb-4">
          <div className="bg-white rounded-xl px-6 py-3 flex items-center gap-3">
            <Camera className="w-6 h-6 text-purple-500 animate-bounce" />
            <h2 className="text-xl font-display font-bold gradient-text">
              דוגמאות לשימוש
            </h2>
            <Palette className="w-6 h-6 text-pink-500 animate-pulse" />
          </div>
        </div>
        <p className="text-gray-600 max-w-3xl mx-auto mb-6">
          רגעים קסומים שנוצרו עם Gemini AI 🎨 לחצו על כל דוגמה כדי לראות לפני ואחרי ✨
        </p>
      </div>

      {/* Examples Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {examples.map((example) => {
          const isSelected = selectedExample === example.id;
          
          return (
            <div key={example.id} className="space-y-4">
              {/* Example Card */}
              <div
                className={`
                  group relative bg-white/95 backdrop-blur-sm rounded-2xl p-4 
                  shadow-card border border-white/50 hover:shadow-card-hover 
                  hover:scale-105 transition-all duration-300 cursor-pointer
                  ${isSelected ? 'scale-105 shadow-card-hover ring-2 ring-purple-400' : ''}
                `}
                onClick={() => handleExampleClick(example.id)}
              >

                {/* Preview Image */}
                <div className="relative rounded-xl overflow-hidden mb-4">
                  <img
                    src={example.image1}
                    alt={`דוגמה ${example.name}`}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isSelected) {
                        // Second click - open full screen
                        console.log('Opening image 1 full screen:', example.image1);
                        setFullScreenImage(example.image1);
                      } else {
                        // First click - open second image
                        console.log('First click - opening second image');
                        handleExampleClick(example.id);
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  <div className="absolute bottom-2 left-2 right-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <ZoomIn className="w-4 h-4 inline mr-1" />
                    <span className="text-xs">לחץ לצפייה מלאה</span>
                  </div>
                  <div className="absolute top-2 left-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <Eye className="w-4 h-4 inline mr-1" />
                    <span className="text-xs">לחץ על הכרטיס לוריאציה שנייה</span>
                  </div>
                </div>

                {/* Example Info */}
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-purple-600">
                    {example.name}
                  </h3>
                </div>

                {/* Sparkles Effect */}
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <Sparkles className="w-4 h-4 text-yellow-400 animate-ping" />
                </div>
              </div>

              {/* Expanded View - Show Second Image Only */}
              {isSelected && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-200 animate-fade-in">
                  <div className="relative rounded-xl overflow-hidden group cursor-pointer">
                    <img
                      src={example.image2}
                      alt={`${example.name} - וריאציה 2`}
                      className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                      onClick={() => {
                        console.log('Opening image 2:', example.image2);
                        setFullScreenImage(example.image2);
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    <div className="absolute bottom-2 right-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <ZoomIn className="w-4 h-4 inline mr-1" />
                      <span className="text-xs">לחץ לצפייה מלאה</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Encouraging Message */}
      <div className="text-center mt-12">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-400/20 to-pink-400/20 backdrop-blur-sm px-6 py-3 rounded-2xl border border-purple-200/50">
          <span className="text-2xl animate-bounce">🎨</span>
          <span className="text-gray-600 font-medium">
            מוכנים ליצור משהו דומה? בואו ננסה יחד! ✨
          </span>
          <span className="text-2xl animate-bounce delay-300">🚀</span>
        </div>
      </div>

      {/* Full Screen Modal */}
      {fullScreenImage && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4 cursor-pointer"
          onClick={closeFullScreen}
          style={{ backdropFilter: 'blur(10px)' }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={fullScreenImage}
              alt="צפייה בגודל מלא"
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl cursor-zoom-out"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={closeFullScreen}
              className="absolute top-6 right-6 bg-white/20 backdrop-blur-sm text-white p-4 rounded-full hover:bg-white/40 transition-colors border border-white/30 shadow-xl z-10"
            >
              <X className="w-8 h-8" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}