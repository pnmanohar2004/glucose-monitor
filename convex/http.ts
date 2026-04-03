import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// Define a webhook that accepts POST requests
http.route({
  path: "/add-reading",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      // Parse the JSON body from the incoming request
      const payload = await request.json();

      // Handle ESP32 capitalized field names
      const glucoseValue = Number(payload.Glucose ?? payload.glucose);
      const bpmValue = payload.BPM;
      const spo2Value = payload.SpO2;
      const rValue = payload.R;
      
      if (isNaN(glucoseValue)) {
        return new Response(
          JSON.stringify({ error: "Missing required field: Glucose" }), 
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Call the existing mutation to save the new reading
      await ctx.runMutation(api.hardwareLogs.saveLog, {
        glucose: glucoseValue,
        datetime: payload.datetime ?? new Date().toISOString(),
        type: payload.type,
        notes: payload.notes,
        bpm: bpmValue !== undefined ? Number(bpmValue) : undefined,
        spo2: spo2Value !== undefined ? Number(spo2Value) : undefined,
        rValue: rValue !== undefined ? Number(rValue) : undefined,
      });

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Webhook error:", error);
      return new Response(
        JSON.stringify({ error: "Invalid request format" }), 
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});

// Add GET route for testing
http.route({
  path: "/add-reading",
  method: "GET",
  handler: httpAction(async () => {
    return new Response(JSON.stringify({ status: "Webhook is active" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

export default http;
