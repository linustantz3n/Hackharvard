import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Check, Loader2, Play, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { protocols } from "./protocols.js";
import { callExternalModel } from "@/functions/callExternalModel";
import { useTextToSpeech } from "@/components/hooks/useTextToSpeech";

export default function ChecklistFlow({ onClose, initialDescription }) {
  const [status, setStatus] = useState("categorizing"); // categorizing, viewing, complete
  const [protocol, setProtocol] = useState(null);
  const [protocolKey, setProtocolKey] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  
  const textToSpeak = protocol?.steps[currentStep];
  const [speaking, setSpeaking] = useState(false);

  useTextToSpeech(speaking ? textToSpeak : null, 'speaking', {
      onEnd: () => setSpeaking(false)
  });

  const categorizeEmergency = useCallback(async () => {
    if (!initialDescription) {
      onClose();
      return;
    }
    try {
      const { data: classification } = await callExternalModel({ text: initialDescription });
      if (classification.prediction && classification.prediction !== "Unknown" && protocols[classification.prediction]) {
        setProtocolKey(classification.prediction);
        setProtocol(protocols[classification.prediction]);
      } else {
        setProtocol({ name: "General Guidance", steps: ["Stay calm.", "Describe your situation to emergency services.", "Follow their instructions carefully."] });
      }
      setStatus("viewing");
    } catch (error) {
      console.error("Error during categorization:", error);
      setProtocol({ name: "Guidance Unavailable", steps: ["Could not load guidance. Please call 911 immediately if this is an emergency."] });
      setStatus("viewing");
    }
  }, [initialDescription, onClose]);

  useEffect(() => {
    categorizeEmergency();
  }, [categorizeEmergency]);

  const handleNext = () => {
    setCompletedSteps(prev => new Set(prev).add(currentStep));
    setSpeaking(false); // Stop speaking on manual navigation
    if (currentStep < protocol.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setSpeaking(false); // Stop speaking on manual navigation
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  if (status === "categorizing") {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
              <Loader2 className="w-12 h-12 animate-spin text-[var(--primary)] mb-4"/>
              <p className="text-lg text-gray-700">Analyzing situation...</p>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="p-4 border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <Badge className="bg-[var(--emergency)] text-white px-4 py-2 text-sm font-semibold">
            CHECKLIST MODE
          </Badge>
        </div>
        <div className="text-center mt-2">
            <h1 className="text-xl font-bold text-gray-800">{protocol?.name || "Emergency Guidance"}</h1>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <Accordion type="single" collapsible value={`item-${currentStep}`} onValueChange={(val) => {
            const stepIndex = parseInt(val.split('-')[1]);
            setCurrentStep(stepIndex);
        }}>
          {protocol?.steps.map((step, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="bg-white border rounded-lg mb-2 shadow-sm">
              <AccordionTrigger className="px-4 text-left">
                <div className="flex items-center gap-3">
                  {completedSteps.has(index) ? (
                    <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4"/>
                    </div>
                  ) : (
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${currentStep === index ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                        {index + 1}
                    </div>
                  )}
                  <span className="flex-1 font-medium text-gray-800">{step}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <Card className="p-4 bg-gray-50 border-dashed">
                    <p className="text-gray-600">Follow the instruction above. Click 'Next Step' when you are ready to proceed.</p>
                </Card>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="p-4 border-t bg-white/80 backdrop-blur-sm sticky bottom-0 z-10 space-y-3">
         <Button onClick={() => setSpeaking(true)} variant="outline" className="w-full h-12" disabled={speaking}>
            {speaking ? <Loader2 className="w-5 h-5 mr-2 animate-spin"/> : <Volume2 className="w-5 h-5 mr-2" />}
            Read Step Aloud
        </Button>
        <div className="flex gap-3">
            <Button onClick={handlePrevious} variant="outline" className="flex-1 h-14" disabled={currentStep === 0}>
                Previous
            </Button>
            <Button onClick={handleNext} className="flex-1 h-14 bg-[var(--primary)] hover:bg-[var(--primary-hover)]" disabled={currentStep === protocol.steps.length - 1}>
                Next Step
            </Button>
        </div>
      </div>
    </div>
  );
}