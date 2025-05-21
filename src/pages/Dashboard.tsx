import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Film, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRelatedVideos } from '../hooks/useRelatedVideos';
import { useYouTubeSearch } from '../hooks/useYouTubeSearch';

function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showYouTube, setShowYouTube] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { videos: driveVideos, isLoading: isDriveLoading } = useRelatedVideos();
  const { videos: youtubeVideos, search, isLoading: isYoutubeLoading } = useYouTubeSearch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      search(searchQuery);
      setShowYouTube(true);
    }
  };

  const handleVideoClick = (videoId: string, isYoutube = false) => {
    if (isYoutube) {
      navigate(`/watch?youtube=${videoId}`);
    } else {
      navigate(`/watch?play=${videoId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Film className="h-8 w-8 text-purple-500" />
              <h1 className="text-2xl font-bold text-white">SwarupPlay</h1>
            </div>

            <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
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

            <div className="flex items-center space-x-4">
              <span className="text-white">{user?.name}</span>
              <button
                onClick={() => logout()}
                className="text-gray-400 hover:text-white"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setShowYouTube(false)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              !showYouTube
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            My Videos
          </button>
          <button
            onClick={() => setShowYouTube(true)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              showYouTube
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            YouTube
          </button>
        </div>

        {/* Video grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {showYouTube ? (
            isYoutubeLoading ? (
              // YouTube videos loading skeleton
              Array(8)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-800 rounded-lg aspect-video mb-2"></div>
                    <div className="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                  </div>
                ))
            ) : (
              youtubeVideos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => handleVideoClick(video.id, true)}
                  className="cursor-pointer group"
                >
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                    />
                  </div>
                  <h3 className="text-white font-medium line-clamp-2 group-hover:text-purple-400">
                    {video.title}
                  </h3>
                </div>
              ))
            )
          ) : isDriveLoading ? (
            // Drive videos loading skeleton
            Array(8)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-800 rounded-lg aspect-video mb-2"></div>
                  <div className="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                </div>
              ))
          ) : (
            driveVideos.map((video) => (
              <div
                key={video.id}
                onClick={() => handleVideoClick(video.id)}
                className="cursor-pointer group"
              >
                <div className="relative aspect-video rounded-lg overflow-hidden mb-2 bg-gray-800">
                  {video.thumbnail ? (
                    <img
                      src={video.thumbnail}
                      alt={video.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Film className="w-12 h-12 text-gray-600" />
                    </div>
                  )}
                </div>
                <h3 className="text-white font-medium line-clamp-2 group-hover:text-purple-400">
                  {video.name}
                </h3>
                {video.duration && (
                  <p className="text-sm text-gray-400 mt-1">
                    {Math.floor(video.duration / 60)}:{(video.duration % 60)
                      .toString()
                      .padStart(2, '0')}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;