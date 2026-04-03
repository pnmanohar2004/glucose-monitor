import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  readings: defineTable({
    glucose: v.number(),
    datetime: v.string(),
    type: v.optional(v.string()),
    notes: v.optional(v.string()),
  }).index("by_datetime", ["datetime"]),
  hardwareLogs: defineTable({
    device: v.optional(v.string()),
    glucose_mgdl: v.optional(v.number()),
    glucose: v.optional(v.number()),
    heart_rate: v.optional(v.number()),
    spo2: v.optional(v.number()),
    wifi_rssi: v.optional(v.number()),
    glucose_status: v.optional(v.string()),
    hr_status: v.optional(v.string()),
    datetime: v.string(),
  }).index("by_datetime", ["datetime"]),
});
