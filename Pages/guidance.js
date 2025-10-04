import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { EmergencySession } from "@/entities/EmergencySession";
import { motion } from "framer-motion";
import { Phone, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import InstructionStep from "../components/emergency/InstructionStep";
import EmergencyAnimation from "../components/emergency/EmergencyAnimation";

export default function Guidance() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get("sessionId");
    
    if (sessionId) {
      const sessionData = await EmergencySession.filter({ id: sessionId });
      if (sessionData.length > 0) {
        setSession(sessionData[0]);
      }
    }
  };

  const handleStepComplete = async (stepNumber) => {
    setCompletedSteps(prev => [...prev, stepNumber]);
    
    // Update session
    const updatedSteps = session.guidance_steps.map(step => ({
      ...step,
      completed: completedSteps.includes(step.step_number) || step.step_number === stepNumber
    }));
    
    await EmergencySession.update(session.id, {
      guidance_steps: updatedSteps
    });

    // Move to next step
    if (stepNumber < session.guidance_steps.length) {
      setCurrentStep(stepNumber);
    }
  };

  const handleComplete = async () => {
    await EmergencySession.update(session.id, {
      status: "resolved"
    });
    navigate(createPageUrl("Summary") + `?sessionId=${session.id}`);
  };

  const handleEscalate = async () => {
    await EmergencySession.update(session.id, {
      status: "escalated",
      emergency_contacts_notified: true
    });
    navigate(createPageUrl("Summary") + `?sessionId=${session.id}`);
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500" />
      </div>
    );
  }

  const progress = (completedSteps.length / session.guidance_steps.length) * 100;
  const allStepsCompleted = completedSteps.length === session.guidance_steps.length;

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Emergency Type Animation */}
        <motion.div
          
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          
        >
          <EmergencyAnimation 
            emergencyType={session.emergency_type}
            severity={session.severity}
          />
        </motion.div>

        {/* Emergency Info */}
        <motion.div
          
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2 capitalize">
            {session.emergency_type} Emergency
          </h1>
          <div className="flex items-center justify-center gap-2">
            <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${
              session.severity === 'critical' ? 'bg-red-100 text-red-700' :
              session.severity === 'high' ? 'bg-orange-100 text-orange-700' :
              session.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {session.severity.toUpperCase()} Severity
            </span>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          
          className="mb-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Your Progress</span>
              <span className="text-sm font-bold text-cyan-600">
                {completedSteps.length} of {session.guidance_steps.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </motion.div>

        {/* Instruction Steps */}
        <div className="space-y-4 mb-8">
          {session.guidance_steps.map((step, index) => (
            <InstructionStep
              key={index}
              step={step}
              stepNumber={step.step_number}
              isActive={currentStep === index}
              isCompleted={completedSteps.includes(step.step_number)}
              onComplete={handleStepComplete}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <motion.div
          
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          
          className="sticky bottom-6 bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-gray-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={handleEscalate}
              variant="outline"
              className="h-14 text-base font-medium border-2 border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call Emergency Services
            </Button>
            
            <Button
              onClick={handleComplete}
              disabled={!allStepsCompleted}
              className="h-14 text-base font-medium bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
            >
              {allStepsCompleted ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Situation Resolved
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Complete All Steps First
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}