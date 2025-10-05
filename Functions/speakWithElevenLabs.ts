import { createClientFromRequest } from 'npm:@base44/sdk@0.7.1';
import { encode } from "https://deno.land/std@0.208.0/encoding/base64.ts";

const VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // Default voice 'Rachel'
const API_URL_BASE = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?optimize_streaming_latency=1`;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Helper to concatenate ArrayBuffers
function concatenateAudio(buffers) {
    const totalLength = buffers.reduce((acc, val) => acc + val.byteLength, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const buffer of buffers) {
        result.set(new Uint8Array(buffer), offset);
        offset += buffer.byteLength;
    }
    return result.buffer;
}

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: cors });
    }

    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        if (!user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { "Content-Type": "application/json", ...cors } });
        }

        const { texts } = await req.json(); // Expect an array of texts
        if (!texts || !Array.isArray(texts) || texts.length === 0) {
            return new Response(JSON.stringify({ error: 'An array of texts is required' }), { status: 400, headers: { "Content-Type": "application/json", ...cors } });
        }

        const apiKey = Deno.env.get("ELEVENLABS_API_KEY");
        if (!apiKey) {
            throw new Error('ElevenLabs API key is not configured');
        }

        const requestBodyBase = {
            model_id: 'eleven_turbo_v2',
            voice_settings: { stability: 0.7, similarity_boost: 0.2 },
        };

        // Create parallel requests to ElevenLabs
        const audioPromises = texts.map(text =>
            fetch(API_URL_BASE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'xi-api-key': apiKey },
                body: JSON.stringify({ ...requestBodyBase, text }),
            }).then(response => {
                if (!response.ok) {
                    throw new Error(`ElevenLabs API error: ${response.statusText}`);
                }
                return response.arrayBuffer();
            })
        );

        // Wait for all audio buffers to be generated
        const audioBuffers = await Promise.all(audioPromises);

        // Concatenate all buffers into one
        const combinedAudioBuffer = concatenateAudio(audioBuffers);

        if (combinedAudioBuffer.byteLength === 0) {
            return new Response(JSON.stringify({ error: 'ElevenLabs returned empty audio data.' }), { status: 500, headers: { "Content-Type": "application/json", ...cors } });
        }

        const audioBase64 = encode(combinedAudioBuffer);

        return new Response(JSON.stringify({ audio_base64: audioBase64 }), { status: 200, headers: { "Content-Type": "application/json", ...cors } });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json", ...cors } });
    }
});