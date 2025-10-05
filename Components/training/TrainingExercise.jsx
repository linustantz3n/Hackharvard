
import React, { useState, useCallback } from "react";
import { ArrowLeft, Play, CheckCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrainingProgress } from "@/entities/TrainingProgress";
import { motion, AnimatePresence } from "framer-motion";
import { useTextToSpeech } from "@/components/hooks/useTextToSpeech";
import CprTrainer from "./CprTrainer";
import { trainingContent } from "./trainingContent";

export default function TrainingExercise({ exercise, onClose }) {
  const [phase, setPhase] = useState("intro");
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());
  
  const content = trainingContent[exercise.id];

  const textToSpeak = phase === 'training' && content?.steps[currentStep] ? content.steps[currentStep].action : (phase === 'intro' ? content?.introduction : null);
  useTextToSpeech(textToSpeak, phase === 'training' || phase === 'intro' ? 'speaking' : 'paused');

  const handleStepComplete = () => {
    // Ensure content and content.steps exist before performing calculations
    if (!content || !content.steps || content.steps.length === 0) {
      console.warn("Content or steps not available for score calculation.");
      return;
    }

    const newScore = score + (100 / content.steps.length);
    setScore(newScore);
    
    if (currentStep < content.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    const duration = Math.floor((Date.now() - startTime) / 1000);
    try {
      await TrainingProgress.create({
        exercise_type: exercise.id,
        score: Math.round(score),
        duration_seconds: duration,
        completed: true,
        achievements: score >= 80 ? ["Expert"] : score >= 60 ? ["Proficient"] : ["Practiced"]
      });
    } catch(e) {
      console.warn("Could not save progress. User may not be logged in.", e);
    }
    setPhase("complete");
  };

  const Icon = exercise.icon;

  const headerBgClass = exercise.color ? exercise.color.replace('text-', 'bg-').replace('100', '500') : 'bg-gray-500';

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Error: Content not found for this exercise.</p>
        <Button onClick={onClose} className="ml-4">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{exercise.title}</h1>
            <div className="flex gap-2 mt-1">
              <Badge variant="outline">{exercise.difficulty}</Badge>
              <Badge variant="outline">{exercise.duration}</Badge>
            </div>
          </div>
        </div>

        {/* Intro Phase */}
        {phase === "intro" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Card className={`p-8 ${headerBgClass} text-white border-none`}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center">
                  <Icon className="w-10 h-10" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1">Ready to Practice?</h2>
                  <p className="text-white/90">Follow each step carefully</p>
                </div>
              </div>
              <p className="text-white/90 leading-relaxed mb-6">{content.introduction}</p>
              <Button
                onClick={() => setPhase("training")}
                className="w-full h-14 bg-white hover:bg-gray-100 text-gray-900 font-semibold"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Training
              </Button>
            </Card>

            {(exercise.id === "aed_usage" || exercise.id === "choking_child" || exercise.id === "cpr_child") && (
              <Card className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3 text-lg">Instructional Video</h3>
                <div className="aspect-video w-full overflow-hidden rounded-lg">
                  <iframe
                    className="w-full h-full"
                    src={
                      exercise.id === "aed_usage"
                        ? "https://www.youtube.com/embed/2PJR0JyLPZY?si=iofiMYqMlN1iuBkm"
                        : exercise.id === "choking_child"
                        ? "https://www.youtube.com/embed/GymXjJJ7Ugo?si=n8ydMainQ1GcvR_b"
                        : "https://www.youtube.com/embed/YeDwkE9p52M?si=9MvAqSZQzwT_CjjK"
                    }
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </div>
              </Card>
            )}

            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Common Mistakes to Avoid</h3>
              <ul className="space-y-2">
                {content.mistakes.map((mistake, idx) => (
                  <li key={idx} className="flex gap-3 text-gray-700">
                    <span className="text-red-500 font-bold">✗</span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        )}

        {/* CPR Training Phase */}
        {phase === "training" && exercise.id === 'cpr_adult' && (
           <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <CprTrainer onComplete={(finalScore) => {
              setScore(finalScore);
              handleFinish(); // Use handleFinish to save progress and switch phase
            }} />
          </motion.div>
        )}

        {/* Standard Training Phase (for non-CPR exercises) */}
        {phase === "training" && exercise.id !== 'cpr_adult' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <Card className="p-6">
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Step {currentStep + 1} of {content.steps.length}</span>
                  <span>Score: {Math.round(score)}%</span>
                </div>
                <Progress value={(currentStep / content.steps.length) * 100} className="h-2" />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="mb-6">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-xl mb-4">
                      {currentStep + 1}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {content.steps[currentStep].action}
                    </h3>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-3">
                      <p className="text-sm font-medium text-blue-900">
                        ⏱️ {content.steps[currentStep].timing}
                      </p>
                    </div>
                    <p className="text-gray-600">
                      💡 {content.steps[currentStep].tip}
                    </p>
                  </div>

                  <Button
                    onClick={handleStepComplete}
                    className="w-full h-14 bg-purple-500 hover:bg-purple-600 text-lg font-semibold"
                  >
                    {currentStep < content.steps.length - 1 ? "Next Step" : "Finish Training"}
                  </Button>
                </motion.div>
              </AnimatePresence>
            </Card>
          </motion.div>
        )}

        {/* Complete Phase */}
        {phase === "complete" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <Card className="p-8 bg-gradient-to-br from-green-500 to-emerald-600 text-white border-none text-center">
              <CheckCircle className="w-20 h-20 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">Well Done!</h2>
              <p className="text-white/90 mb-6">You've completed this training exercise</p>
              <div className="bg-white/20 rounded-xl p-6 mb-6">
                <div className="text-5xl font-bold mb-2">{Math.round(score)}%</div>
                <div className="text-white/90">Your Score</div>
              </div>
              <p className="text-sm text-white/80">{content.success_criteria}</p>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setPhase("intro");
                  setCurrentStep(0);
                  setScore(0);
                }}
                className="h-14"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Practice Again
              </Button>
              <Button
                onClick={onClose}
                className="h-14 bg-blue-500 hover:bg-blue-600"
              >
                Back to Training
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
