import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus, Home, Car, FileText, Users, Phone } from "lucide-react";
import { PreparednessList } from "@/entities/PreparednessList";

export default function ChecklistManager({ checklists, onUpdate }) {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const categories = [
    { id: "home_kit", name: "Home Emergency Kit", icon: Home, color: "text-blue-600" },
    { id: "car_kit", name: "Car Emergency Kit", icon: Car, color: "text-green-600" },
    { id: "emergency_plan", name: "Emergency Plan", icon: FileText, color: "text-purple-600" },
    { id: "documents", name: "Important Documents", icon: FileText, color: "text-orange-600" },
    { id: "contacts", name: "Emergency Contacts", icon: Phone, color: "text-red-600" }
  ];

  const defaultItems = {
    home_kit: [
      "Water (1 gallon per person per day for 3 days)",
      "Non-perishable food (3-day supply)",
      "Battery-powered radio",
      "Flashlight and extra batteries",
      "First aid kit",
      "Medications (7-day supply)",
      "Multi-purpose tool",
      "Personal hygiene items",
      "Copies of important documents",
      "Cash and credit cards",
      "Emergency blanket",
      "Local maps"
    ],
    car_kit: [
      "Jumper cables",
      "Tire pressure gauge",
      "Spare tire and jack",
      "First aid kit",
      "Flashlight and batteries",
      "Non-perishable snacks",
      "Water bottles",
      "Emergency blanket",
      "Ice scraper and snow brush",
      "Flares or reflective triangles"
    ],
    emergency_plan: [
      "Evacuation routes identified",
      "Meeting place established",
      "Out-of-state contact designated",
      "Emergency numbers posted",
      "Practice drills completed",
      "Pet evacuation plan",
      "Special needs addressed"
    ],
    documents: [
      "Medical records and insurance",
      "Identification documents",
      "Bank account information",
      "Property documents",
      "Emergency contacts list",
      "Prescriptions list"
    ],
    contacts: [
      "Primary care physician",
      "Nearby hospital",
      "Poison control center",
      "Local police/fire",
      "Family emergency contact",
      "Insurance provider"
    ]
  };

  const handleCreateChecklist = async (categoryId) => {
    const items = defaultItems[categoryId].map(name => ({
      name,
      checked: false,
      notes: ""
    }));

    await PreparednessList.create({
      category: categoryId,
      items,
      last_reviewed: new Date().toISOString().split('T')[0]
    });

    onUpdate();
  };

  const handleToggleItem = async (checklist, itemIndex) => {
    const updatedItems = [...checklist.items];
    updatedItems[itemIndex].checked = !updatedItems[itemIndex].checked;

    await PreparednessList.update(checklist.id, {
      items: updatedItems,
      last_reviewed: new Date().toISOString().split('T')[0]
    });

    onUpdate();
  };

  return (
    <div className="space-y-4">
      {categories.map((category) => {
        const Icon = category.icon;
        const checklist = checklists.find(c => c.category === category.id);
        const isExpanded = expandedCategory === category.id;
        
        return (
          <Card key={category.id} className="overflow-hidden">
            <div
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center ${category.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    {checklist && (
                      <p className="text-sm text-gray-600">
                        {checklist.items.filter(i => i.checked).length} / {checklist.items.length} complete
                      </p>
                    )}
                  </div>
                </div>
                {!checklist && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCreateChecklist(category.id);
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create
                  </Button>
                )}
              </div>
            </div>

            {isExpanded && checklist && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="space-y-3">
                  {checklist.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Checkbox
                        checked={item.checked}
                        onCheckedChange={() => handleToggleItem(checklist, idx)}
                        className="mt-1"
                      />
                      <label className={`flex-1 cursor-pointer ${item.checked ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                        {item.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}