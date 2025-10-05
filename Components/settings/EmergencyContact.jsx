
import React, { useState, useEffect } from "react";
import { User, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User as UserSDK } from "@/entities/User";

export default function EmergencyContact() {
  const [user, setUser] = useState(null); // Added user state
  const [contact, setContact] = useState({ name: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await UserSDK.me();
        setUser(currentUser); // Set user state
        if (currentUser) { // Only set contact if currentUser exists
          setContact({
            name: currentUser.emergencyContactName || "",
            phone: currentUser.emergencyContactPhone || ""
          });
        }
      } catch (e) {
        console.error("Failed to fetch user data for emergency contact", e);
        setUser(null); // Ensure user is null on error
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await UserSDK.updateMyUserData({
        emergencyContactName: contact.name,
        emergencyContactPhone: contact.phone
      });
    } catch (e) {
      console.error("Failed to save emergency contact", e);
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
        <Card className="p-6 text-center">
            <Loader2 className="w-6 h-6 mx-auto animate-spin text-gray-400" />
            <p className="text-gray-600 mt-2">Loading...</p>
        </Card>
    );
  }

  // New conditional rendering for no user
  if (!user) {
    return (
      <Card className="p-6 text-center">
        <User className="w-8 h-8 mx-auto text-gray-400" />
        <p className="mt-4 text-gray-600">Please log in to manage your emergency contact.</p>
         <Button 
          onClick={() => UserSDK.login()} 
          className="mt-4 bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
        >
          Log In / Sign Up
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSave} className="space-y-4">
        <div className="flex items-start gap-4">
          <User className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <Label className="text-base font-semibold text-gray-900 mb-3 block">
              Primary Emergency Contact
            </Label>
            <div className="space-y-4">
              <div>
                <Label htmlFor="contact-name" className="text-sm">Contact Name</Label>
                <Input
                  id="contact-name"
                  value={contact.name}
                  onChange={(e) => setContact({ ...contact, name: e.target.value })}
                  placeholder="e.g., Jane Doe"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="contact-phone" className="text-sm">Contact Phone Number</Label>
                <Input
                  id="contact-phone"
                  type="tel"
                  value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                  className="mt-1"
                />
              </div>
            </div>
             <Button type="submit" disabled={saving} className="w-full mt-4 bg-[var(--primary)] hover:bg-[var(--primary-hover)]">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span className="ml-2">Save Contact</span>
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}
