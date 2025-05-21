import React from 'react';
import { VideoMetadata } from '../types';
import { Film } from 'lucide-react';

interface HeaderProps {
  metadata: VideoMetadata | null;
}

export const Header: React.FC<HeaderProps> = ({ metadata }) => {
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <header className="bg-gray-800 shadow-md py-4 px-6">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Film className="h-8 w-8 text-purple-500" />
          <h1 className="text-2xl font-bold text-white">SwarupPlay</h1>
        </div>
        
        {metadata && (
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-gray-300">
              <span className="font-medium text-white">{metadata.file_name}</span>
              {metadata.size && (
                <span className="ml-2 text-sm text-gray-400">
                  ({formatFileSize(metadata.size)})
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};