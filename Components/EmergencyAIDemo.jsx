import React, { useState } from 'react';
import { AlertCircle, Mic, Phone, Volume2, TestTube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EmergencyAIService from '../services/EmergencyAIService';

export default function EmergencyAIDemo() {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const handleEmergencyInput = async () => {
    if (!input.trim() || isProcessing) return;

    setIsProcessing(true);
    try {
      const response = await EmergencyAIService.handleEmergency(input);
      setResult(response);
    } catch (error) {
      console.error('Emergency processing error:', error);
      setResult({
        success: false,
        error: error.message
      });
    }
    setIsProcessing(false);
  };

  const testScenarios = [
    {
      text: "Help! Someone collapsed and isn't breathing!",
      type: "CPR Emergency"
    },
    {
      text: "There's blood everywhere from a deep cut!",
      type: "Severe Bleeding"
    },
    {
      text: "Someone is choking and can't breathe!",
      type: "Choking Emergency"
    },
    {
      text: "Person is having a seizure and shaking uncontrollably!",
      type: "Seizure"
    },
    {
      text: "Someone got badly burned by hot oil!",
      type: "Burn Injury"
    }
  ];

  const testVoice = async () => {
    setIsProcessing(true);
    const success = await EmergencyAIService.testVoice();
    setIsProcessing(false);

    if (success) {
      alert('✅ ElevenLabs voice test successful!');
    } else {
      alert('❌ Voice test failed. Check your API key.');
    }
  };

  const getUrgencyColor = (level) => {
    switch (level?.toUpperCase()) {
      case 'CRITICAL': return 'text-red-600 bg-red-50 border-red-200';
      case 'HIGH': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'MODERATE': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'LOW': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getEmergencyIcon = (type) => {
    switch (type) {
      case 'CPR_NEEDED': return '💔';
      case 'SEVERE_BLEEDING': return '🩸';
      case 'CHOKING': return '🫁';
      case 'SEIZURE': return '⚡';
      case 'BURN': return '🔥';
      default: return '🚨';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <h1 className="text-3xl font-bold text-gray-900">Emergency AI Assistant</h1>
        </div>
        <p className="text-gray-600">
          AI-powered emergency guidance with ElevenLabs voice synthesis
        </p>
      </div>

      {/* Test Voice Button */}
      <div className="flex justify-center">
        <Button
          onClick={testVoice}
          disabled={isProcessing}
          variant="outline"
          className="flex items-center gap-2"
        >
          <TestTube className="w-4 h-4" />
          Test Voice System
        </Button>
      </div>

      {/* Emergency Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5" />
            Describe the Emergency
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Describe what's happening... (e.g., 'Someone collapsed and isn't breathing')"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleEmergencyInput()}
              className="flex-1"
            />
            <Button
              onClick={handleEmergencyInput}
              disabled={isProcessing || !input.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {isProcessing ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Volume2 className="w-4 h-4 mr-1" />
                  Get Help
                </>
              )}
            </Button>
          </div>

          {/* Test Scenarios */}
          <div>
            <p className="text-sm text-gray-600 mb-2">Quick test scenarios:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {testScenarios.map((scenario, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInput(scenario.text)}
                  className="text-left justify-start h-auto p-2"
                >
                  <div>
                    <div className="font-medium text-xs text-gray-500">{scenario.type}</div>
                    <div className="text-sm">{scenario.text}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.success ? (
                <>
                  <div className="text-2xl">
                    {getEmergencyIcon(result.analysis?.emergency_type)}
                  </div>
                  Emergency Analysis
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  Error
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.success ? (
              <>
                {/* Emergency Type & Urgency */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-500">Emergency Type</label>
                    <div className="text-lg font-semibold text-gray-900">
                      {result.analysis.emergency_type?.replace('_', ' ') || 'Unknown'}
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-500">Urgency Level</label>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getUrgencyColor(result.analysis.urgency_level)}`}>
                      {result.analysis.urgency_level || 'Unknown'}
                    </div>
                  </div>
                </div>

                {/* Immediate Action */}
                <div>
                  <label className="text-sm font-medium text-gray-500">Immediate Action</label>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                    <p className="text-blue-900 font-medium">
                      {result.analysis.immediate_action}
                    </p>
                  </div>
                </div>

                {/* Call 911 Alert */}
                {result.analysis.call_911 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-800">
                      <Phone className="w-5 h-5" />
                      <span className="font-semibold">Call 911 Immediately</span>
                    </div>
                    <p className="text-red-700 text-sm mt-1">
                      This situation requires immediate professional medical assistance.
                    </p>
                  </div>
                )}

                {/* Detailed Steps */}
                {result.analysis.detailed_steps && result.analysis.detailed_steps.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Step-by-Step Instructions</label>
                    <ol className="mt-2 space-y-2">
                      {result.analysis.detailed_steps.map((step, index) => (
                        <li key={index} className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-cyan-100 text-cyan-800 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <span className="text-gray-900">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Audio Status */}
                {result.audioPlayed && (
                  <div className="text-sm text-green-600 flex items-center gap-1">
                    <Volume2 className="w-4 h-4" />
                    Voice guidance played using ElevenLabs TTS
                  </div>
                )}
              </>
            ) : (
              <div className="text-red-600">
                <p className="font-medium">Processing Error:</p>
                <p className="text-sm">{result.error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Footer */}
      <div className="text-center text-sm text-gray-500">
        <p>⚠️ This is a demonstration system. Always call 911 for real emergencies.</p>
        <p>🤖 Powered by your InvokeLLM system + ElevenLabs voice synthesis</p>
      </div>
    </div>
  );
}