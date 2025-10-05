import { createClientFromRequest } from 'npm:@base44/sdk@0.7.1';
import Twilio from 'npm:twilio@5.2.2';

const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
const TWILIO_PHONE_NUMBER = Deno.env.get("TWILIO_PHONE_NUMBER");

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function normalizePhoneNumber(phone) {
    if (!phone) return null;
    const digitsOnly = phone.replace(/\D/g, '');
    if (phone.startsWith('+')) {
        return `+${digitsOnly}`;
    }
    if (digitsOnly.length === 10) {
        return `+1${digitsOnly}`;
    }
    if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
        return `+${digitsOnly}`;
    }
    return null; // Return null if format is unrecognized
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
        
        const contactPhone = normalizePhoneNumber(user.emergencyContactPhone);
        if (!contactPhone) {
            return new Response(JSON.stringify({ error: 'No valid primary emergency contact phone number is set for this user.' }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
        }

        const { sessionId } = await req.json();
        if (!sessionId) {
            return new Response(JSON.stringify({ error: 'sessionId is required' }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
        }

        const emergencySession = await base44.asServiceRole.entities.EmergencySession.get(sessionId);
        if (!emergencySession) {
            return new Response(JSON.stringify({ error: 'Emergency session not found' }), { status: 404, headers: { ...cors, "Content-Type": "application/json" } });
        }

        const emergencyType = emergencySession.emergency_type.replace(/_/g, ' ');
        const userName = user.full_name;
        const description = emergencySession.description;

        const message = `This is an automated alert from LifeLine. An emergency has been reported for ${userName}. The situation is a possible ${emergencyType}. The reported description is: ${description}. Please check on them immediately. Repeating: a possible ${emergencyType} has been reported for ${userName}.`;

        const twiml = `<Response><Say voice="Polly.Matthew-Neural" language="en-US">${message}</Say></Response>`;
        
        // The Twilio library is a factory function, not a class constructor with `new`.
        const twilioClient = Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

        const call = await twilioClient.calls.create({
            twiml: twiml,
            to: contactPhone,
            from: TWILIO_PHONE_NUMBER,
        });

        return new Response(JSON.stringify({ message: `Call initiated to ${contactPhone}.`, callSid: call.sid }), { status: 200, headers: { ...cors, "Content-Type": "application/json" } });

    } catch (error) {
        console.error("Error in callEmergencyContact function:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
    }
});