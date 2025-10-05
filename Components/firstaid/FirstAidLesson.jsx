import React, { useState } from "react";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { useTextToSpeech } from "@/components/hooks/useTextToSpeech";
import { firstAidContent } from "./firstAidContent";

export default function FirstAidLesson({ lesson, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const content = firstAidContent[lesson.id];

  const textToSpeak = content?.steps[currentStep];
  useTextToSpeech(textToSpeak, 'speaking');

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Error: Content not found for this lesson.</p>
        <Button onClick={onClose} className="ml-4">Go Back</Button>
      </div>
    );
  }

  const Icon = lesson.icon;
  const progress = ((currentStep + 1) / content.steps.length) * 100;
  
  const headerBgClass = lesson.color ? lesson.color.replace('text-', 'bg-').replace('100', '500') : 'bg-gray-500';

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
            <p className="text-sm text-gray-600">{lesson.category} • {lesson.duration}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <Card className={`p-6 ${headerBgClass} text-white border-none`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Icon className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-1">Treatment Guide</h2>
                <Progress value={progress} className="h-2 bg-white/30" />
              </div>
            </div>
            <p className="text-white/90 leading-relaxed">{content.overview}</p>
          </Card>

          <Card className="p-4 bg-red-50 border-red-200">
            <h3 className="font-semibold text-red-900 mb-2">When to Call 911</h3>
            <p className="text-sm text-red-800">{content.when_emergency}</p>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Treatment Steps</h3>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="mb-6"
              >
                <div className="flex gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {currentStep + 1}
                  </div>
                  <p className="text-lg text-gray-900 pt-2 leading-relaxed">
                    {content.steps[currentStep]}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex gap-3">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex-1 h-12"
                >
                  Previous
                </Button>
              )}
              {currentStep < content.steps.length - 1 ? (
                <Button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="flex-1 h-12 bg-blue-500 hover:bg-blue-600"
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  onClick={onClose}
                  className="flex-1 h-12 bg-green-500 hover:bg-green-600"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Complete
                </Button>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Prevention Tips</h3>
            <ul className="space-y-2">
              {content.prevention.map((tip, idx) => (
                <li key={idx} className="flex gap-3 text-gray-700">
                  <span className="text-green-500 font-bold">✓</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </Card>

          {content.warnings && (
            <Card className="p-6 bg-yellow-50 border-yellow-200">
              <h3 className="font-semibold text-yellow-900 mb-2">Important Note</h3>
              <p className="text-sm text-yellow-800">{content.warnings}</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}