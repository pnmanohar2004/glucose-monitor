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

      // Ensure glucose is a number
      const glucoseValue = Number(payload.glucose);
      
      if (isNaN(glucoseValue) || !payload.datetime) {
        return new Response(
          JSON.stringify({ error: "Missing required fields: glucose and datetime" }), 
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Call the existing mutation to save the new reading
      await ctx.runMutation(api.readings.saveReading, {
        glucose: glucoseValue,
        datetime: payload.datetime,
        type: payload.type,
        notes: payload.notes,
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

export default http;
