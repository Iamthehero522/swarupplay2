// src/components/YouTubeSuggestions.tsx
import React from 'react';
import { Play } from 'lucide-react';

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
}

interface Props {
  videos: YouTubeVideo[];
  onSelect: (videoId: string) => void;
  isLoading: boolean;
}

export const YouTubeSuggestions: React.FC<Props> = ({ videos, onSelect, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse flex gap-3">
            <div className="bg-gray-700 w-40 h-24 rounded" />
            <div className="flex-1">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-700 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {videos.map((video) => (
        <button
          key={video.id}
          className="flex gap-3 w-full hover:bg-gray-800 p-2 rounded-lg transition-colors group"
          onClick={() => onSelect(video.id)}
        >
          <div className="relative w-40 h-24">
            <img 
              src={video.thumbnail} 
              alt={video.title} 
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all">
              <Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <p className="flex-1 text-sm font-medium text-white text-left line-clamp-2">
            {video.title}
          </p>
        </button>
      ))}
    </div>
  );
};