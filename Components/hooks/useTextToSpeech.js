import { useEffect, useRef, useCallback } from 'react';
import { speakWithElevenLabs } from '@/functions/speakWithElevenLabs';

const base64ToBlob = (base64, contentType = 'audio/mpeg') => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
};

export const useTextToSpeech = (textsToSpeak, status = 'speaking', { onEnd } = {}) => {
  const audioRef = useRef(null);
  const onEndRef = useRef(onEnd);

  useEffect(() => {
    onEndRef.current = onEnd;
  }, [onEnd]);
  
  const cleanup = useCallback(() => {
      if (audioRef.current) {
        audioRef.current.pause();
        if (audioRef.current.src && audioRef.current.src.startsWith('blob:')) {
          URL.revokeObjectURL(audioRef.current.src);
        }
        audioRef.current.src = ''; 
        audioRef.current = null;
      }
    }, []);

  useEffect(() => {
    const texts = textsToSpeak ? (Array.isArray(textsToSpeak) ? textsToSpeak : [textsToSpeak]) : [];
    
    if (status !== 'speaking' || texts.length === 0) {
        cleanup();
        return;
    }

    cleanup(); 

    const settings = JSON.parse(localStorage.getItem('lifeline-settings'));
    const voiceGuidanceEnabled = settings ? settings.voiceGuidance : true;

    if (!voiceGuidanceEnabled) {
      if (onEndRef.current) onEndRef.current();
      return;
    }
    
    let isCancelled = false;

    const getAndPlayAudio = async () => {
      try {
        const response = await speakWithElevenLabs({ texts });
        
        if (isCancelled || !response.data || !response.data.audio_base64) {
          if (onEndRef.current) onEndRef.current();
          return;
        }

        const audioBlob = base64ToBlob(response.data.audio_base64);
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.play().catch(error => {
          if (error.name !== 'AbortError') { 
            console.error("Error playing audio.", error);
          }
        });

        audio.onended = () => {
            if (audioRef.current && audioRef.current.src === audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
            if (onEndRef.current) {
              onEndRef.current();
            }
        };

      } catch (error) {
        console.error("Error fetching or playing audio:", error);
        if (onEndRef.current) onEndRef.current();
      }
    };

    getAndPlayAudio();

    return () => {
      isCancelled = true;
      cleanup();
    };
  }, [textsToSpeak, status, cleanup]);
};