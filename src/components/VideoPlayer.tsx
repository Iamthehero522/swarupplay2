// === swarupplay/src/components/VideoPlayer.tsx ===
import React from 'react';
import { useVideoPlayer } from '../hooks/useVideoPlayer';
import { PlayerControls } from './PlayerControls';
import { VideoMetadata } from '../types';

interface VideoPlayerProps {
  metadata: VideoMetadata;
  youtubeId?: string | null;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ metadata, youtubeId = null }) => {
  if (youtubeId) {
    return (
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
          title={metadata.file_name}
        />
      </div>
    );
  }

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

  return (
    <div className="w-full max-w-6xl mx-auto aspect-video bg-black relative">
      <video
        key={metadata.file_id}
        ref={videoRef}
        src={metadata.streamUrl}
        className="w-full h-full object-contain"
        onClick={togglePlay}
        playsInline
        autoPlay
      />

      {playerState.isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-16 h-16 rounded-full border-4 border-t-purple-500 border-r-transparent border-b-purple-300 border-l-transparent animate-spin" />
        </div>
      )}

      <PlayerControls
        playerState={playerState}
        togglePlay={togglePlay}
        handleVolumeChange={handleVolumeChange}
        toggleMute={toggleMute}
        handleSeek={handleSeek}
        toggleFullscreen={toggleFullscreen}
        setPlaybackRate={setPlaybackRate}
      />
    </div>
  );
};