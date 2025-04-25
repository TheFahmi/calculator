'use client';
import { useState, useEffect } from 'react';

interface DisplayProps {
  display: string;
  expression: string;
  errorMessage?: string;
  handleVoiceInput: (transcript: string) => void;
}

const Display: React.FC<DisplayProps> = ({ display, expression, errorMessage: propErrorMessage, handleVoiceInput }) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [localErrorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    // Check if browser supports SpeechRecognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();

      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'id-ID'; // Set to Indonesian language

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('Voice input:', transcript);
        handleVoiceInput(transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);

        if (event.error === 'not-allowed') {
          setErrorMessage('Izin mikrofon ditolak. Silakan izinkan akses mikrofon di browser Anda.');
          setTimeout(() => setErrorMessage(''), 5000);
        }

        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }

    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, [handleVoiceInput, recognition]);

  const toggleListening = (): void => {
    if (!recognition) {
      setErrorMessage('Maaf, browser Anda tidak mendukung fitur pengenalan suara.');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setErrorMessage('Terjadi kesalahan saat memulai pengenalan suara. Silakan coba lagi.');
        setTimeout(() => setErrorMessage(''), 5000);
      }
    }
  };

  // Combine error messages from props and local state
  const displayErrorMessage = propErrorMessage || localErrorMessage;

  return (
    <div className="calculator-display">
      <div id="error-message" className={`error-message ${displayErrorMessage ? 'show' : ''}`}>
        {displayErrorMessage}
      </div>
      <div id="expression">{expression}</div>
      <div className="display-row">
        <div id="display">{display}</div>
      </div>
    </div>
  );
};

export default Display;
