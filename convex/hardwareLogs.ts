import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get recent hardware readings (latest 50)
export const listLogs = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("hardwareLogs")
      .withIndex("by_datetime")
      .order("desc")
      .take(50);
  },
});

// Save a new hardware log — matches exact ESP32 payload fields
export const saveLog = mutation({
  args: {
    device: v.optional(v.string()),
    glucose_mgdl: v.number(),
    heart_rate: v.optional(v.number()),
    spo2: v.optional(v.number()),
    wifi_rssi: v.optional(v.number()),
    glucose_status: v.optional(v.string()),
    hr_status: v.optional(v.string()),
    datetime: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const datetime = args.datetime ?? new Date().toISOString();
    return await ctx.db.insert("hardwareLogs", {
      device: args.device,
      glucose_mgdl: args.glucose_mgdl,
      heart_rate: args.heart_rate,
      spo2: args.spo2,
      wifi_rssi: args.wifi_rssi,
      glucose_status: args.glucose_status,
      hr_status: args.hr_status,
      datetime,
    });
  },
});
