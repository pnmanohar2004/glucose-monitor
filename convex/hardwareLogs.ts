import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get recent hardware readings
export const listLogs = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("hardwareLogs")
      .withIndex("by_datetime")
      .order("desc")
      .take(10);
  },
});

// Save a new hardware log
export const saveLog = mutation({
  args: {
    glucose: v.number(),
    datetime: v.optional(v.string()),
    bpm: v.optional(v.number()),
    spo2: v.optional(v.number()),
    rValue: v.optional(v.number()),
    type: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const datetime = args.datetime ?? new Date().toISOString();
    return await ctx.db.insert("hardwareLogs", {
      glucose: args.glucose,
      datetime,
      bpm: args.bpm,
      spo2: args.spo2,
      rValue: args.rValue,
      type: args.type,
      notes: args.notes,
    });
  },
});
