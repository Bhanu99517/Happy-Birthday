
import React from 'react';
import { playSound } from '../audio';

interface PhoneInputFormProps {
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  onStartTracking: () => void;
  error: string | null;
  setError: (message: string | null) => void;
}

const PhoneInputForm: React.FC<PhoneInputFormProps> = ({ phoneNumber, setPhoneNumber, onStartTracking, error, setError }) => {
  
  const validatePhoneNumber = (number: string): string | null => {
    const cleaned = number.trim();
    if (cleaned === '') return null;

    if (/[^+\d\s]/.test(cleaned)) {
      return "Invalid characters. Use only digits, '+', and spaces.";
    }

    let normalized = cleaned.replace(/\s/g, '');
    if (normalized.startsWith('+91')) {
      normalized = normalized.substring(3);
    }
    
    if (/\D/.test(normalized)) {
        return "Invalid format. Check number for non-digit characters."
    }

    if (normalized.length > 10) {
      return "Number too long. An Indian mobile number has 10 digits.";
    }

    if (normalized.length > 0 && !/^[6-9]/.test(normalized)) {
      return "Invalid start. Indian numbers must start with 6, 7, 8, or 9.";
    }

    return null;
  };
  
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    playSound('typing');
    const newValue = e.target.value;
    setPhoneNumber(newValue);
    const validationError = validatePhoneNumber(newValue);
    setError(validationError);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validatePhoneNumber(phoneNumber);
    if (validationError) {
        setError(validationError);
        return;
    }

    let normalized = phoneNumber.trim().replace(/\s/g, '');
    if (normalized.startsWith('+91')) {
        normalized = normalized.substring(3);
    }

    if (normalized.length !== 10) {
        setError("A valid Indian mobile number must contain exactly 10 digits.");
        return;
    }

    setError(null);
    onStartTracking();
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fadeIn space-y-4">
      <label htmlFor="phone-input" className="block text-center text-green-400">
        Enter Target Indian Mobile Number to Initiate Triangulation
      </label>
      <input
        id="phone-input"
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        placeholder="+91 98765 43210"
        className="w-full bg-gray-800 text-white font-mono p-3 rounded border border-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-500 text-center text-lg"
        autoComplete="off"
      />
      <button
        type="submit"
        disabled={!!error || phoneNumber.trim().length === 0}
        className="w-full bg-green-600 hover:bg-green-500 text-gray-900 font-bold py-3 px-4 rounded transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        INITIATE TRACK
      </button>
    </form>
  );
};

export default PhoneInputForm;
