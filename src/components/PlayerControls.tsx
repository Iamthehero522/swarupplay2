import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from 'lucide-react';
import { PlayerState } from '../types';

interface PlayerControlsProps {
  playerState: PlayerState;
  togglePlay: () => void;
  handleVolumeChange: (value: number) => void;
  toggleMute: () => void;
  handleSeek: (value: number) => void;
  toggleFullscreen: () => void;
  setPlaybackRate: (rate: number) => void;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  playerState,
  togglePlay,
  handleVolumeChange,
  toggleMute,
  handleSeek,
  toggleFullscreen,
  setPlaybackRate
}) => {
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [showPlaybackRates, setShowPlaybackRates] = useState(false);
  let hideControlsTimeout: number;

  useEffect(() => {
    resetHideControlsTimer();
    return () => clearTimeout(hideControlsTimeout);
  }, [playerState.isPlaying]);

  const resetHideControlsTimer = () => {
    clearTimeout(hideControlsTimeout);
    setIsControlsVisible(true);
    
    if (playerState.isPlaying) {
      hideControlsTimeout = window.setTimeout(() => {
        setIsControlsVisible(false);
        setShowPlaybackRates(false);
      }, 3000);
    }
  };

  const handleMouseMove = () => {
    resetHideControlsTimer();
  };

  // Format time (seconds) to MM:SS
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '00:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <div 
      className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity duration-300 ${isControlsVisible ? 'opacity-100' : 'opacity-0'}`}
      onMouseMove={handleMouseMove}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Progress bar */}
      <div className="mb-4">
        <input
          type="range"
          min={0}
          max={playerState.duration || 100}
          value={playerState.currentTime}
          onChange={(e) => handleSeek(parseFloat(e.target.value))}
          className="w-full h-1 bg-gray-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:hover:w-4 [&::-webkit-slider-thumb]:hover:h-4 [&::-webkit-slider-thumb]:transition-all"
        />
      </div>
      
      {/* Controls row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Play/Pause button */}
          <button 
            onClick={togglePlay} 
            className="text-white hover:text-purple-400 transition"
          >
            {playerState.isPlaying ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8" />
            )}
          </button>
          
          {/* Skip backward 10s button */}
          <button 
            onClick={() => handleSeek(playerState.currentTime - 10)}
            className="text-white hover:text-purple-400 transition"
          >
            <SkipBack className="w-6 h-6" />
          </button>
          
          {/* Skip forward 10s button */}
          <button 
            onClick={() => handleSeek(playerState.currentTime + 10)}
            className="text-white hover:text-purple-400 transition"
          >
            <SkipForward className="w-6 h-6" />
          </button>
          
          {/* Volume control */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMute}
              className="text-white hover:text-purple-400 transition"
            >
              {playerState.isMuted ? (
                <VolumeX className="w-6 h-6" />
              ) : (
                <Volume2 className="w-6 h-6" />
              )}
            </button>
            
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={playerState.isMuted ? 0 : playerState.volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-20 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
            />
          </div>
          
          {/* Time display */}
          <div className="text-white text-sm">
            <span>{formatTime(playerState.currentTime)}</span>
            <span className="mx-1">/</span>
            <span>{formatTime(playerState.duration)}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Playback speed */}
          <div className="relative">
            <button
              onClick={() => setShowPlaybackRates(!showPlaybackRates)}
              className="text-white hover:text-purple-400 px-2 py-1 rounded text-sm border border-gray-700 hover:border-purple-400 transition"
            >
              {playerState.playbackRate}x
            </button>
            
            {showPlaybackRates && (
              <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded shadow-lg overflow-hidden z-10">
                {playbackRates.map(rate => (
                  <button
                    key={rate}
                    onClick={() => {
                      setPlaybackRate(rate);
                      setShowPlaybackRates(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      playerState.playbackRate === rate 
                        ? 'bg-purple-600 text-white' 
                        : 'text-white hover:bg-gray-700'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Fullscreen button */}
          <button
            onClick={toggleFullscreen}
            className="text-white hover:text-purple-400 transition"
          >
            <Maximize className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};