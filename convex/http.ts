import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
    },
  });
}

function optionalNumber(value: unknown) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

http.route({
  path: "/add-reading",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    let rawBody = "";

    try {
      rawBody = await request.text();
      console.log("ESP32 raw payload received:", rawBody);

      const body = JSON.parse(rawBody);
      console.log("Parsed body keys:", Object.keys(body).join(", "));

      const glucose_mgdl =
        body.glucose_mgdl !== undefined
          ? Number(body.glucose_mgdl)
          : body.glucose !== undefined
            ? Number(body.glucose)
            : NaN;

      if (Number.isNaN(glucose_mgdl)) {
        console.error("No glucose value found in payload:", rawBody);
        return jsonResponse({
          warning: "No glucose value found, data not saved",
          received: body,
        });
      }

      const datetime =
        typeof body.datetime === "string" ? body.datetime : new Date().toISOString();

      // ESP32 sends temperature as "temperature_c", fallback to "temperature"
      const temperatureRaw =
        body.temperature_c !== undefined ? body.temperature_c : body.temperature;

      const mutationArgs = Object.fromEntries(
        Object.entries({
          device: optionalString(body.device) ?? "ESP32",
          glucose_mgdl,
          heart_rate: optionalNumber(body.heart_rate),
          spo2: optionalNumber(body.spo2),
          wifi_rssi: optionalNumber(body.wifi_rssi),
          temperature: optionalNumber(temperatureRaw),
          glucose_status: optionalString(body.glucose_status),
          hr_status: optionalString(body.hr_status),
          datetime,
        }).filter(([, value]) => value !== undefined),
      );

      await ctx.runMutation(internal.hardwareLogs.saveLogInternal, mutationArgs);

      console.log("Saved reading: glucose_mgdl =", glucose_mgdl, "at", datetime);

      return jsonResponse({ success: true, glucose_mgdl, datetime });
    } catch (err) {
      console.error("Webhook error. Raw body was:", rawBody, "Error:", err);
      return jsonResponse({ received: true, error: String(err) }, 500);
    }
  }),
});

http.route({
  path: "/add-reading",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }),
});

http.route({
  path: "/add-reading",
  method: "GET",
  handler: httpAction(async () => {
    return jsonResponse({ status: "Webhook is live. POST your ESP32 data here." });
  }),
});

export default http;
