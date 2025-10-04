import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Wind, Activity, Trophy, Target, Zap } from "lucide-react";

export default function Training() {
  const navigate = useNavigate();

  const trainingModules = [
    {
      id: "cpr_adult",
      title: "Adult CPR",
      description: "Learn chest compressions and rescue breathing for adults",
      icon: Heart,
      color: "from-red-500 to-red-600",
      difficulty: "Advanced",
      duration: "10 min"
    },
    {
      id: "cpr_child",
      title: "Child CPR",
      description: "Modified CPR technique for children ages 1-8",
      icon: Heart,
      color: "from-pink-500 to-pink-600",
      difficulty: "Advanced",
      duration: "10 min"
    },
    {
      id: "choking_adult",
      title: "Choking Adult",
      description: "Heimlich maneuver and back blows practice",
      icon: Wind,
      color: "from-blue-500 to-blue-600",
      difficulty: "Intermediate",
      duration: "5 min"
    },
    {
      id: "choking_child",
      title: "Choking Child",
      description: "Age-appropriate choking response techniques",
      icon: Wind,
      color: "from-cyan-500 to-cyan-600",
      difficulty: "Intermediate",
      duration: "5 min"
    },
    {
      id: "aed_use",
      title: "AED Usage",
      description: "Automated External Defibrillator operation",
      icon: Activity,
      color: "from-purple-500 to-purple-600",
      difficulty: "Beginner",
      duration: "7 min"
    }
  ];

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Training Mode</h1>
          <p className="text-gray-600">Practice life-saving skills with interactive simulations</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: Trophy, label: "Completed", value: "0", color: "from-yellow-400 to-yellow-500" },
            { icon: Target, label: "Accuracy", value: "0%", color: "from-green-400 to-green-500" },
            { icon: Zap, label: "Streak", value: "0", color: "from-purple-400 to-purple-500" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-none shadow-lg">
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 mx-auto mb-2 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Training Modules */}
        <div className="space-y-4">
          {trainingModules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
            >
              <Card 
                className="cursor-pointer hover:shadow-xl transition-all border-none group"
                onClick={() => navigate(createPageUrl("TrainingSession") + `?type=${module.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${module.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <module.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{module.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{module.description}</p>
                      <div className="flex gap-2">
                        <Badge variant="outline">{module.difficulty}</Badge>
                        <Badge variant="outline">{module.duration}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}