import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { TrainingSession } from "@/entities/TrainingSession";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Play, Check, X } from "lucide-react";

export default function TrainingSessionPage() {
  const navigate = useNavigate();
  const [trainingType, setTrainingType] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [compressionCount, setCompressionCount] = useState(0);
  const [startTime, setStartTime] = useState(null);

  const trainingSteps = {
    cpr_adult: [
      "Check the scene for safety",
      "Check for responsiveness - tap and shout",
      "Call 911 or ask someone to call",
      "Position hands on center of chest",
      "Perform 30 chest compressions (2 inches deep)",
      "Give 2 rescue breaths",
      "Continue cycles until help arrives"
    ],
    choking_adult: [
      "Ask 'Are you choking?'",
      "Stand behind the person",
      "Make a fist above navel",
      "Perform 5 quick upward thrusts",
      "Check if object is expelled",
      "Repeat if necessary",
      "Call 911 if unsuccessful"
    ]
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get("type") || "cpr_adult";
    setTrainingType(type);
  }, []);

  const handleStart = () => {
    setIsActive(true);
    setStartTime(Date.now());
    setCurrentStep(0);
    setScore(0);
  };

  const handleStepComplete = (success) => {
    if (success) {
      setScore(prev => prev + 1);
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleCompressionTap = () => {
    setCompressionCount(prev => prev + 1);
    
    // Simulate compression
    setTimeout(() => {
      if (compressionCount >= 29) {
        handleStepComplete(true);
        setCompressionCount(0);
      }
    }, 100);
  };

  const handleFinish = async () => {
    const duration = Math.floor((Date.now() - startTime) / 1000);
    const accuracy = (score / steps.length) * 100;
    
    await TrainingSession.create({
      training_type: trainingType,
      score: Math.round(accuracy),
      duration_seconds: duration,
      accuracy: accuracy,
      compression_rate: trainingType.includes('cpr') ? Math.round((compressionCount / duration) * 60) : 0,
      completed: true
    });

    navigate(createPageUrl("Training"));
  };

  const steps = trainingSteps[trainingType] || trainingSteps.cpr_adult;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl("Training"))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Training
        </Button>

        {!isActive ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="border-none shadow-2xl text-center">
              <CardContent className="p-12">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Play className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Ready to Practice?</h1>
                <p className="text-gray-600 mb-8">
                  Follow the steps and tap when you complete each action
                </p>
                <Button
                  onClick={handleStart}
                  size="lg"
                  className="h-14 px-8 text-lg bg-gradient-to-r from-cyan-500 to-teal-500"
                >
                  Start Training
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Progress */}
            <Card className="border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex justify-between mb-3">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm font-bold text-cyan-600">
                    Step {currentStep + 1} of {steps.length}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </CardContent>
            </Card>

            {/* Current Step */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <Card className="border-2 border-cyan-500 shadow-2xl">
                  <CardContent className="p-8 text-center">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">
                      {steps[currentStep]}
                    </h2>

                    {trainingType.includes('cpr') && currentStep === 4 ? (
                      <div className="space-y-6">
                        <div className="text-6xl font-bold text-cyan-600">
                          {compressionCount} / 30
                        </div>
                        <Button
                          onClick={handleCompressionTap}
                          size="lg"
                          className="w-full h-32 text-2xl bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                        >
                          TAP for Compression
                        </Button>
                        <p className="text-sm text-gray-500">
                          Tap at 100-120 compressions per minute
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          onClick={() => handleStepComplete(false)}
                          variant="outline"
                          size="lg"
                          className="h-20 border-2"
                        >
                          <X className="w-6 h-6 mr-2" />
                          Skip
                        </Button>
                        <Button
                          onClick={() => handleStepComplete(true)}
                          size="lg"
                          className="h-20 bg-gradient-to-r from-green-500 to-green-600"
                        >
                          <Check className="w-6 h-6 mr-2" />
                          Done
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Score */}
            <Card className="border-none shadow-lg bg-gradient-to-r from-cyan-50 to-teal-50">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Current Score</span>
                  <span className="text-3xl font-bold text-cyan-600">
                    {Math.round((score / steps.length) * 100)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}