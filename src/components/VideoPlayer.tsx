import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useVideoPlayer } from '../hooks/useVideoPlayer';
import { PlayerControls } from './PlayerControls';
import { Header } from './Header';
import { useVideoMetadata } from '../hooks/useVideoMetadata';
import { LoadingScreen } from './LoadingScreen';
import { ErrorScreen } from './ErrorScreen';
import { Search } from 'lucide-react';
import { useYouTubeSearch } from '../hooks/useYouTubeSearch';

export const VideoPlayer: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const fileId = params.get('play');
  const youtubeId = params.get('youtube');
  
  const [searchQuery, setSearchQuery] = useState('');
  const { videos: youtubeVideos, search, isLoading: isSearching } = useYouTubeSearch();
  
  const { metadata, isLoading, error } = useVideoMetadata(fileId);
  const {
    videoRef,
    playerState,
    togglePlay,
    handleVolumeChange,
    toggleMute,
    handleSeek,
    toggleFullscreen,
    setPlaybackRate,
  } = useVideoPlayer();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen message={error} />;
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      search(searchQuery);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header metadata={metadata} />
      
      {/* Search bar */}
      <div className="bg-gray-800 py-4 px-6 border-b border-gray-700">
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="search"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>

      <div className="flex-1 flex">
        {/* Main video player */}
        <div className="flex-1 p-6">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            {youtubeId ? (
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                className="absolute inset-0 w-full h-full"
                allowFullScreen
                allow="autoplay; encrypted-media"
              />
            ) : metadata ? (
              <>
                <video
                  ref={videoRef}
                  src={metadata.streamUrl}
                  className="w-full h-full"
                  onClick={togglePlay}
                  playsInline
                />
                <PlayerControls
                  playerState={playerState}
                  togglePlay={togglePlay}
                  handleVolumeChange={handleVolumeChange}
                  toggleMute={toggleMute}
                  handleSeek={handleSeek}
                  toggleFullscreen={toggleFullscreen}
                  setPlaybackRate={setPlaybackRate}
                />
              </>
            ) : null}
          </div>
        </div>

        {/* Search results sidebar */}
        {youtubeVideos.length > 0 && (
          <div className="w-80 bg-gray-800 p-4 overflow-y-auto">
            <h3 className="text-white font-medium mb-4">Search Results</h3>
            <div className="space-y-4">
              {youtubeVideos.map((video) => (
                <a
                  key={video.id}
                  href={`/watch?youtube=${video.id}`}
                  className="block group"
                >
                  <div className="aspect-video rounded overflow-hidden mb-2">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm text-white group-hover:text-purple-400 line-clamp-2">
                    {video.title}
                  </p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};