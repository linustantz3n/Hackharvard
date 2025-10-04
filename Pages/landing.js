import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { EmergencySession } from "@/entities/EmergencySession";
import { InvokeLLM } from "@/integrations/Core";
import { motion } from "framer-motion";
import { AlertCircle, BookOpen, Dumbbell, Shield, Heart, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import VoiceRecorder from "../components/emergency/VoiceRecorder";

export default function Landing() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTranscriptComplete = async (transcript) => {
    setIsProcessing(true);

    try {
      const analysis = await InvokeLLM({
        prompt: `You are an emergency response AI assistant. Analyze this emergency situation and provide:
1. Emergency type (medical, injury, fire, cardiac, breathing, safety, choking, bleeding, other)
2. Severity level (low, medium, high, critical)
3. 5-8 clear, calming step-by-step instructions to handle this emergency safely
4. Keep instructions simple, reassuring, and prioritizing safety

Emergency description: "${transcript}"

Be professional, calm, and clear.`,
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

      const session = await EmergencySession.create({
        transcript: transcript,
        emergency_type: analysis.emergency_type,
        severity: analysis.severity,
        guidance_steps: analysis.steps,
        status: "guiding"
      });

      navigate(createPageUrl("Guidance") + `?sessionId=${session.id}`);
    } catch (error) {
      console.error("Error processing emergency:", error);
      setIsProcessing(false);
    }
  };

  const quickActions = [
    { 
      title: "First Aid Library", 
      description: "Learn treatments for common injuries",
      icon: BookOpen, 
      color: "from-blue-500 to-blue-600",
      path: "Library"
    },
    { 
      title: "Training Mode", 
      description: "Practice CPR & emergency skills",
      icon: Dumbbell, 
      color: "from-purple-500 to-purple-600",
      path: "Training"
    },
    { 
      title: "Preparedness", 
      description: "Checklists & family profiles",
      icon: Shield, 
      color: "from-green-500 to-green-600",
      path: "Preparedness"
    },
  ];

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-3xl flex items-center justify-center shadow-xl">
              <Heart className="w-8 h-8 text-white" fill="white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
              LifeLine
            </h1>
          </div>
          
          <p className="text-xl text-gray-600 mb-2">
            Your AI-powered emergency companion
          </p>
          <p className="text-gray-500">
            Get instant guidance for medical emergencies
          </p>
        </motion.div>

        {/* Emergency Alert */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Life-Threatening Emergency?</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    If someone is unconscious, not breathing, or severely injured, call 911 immediately.
                  </p>
                  <a href="tel:911" className="text-red-600 font-semibold text-sm hover:underline">
                    → Call 911 Now
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Voice Recorder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <Card className="border-none shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-cyan-500 to-teal-500 p-6 text-white text-center">
              <AlertCircle className="w-8 h-8 mx-auto mb-2" />
              <h2 className="text-2xl font-bold">Emergency Voice Input</h2>
              <p className="text-cyan-100 mt-1">Describe what's happening</p>
            </div>
            <CardContent className="p-8">
              <VoiceRecorder 
                onTranscriptComplete={handleTranscriptComplete}
                isProcessing={isProcessing}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card 
                className="cursor-pointer hover:shadow-xl transition-all duration-300 border-none group"
                onClick={() => navigate(createPageUrl(action.path))}
              >
                <CardContent className="p-6">
                  <div className={`w-14 h-14 mb-4 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}