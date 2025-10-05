import { createClientFromRequest } from 'npm:@base44/sdk@0.7.1';

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req) => {
  try {
    // CORS preflight
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    // This function can be called publicly, so we don't check for a user session.
    // However, we still need to initialize the client for potential service role operations if needed later.
    const base44 = createClientFromRequest(req);

    const modelUrl = "https://lifelineapi-mrjo.onrender.com/classify";
    //const modelUrl = Deno.env.get("MODEL_URL");
    if (!modelUrl) {
      return new Response(JSON.stringify({ error: "External model URL is not configured in secrets." }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }

    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "This endpoint only accepts POST requests." }), {
        status: 405,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }

    const requestBody = await req.json();

    const modelResponse = await fetch(modelUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!modelResponse.ok) {
      const errorBody = await modelResponse.text();
      return new Response(JSON.stringify({
        error: `Error from external model: ${modelResponse.status} ${modelResponse.statusText}`,
        details: errorBody.slice(0, 2000),
      }), {
        status: modelResponse.status,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }

    const data = await modelResponse.json().catch(async () => {
      // If parsing as JSON fails, return the raw text
      const txt = await modelResponse.text();
      return { raw: txt };
    });

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json", ...cors },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e?.message ?? "Internal error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...cors },
    });
  }
});