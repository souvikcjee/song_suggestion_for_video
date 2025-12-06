import React from 'react';
import { VideoAnalysisResult } from '../types';
import { Music, AlignLeft, Sparkles, PlayCircle } from 'lucide-react';

interface AnalysisResultsProps {
  result: VideoAnalysisResult;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result }) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
      
      {/* Summary Section */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <AlignLeft className="w-6 h-6 text-purple-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-100">Video Summary</h2>
        </div>
        <p className="text-slate-300 leading-relaxed text-lg">
          {result.summary}
        </p>
      </div>

      {/* Song Suggestions Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-2 px-2">
          <div className="p-2 bg-pink-500/20 rounded-lg">
            <Music className="w-6 h-6 text-pink-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Soundtrack Suggestions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {result.songs.map((song, index) => (
            <div 
              key={index}
              className="group bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-pink-500/50 rounded-xl p-6 transition-all duration-300 flex flex-col shadow-lg hover:shadow-pink-500/10 hover:-translate-y-1"
            >
              <div className="mb-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold tracking-wider text-pink-400 uppercase">Option {index + 1}</span>
                  <Sparkles className="w-4 h-4 text-slate-500 group-hover:text-yellow-400 transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-pink-300 transition-colors">{song.title}</h3>
                <p className="text-slate-400 font-medium flex items-center gap-2">
                  {song.artist}
                </p>
              </div>
              
              <div className="mt-auto pt-4 border-t border-slate-700/50">
                <p className="text-sm text-slate-300 italic">
                  "{song.reason}"
                </p>
              </div>
              
              <div className="mt-4 flex justify-end">
                <a 
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${song.title} ${song.artist}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-white transition-colors"
                >
                  <PlayCircle className="w-4 h-4" />
                  Listen on YT
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
