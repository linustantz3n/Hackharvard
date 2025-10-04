import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { PreparednessChecklist, FamilyMember } from "@/entities/all";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, CheckSquare, Shield, Home } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function Preparedness() {
  const navigate = useNavigate();
  const [checklists, setChecklists] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const checklistData = await PreparednessChecklist.list();
    const familyData = await FamilyMember.list();
    setChecklists(checklistData);
    setFamilyMembers(familyData);
  };

  const quickStats = [
    {
      icon: CheckSquare,
      label: "Checklists",
      value: checklists.length,
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Users,
      label: "Family",
      value: familyMembers.length,
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Shield,
      label: "Ready",
      value: "0%",
      color: "from-green-500 to-green-600"
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Preparedness Hub</h1>
          <p className="text-gray-600">Keep your family safe and ready for emergencies</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {quickStats.map((stat, index) => (
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

        {/* Family Members Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className="border-none shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Family Profiles
                </span>
                <Button
                  onClick={() => navigate(createPageUrl("AddFamily"))}
                  size="sm"
                  className="bg-gradient-to-r from-purple-500 to-purple-600"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {familyMembers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No family members added yet</p>
                  <p className="text-sm mt-1">Add profiles to track medical info</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {familyMembers.map((member) => (
                    <div key={member.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                        {member.name[0]}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.relationship} • Age {member.age}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Checklists Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-none shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-cyan-50">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5" />
                  Emergency Checklists
                </span>
                <Button
                  onClick={() => navigate(createPageUrl("CreateChecklist"))}
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-cyan-500"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  New
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {checklists.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No checklists created yet</p>
                  <p className="text-sm mt-1">Start with an emergency kit checklist</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {checklists.map((checklist) => {
                    const progress = (checklist.completed_count / checklist.total_count) * 100;
                    return (
                      <div key={checklist.id} className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{checklist.title}</h4>
                            <p className="text-sm text-gray-500 capitalize">{checklist.category?.replace(/_/g, ' ')}</p>
                          </div>
                          <span className="text-sm font-medium text-cyan-600">
                            {checklist.completed_count}/{checklist.total_count}
                          </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}