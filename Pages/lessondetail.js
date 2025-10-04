import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FirstAidLesson } from "@/entities/FirstAidLesson";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle, Phone } from "lucide-react";
import { createPageUrl } from "@/utils";

export default function LessonDetail() {
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    loadLesson();
  }, []);

  const loadLesson = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const lessonId = urlParams.get("lessonId");
    
    if (lessonId) {
      const data = await FirstAidLesson.filter({ id: lessonId });
      if (data.length > 0) {
        setLesson(data[0]);
      }
    }
  };

  if (!lesson) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl("Library"))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Library
        </Button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{lesson.title}</h1>
          <div className="flex gap-2 mb-4">
            <Badge variant="outline" className="capitalize">{lesson.category}</Badge>
            <Badge className={
              lesson.severity === 'serious' ? 'bg-red-100 text-red-700' :
              lesson.severity === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
              'bg-blue-100 text-blue-700'
            }>
              {lesson.severity}
            </Badge>
          </div>
          <p className="text-gray-600 text-lg">{lesson.description}</p>
        </motion.div>

        {/* Steps */}
        <Card className="mb-6 border-none shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Treatment Steps</h2>
            <div className="space-y-4">
              {lesson.steps?.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                    {step.step_number}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 leading-relaxed mb-2">{step.instruction}</p>
                    {step.warning && (
                      <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-yellow-800">{step.warning}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* When to Call 911 */}
        {lesson.when_to_call_911 && (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">When to Call 911</h3>
                  <p className="text-gray-700">{lesson.when_to_call_911}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}