
import React, { useState, useEffect } from "react";
import { User as UserIcon, Heart, Pill, AlertTriangle, Edit, Save, Loader2, Calendar, Droplet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "@/entities/User";
import { format, differenceInYears } from "date-fns";

const ProfileField = ({ icon: Icon, label, value, color }) => (
  <div className="flex gap-3">
    <Icon className={`w-5 h-5 ${color} flex-shrink-0 mt-0.5`} />
    <div>
      <p className="font-medium text-gray-900 text-sm mb-1">{label}</p>
      <p className="text-gray-700">{value || "Not set"}</p>
    </div>
  </div>
);

export default function MedicalProfile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        setFormData({
          full_name: currentUser.full_name || "",
          date_of_birth: currentUser.date_of_birth ? currentUser.date_of_birth.split('T')[0] : "",
          blood_type: currentUser.blood_type || "Unknown",
          allergies: currentUser.allergies ? currentUser.allergies.join(", ") : "",
          medications: currentUser.medications ? currentUser.medications.join(", ") : "",
          medical_conditions: currentUser.medical_conditions ? currentUser.medical_conditions.join(", ") : ""
        });
      } catch (e) {
        console.error("Failed to fetch user", e);
        // If fetching user fails, user will remain null, handled by the new !user check
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const updatedData = {
      ...formData,
      allergies: formData.allergies.split(",").map(a => a.trim()).filter(a => a),
      medications: formData.medications.split(",").map(m => m.trim()).filter(m => m),
      medical_conditions: formData.medical_conditions.split(",").map(c => c.trim()).filter(c => c)
    };
    await User.updateMyUserData(updatedData);
    const refreshedUser = await User.me();
    setUser(refreshedUser);
    setSaving(false);
    setEditing(false);
  };

  if (loading) {
    return (
      <Card className="p-6 text-center">
        <Loader2 className="w-8 h-8 mx-auto animate-spin text-gray-400" />
        <p className="mt-2 text-gray-600">Loading Profile...</p>
      </Card>
    );
  }

  // New check for unauthenticated users
  if (!user) {
    return (
      <Card className="p-6 text-center">
        <UserIcon className="w-8 h-8 mx-auto text-gray-400" />
        <p className="mt-4 text-gray-600">Please log in to view and manage your Medical ID.</p>
        <Button 
          onClick={() => User.login()} 
          className="mt-4 bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
        >
          Log In / Sign Up
        </Button>
      </Card>
    );
  }

  if (editing) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Edit Medical ID</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} required />
            </div>
            <div>
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" type="date" value={formData.date_of_birth} onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})} />
            </div>
            <div>
              <Label htmlFor="blood">Blood Type</Label>
              <Select value={formData.blood_type} onValueChange={(v) => setFormData({...formData, blood_type: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="allergies">Allergies (comma-separated)</Label>
            <Input id="allergies" value={formData.allergies} onChange={(e) => setFormData({...formData, allergies: e.target.value})} />
          </div>
          <div>
            <Label htmlFor="medications">Medications (comma-separated)</Label>
            <Input id="medications" value={formData.medications} onChange={(e) => setFormData({...formData, medications: e.target.value})} />
          </div>
          <div>
            <Label htmlFor="conditions">Medical Conditions (comma-separated)</Label>
            <Input id="conditions" value={formData.medical_conditions} onChange={(e) => setFormData({...formData, medical_conditions: e.target.value})} />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setEditing(false)} className="w-full">Cancel</Button>
            <Button type="submit" disabled={saving} className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)]">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span className="ml-2">Save</span>
            </Button>
          </div>
        </form>
      </Card>
    );
  }
  
  const age = user.date_of_birth ? `${differenceInYears(new Date(), new Date(user.date_of_birth))} years old` : "Not set";

  return (
    <Card className="p-6 relative">
      <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={() => setEditing(true)}>
        <Edit className="w-5 h-5 text-gray-500" />
      </Button>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">My Medical ID</h3>
      <div className="space-y-4">
        <ProfileField icon={UserIcon} label="Name" value={user.full_name} color="text-gray-500" />
        <ProfileField icon={Calendar} label="Age" value={age} color="text-gray-500" />
        <ProfileField icon={Droplet} label="Blood Type" value={user.blood_type} color="text-red-500" />
        <ProfileField icon={AlertTriangle} label="Allergies" value={user.allergies?.join(', ')} color="text-orange-500" />
        <ProfileField icon={Pill} label="Medications" value={user.medications?.join(', ')} color="text-blue-500" />
        <ProfileField icon={Heart} label="Medical Conditions" value={user.medical_conditions?.join(', ')} color="text-purple-500" />
      </div>
    </Card>
  );
}
