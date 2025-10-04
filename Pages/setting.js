import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Volume2, Accessibility, Download, Bell, Shield } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Customize your LifeLine experience</p>
        </motion.div>

        <div className="space-y-4">
          {[
            {
              icon: Globe,
              title: "Language",
              description: "English (US)",
              color: "from-blue-500 to-blue-600"
            },
            {
              icon: Volume2,
              title: "Voice Guidance",
              description: "Enable AI voice instructions",
              color: "from-purple-500 to-purple-600",
              toggle: true
            },
            {
              icon: Accessibility,
              title: "Accessibility",
              description: "Large text, high contrast",
              color: "from-green-500 to-green-600"
            },
            {
              icon: Download,
              title: "Offline Mode",
              description: "Download content for offline use",
              color: "from-orange-500 to-orange-600"
            },
            {
              icon: Bell,
              title: "Notifications",
              description: "Emergency alerts and reminders",
              color: "from-red-500 to-red-600",
              toggle: true
            },
            {
              icon: Shield,
              title: "Privacy & Data",
              description: "Manage your data and privacy",
              color: "from-gray-500 to-gray-600"
            }
          ].map((setting, index) => (
            <motion.div
              key={setting.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="border-none shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${setting.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <setting.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{setting.title}</h3>
                      <p className="text-sm text-gray-600">{setting.description}</p>
                    </div>
                    {setting.toggle && <Switch />}
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