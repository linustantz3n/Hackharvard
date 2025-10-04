import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function VoiceRecorder({ onTranscriptComplete, isProcessing }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcriptPart + ' ';
          } else {
            interim += transcriptPart;
          }
        }

        if (final) {
          setTranscript(prev => prev + final);
        }
        setInterimTranscript(interim);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          recognitionRef.current.start();
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript("");
      setInterimTranscript("");
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      if (transcript.trim()) {
        onTranscriptComplete(transcript.trim());
      }
    }
  };

  const displayText = transcript + (interimTranscript ? ' ' + interimTranscript : '');

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-lg mx-auto">
      <div className="relative">
        <AnimatePresence>
          {isListening && (
            <>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-teal-400 rounded-full blur-3xl"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                className="absolute inset-0 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full blur-2xl"
              />
            </>
          )}
        </AnimatePresence>

        <motion.div whileTap={{ scale: 0.95 }} className="relative">
          <Button
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing}
            className={`w-32 h-32 rounded-full shadow-2xl transition-all duration-300 ${
              isListening 
                ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
                : 'bg-gradient-to-br from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600'
            }`}
          >
            {isProcessing ? (
              <Loader2 className="w-12 h-12 text-white animate-spin" />
            ) : isListening ? (
              <MicOff className="w-12 h-12 text-white" />
            ) : (
              <Mic className="w-12 h-12 text-white" />
            )}
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
          {isProcessing ? 'Analyzing...' : isListening ? 'Listening...' : 'Tap to speak'}
        </h3>
        <p className="text-gray-500">
          {isProcessing ? 'Getting help ready for you' : isListening ? 'Describe your emergency' : 'Tell me what\'s happening'}
        </p>
      </motion.div>

      <AnimatePresence>
        {displayText && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-gray-100"
          >
            <p className="text-gray-700 text-lg leading-relaxed">
              "{displayText}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}