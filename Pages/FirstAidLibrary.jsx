import React, { useState } from "react";
import { Search, Droplet, Flame, Wind, Bandage, Heart, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FirstAidLesson from "../components/firstaid/FirstAidLesson";

export default function FirstAidLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLesson, setSelectedLesson] = useState(null);

  const lessons = [
    { 
      id: 1, 
      title: "Cuts & Scrapes", 
      icon: Bandage, 
      color: "bg-red-100 text-red-600",
      category: "Bleeding",
      duration: "3 min"
    },
    { 
      id: 2, 
      title: "Burns", 
      icon: Flame, 
      color: "bg-orange-100 text-orange-600",
      category: "Skin",
      duration: "4 min"
    },
    { 
      id: 3, 
      title: "Nosebleeds", 
      icon: Droplet, 
      color: "bg-blue-100 text-blue-600",
      category: "Bleeding",
      duration: "2 min"
    },
    { 
      id: 4, 
      title: "Sprains", 
      icon: AlertTriangle, 
      color: "bg-purple-100 text-purple-600",
      category: "Injuries",
      duration: "5 min"
    },
    { 
      id: 5, 
      title: "Choking", 
      icon: Wind, 
      color: "bg-red-100 text-red-600",
      category: "Breathing",
      duration: "6 min"
    },
    { 
      id: 6, 
      title: "Heart Attack", 
      icon: Heart, 
      color: "bg-pink-100 text-pink-600",
      category: "Cardiac",
      duration: "7 min"
    }
  ];

  const filteredLessons = lessons.filter(lesson =>
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedLesson) {
    return (
      <FirstAidLesson
        lesson={selectedLesson}
        onClose={() => setSelectedLesson(null)}
      />
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">First Aid Library</h1>
          <p className="text-gray-600">Learn how to handle common medical situations</p>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for injuries, symptoms, or conditions..."
            className="pl-12 h-14 text-lg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLessons.map((lesson) => {
            const Icon = lesson.icon;
            return (
              <Card
                key={lesson.id}
                onClick={() => setSelectedLesson(lesson)}
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${lesson.color}`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">{lesson.title}</h3>
                    <div className="flex gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">{lesson.category}</Badge>
                      <Badge variant="outline" className="text-xs">{lesson.duration}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">Tap to learn step-by-step treatment</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredLessons.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No lessons found for "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
}