
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, Volume2, Accessibility, Download, Bell, Shield, User as UserIcon, MessageSquare, ListChecks } from "lucide-react";
import MedicalProfile from "../components/settings/MedicalProfile";
import EmergencyContact from "../components/settings/EmergencyContact";

const SETTINGS_KEY = 'lifeline-settings';

export default function Settings() {
  const [settings, setSettings] = useState({
    language: "en",
    voiceGuidance: true,
    largeText: false,
    hapticFeedback: true,
    notifications: true,
    offlineMode: false,
    emergencyInterfaceStyle: "chatbot" // New setting
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
  };

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Customize your LifeLine experience</p>
        </div>

        <div className="space-y-6">
          {/* Medical ID */}
          <MedicalProfile />

          {/* Emergency Contact */}
          <EmergencyContact />

          {/* Language */}
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <Globe className="w-6 h-6 text-blue-500 mt-1" />
              <div className="flex-1">
                <Label className="text-base font-semibold text-gray-900 mb-3 block">
                  Language
                </Label>
                <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="zh">中文</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* UI Style -- NEW */}
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <ListChecks className="w-6 h-6 text-indigo-500 mt-1" />
              <div className="flex-1">
                <Label className="text-base font-semibold text-gray-900 mb-3 block">
                  Emergency UI Style
                </Label>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {settings.emergencyInterfaceStyle === 'chatbot' ? 'Chatbot (Dynamic)' : 'Checklist (Manual)'}
                    </p>
                    <p className="text-sm text-gray-600">Choose your preferred guide style</p>
                  </div>
                  <div className="relative flex items-center">
                    <MessageSquare className="w-5 h-5 text-gray-500 absolute left-[-28px]"/>
                    <Switch
                      checked={settings.emergencyInterfaceStyle === 'checklist'}
                      onCheckedChange={(checked) => handleSettingChange('emergencyInterfaceStyle', checked ? 'checklist' : 'chatbot')}
                    />
                    <ListChecks className="w-5 h-5 text-gray-500 absolute right-[-28px]"/>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Voice & Audio */}
          <Card className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <Volume2 className="w-6 h-6 text-purple-500 mt-1" />
              <div className="flex-1">
                <Label className="text-base font-semibold text-gray-900 mb-3 block">
                  Voice & Audio
                </Label>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Voice Guidance</p>
                      <p className="text-sm text-gray-600">Spoken instructions during emergencies</p>
                    </div>
                    <Switch
                      checked={settings.voiceGuidance}
                      onCheckedChange={(checked) => handleSettingChange('voiceGuidance', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Haptic Feedback</p>
                      <p className="text-sm text-gray-600">Vibration on key actions</p>
                    </div>
                    <Switch
                      checked={settings.hapticFeedback}
                      onCheckedChange={(checked) => handleSettingChange('hapticFeedback', checked)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Accessibility */}
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <Accessibility className="w-6 h-6 text-green-500 mt-1" />
              <div className="flex-1">
                <Label className="text-base font-semibold text-gray-900 mb-3 block">
                  Accessibility
                </Label>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Large Text</p>
                    <p className="text-sm text-gray-600">Increase font size throughout app</p>
                  </div>
                  <Switch
                    checked={settings.largeText}
                    onCheckedChange={(checked) => handleSettingChange('largeText', checked)}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <Bell className="w-6 h-6 text-orange-500 mt-1" />
              <div className="flex-1">
                <Label className="text-base font-semibold text-gray-900 mb-3 block">
                  Notifications
                </Label>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Emergency Alerts</p>
                    <p className="text-sm text-gray-600">Get notified of local emergencies</p>
                  </div>
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Offline */}
          <Card className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <Download className="w-6 h-6 text-blue-500 mt-1" />
              <div className="flex-1">
                <Label className="text-base font-semibold text-gray-900 mb-3 block">
                  Offline Content
                </Label>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium text-gray-900">Offline Mode</p>
                    <p className="text-sm text-gray-600">Access saved content without internet</p>
                  </div>
                  <Switch
                    checked={settings.offlineMode}
                    onCheckedChange={(checked) => handleSettingChange('offlineMode', checked)}
                  />
                </div>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Essential Content (12 MB)
                </Button>
              </div>
            </div>
          </Card>

          {/* Privacy */}
          <Card className="p-6 bg-gray-50">
            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 text-gray-500 mt-1" />
              <div className="flex-1">
                <Label className="text-base font-semibold text-gray-900 mb-2 block">
                  Privacy & Data
                </Label>
                <p className="text-sm text-gray-600 mb-4">
                  Your medical data is encrypted and stored locally on your device. We never share your personal information.
                </p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    View Privacy Policy
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                    Delete All Data
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
