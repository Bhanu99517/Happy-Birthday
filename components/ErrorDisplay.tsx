import React from 'react';

interface ErrorDisplayProps {
  message: string | null;
  title?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, title = "System Alert" }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded text-left animate-fadeIn" role="alert">
      <strong className="font-bold block text-red-200">{title}</strong>
      <span className="block sm:inline font-mono text-sm mt-1">{message}</span>
    </div>
  );
};

export default ErrorDisplay;
