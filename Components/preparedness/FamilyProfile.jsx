
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Heart, Pill, AlertTriangle, Phone, Users, Pencil } from "lucide-react";
import { format, differenceInYears } from "date-fns";
import { Button } from "@/components/ui/button";

export default function FamilyProfile({ members, onUpdate, onEdit }) {
  if (members.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Family Members Yet</h3>
        <p className="text-gray-600">Add family members to store their medical information</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {members.map((member) => {
        const age = member.date_of_birth 
          ? differenceInYears(new Date(), new Date(member.date_of_birth))
          : null;

        return (
          <Card key={member.id} className="p-6 relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => onEdit(member)}
            >
              <Pencil className="w-5 h-5" />
            </Button>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
                <User className="w-7 h-7 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline">{member.relationship}</Badge>
                  {age && <Badge variant="outline">{age} years old</Badge>}
                  <Badge className="bg-red-100 text-red-800">{member.blood_type}</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {member.allergies && member.allergies.length > 0 && (
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm mb-1">Allergies</p>
                    <p className="text-gray-700">{member.allergies.join(", ")}</p>
                  </div>
                </div>
              )}

              {member.medications && member.medications.length > 0 && (
                <div className="flex gap-3">
                  <Pill className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm mb-1">Medications</p>
                    <p className="text-gray-700">{member.medications.join(", ")}</p>
                  </div>
                </div>
              )}

              {member.medical_conditions && member.medical_conditions.length > 0 && (
                <div className="flex gap-3">
                  <Heart className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm mb-1">Medical Conditions</p>
                    <p className="text-gray-700">{member.medical_conditions.join(", ")}</p>
                  </div>
                </div>
              )}

              {member.emergency_contact && (
                <div className="flex gap-3">
                  <Phone className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm mb-1">Emergency Contact</p>
                    <p className="text-gray-700">{member.emergency_contact}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
