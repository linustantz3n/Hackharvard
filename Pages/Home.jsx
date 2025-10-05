
import React, { useState, useEffect } from "react";
import { Mic, Phone, Search, Activity, Loader2, HeartPulse, Droplets, Wind, UserRoundX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import EmergencyFlow from "../components/emergency/EmergencyFlow";
import ChecklistFlow from "../components/emergency/ChecklistFlow";
import QuickAccessCard from "../components/home/QuickAccessCard";
import GlobalSearch from "../components/home/GlobalSearch";

const SETTINGS_KEY = 'lifeline-settings';

export default function Home() {
  const [mode, setMode] = useState("loading"); // loading, idle, listening, analyzing, guiding, unsupported
  const [description, setDescription] = useState("");
  const [recognition, setRecognition] = useState(null);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [settings, setSettings] = useState({ emergencyInterfaceStyle: 'chatbot' });

  useEffect(() => {
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Failed to parse settings from localStorage:", e);
        // Fallback to default settings if parsing fails
        setSettings({ emergencyInterfaceStyle: 'chatbot' });
      }
    }

    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      console.error("Speech recognition not supported.");
      setMode("unsupported"); // Set a specific mode for unsupported case
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = true; // Enable interim results for real-time feedback
    recognitionInstance.lang = 'en-US';

    recognitionInstance.onstart = () => {
        setInterimTranscript(""); // Clear interim transcript on start
        setMode("listening");
    };
    
    // The onend event can fire after onresult, so we need to check the mode
    // to avoid resetting to 'idle' after we've already moved to 'analyzing'.
    recognitionInstance.onend = () => {
        setInterimTranscript(""); // Clear interim transcript on end
        // We use a functional update with setMode to get the most recent 'mode' value
        // without adding 'mode' as a dependency to this useEffect.
        setMode(currentMode => (currentMode === "listening" ? "idle" : currentMode));
    };

    recognitionInstance.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setMode("idle");
    };
    recognitionInstance.onresult = (event) => {
      let finalTranscript = '';
      let currentInterimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          currentInterimTranscript += event.results[i][0].transcript;
        }
      }
      
      setInterimTranscript(currentInterimTranscript);

      if (finalTranscript) {
          setDescription(finalTranscript);
          setMode("analyzing");
      }
    };

    setRecognition(recognitionInstance);
    setMode("idle"); // Speech recognition is set up, move to idle state

    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, []); // This effect should only run once on mount

  const handleEmergencyClick = () => {
    if (mode === "listening") {
      recognition?.stop();
      setMode("idle");
    } else if(recognition) {
      recognition.start();
    }
  };
  
  const quickAccess = [
    { title: "Choking", icon: Wind, color: "bg-blue-100 text-blue-600", description: "Someone is choking" },
    { title: "CPR", icon: Activity, color: "bg-orange-100 text-orange-600", description: "Someone is unconscious and not breathing" },
    { title: "Bleeding", icon: Droplets, color: "bg-red-100 text-red-600", description: "There is severe bleeding" },
    { title: "Unconscious", icon: UserRoundX, color: "bg-purple-100 text-purple-600", description: "Someone is unconscious" }
  ];

  const handleQuickAccess = (description) => {
    setDescription(description);
    setMode("analyzing");
  };

  if (mode === "analyzing" || mode === "guiding") {
    const isChecklist = settings.emergencyInterfaceStyle === 'checklist';
    const FlowComponent = isChecklist ? ChecklistFlow : EmergencyFlow;
    
    return (
      <FlowComponent 
        initialDescription={description} 
        onClose={() => {
          setMode("idle");
          setDescription("");
        }}
        // Conditionally pass onAnalysisComplete only if it's EmergencyFlow
        {...(!isChecklist && { onAnalysisComplete: () => setMode("guiding") })}
      />
    );
  }
  
  if (mode === "search") {
    return <GlobalSearch onClose={() => setMode("idle")} />;
  }

  const getButtonContent = () => {
    switch(mode) {
      case "listening":
        return (
          <>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
              <Mic className="w-8 h-8" />
            </div>
            <span className="text-lg h-7 px-2 flex items-center justify-center min-w-[100px] text-center">{interimTranscript || "Listening..."}</span>
          </>
        );
      case "analyzing":
      case "loading":
         return (
          <>
            <Loader2 className="w-10 h-10 animate-spin" />
            <span>{mode === 'loading' ? 'Initializing...' : 'Analyzing...'}</span>
          </>
        );
      case "unsupported":
        return (
          <>
            <Mic className="w-10 h-10 opacity-50" />
            <span>SPEECH NOT SUPPORTED</span>
          </>
        );
      default:
        return (
          <>
            <Mic className="w-10 h-10" />
            <span>TAP TO SPEAK</span>
          </>
        );
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center pt-8 pb-4">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e15cdd77aa3bd840b81deb/8b6edec8c_LifeLineLogo.png" 
            alt="LifeLine Logo" 
            className="w-20 h-20 mx-auto mb-4"
          />
          <h1 className="text-4xl font-bold text-[var(--primary)] mb-2 tracking-tight">LifeLine</h1>
          <p className="text-[var(--text-secondary)] text-lg">Anyone can be a First Responder.</p>
        </div>

        {/* Search Bar */}
        <Button
          variant="outline"
          className="w-full h-14 justify-start text-left text-[var(--text-secondary)] hover:bg-gray-50 bg-white"
          onClick={() => setMode("search")}
        >
          <Search className="w-5 h-5 mr-3 text-gray-400" />
          Search for any medical situation...
        </Button>

        {/* Emergency Button */}
        <Card className="p-8 bg-gradient-to-br from-[var(--emergency)] to-red-500 border-none shadow-xl">
          <Button
            onClick={handleEmergencyClick}
            disabled={mode !== 'idle' && mode !== 'listening'}
            className={`w-full h-24 bg-white/10 hover:bg-white/20 text-white rounded-2xl shadow-lg text-xl font-bold transition-all active:scale-95 border-2 border-white/30 disabled:opacity-70 disabled:cursor-not-allowed`}
          >
            <div className="flex flex-col items-center gap-2">
              {getButtonContent()}
            </div>
          </Button>
          <p className="text-white text-center mt-4 text-sm">
            {mode === 'listening' ? "Tap to stop" : mode === 'unsupported' ? "Your browser does not support speech recognition." : (mode === 'loading' ? " " : "Describe the emergency")}
          </p>
        </Card>

        {/* Quick Access */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Access</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickAccess.map((item) => (
              <QuickAccessCard
                key={item.title}
                title={item.title}
                icon={item.icon}
                color={item.color}
                onClick={() => handleQuickAccess(item.description)}
              />
            ))}
          </div>
        </div>

        {/* Call 911 */}
        <Card className="p-6 bg-white border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Life-threatening emergency?</h3>
              <p className="text-sm text-gray-600">Call immediately for professional help</p>
            </div>
            <Button
              className="bg-[var(--emergency)] hover:bg-[var(--emergency-hover)] h-14 w-14 rounded-full shadow-lg"
              onClick={() => window.location.href = 'tel:911'}
            >
              <Phone className="w-6 h-6" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
