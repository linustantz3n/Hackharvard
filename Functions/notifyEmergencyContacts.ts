import { createClientFromRequest } from 'npm:@base44/sdk@0.7.1';

const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
const TWILIO_PHONE_NUMBER = Deno.env.get("TWILIO_PHONE_NUMBER");
const TWILIO_API_URL = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Function to normalize a phone number to E.164 format
function normalizePhoneNumber(phone) {
    if (!phone) return null;

    // Remove all non-digit characters from the string.
    const digitsOnly = phone.replace(/\D/g, '');

    // If the number is 10 digits (e.g., 2487563656), assume it's a US number and prepend "+1".
    if (digitsOnly.length === 10) {
        return `+1${digitsOnly}`;
    }
    
    // If the number is 11 digits and starts with "1" (e.g., 12487563656), prepend "+".
    if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
        return `+${digitsOnly}`;
    }
    
    // If it's already in a valid E.164 format but had other characters, it will be returned correctly.
    // e.g. "+44 123 456 7890" becomes "+441234567890" which is valid.
    if (phone.startsWith('+')) {
        return `+${digitsOnly}`;
    }

    // Return null if format is unrecognized
    return null;
}


Deno.serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: cors });
    }

    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        if (!user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...cors, "Content-Type": "application/json" } });
        }

        const { sessionId } = await req.json();
        if (!sessionId) {
            return new Response(JSON.stringify({ error: 'sessionId is required' }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
        }

        const emergencySession = await base44.asServiceRole.entities.EmergencySession.get(sessionId);
        if (!emergencySession) {
            return new Response(JSON.stringify({ error: 'Emergency session not found' }), { status: 404, headers: { ...cors, "Content-Type": "application/json" } });
        }

        const familyMembers = await base44.asServiceRole.entities.FamilyMember.filter({ created_by: user.email });
        
        const validContacts = familyMembers
            .map(member => normalizePhoneNumber(member.emergency_contact))
            .filter(contact => contact);

        const uniqueContacts = [...new Set(validContacts)];

        if (uniqueContacts.length === 0) {
            console.log("No valid emergency contacts found for user.");
            return new Response(JSON.stringify({ message: 'No valid emergency contacts found to notify.' }), { status: 200, headers: { ...cors, "Content-Type": "application/json" } });
        }

        const emergencyType = emergencySession.emergency_type.replace(/_/g, ' ').toUpperCase();
        const messageBody = `LifeLine Alert: An emergency (${emergencyType}) has been reported for ${user.full_name}. Description: "${emergencySession.description}". The user is receiving first-aid guidance.`;

        const authHeader = 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);
        
        const notificationPromises = uniqueContacts.map(contactPhone => {
            const body = new URLSearchParams();
            body.append('To', contactPhone);
            body.append('From', TWILIO_PHONE_NUMBER);
            body.append('Body', messageBody);
            
            return fetch(TWILIO_API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: body.toString()
            });
        });

        const results = await Promise.all(notificationPromises);
        
        results.forEach(async (res) => {
            if (!res.ok) {
                const errorBody = await res.json().catch(() => res.text());
                console.error(`Failed to send SMS via Twilio. Status: ${res.status}. Error:`, errorBody);
            }
        });

        return new Response(JSON.stringify({ message: `Attempted to notify ${uniqueContacts.length} contacts.` }), { status: 200, headers: { ...cors, "Content-Type": "application/json" } });
    } catch (error) {
        console.error("Error in notifyEmergencyContacts function:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
    }
});