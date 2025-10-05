
import React, { useState } from "react";
import { ArrowLeft, Phone, Copy, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function EmergencyCallScript({ emergency, onBack, onClose }) {
  const [copied, setCopied] = useState(false);

  const script = `Emergency Type: ${emergency.emergency_type.replace(/_/g, ' ')}
Severity: ${emergency.severity}
Description: ${emergency.description || 'Medical emergency in progress'}

Please send help to my location immediately.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-red-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Call 911</h1>
        </div>

        <div className="space-y-4">
          <Card className="p-6 bg-[var(--emergency)] text-white border-none">
            <div className="text-center">
              <Phone className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Ready to Call</h2>
              <p className="mb-6">Stay calm and speak clearly to the operator</p>
              <Button
                onClick={() => window.location.href = 'tel:911'}
                className="w-full h-16 bg-white hover:bg-gray-100 text-[var(--emergency)] text-xl font-bold"
              >
                CALL 911 NOW
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">What to Say</h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                {script}
              </pre>
            </div>
            <Button
              variant="outline"
              onClick={handleCopy}
              className="w-full"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Script
                </>
              )}
            </Button>
          </Card>

          <Card className="p-6 bg-teal-50 border-teal-200">
            <h3 className="font-semibold text-[var(--primary)] mb-3">Important Tips</h3>
            <ul className="space-y-2 text-sm text-[var(--secondary)]">
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>Stay on the line until help arrives</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>Give your exact location and any landmarks</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>Answer all questions clearly and calmly</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">•</span>
                <span>Follow any instructions given by the operator</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
