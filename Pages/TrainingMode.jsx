
import React, { useState, useCallback } from "react";
import { Heart, Wind, Zap, Trophy, Target, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrainingProgress } from "@/entities/TrainingProgress";
import TrainingExercise from "../components/training/TrainingExercise";

// Define exercises outside the component since it's static data
const exercises = [
  {
    id: "cpr_adult",
    title: "CPR - Adult",
    icon: Heart,
    color: "bg-red-100 text-red-600",
    difficulty: "Advanced",
    duration: "10 min",
    description: "Learn chest compressions and rescue breathing"
  },
  {
    id: "cpr_child",
    title: "CPR - Child",
    icon: Heart,
    color: "bg-pink-100 text-pink-600",
    difficulty: "Advanced",
    duration: "8 min",
    description: "Modified CPR technique for children"
  },
  {
    id: "choking_adult",
    title: "Choking - Adult",
    icon: Wind,
    color: "bg-blue-100 text-blue-600",
    difficulty: "Intermediate",
    duration: "5 min",
    description: "Heimlich maneuver and back blows"
  },
  {
    id: "choking_child",
    title: "Choking - Child",
    icon: Wind,
    color: "bg-cyan-100 text-cyan-600",
    difficulty: "Intermediate",
    duration: "5 min",
    description: "Safe choking relief for children"
  },
  {
    id: "aed_usage",
    title: "AED Usage",
    icon: Zap,
    color: "bg-yellow-100 text-yellow-600",
    difficulty: "Beginner",
    duration: "6 min",
    description: "Using an automated external defibrillator"
  }
];

export default function TrainingMode() {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [stats, setStats] = useState({ total: 0, completed: 0 });
  const [completedSet, setCompletedSet] = useState(new Set());

  const loadStats = useCallback(async () => {
    try {
      const progress = await TrainingProgress.list();
      
      const uniqueCompleted = new Set(
        progress.filter(p => p.completed).map(p => p.exercise_type)
      );
      
      setCompletedSet(uniqueCompleted);
      setStats({
        total: exercises.length,
        completed: uniqueCompleted.size
      });
    } catch (error) {
      console.warn("Could not load training stats, likely because user is not logged in. This is expected.", error);
      // Fallback for logged-out users, preventing a crash.
      setStats({ total: exercises.length, completed: 0 });
      setCompletedSet(new Set());
    }
  }, []);

  React.useEffect(() => {
    loadStats();
  }, [loadStats]);


  if (selectedExercise) {
    return (
      <TrainingExercise
        exercise={selectedExercise}
        onClose={() => {
          setSelectedExercise(null);
          loadStats();
        }}
      />
    );
  }

  // Calculate percentage for progress bar, handling division by zero if exercises array is empty.
  const progressPercentage = exercises.length > 0 ? (stats.completed / exercises.length) * 100 : 0;

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Training Mode</h1>
          <p className="text-gray-600">Practice life-saving skills with interactive exercises</p>
        </div>

        {/* Stats */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white border-none">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">Your Progress</h2>
              <p className="text-white/80">Keep practicing to save lives</p>
            </div>
            <Trophy className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Exercises Completed</span>
              <span className="font-semibold">{stats.completed} / {exercises.length}</span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-3 bg-white/20"
            />
          </div>
        </Card>

        {/* Exercises */}
        <div className="space-y-3">
          {exercises.map((exercise) => {
            const Icon = exercise.icon;
            const isCompleted = completedSet.has(exercise.id);
            return (
              <Card
                key={exercise.id}
                onClick={() => setSelectedExercise(exercise)}
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${exercise.color}`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg mb-1">{exercise.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{exercise.description}</p>
                      </div>
                      <Star className={`w-5 h-5 transition-colors ${isCompleted ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        <Target className="w-3 h-3 mr-1" />
                        {exercise.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs">{exercise.duration}</Badge>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
