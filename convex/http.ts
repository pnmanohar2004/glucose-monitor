import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// POST /add-reading — receives ESP32 sensor payload
http.route({
  path: "/add-reading",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();

      // The ESP32 sends: device, glucose_mgdl, heart_rate, spo2, wifi_rssi, glucose_status, hr_status
      const glucose_mgdl = Number(body.glucose_mgdl);

      if (isNaN(glucose_mgdl)) {
        return new Response(
          JSON.stringify({ error: "Missing or invalid field: glucose_mgdl" }),
          { status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
        );
      }

      await ctx.runMutation(api.hardwareLogs.saveLog, {
        device:          typeof body.device === "string" ? body.device : undefined,
        glucose_mgdl,
        heart_rate:      body.heart_rate  !== undefined ? Number(body.heart_rate)  : undefined,
        spo2:            body.spo2        !== undefined ? Number(body.spo2)        : undefined,
        wifi_rssi:       body.wifi_rssi   !== undefined ? Number(body.wifi_rssi)   : undefined,
        glucose_status:  typeof body.glucose_status === "string" ? body.glucose_status : undefined,
        hr_status:       typeof body.hr_status      === "string" ? body.hr_status      : undefined,
        datetime:        typeof body.datetime       === "string" ? body.datetime        : undefined,
      });

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
      );
    } catch (err) {
      console.error("Webhook error:", err);
      return new Response(
        JSON.stringify({ error: "Invalid request", details: String(err) }),
        { status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
      );
    }
  }),
});

// GET /add-reading — health check
http.route({
  path: "/add-reading",
  method: "GET",
  handler: httpAction(async () => {
    return new Response(
      JSON.stringify({ status: "Webhook is live. POST your ESP32 data here." }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }),
});

export default http;
