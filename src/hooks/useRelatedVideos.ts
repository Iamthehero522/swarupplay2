//swarupplay/src/hooks/useRelatedVideos.ts
import { useState, useEffect } from 'react';
import { RelatedVideo } from '../types';

export const useRelatedVideos = () => {
  const [videos, setVideos] = useState<RelatedVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:7001/api/files?type=video', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch videos (${response.status})`);
        }

        const data = await response.json();
        setVideos(data.files || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load videos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return { videos, isLoading, error };
};
