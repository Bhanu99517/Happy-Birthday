
import React, { useEffect, useRef } from 'react';
import { playSound } from '../audio';

interface LogDisplayProps {
  logs: string[];
}

const LogDisplay: React.FC<LogDisplayProps> = ({ logs }) => {
  const logContainerRef = useRef<HTMLDivElement>(null);
  const prevLogsLengthRef = useRef<number>(0);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
    
    // Play sound for new logs as they appear
    if (logs.length > prevLogsLengthRef.current) {
      playSound('log');
    }
    prevLogsLengthRef.current = logs.length;

  }, [logs]);

  return (
    <div
      ref={logContainerRef}
      className="h-48 bg-black p-4 rounded font-mono text-sm border border-green-800 overflow-y-auto"
    >
      {logs.map((log, index) => (
        <p key={index} className="animate-fadeIn leading-relaxed">
          <span className="text-gray-500">{`> `}</span>
          {log}
        </p>
      ))}
    </div>
  );
};

export default LogDisplay;
