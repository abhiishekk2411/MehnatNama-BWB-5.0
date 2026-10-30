import { useState, useEffect, useRef } from 'react';
import { Mic, AlertCircle, Loader2 } from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  currentValue: string;
}

// Check window for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

export function VoiceInput({ onTranscript, currentValue }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'hi-IN'; // Hindi (India)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        for (let i = 0; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          const combined = currentValue ? `${currentValue} ${finalTranscript.trim()}` : finalTranscript.trim();
          onTranscript(combined);
        }
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onerror = (event: any) => {
        console.warn('[VoiceInput] Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMsg('माइक्रोफ़ोन अनुमति नहीं दी गई (Microphone permission denied)');
        } else if (event.error === 'no-speech') {
          setErrorMsg('कोई आवाज़ नहीं सुनी गई (No speech detected)');
        } else {
          setErrorMsg(`त्रुटि: ${event.error}`);
        }
        setIsListening(false);
        setTimeout(() => setErrorMsg(null), 4000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('[VoiceInput] Init failed:', e);
      setIsSupported(false);
    }
  }, [currentValue, onTranscript]);

  const toggleListening = () => {
    if (!isSupported) {
      setErrorMsg('इस ब्राउज़र में आवाज़ पहचान समर्थित नहीं है (Speech recognition not supported in this browser)');
      setTimeout(() => setErrorMsg(null), 4000);
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setErrorMsg(null);
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.error('[VoiceInput] Start error:', err);
        setIsListening(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-1 mt-1">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={toggleListening}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
            isListening
              ? 'bg-rose-500 text-white animate-pulse ring-2 ring-rose-400/50'
              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
          }`}
          title="बोलकर नोट लिखें (Voice input in Hindi)"
        >
          {isListening ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>सुन रहे हैं... (Listening)</span>
            </>
          ) : (
            <>
              <Mic className="w-3.5 h-3.5" />
              <span>बोलकर लिखें (हिंदी आवाज़)</span>
            </>
          )}
        </button>

        <span className="text-[10px] text-slate-400 italic">
          [प्रायोगिक • Experimental Hindi Speech]
        </span>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-1.5 text-[11px] text-rose-600 dark:text-rose-400 mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
