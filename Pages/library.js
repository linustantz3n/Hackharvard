import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { FirstAidLesson } from "@/entities/FirstAidLesson";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Droplet, Flame, AlertTriangle, Bone, HeartPulse } from "lucide-react";

const categoryIcons = {
  cuts: Droplet,
  burns: Flame,
  nosebleeds: Droplet,
  sprains: Bone,
  fractures: Bone,
  poisoning: AlertTriangle,
  allergic_reactions: AlertTriangle,
  choking: HeartPulse,
  breathing: HeartPulse,
  other: AlertTriangle
};

export default function Library() {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    const data = await FirstAidLesson.list();
    setLessons(data);
  };

  const categories = ["all", "cuts", "burns", "nosebleeds", "sprains", "fractures", "choking"];

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || lesson.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">First Aid Library</h1>
          <p className="text-gray-600">Learn how to handle common medical situations</p>
        </motion.div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search treatments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`cursor-pointer capitalize px-4 py-2 whitespace-nowrap ${
                selectedCategory === category 
                  ? 'bg-cyan-500 hover:bg-cyan-600' 
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Lessons Grid */}
        {filteredLessons.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No lessons found</p>
              <p className="text-sm text-gray-400 mt-2">Try a different search term</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredLessons.map((lesson, index) => {
              const Icon = categoryIcons[lesson.category] || AlertTriangle;
              return (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className="cursor-pointer hover:shadow-lg transition-all border-none group"
                    onClick={() => navigate(createPageUrl("LessonDetail") + `?lessonId=${lesson.id}`)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <Icon className="w-6 h-6 text-cyan-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-2">{lesson.title}</h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {lesson.description}
                          </p>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="capitalize">
                              {lesson.category}
                            </Badge>
                            <Badge className={
                              lesson.severity === 'serious' ? 'bg-red-100 text-red-700' :
                              lesson.severity === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-blue-100 text-blue-700'
                            }>
                              {lesson.severity}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}