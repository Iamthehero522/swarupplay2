import React from 'react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-900">
      <div className="relative w-24 h-24">
        <div className="absolute top-0 w-full h-full rounded-full border-4 border-t-purple-500 border-r-transparent border-b-purple-300 border-l-transparent animate-spin"></div>
      </div>
      <p className="mt-6 text-xl text-gray-300">Loading video...</p>
    </div>
  );
};