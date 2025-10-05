
import React from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function InstructionStep({ instruction, isActive, isCompleted, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <Card
        onClick={onClick}
        className={`p-6 cursor-pointer transition-all ${
          isActive 
            ? "border-teal-500 border-2 shadow-lg bg-teal-50" 
            : isCompleted 
            ? "border-green-300 bg-green-50" 
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <div className="flex gap-4">
          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${
            isCompleted 
              ? "bg-green-500 text-white" 
              : isActive 
              ? "bg-[var(--primary)] text-white" 
              : "bg-gray-200 text-gray-600"
          }`}>
            {isCompleted ? <CheckCircle className="w-6 h-6" /> : instruction.step}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-3 mb-2">
              <p className={`font-medium ${isActive ? "text-lg" : "text-base"} text-gray-900`}>
                {instruction.instruction}
              </p>
              {instruction.critical && (
                <AlertCircle className="w-5 h-5 text-[var(--emergency)] flex-shrink-0" />
              )}
            </div>
            {instruction.critical && (
              <p className="text-sm text-[var(--emergency)] font-medium">Critical Step</p>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
