import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { EmergencySession } from "@/entities/EmergencySession";
import { InvokeLLM } from "@/integrations/Core";
import { motion } from "framer-motion";
import { Heart, Shield, Clock, Users } from "lucide-react";
import VoiceRecorder from "../components/emergency/VoiceRecorder";

export default function Landing() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTranscriptComplete = async (transcript) => {
    setIsProcessing(true);

    try {
      // Analyze the emergency using AI
      const analysis = await InvokeLLM({
        prompt: `You are an emergency response AI. Analyze this emergency situation and provide:
1. Emergency type (medical, injury, fire, cardiac, breathing, safety, other)
2. Severity level (low, medium, high, critical)
3. 5-7 clear, actionable step-by-step instructions to handle this emergency
4. Keep instructions simple, calming, and direct

Emergency description: "${transcript}"

Be professional, calm, and prioritizing safety.`,
        response_json_schema: {
          type: "object",
          properties: {
            emergency_type: { type: "string" },
            severity: { type: "string", enum: ["low", "medium", "high", "critical"] },
            steps: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  step_number: { type: "number" },
                  instruction: { type: "string" },
                  completed: { type: "boolean" }
                }
              }
            }
          }
        }
      });

      // Create emergency session
      const session = await EmergencySession.create({
        transcript: transcript,
        emergency_type: analysis.emergency_type,
        severity: analysis.severity,
        guidance_steps: analysis.steps,
        status: "guiding"
      });

      // Navigate to guidance page
      navigate(createPageUrl("Guidance") + `?sessionId=${session.id}`);
    } catch (error) {
      console.error("Error processing emergency:", error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Hero Section */}
      <motion.div
        
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        
        className="text-center mb-12 max-w-2xl"
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-3xl flex items-center justify-center shadow-xl">
            <Heart className="w-8 h-8 text-white" fill="white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
            LifePal
          </h1>
        </div>
        
        <p className="text-xl text-gray-600 leading-relaxed mb-4">
          Your calm companion in emergencies
        </p>
        <p className="text-gray-500">
          Speak to get instant, step-by-step guidance for any emergency situation
        </p>
      </motion.div>

      {/* Voice Recorder */}
      <motion.div
        
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        
        className="w-full max-w-2xl"
      >
        <VoiceRecorder 
          onTranscriptComplete={handleTranscriptComplete}
          isProcessing={isProcessing}
        />
      </motion.div>

      {/* Feature Cards */}
      <motion.div
        
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl w-full"
      >
        {[
          { icon: Shield, label: "Safe & Secure", color: "from-blue-500 to-blue-600" },
          { icon: Clock, label: "Instant Help", color: "from-green-500 to-green-600" },
          { icon: Users, label: "Expert Guidance", color: "from-purple-500 to-purple-600" },
          { icon: Heart, label: "Always Here", color: "from-red-500 to-red-600" }
        ].map((feature, index) => (
          <motion.div
            key={index}
            
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-100 hover:shadow-lg transition-shadow"
          >
            <div className={`w-12 h-12 mx-auto mb-3 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center`}>
              <feature.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-medium text-gray-700">{feature.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Disclaimer */}
      <motion.p
        
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        
        className="text-xs text-gray-400 text-center mt-12 max-w-lg"
      >
        LifePal provides general guidance. Always call emergency services (911) for life-threatening situations.
      </motion.p>
    </div>
  );
}