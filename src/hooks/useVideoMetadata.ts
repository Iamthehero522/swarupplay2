//swarupplay/src/hooks/useVideoMetadata.ts
import { useState, useEffect } from 'react';
import { VideoMetadata } from '../types';

export const useVideoMetadata = (fileId: string | null) => {
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      if (!fileId) return;

      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`http://localhost:7001/api/video/${fileId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch video metadata');
        }
        
        const data = await response.json();
        setMetadata(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching video metadata:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetadata();
  }, [fileId]);

  return { metadata, isLoading, error };
};