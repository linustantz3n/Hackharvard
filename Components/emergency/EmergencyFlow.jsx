
import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, Loader2, Phone, User, Mic, Square, ListChecks, MessageSquare, Hand, Volume2, PhoneForwarded } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User as UserSDK } from "@/entities/User"; // Renamed to avoid conflict with Lucide icon
import { EmergencySession } from "@/entities/EmergencySession";
import { useTextToSpeech } from "@/components/hooks/useTextToSpeech";
import { callEmergencyContact } from "@/functions/callEmergencyContact";
import { callExternalModel } from "@/functions/callExternalModel";
import { InvokeLLM } from "@/integrations/Core"; //Utilize Gemini
import { protocols } from "./protocols.js";
import MessageBubble from "./MessageBubble";
import { motion } from "framer-motion";

// Step 3: Create the Media Library
// This maps the keys the AI will use to the actual asset URLs.
const emergencyAssets = {
  cpr_compressions: 'https://pub-d822d506c8ae4499947e68bb3f43ed5a.r2.dev/Chest_compressions.gif',
  heimlich_maneuver: 'https://pub-d822d506c8ae4499947e68bb3f43ed5a.r2.dev/heimlich.webp',
};

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export default function EmergencyFlow({ onClose, initialDescription }) {
    const [user, setUser] = useState(null);
    const [sessionId, setSessionId] = useState(null); // New state for session ID
    const [messages, setMessages] = useState([]);
    const [status, setStatus] = useState("categorizing"); // categorizing, processing, speaking, listening, paused
    const [isCallingContact, setIsCallingContact] = useState(false);
    const [protocol, setProtocol] = useState(null);
    const [textsToSpeak, setTextsToSpeak] = useState([]); // Simplified state for TTS
    const [isChecklistMode, setIsChecklistMode] = useState(false);
    
    const recognitionRef = useRef(null);
    const scrollRef = useRef(null);

    // This hook now triggers when `textsToSpeak` array is populated.
    // It handles the entire audio chunk in one go.
    useTextToSpeech(textsToSpeak, status, {
        onEnd: () => {
            // When the entire audio chunk finishes, clear the spoken texts
            // and switch to listening mode if the last AI message awaits a response.
            setTextsToSpeak([]);
            const lastAiMessage = messages.slice().reverse().find(m => m.role === 'assistant');
            if (lastAiMessage?.awaits_response) {
                setStatus("listening");
            } else {
                setStatus("paused"); // If no response is awaited, go to paused
            }
        }
    });

    // New useCallback for handling emergency contact call
    const handleCallContact = useCallback(async () => {
        if (!user?.emergencyContactPhone || !sessionId) return;
        setIsCallingContact(true);
        try {
            await callEmergencyContact({ sessionId });
            // Add a confirmation message for the user
            setMessages(prev => [...prev, { role: 'system', content: `Calling emergency contact: ${user.emergencyContactName || user.emergencyContactPhone}` }]);
        } catch(e) {
            console.error("Failed to initiate call", e);
            setMessages(prev => [...prev, { role: 'system', content: 'Failed to initiate call to emergency contact.' }]);
        } finally {
            setIsCallingContact(false);
        }
    }, [user, sessionId]); // Depend on user and sessionId

    // Effect to fetch user data on component mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = await UserSDK.me();
                setUser(currentUser);
            } catch (e) { console.error("Could not fetch user", e); }
        };
        fetchUser();
    }, []); // Runs once on mount

    useEffect(() => {
        const categorizeEmergency = async () => {
            if (!initialDescription) {
                onClose();
                return;
            }

            try {
                const { data: classification } = await callExternalModel({ text: initialDescription });

                let selectedProtocol = null;
                let firstAIMessages;
                const emergencyType = classification.prediction || "unknown";

                // Create a new emergency session and store its ID
                const newSession = await EmergencySession.create({
                    emergency_type: emergencyType,
                    description: initialDescription,
                });
                setSessionId(newSession.id);

                if (emergencyType && emergencyType !== "Unknown" && protocols[emergencyType]) {
                    selectedProtocol = protocols[emergencyType];
                    setProtocol(selectedProtocol);
                    const friendlyName = emergencyType.replace(/_/g, ' ').toLowerCase();
                    firstAIMessages = [
                        { text: `Okay, it looks like we are dealing with a potential ${friendlyName}.`, awaits_response: false },
                        { text: `I will guide you through the required steps. Stay calm and listen carefully. Tell me when you're ready to start.`, awaits_response: true }
                    ];
                } else {
                    setProtocol(null);
                    firstAIMessages = [
                        { text: "Okay, I understand.", awaits_response: false },
                        { text: "I will do my best to guide you. Please describe what you see in more detail.", awaits_response: true }
                    ];
                }
                
                const initialUserMessage = { role: 'user', content: initialDescription };
                const assistantMessages = firstAIMessages.map(msg => ({ role: 'assistant', content: msg.text, awaits_response: msg.awaits_response }));
                
                setMessages([initialUserMessage, ...assistantMessages]);
                setTextsToSpeak(firstAIMessages.map(m => m.text));
                setStatus("speaking");

            } catch (error) {
                console.error("Error during categorization:", error);
                const errorMessages = [{ text: "I'm having trouble connecting. I'll do my best to help. Can you tell me more about what's happening?", awaits_response: true }];
                setProtocol(null);
                setMessages([
                    { role: 'user', content: initialDescription },
                    { role: 'assistant', content: errorMessages[0].text, awaits_response: true }
                ]);
                setTextsToSpeak(errorMessages.map(m => m.text));
                setStatus("speaking");
            }
        };

        categorizeEmergency();
        
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';
            
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setMessages(prev => [...prev, { role: 'user', content: transcript }]);
                setStatus("processing");
            };
            
            recognitionRef.current = recognition;
        } else {
            console.error("Speech recognition not supported.");
        }
    }, [initialDescription, onClose]);

    useEffect(() => {
        const recognition = recognitionRef.current;
        if (!recognition) return;

        recognition.onerror = (event) => {
            // Log non-critical errors for debugging, but let onend handle the restart logic
            // to prevent race conditions and create a more stable loop.
            console.warn("Speech recognition event:", event.error);
        };
        
        recognition.onend = () => {
            // If the status is still 'listening', it means no speech was captured.
            // We restart recognition to keep the mic active and ready for the user.
            if (status === 'listening') {
                try {
                    recognition.start();
                } catch(e) {
                   console.warn("Speech recognition start error, will retry.", e);
                   // If start fails, try again after a short delay.
                   setTimeout(() => { if (status === 'listening') setStatus('listening'); }, 100);
                }
            }
        };
    }, [status]);


    const processAIResponse = useCallback(async () => {
        const conversationHistory = messages.map(m => `${m.role}: ${m.content}`).join('\n');
        
        let prompt;
        if (protocol) {
            const protocolSteps = protocol.steps.map((step, index) => `${index + 1}. ${step}`).join('\n');
            const protocolSigns = protocol.signs_to_look_for.map(sign => `- ${sign}`).join('\n');
            
            prompt = `You are LifeLine, an authoritative and adaptable emergency AI assistant. A situation has been identified as '${protocol.name}'.
Your primary goal is to be a helpful, intelligent, and flexible guide. You are not a robot that just reads a list.

**Core Instruction:**
Your most important job is to listen to the user. If they ask to skip ahead, ask about a specific procedure (e.g., "how do I do compressions?"), or seem to be in a later stage of the emergency, you MUST adapt. Jump directly to the most relevant step in the protocol instead of following the steps in a rigid, linear order. Provide the most helpful information immediately based on the user's request.

**Conversation History:**
---
${conversationHistory}
---

**Medical Protocol & Guidelines:**
Use the following protocol as your guide. The numbers are for reference, not a strict sequence you must follow if the user's needs dictate otherwise.
---
PROTOCOL NAME: ${protocol.name}
STEPS:
${protocolSteps}

CRITICAL SIGNS TO WATCH FOR:
${protocolSigns}
---

**Available Visual Aids:**
You can show a visual aid by including its key in your response.
- 'cpr_compressions': Use when instructing on chest compressions.
- 'heimlich_maneuver': Use when instructing on abdominal thrusts.

**Available Actions:**
You can trigger a real-world action by including an 'action' key in your response.
- 'call_emergency_contact': Use this ONLY when the user explicitly asks you to call their emergency contact.

**RESPONSE FORMAT:**
Your response MUST be a JSON object with a single key "responses" which is an array of objects. Each object must have a "text" field and an "awaits_response" boolean. It may optionally include an "asset_key" or "action".
- Example with visual: {"text": "Start chest compressions, like this.", "awaits_response": true, "asset_key": "cpr_compressions"}
- Example with action: {"text": "Okay, calling them now.", "awaits_response": false, "action": "call_emergency_contact"}

Given all of the above, and paying close attention to the user's last message, what is the most helpful and relevant response?`;

        } else {
            prompt = `You are LifeLine, an authoritative emergency AI. A situation could not be automatically categorized. Your goal is to take control, assess the situation, and provide calm, clear first aid guidance.

**Available Actions:**
- 'call_emergency_contact': Use this ONLY when the user explicitly asks you to call their emergency contact.

**RESPONSE FORMAT:**
Your response MUST be a JSON object with a single key "responses" which is an array of objects. Each object must have a "text" field and an "awaits_response" boolean. It can optionally include an "action".

**Conversation History:**
${conversationHistory}

Based on the history, what do you need to say?`;
        }


        try {
            const aiResponse = await InvokeLLM({
                prompt: prompt,
                response_json_schema: { 
                    type: "object", 
                    properties: { 
                        responses: { 
                            type: "array", 
                            items: { 
                                type: "object",
                                properties: {
                                    text: { type: "string" },
                                    awaits_response: { type: "boolean" },
                                    asset_key: { type: "string" },
                                    action: { type: "string" } // Add action to schema
                                },
                                required: ["text", "awaits_response"]
                            } 
                        } 
                    },
                    required: ["responses"]
                }
            });

            if (aiResponse.responses && aiResponse.responses.length > 0) {
                 // Process actions before displaying messages or speaking
                 for (const res of aiResponse.responses) {
                    if (res.action === 'call_emergency_contact') {
                        handleCallContact(); // Trigger the call action
                    }
                }

                const assistantMessages = aiResponse.responses.map(msg => ({ 
                    role: 'assistant', 
                    content: msg.text, 
                    awaits_response: msg.awaits_response,
                    asset_url: msg.asset_key ? emergencyAssets[msg.asset_key] : null // Map key to URL
                }));
                setMessages(prev => [...prev, ...assistantMessages]);
                setTextsToSpeak(aiResponse.responses.map(m => m.text));
                setStatus("speaking");
            } else {
                throw new Error("AI returned empty or invalid response.");
            }
        } catch (error) {
            console.error("Error processing AI response:", error);
            const errorMessages = [{ text: "I'm having trouble connecting. Let's try that again. Can you repeat what you said?", awaits_response: true }];
            setMessages(prev => [...prev, { role: 'assistant', content: errorMessages[0].text, awaits_response: true }]);
            setTextsToSpeak(errorMessages.map(m => m.text));
            setStatus("speaking");
        }
    }, [messages, protocol, handleCallContact]); // Add handleCallContact to dependencies

    useEffect(() => {
        if (status === "processing") {
            if (recognitionRef.current) recognitionRef.current.stop();
            processAIResponse();
        } else if (status === "listening") {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.start();
                } catch(e) {
                    console.error("Could not start speech recognition", e);
                    setTimeout(() => { if(status === 'listening') setStatus('listening'); }, 500);
                }
            }
        } else if (status === "paused" || status === "speaking") {
             if (recognitionRef.current) recognitionRef.current.stop();
        }
    }, [status, processAIResponse]);

    useEffect(() => {
        if (!isChecklistMode && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isChecklistMode]);
    
    const handleInterrupt = () => {
        setTextsToSpeak([]); // Clear the TTS queue
        // The cleanup in useTextToSpeech will handle stopping the audio
        setStatus('listening'); // Immediately switch to listening
    };
    
    const getStatusIndicator = () => {
        switch (status) {
            case 'categorizing':
                 return <div className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</div>;
            case 'listening':
                return <div className="flex items-center gap-2"><Mic className="w-5 h-5 text-red-500 animate-pulse" /> Listening...</div>;
            case 'processing':
                return <div className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Thinking...</div>;
            case 'speaking':
                 return (
                    <div className="flex items-center gap-2 text-amber-600 font-semibold">
                        <Volume2 className="w-5 h-5 animate-pulse" />
                        Speaking...
                    </div>
                );
            case 'paused':
                return <div className="flex items-center gap-2"><Square className="w-5 h-5 text-gray-500" /> Paused</div>;
            default:
                return <div className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Initializing...</div>;
        }
    }

    const renderActionButton = () => {
        let config = {};

        switch(status) {
            case 'speaking':
                config = {
                    text: "INTERRUPT",
                    icon: <Hand className="w-6 h-6" />,
                    onClick: handleInterrupt,
                    className: "bg-amber-500 hover:bg-amber-600 animate-pulse",
                };
                break;
            case 'listening':
                config = {
                    text: "LISTENING...",
                    icon: <div className="relative flex h-6 w-6"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/50 opacity-75"></span><span className="relative inline-flex rounded-full h-6 w-6"><Mic/></span></div>,
                    onClick: () => setStatus('paused'),
                    className: "bg-blue-500 hover:bg-blue-600",
                };
                break;
            default: // paused, categorizing, etc.
                config = {
                    text: "TAP TO SPEAK",
                    icon: <Mic className="w-6 h-6" />,
                    onClick: () => setStatus('listening'),
                    className: "bg-blue-600 hover:bg-blue-700",
                };
        }

        return (
            <Button
                onClick={config.onClick}
                className={`w-40 md:w-48 h-14 rounded-full flex items-center justify-center gap-3 text-lg font-bold text-white shadow-lg transition-all transform hover:scale-105 ${config.className}`}
            >
                {config.icon}
                <span>{config.text}</span>
            </Button>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="p-4 border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex items-center justify-between">
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    <div className="flex items-center gap-2">
                        <Badge className="bg-[var(--emergency)] text-white px-4 py-2 text-sm font-semibold">
                            EMERGENCY MODE
                        </Badge>
                        {protocol && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsChecklistMode(prev => !prev)}
                                className="ml-2"
                            >
                                {isChecklistMode ? <MessageSquare className="w-4 h-4 mr-1" /> : <ListChecks className="w-4 h-4 mr-1" />}
                                {isChecklistMode ? "Chat" : "Checklist"}
                            </Button>
                        )}
                    </div>
                </div>
                <div className="text-center mt-2 font-medium text-gray-700">
                    {getStatusIndicator()}
                </div>
            </div>

            {isChecklistMode && protocol ? (
                <div className="flex-1 p-4 overflow-y-auto">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Protocol: {protocol.name.replace(/_/g, ' ').toUpperCase()}</h2>
                    <ol className="list-decimal list-inside space-y-3">
                        {protocol.steps.map((step, index) => (
                            <li key={index} className="flex items-start text-gray-700">
                                <span>{step}</span>
                            </li>
                        ))}
                    </ol>
                    <p className="mt-6 text-sm text-gray-600">
                        Please refer to the chat mode for interactive guidance and to confirm steps with the AI.
                    </p>
                </div>
            ) : isChecklistMode && !protocol ? (
                 <div className="flex-1 p-4 flex items-center justify-center text-center text-gray-600">
                    No specific protocol has been identified yet. Please use the chat to describe the situation and get guidance.
                 </div>
            ) : (
                <div ref={scrollRef} className="flex-1 p-4 space-y-4 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <MessageBubble key={index} message={msg} />
                    ))}
                    {(status === 'processing' || status === 'categorizing') && (
                        <div className="flex justify-start">
                             <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="flex items-center gap-2 p-3 bg-white border rounded-lg">
                                <Loader2 className="w-4 h-4 animate-spin text-gray-500"/>
                                <span className="text-sm text-gray-500">AI is thinking...</span>
                            </motion.div>
                        </div>
                    )}
                </div>
            )}

            <div
                className={`p-4 border-t bg-gray-100 sticky bottom-0 z-10 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] transition-all duration-500 ${
                    (status === 'speaking' || status === 'listening') ? 'animate-noisy-flare' : ''
                }`}
                style={{
                    '--flare-color': status === 'speaking' 
                        ? 'rgba(251, 191, 36, 0.5)' // Corresponds to amber-400/50
                        : status === 'listening' 
                        ? 'rgba(59, 130, 246, 0.5)' // Corresponds to blue-500/50
                        : 'transparent'
                }}
            >
                 <div className="flex items-center justify-between h-20 px-4">
                    <Button
                        onClick={() => window.location.href = 'tel:911'}
                        className="bg-red-600 hover:bg-red-700 text-white h-16 w-16 rounded-full shadow-lg flex flex-col items-center justify-center transition-transform hover:scale-105"
                    >
                        <Phone className="w-6 h-6" />
                        <span className="text-xs font-bold mt-1">911</span>
                    </Button>
                    
                    {renderActionButton()}
                    
                    <Button
                        onClick={handleCallContact}
                        disabled={!user?.emergencyContactPhone || isCallingContact}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white h-16 w-16 rounded-full shadow-lg flex flex-col items-center justify-center transition-transform hover:scale-105"
                    >
                        {isCallingContact ? <Loader2 className="w-6 h-6 animate-spin" /> : <PhoneForwarded className="w-6 h-6" />}
                        <span className="text-xs font-bold mt-1 leading-tight text-center">Contact</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
