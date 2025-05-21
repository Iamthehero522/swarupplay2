import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorScreenProps {
  message: string;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({ message }) => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-4">Unable to Play Video</h2>
        <p className="text-gray-300 mb-6">{message}</p>
        <button 
          onClick={handleReload}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2 mx-auto"
        >
          <RefreshCw className="w-5 h-5" />
          Reload Page
        </button>
      </div>
    </div>
  );
};