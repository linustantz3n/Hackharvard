import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { EmergencySession } from "@/entities/EmergencySession";
import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, Clock, FileText, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function Summary() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);

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

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500" />
      </div>
    );
  }

  const isResolved = session.status === "resolved";
  const completedSteps = session.guidance_steps?.filter(s => s.completed).length || 0;

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          
          className="text-center mb-8"
        >
          <div className={`w-20 h-20 mx-auto mb-4 rounded-3xl flex items-center justify-center ${
            isResolved ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-orange-500 to-red-600'
          }`}>
            {isResolved ? (
              <CheckCircle className="w-10 h-10 text-white" />
            ) : (
              <AlertTriangle className="w-10 h-10 text-white" />
            )}
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isResolved ? 'Situation Resolved' : 'Emergency Escalated'}
          </h1>
          <p className="text-gray-600">
            {isResolved 
              ? 'Great job following the guidance. Here\'s a summary of what happened.' 
              : 'Emergency services have been notified. Here\'s what happened.'}
          </p>
        </motion.div>

        {/* Emergency Summary */}
        <motion.div
          
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          
        >
          <Card className="mb-6 shadow-lg border-none">
            <CardHeader className="border-b bg-gradient-to-r from-cyan-50 to-teal-50">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Emergency Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Type</p>
                  <Badge className="bg-cyan-100 text-cyan-700 hover:bg-cyan-200 capitalize">
                    {session.emergency_type}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Severity</p>
                  <Badge className={`capitalize ${
                    session.severity === 'critical' ? 'bg-red-100 text-red-700' :
                    session.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                    session.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {session.severity}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Date & Time</p>
                  <p className="font-medium text-gray-900 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {format(new Date(session.created_date), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Steps Completed</p>
                  <p className="font-medium text-gray-900">
                    {completedSteps} of {session.guidance_steps?.length || 0}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Your Description</p>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-700 italic">"{session.transcript}"</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Steps Taken */}
        <motion.div
          
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          
        >
          <Card className="mb-6 shadow-lg border-none">
            <CardHeader className="border-b bg-gradient-to-r from-cyan-50 to-teal-50">
              <CardTitle>Guidance Provided</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {session.guidance_steps?.map((step, index) => (
                  <div 
                    key={index}
                    className={`flex items-start gap-3 p-4 rounded-xl ${
                      step.completed ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                      step.completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      {step.completed ? <CheckCircle className="w-4 h-4" /> : step.step_number}
                    </div>
                    <p className="text-gray-700 pt-1">{step.instruction}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          
          className="flex flex-col gap-3"
        >
          <Button
            onClick={() => navigate(createPageUrl("Landing"))}
            className="h-14 text-base font-medium bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white"
          >
            <Home className="w-5 h-5 mr-2" />
            Return to Home
          </Button>
          
          {!isResolved && (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4">
                <p className="text-sm text-red-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  If this was a life-threatening emergency, ensure you've contacted emergency services (911).
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}