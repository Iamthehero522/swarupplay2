// src/components/RelatedVideos.tsx
import React from 'react';
import { RelatedVideo } from '../types';
import { formatFileSize } from '../utils/format';
import { Clock, HardDrive } from 'lucide-react';

interface RelatedVideosProps {
  videos: RelatedVideo[];
  currentVideoId: string;
  onVideoSelect: (videoId: string) => void;
  isLoading: boolean;
}

export const RelatedVideos: React.FC<RelatedVideosProps> = ({
  videos,
  currentVideoId,
  onVideoSelect,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-2 mb-4">
            <div className="bg-gray-700 w-40 h-24 rounded"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {videos
        .filter(video => video.id !== currentVideoId)
        .map(video => (
          <button
            key={video.id}
            onClick={() => onVideoSelect(video.id)}
            className="flex gap-3 w-full hover:bg-gray-800 p-2 rounded-lg transition-colors"
          >
            <div className="relative w-40 h-24 bg-gray-800 rounded-lg overflow-hidden">
              {video.thumbnail ? (
                <img
                  src={video.thumbnail}
                  alt={video.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Film className="w-8 h-8 text-gray-600" />
                </div>
              )}
            </div>
            
            <div className="flex-1 text-left">
              <h3 className="font-medium text-white line-clamp-2">{video.name}</h3>
              <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                {video.duration && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(video.duration)}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <HardDrive className="w-4 h-4" />
                  <span>{formatFileSize(video.size)}</span>
                </div>
              </div>
            </div>
          </button>
        ))}
    </div>
  );
};