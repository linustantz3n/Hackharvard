import React, { useState, useEffect } from "react";
import { Plus, Users, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FamilyMember } from "@/entities/FamilyMember";
import { PreparednessList } from "@/entities/PreparednessList";
import FamilyProfile from "../components/preparedness/FamilyProfile";
import ChecklistManager from "../components/preparedness/ChecklistManager";
import AddFamilyMember from "../components/preparedness/AddFamilyMember";
import EditFamilyMember from "../components/preparedness/EditFamilyMember";

export default function EmergencyContacts() {
  const [activeTab, setActiveTab] = useState("contacts");
  const [familyMembers, setFamilyMembers] = useState([]);
  const [checklists, setChecklists] = useState([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const members = await FamilyMember.list();
    const lists = await PreparednessList.list();
    setFamilyMembers(members);
    setChecklists(lists);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Plan & Contacts</h1>
            <p className="text-gray-600">Manage emergency contacts and preparedness checklists</p>
          </div>
          {activeTab === "contacts" && !showAddMember && !editingMember && (
            <Button
              onClick={() => setShowAddMember(true)}
              className="bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Contact
            </Button>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="contacts" className="gap-2">
              <Users className="w-4 h-4" />
              Contacts
            </TabsTrigger>
            <TabsTrigger value="checklists" className="gap-2">
              <ClipboardCheck className="w-4 h-4" />
              Checklists
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contacts">
            {editingMember ? (
              <EditFamilyMember
                member={editingMember}
                onClose={() => {
                  setEditingMember(null);
                  loadData();
                }}
              />
            ) : showAddMember ? (
              <AddFamilyMember
                onClose={() => {
                  setShowAddMember(false);
                  loadData();
                }}
              />
            ) : (
              <FamilyProfile
                members={familyMembers}
                onUpdate={loadData}
                onEdit={setEditingMember}
              />
            )}
          </TabsContent>

          <TabsContent value="checklists">
            <ChecklistManager
              checklists={checklists}
              onUpdate={loadData}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}