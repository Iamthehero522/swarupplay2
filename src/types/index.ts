export interface VideoMetadata {
  file_id: string;
  file_name: string;
  size: number;
  mime_type: string;
  duration?: number;
  width?: number;
  height?: number;
  bitrate?: number;
  codec?: string;
  streamUrl: string;
  thumbnail?: string;
}

export interface PlayerState {
  isPlaying: boolean;
  isFullscreen: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLoading: boolean;
  playbackRate: number;
}

export interface RelatedVideo {
  id: string;
  name: string;
  thumbnail?: string;
  duration?: number;
  size: number;
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}