import React, { useState } from 'react';
import { VideoUploader } from './components/VideoUploader';
import { AnalysisResults } from './components/AnalysisResults';
import { analyzeVideoContent } from './services/geminiService';
import { FileData, VideoAnalysisResult } from './types';
import { Clapperboard, Video, Loader2, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<VideoAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (data: FileData | null) => {
    setFileData(data);
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!fileData) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const analysis = await analyzeVideoContent(fileData.base64, fileData.mimeType);
      setResult(analysis);
    } catch (err) {
      setError("Failed to analyze the video. Please try again or check your API key.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-[#0f172a] to-[#0f172a] text-slate-100 pb-20">
      {/* Header */}
      <header className="pt-8 pb-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="relative z-10 container mx-auto px-4">
          <div className="inline-flex items-center justify-center p-3 bg-slate-800/50 backdrop-blur-md rounded-2xl mb-6 border border-slate-700/50 shadow-2xl">
            <Clapperboard className="w-8 h-8 text-blue-400 mr-3" />
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              VideoVibe Analyst
            </h1>
          </div>
          <p className="text-slate-400 max-w-lg mx-auto text-lg">
            Upload a short clip. We'll summarize it and find the perfect soundtrack using <span className="text-slate-200 font-semibold">Gemini 3 Pro</span>.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 space-y-10">
        
        {/* Upload Section */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <VideoUploader 
            onFileSelect={handleFileSelect} 
            isLoading={isAnalyzing} 
          />
        </section>

        {/* Action Section */}
        {fileData && !result && !isAnalyzing && (
          <div className="flex justify-center animate-in zoom-in duration-300">
            <button
              onClick={handleAnalyze}
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-blue-600 font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 hover:bg-blue-500 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)]"
            >
              <div className="absolute -inset-3 transition-all duration-1000 opacity-30 group-hover:opacity-100 group-hover:duration-200 animate-tilt">
                <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 blur-lg rounded-full"></div>
              </div>
              <span className="relative flex items-center gap-2 text-lg">
                <Sparkles className="w-5 h-5" />
                Analyze Video Mood
              </span>
            </button>
          </div>
        )}

        {/* Loading State */}
        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center py-12 animate-in fade-in duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
              <Loader2 className="w-16 h-16 text-blue-400 animate-spin relative z-10" />
            </div>
            <p className="mt-6 text-xl font-medium text-slate-300 animate-pulse">
              Gemini is watching your video...
            </p>
            <p className="text-sm text-slate-500 mt-2">Analyzing frames, checking vibes, picking tunes.</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="max-w-xl mx-auto p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
            <p className="text-red-400 font-medium">{error}</p>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <section className="pb-12">
            <AnalysisResults result={result} />
            <div className="flex justify-center mt-12">
               <button 
                onClick={() => { setFileData(null); setResult(null); }}
                className="text-slate-500 hover:text-white transition-colors flex items-center gap-2"
              >
                <Video className="w-4 h-4" />
                Analyze another video
              </button>
            </div>
          </section>
        )}

      </main>
    </div>
  );
};

export default App;
