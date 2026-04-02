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
    glucose: v.number(),
    datetime: v.string(),
    type: v.optional(v.string()),
    notes: v.optional(v.string()),
  }).index("by_datetime", ["datetime"]),
});
