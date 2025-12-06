import React, { useCallback, useState, useRef } from 'react';
import { Upload, FileVideo, X, AlertCircle } from 'lucide-react';
import { FileData } from '../types';

interface VideoUploaderProps {
  onFileSelect: (fileData: FileData | null) => void;
  isLoading: boolean;
}

const MAX_SIZE_MB = 100; // Updated limit to 100MB

export const VideoUploader: React.FC<VideoUploaderProps> = ({ onFileSelect, isLoading }) => {
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setError(null);

    // Validate type
    if (!file.type.startsWith('video/')) {
      setError("Please upload a valid video file.");
      return;
    }

    // Validate size
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File is too large. Max size is ${MAX_SIZE_MB}MB for this demo.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // Extract base64 part
      const base64 = result.split(',')[1];
      
      onFileSelect({
        base64,
        mimeType: file.type,
        name: file.name,
        size: file.size
      });
      setPreviewUrl(URL.createObjectURL(file));
    };
    reader.onerror = () => {
      setError("Failed to read file.");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoading) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [isLoading]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setPreviewUrl(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (previewUrl) {
    return (
      <div className="relative w-full max-w-2xl mx-auto bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700">
        <video 
          src={previewUrl} 
          controls 
          className="w-full max-h-[400px] object-contain bg-black"
        />
        {!isLoading && (
          <button 
            onClick={clearFile}
            className="absolute top-4 right-4 p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full backdrop-blur-sm transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400 hover:bg-slate-800/50'}
          ${error ? 'border-red-500 bg-red-500/10' : 'border-slate-600 bg-slate-800/30'}
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleChange}
          accept="video/*"
          className="hidden"
          disabled={isLoading}
        />
        
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-slate-700 rounded-full">
            {error ? <AlertCircle className="w-8 h-8 text-red-400" /> : <Upload className="w-8 h-8 text-blue-400" />}
          </div>
          <div>
            <h3 className="text-lg font-medium text-slate-200">
              {error ? "Upload Failed" : "Drop your video here"}
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              {error || `Support .mp4, .mov (max ${MAX_SIZE_MB}MB)`}
            </p>
          </div>
          {!error && (
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
              Browse Files
            </button>
          )}
        </div>
      </div>
    </div>
  );
};