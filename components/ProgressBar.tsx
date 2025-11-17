
import React from 'react';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="w-full bg-gray-800 border border-green-800 rounded-sm overflow-hidden p-1">
      <div
        className="bg-green-500 h-4 rounded-sm transition-all duration-500 ease-linear"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
