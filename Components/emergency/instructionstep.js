import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InstructionStep({ step, stepNumber, isActive, isCompleted, onComplete }) {
  return (
    <motion.div
      
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: stepNumber * 0.1 }}
      
    >
      <Card className={`transition-all duration-300 ${
        isActive 
          ? 'border-2 border-cyan-500 shadow-lg bg-white' 
          : isCompleted 
            ? 'border border-green-300 bg-green-50/50' 
            : 'border border-gray-200 bg-white/50'
      }`}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Step Number/Status */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              isCompleted 
                ? 'bg-green-500 text-white' 
                : isActive 
                  ? 'bg-gradient-to-br from-cyan-500 to-teal-500 text-white' 
                  : 'bg-gray-100 text-gray-400'
            }`}>
              {isCompleted ? (
                <Check className="w-5 h-5" />
              ) : (
                <span>{stepNumber}</span>
              )}
            </div>

            {/* Instruction Content */}
            <div className="flex-1 space-y-3">
              <p className={`text-lg leading-relaxed ${
                isActive ? 'text-gray-900 font-medium' : 'text-gray-600'
              }`}>
                {step.instruction}
              </p>

              {isActive && !isCompleted && (
                <motion.div
                  
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  
                >
                  <Button
                    onClick={() => onComplete(stepNumber)}
                    className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Mark Complete
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}