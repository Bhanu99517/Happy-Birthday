import React, { useState, useEffect, useCallback } from 'react';
import { TrackingResult, TrackingStatus } from './types';
import { FAKE_LOCATIONS } from './constants';
import LogDisplay from './components/LogDisplay';
import MapDisplay from './components/MapDisplay';
import ProgressBar from './components/ProgressBar';
import PhoneInputForm from './components/PhoneInputForm';
import ErrorDisplay from './components/ErrorDisplay';
import { initializeAudio, playSound, setMutedState } from './audio';
import { SpeakerOnIcon } from './components/icons/SpeakerOnIcon';
import { SpeakerOffIcon } from './components/icons/SpeakerOffIcon';
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [status, setStatus] = useState<TrackingStatus>(TrackingStatus.Idle);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const resetState = useCallback(() => {
    playSound('reset');
    setPhoneNumber('');
    setStatus(TrackingStatus.Idle);
    setLogs([]);
    setError(null);
    setProgress(0);
    setResult(null);
  }, []);

  const toggleMute = () => {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      setMutedState(newMutedState);
  };

  const fetchGeneratedLocation = useCallback(async (phone: string) => {
    setLogs(prev => [...prev, '> Generating detailed intelligence report...']);
    
    try {
      const response = await fetch('/api/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: phone }),
      });

      const data = await response.json().catch(() => {
        throw new Error(`Invalid response from server. Status: ${response.status}`);
      });

      if (!response.ok) {
        const errorMessage = data.error || `Server error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }
      
      setResult(data);

    } catch (error: any) {
        console.error("Backend API call failed, using fallback location.", error);
        
        const userFriendlyMessage = error.message || 'An unknown uplink error occurred.';
        
        setLogs(prev => [...prev, `> [ERROR] ${userFriendlyMessage}`]);
        setLogs(prev => [...prev, '> [WARNING] Uplink to intelligence server failed. Using cached data.']);
        setError(`Uplink Failed: ${userFriendlyMessage}. Using cached data as a fallback.`);
        
        const randomLocation = FAKE_LOCATIONS[Math.floor(Math.random() * FAKE_LOCATIONS.length)];
        setResult(randomLocation);
    } finally {
        setStatus(TrackingStatus.Complete);
    }
  }, []);
  
  const streamTrackingLogs = useCallback(async (phone: string) => {
    setStatus(TrackingStatus.InProgress);
    setLogs([]);
    setError(null);
    setProgress(0);
    setResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const model = 'gemini-2.5-flash';

      const prompt = `You are a G.T.S. (Global Tracking System) AI. A user wants to track the phone number '${phone}'. Generate a realistic, step-by-step log of the triangulation process. Provide exactly 15 distinct, concise log entries, one per line, without any introductory or concluding text. Each entry should sound technical and authentic to a hacking/espionage theme. For example: "Initializing G.T.S. kernel...", "Connecting to global satellite network...", "Authenticating with uplink node [SAT-US-EAST-7]...". Be creative.`;
      
      const responseStream = await ai.models.generateContentStream({
        model,
        contents: prompt,
      });
      
      let combinedText = '';
      const totalLogsExpected = 15;
      
      for await (const chunk of responseStream) {
        combinedText += chunk.text;
        const lines = combinedText.split('\n').filter(line => line.trim() !== '');
        
        setLogs(lines);
        
        const progressPercentage = Math.min(100, (lines.length / totalLogsExpected) * 100);
        setProgress(progressPercentage);
      }
      
      setProgress(100);
      await fetchGeneratedLocation(phone);

    } catch (err: any) {
      console.error("AI log generation failed:", err);
      const errorMessage = `Failed to initialize tracking sequence. Uplink to G.T.S. AI failed. ${err.message || ''}`;
      setError(errorMessage);
      setLogs(prev => [...prev, `> [FATAL ERROR] ${errorMessage}`]);
      setStatus(TrackingStatus.Idle);
    }
  }, [fetchGeneratedLocation]);


  const startTracking = useCallback(() => {
    initializeAudio();
    playSound('initiate');
    streamTrackingLogs(phoneNumber);
  }, [phoneNumber, streamTrackingLogs]);


  useEffect(() => {
    if (status === TrackingStatus.Complete) {
      playSound('complete');
    }
  }, [status]);

  return (
    <div className="bg-gray-900 text-green-400 min-h-screen flex flex-col items-center justify-center p-4 selection:bg-green-800 selection:text-green-300">
      <div className="w-full max-w-4xl bg-black bg-opacity-50 border border-green-700 rounded-lg shadow-2xl shadow-green-900/50 p-6">
        <header className="relative text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-green-500 animate-pulse">G.T.S. - Global Tracking System</h1>
          <p className="text-green-600 text-sm mt-1">Mobile Network Triangulation Interface v2.5</p>
          <button 
            onClick={toggleMute} 
            className="absolute top-0 right-0 p-2 text-green-600 hover:text-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-full"
            aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
          >
            {isMuted ? <SpeakerOffIcon className="w-6 h-6" /> : <SpeakerOnIcon className="w-6 h-6" />}
          </button>
        </header>

        <main className="space-y-6">
          <ErrorDisplay 
            message={error} 
            title={status === TrackingStatus.Idle ? "Input Validation Error" : "System Alert"} 
          />

          {status === TrackingStatus.Idle && (
            <PhoneInputForm
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              onStartTracking={startTracking}
              error={error}
              setError={setError}
            />
          )}

          {status !== TrackingStatus.Idle && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-gray-800 border border-green-800 p-2 rounded">
                <span className="text-green-400">Target Number:</span>
                <span className="font-mono text-white">{phoneNumber}</span>
              </div>
              
              <ProgressBar progress={progress} />
              <LogDisplay logs={logs} />

              {status === TrackingStatus.Complete && result && (
                <div className="animate-fadeIn">
                    <MapDisplay result={result} />
                    <button
                        onClick={resetState}
                        className="w-full mt-4 bg-green-600 hover:bg-green-500 text-gray-900 font-bold py-2 px-4 rounded transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
                    >
                        Track Another Number
                    </button>
                </div>
              )}
            </div>
          )}
        </main>
        
        <footer className="text-center text-xs text-gray-600 mt-8">
          <p>Disclaimer: This is a simulation created for entertainment purposes only.</p>
          <p>No real tracking is performed. Do not use for illegal activities.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
