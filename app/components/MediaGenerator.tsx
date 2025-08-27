'use client';

import { useState, useRef, useCallback } from 'react';
import { 
  Upload, 
  Sparkles, 
  Download, 
  Share2, 
  Copy, 
  Check,
  AlertCircle,
  Wand2,
  X,
  Loader2
} from 'lucide-react';
import { triggerSuccessConfetti, triggerGentleConfetti, triggerMagicSparkles } from '../utils/confetti';
import { 
  playUploadSound, 
  playGenerateStartSound, 
  playSuccessSound, 
  playCopySound, 
  playClickSound, 
  playErrorSound 
} from '../utils/sounds';
import CreativeBackground from './CreativeBackground';
import InspirationGallery from './InspirationGallery';
import CreativeToolsShowcase from './CreativeToolsShowcase';
import ExamplesGallery from './ExamplesGallery';
import SoundControl from './SoundControl';

interface GenerationResult {
  success: boolean;
  text?: string;
  enhancedPrompt?: string;
  originalPrompt?: string;
  message?: string;
  error?: string;
  code?: string;
  timestamp?: string;
  image?: {
    data: string;
    mimeType: string;
  };
}

export default function MediaGenerator() {
  // State management
  const [prompt, setPrompt] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [uploadedImages, setUploadedImages] = useState<Array<{data: string; name: string}>>([]);
  const [, setUploadedFileName] = useState<string>(''); // Keep for backwards compatibility
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareData, setShareData] = useState<{image?: {data: string; mimeType: string}, text?: string} | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Load API key from localStorage on component mount
  useState(() => {
    if (typeof window !== 'undefined') {
      const savedApiKey = localStorage.getItem('gemini_api_key');
      if (savedApiKey) {
        setApiKey(savedApiKey);
      }
    }
  });

  // Save API key to localStorage
  const saveApiKey = useCallback((key: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gemini_api_key', key);
    }
  }, []);

  // Handle file upload (now supports multiple files)
  const handleFileUpload = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedImages(prev => [...prev, { data: result, name: file.name }]);
      setUploadedFileName(file.name); // Keep for backwards compatibility
      triggerGentleConfetti();
      playUploadSound();
    };
    reader.readAsDataURL(file);
  }, []);

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  // Handle file input change (now supports multiple files)
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        handleFileUpload(file);
      });
    }
  }, [handleFileUpload]);

  // Remove uploaded image
  const removeUploadedImage = useCallback((index?: number) => {
    if (index !== undefined) {
      // Remove specific image
      setUploadedImages(prev => prev.filter((_, i) => i !== index));
    } else {
      // Remove all images
      setUploadedImages([]);
      setUploadedFileName('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, []);

  // Generate content
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }

    if (!apiKey.trim()) {
      alert('Please enter your Gemini API key');
      return;
    }

    setIsGenerating(true);
    setResult(null);
    
    // Trigger magic sparkles and sound when starting
    triggerMagicSparkles();
    playGenerateStartSound();
    
    // Save API key
    saveApiKey(apiKey);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          imageData: uploadedImages.length > 0 ? uploadedImages[0].data : null,
          apiKey: apiKey.trim(),
        }),
      });

      const data: GenerationResult = await response.json();
      setResult(data);

      // Trigger success celebration if generation was successful
      if (data.success) {
        setTimeout(() => {
          triggerSuccessConfetti();
          playSuccessSound();
        }, 500);
      }

      // Auto-scroll to results
      setTimeout(() => {
        const resultsElement = document.getElementById('results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);

    } catch {
      console.error('Generation error');
      setResult({
        success: false,
        error: 'Failed to connect to the server. Please try again.',
        code: 'NETWORK_ERROR'
      });
      playErrorSound();
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      triggerGentleConfetti(); // Celebrate copying!
      playCopySound();
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      triggerGentleConfetti(); // Celebrate copying!
      playCopySound();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Open share dialog
  const openShareDialog = (imageData?: { data: string; mimeType: string }, text?: string) => {
    setShareData({ image: imageData, text });
    setShowShareDialog(true);
    playClickSound();
  };

  // Close share dialog
  const closeShareDialog = () => {
    setShowShareDialog(false);
    setShareData(null);
    playClickSound();
  };

  // Actually perform the share
  const performShare = async () => {
    if (!shareData || !shareData.image) return;
    
    const { image, text } = shareData;
    
    try {
      // Convert base64 to blob for sharing
      const base64Response = await fetch(`data:${image.mimeType};base64,${image.data}`);
      const blob = await base64Response.blob();
      
      // Create a file from the blob with a better name
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const fileName = `AI-Artwork-${timestamp}.${image.mimeType.split('/')[1] || 'png'}`;
      const file = new File([blob], fileName, { 
        type: image.mimeType 
      });

      console.log('🔍 Share Debug:', { 
        fileSize: blob.size, 
        fileName, 
        mimeType: image.mimeType,
        hasImage: !!image,
        textBeingShared: text,
        canShareFiles: navigator.canShare ? navigator.canShare({ files: [file] }) : false,
        webShareSupported: !!navigator.share
      });

      // Try to share the image file - prioritize file sharing for WhatsApp
      if (navigator.share) {
        // Check if the browser supports sharing files (works best with WhatsApp mobile)
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          console.log('✅ Sharing with files (should work with WhatsApp)');
          // Share ONLY the file with NO TEXT to ensure image is the main content
          await navigator.share({
            files: [file]
            // Removed title and text to force image-only sharing
          });
        } else {
          console.log('File sharing not supported, trying alternative method');
          // If file sharing not supported, download + share text
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
          
          // Share download message only
          await navigator.share({
            title: '🎨 יצירה מ-AI',
            text: `התמונה הורדה למכשיר! תוכלו למצוא אותה בתיקיית ההורדות ולשתף מכל אפליקציה 📁`
          });
        }
      } else {
        // For browsers without Web Share API, download the image
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        
        // Also copy text to clipboard as additional info
        if (text) {
          await navigator.clipboard.writeText(`יצירה שנוצרה עם: "${text}"`);
        }
      }
      
      // Close dialog after successful share
      closeShareDialog();
      playSuccessSound();
      
    } catch {
      console.log('Share cancelled or failed');
      
      // If all sharing methods fail, at least download the image
      try {
        const base64Response = await fetch(`data:${image.mimeType};base64,${image.data}`);
        const blob = await base64Response.blob();
        const fileName = `ai-artwork-${Date.now()}.${image.mimeType.split('/')[1] || 'png'}`;
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        
        // Show message that image was downloaded
        alert('התמונה הורדה למכשיר שלכם! 📁');
      } catch (downloadError) {
        console.error('Failed to download image:', downloadError);
        playErrorSound();
      }
      
      closeShareDialog();
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto space-y-8 px-4">
      {/* Creative Background */}
      <CreativeBackground />
      
      <div className="relative z-10 space-y-8">
      {/* Header */}
      <div className="text-center animate-fade-in">
        <div className="bg-gradient-to-r from-blue-50 via-white to-purple-50 rounded-3xl shadow-2xl p-12 mb-8 border border-blue-100">
          <div className="flex justify-center items-center">
            <img 
              src="/logo.png" 
              alt="נאנו-בננה - סטודיו יצירה AI"
              className="w-full max-w-md md:max-w-lg lg:max-w-xl h-auto object-contain drop-shadow-2xl hover:scale-105 transition-all duration-300 hover:drop-shadow-2xl"
            />
          </div>
          <div className="mt-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              נאנו-בננה AI Studio
            </h1>
            <p className="text-gray-600 text-base md:text-lg lg:text-xl mt-3">
              סטודיו יצירה מתקדם עם בינה מלאכותית
            </p>
          </div>
        </div>
      </div>

      {/* Main Generation Card */}
      <div className="card card-hover animate-fade-in animate-stagger-2 border-2 border-primary-100 shadow-xl">
        <div className="space-y-6">
          {/* API Key Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2 text-right" dir="rtl">
                Gemini API Key
                <span className="text-yellow-500 animate-pulse">✨</span>
              </label>
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="text-sm text-primary-500 hover:text-primary-600 transition-colors"
              >
                {showApiKey ? 'Hide' : 'Show'} Key
              </button>
            </div>
            <input
              type={showApiKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="🪄 הכניסו את מפתח הקסם שלכם כאן..."
              className="input"
            />
            <p className="text-xs text-gray-500">
              Get your free API key from{' '}
              <a 
                href="https://makersuite.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-500 hover:underline"
              >
                Google AI Studio
              </a>
              . Your key is stored locally and never sent to our servers. 
              <span className="font-medium text-primary-600">
                {' '}✨ Gemini 2.5 Flash Image model supported!
              </span>
            </p>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              🖼️ תמונות לעריכה (אופציונלי)
              <span className="text-blue-500 animate-pulse">💫</span>
            </label>
            <div
              ref={dropZoneRef}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
                ${isDragOver 
                  ? 'border-primary-400 bg-primary-50 scale-[1.02]' 
                  : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                }
              `}
            >
              {uploadedImages.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image.data}
                          alt={`Uploaded image ${index + 1}`}
                          className="w-full max-h-24 object-cover rounded-lg shadow-md"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeUploadedImage(index);
                          }}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors w-6 h-6 flex items-center justify-center"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      {uploadedImages.length} תמונות נטענו
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeUploadedImage();
                      }}
                      className="text-red-500 hover:text-red-600 text-sm"
                    >
                      מחק הכל
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="w-8 h-8 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-700">
                      גררו תמונות לכאן או לחצו להעלאה
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      PNG, JPG, GIF עד 10MB כל אחת | תמיכה בכמה תמונות
                    </p>
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Prompt Section */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              🎨 הרעיון הגדול שלכם
              <span className="text-purple-500 animate-pulse">🌟</span>
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="תארו מה אתם רוצים ליצור... תנו לדמיון לעוף! ✨

דוגמאות:
🏰 • טירה קסומה מרחפת על העננים
🌳 • בית קפה נעים בתוך עץ
🤖 • רובוט עתידני מנגן בפסנתר  
🧜‍♀️ • גן תת-מימי עם פרחים זוהרים
🎪 • קרקס קוסמי עם חיות כוכבים
🏮 • רחוב יפני בלילה גשום עם פנסים"
              className="textarea min-h-[140px]"
              dir="auto"
            />
            <div className="flex justify-end items-center text-sm text-gray-500">
              <span>{prompt.length} תווים</span>
            </div>
          </div>

          {/* Generate Button */}
          <div className="relative">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim() || !apiKey.trim()}
              className={`
                btn-primary w-full py-3 text-base font-bold relative overflow-hidden shadow-2xl transform transition-all duration-300
                ${isGenerating ? 'loading-gradient scale-105' : 'hover:scale-105'}
                disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100
              `}
            >
              <div className="flex items-center justify-center gap-4">
                {isGenerating ? (
                  <>
                    <div className="relative">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <div className="absolute inset-0 w-6 h-6 border-2 border-white/30 rounded-full animate-ping" />
                    </div>
                    <span className="animate-pulse">✨ יוצר קסם בשבילכם... ✨</span>
                  </>
                ) : (
                  <>
                    <div className="relative">
                      <Wand2 className="w-6 h-6 animate-bounce" />
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
                    </div>
                    <span>🎨 בואו ניצור קסם! 🌟</span>
                  </>
                )}
              </div>
              
              {/* Button sparkle effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </button>
            
            {/* Encouraging message below button */}
            {!isGenerating && (
              <div className="text-center mt-4 animate-pulse">
                <span className="text-sm text-gray-500 flex items-center justify-center gap-2">
                  <span>🎪</span>
                  <span>כל רעיון הוא תחילה של הרפתקה!</span>
                  <span>🎭</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Inspiration Gallery */}
      <div className="animate-fade-in animate-stagger-1">
        <InspirationGallery />
      </div>

      {/* Creative Tools Showcase */}
      <div className="animate-fade-in animate-stagger-1">
        <CreativeToolsShowcase />
      </div>

      {/* Examples Gallery */}
      <div className="animate-fade-in animate-stagger-1">
        <ExamplesGallery />
      </div>

      {/* Results Section */}
      {result && (
        <div id="results" className="space-y-6 animate-fade-in">
          {result.success ? (
            <div className="card border-l-4 border-l-success bg-gradient-to-r from-green-50 to-white">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="success-checkmark">
                    <Check className="w-4 h-4" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-gray-800">
                    {result.image ? 'Image Generated! 🎉' : 'Content Created! 🎉'}
                  </h3>
                </div>

                {/* Generated Image Display */}
                {result.image && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700">Generated Image:</h4>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <img
                        src={`data:${result.image.mimeType};base64,${result.image.data}`}
                        alt="Generated by AI"
                        className="w-full max-w-2xl mx-auto rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                      />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <a
                        href={`data:${result.image.mimeType};base64,${result.image.data}`}
                        download={`gemini-generated-${Date.now()}.${result.image.mimeType.split('/')[1]}`}
                        className="btn-primary flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download Image
                      </a>
                      <button
                        onClick={() => openShareDialog(result.image, result.originalPrompt || result.text || '')}
                        className="btn-ghost flex items-center gap-2"
                      >
                        <Share2 className="w-4 h-4" />
                        שתף תמונה
                      </button>
                    </div>
                  </div>
                )}

                {result.enhancedPrompt && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-700">
                      {result.image ? 'Prompt Used:' : 'Enhanced Prompt:'}
                    </h4>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {result.enhancedPrompt}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(result.enhancedPrompt || '')}
                        className="btn-outline flex items-center gap-2"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                      <button
                        onClick={() => openShareDialog(result.image, result.originalPrompt || result.text || '')}
                        className="btn-ghost flex items-center gap-2"
                      >
                        <Share2 className="w-4 h-4" />
                        שתף יצירה
                      </button>
                    </div>
                  </div>
                )}

                {result.message && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm">
                      💡 {result.message}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card border-l-4 border-l-error bg-gradient-to-r from-red-50 to-white">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                  <h3 className="text-xl font-display font-semibold text-gray-800">
                    Oops! Something went wrong
                  </h3>
                </div>
                <p className="text-red-700">
                  {result.error || 'An unexpected error occurred'}
                </p>
                {result.code && (
                  <p className="text-sm text-red-600 font-mono bg-red-100 px-3 py-2 rounded">
                    Error Code: {result.code}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="text-center space-y-6 animate-fade-in animate-stagger-3">
        {/* Creative divider */}
        <div className="flex items-center justify-center gap-4 text-2xl">
          <span className="animate-pulse">🎨</span>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-primary-300 to-transparent"></div>
          <span className="animate-pulse delay-300">✨</span>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-secondary-300 to-transparent"></div>
          <span className="animate-pulse delay-500">🎭</span>
        </div>
        
        {/* Footer message */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
          <p className="text-gray-700 font-medium mb-2 text-center" dir="rtl">
            נוצר באהבה ❤️ עם{' '}
            <span className="gradient-text font-bold">Claude Code</span> ו{' '}
            <span className="gradient-text font-bold">בינה מלאכותית של גוגל</span> ✨
          </p>
        </div>
        
        {/* Final encouragement */}
        <div className="text-center">
          <p className="text-purple-600 font-medium animate-pulse">
            💫 תמשיכו ליצור, תמשיכו לחלום! 💫
          </p>
        </div>
      </div>
      </div>

      {/* Sound Control */}
      <SoundControl />

      {/* Share Dialog */}
      {showShareDialog && shareData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-fade-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-t-2xl p-6">
              <h3 className="text-xl font-bold text-center flex items-center justify-center gap-3">
                <Share2 className="w-6 h-6" />
                שתפו את היצירה שלכם
                <Sparkles className="w-6 h-6 animate-pulse" />
              </h3>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {shareData.image && (
                <div className="text-center">
                  <img
                    src={`data:${shareData.image.mimeType};base64,${shareData.image.data}`}
                    alt="Generated artwork to share"
                    className="max-w-full max-h-48 rounded-lg shadow-md mx-auto"
                  />
                </div>
              )}
              
              <div className="text-center space-y-2">
                <p className="text-gray-700 font-medium">
                  🖼️ שיתוף התמונה בלבד (ללא טקסט)
                </p>
                {shareData.text && (
                  <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 text-center">
                    <strong>נוצר עם:</strong> &quot;{shareData.text}&quot;<br/>
                    <span className="text-xs text-gray-500">(המידע הזה לא ישותף, רק התמונה)</span>
                  </div>
                )}
                <div className="bg-blue-50 rounded-lg p-3 text-sm">
                  <p className="text-blue-800 text-center">
                    <strong>📱 WhatsApp, Instagram:</strong> רק התמונה תשותף!<br/>
                    <strong>💻 דסקטופ:</strong> התמונה תוורד למכשיר
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 pt-0 flex gap-3">
              <button
                onClick={closeShareDialog}
                className="flex-1 btn-ghost text-gray-600 hover:text-gray-800 flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                ביטול
              </button>
              <button
                onClick={performShare}
                className="flex-1 btn-primary flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-secondary-500"
              >
                <Share2 className="w-4 h-4" />
                שתף תמונה!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}