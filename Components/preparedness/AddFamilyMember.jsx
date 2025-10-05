
import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FamilyMember } from "@/entities/FamilyMember";

export default function AddFamilyMember({ onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    date_of_birth: "",
    blood_type: "Unknown",
    allergies: "",
    medications: "",
    medical_conditions: "",
    emergency_contact: ""
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    await FamilyMember.create({
      ...formData,
      allergies: formData.allergies.split(",").map(a => a.trim()).filter(a => a),
      medications: formData.medications.split(",").map(m => m.trim()).filter(m => m),
      medical_conditions: formData.medical_conditions.split(",").map(c => c.trim()).filter(c => c)
    });
    
    onClose();
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h2 className="text-2xl font-bold text-gray-900">Add Family Member</h2>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="relationship">Relationship *</Label>
              <Input
                id="relationship"
                value={formData.relationship}
                onChange={(e) => setFormData({...formData, relationship: e.target.value})}
                placeholder="e.g., Spouse, Child, Parent"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="blood">Blood Type</Label>
              <Select
                value={formData.blood_type}
                onValueChange={(value) => setFormData({...formData, blood_type: value})}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"].map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="allergies">Allergies (comma-separated)</Label>
            <Input
              id="allergies"
              value={formData.allergies}
              onChange={(e) => setFormData({...formData, allergies: e.target.value})}
              placeholder="e.g., Penicillin, Peanuts"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="medications">Current Medications (comma-separated)</Label>
            <Input
              id="medications"
              value={formData.medications}
              onChange={(e) => setFormData({...formData, medications: e.target.value})}
              placeholder="e.g., Aspirin 81mg, Lisinopril 10mg"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="conditions">Medical Conditions (comma-separated)</Label>
            <Input
              id="conditions"
              value={formData.medical_conditions}
              onChange={(e) => setFormData({...formData, medical_conditions: e.target.value})}
              placeholder="e.g., Diabetes, Hypertension"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="emergency">Emergency Contact</Label>
            <Input
              id="emergency"
              type="tel"
              value={formData.emergency_contact}
              onChange={(e) => setFormData({...formData, emergency_contact: e.target.value})}
              placeholder="(555) 123-4567"
              className="mt-1"
            />
          </div>

          <Button
            type="submit"
            disabled={saving}
            className="w-full h-12 bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
          >
            {saving ? "Saving..." : "Add Family Member"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
