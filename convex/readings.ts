import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all readings sorted by datetime ascending (for chart)
export const listReadings = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("readings")
      .withIndex("by_datetime")
      .order("asc")
      .collect();
  },
});

// Save a new reading
export const saveReading = mutation({
  args: {
    glucose: v.number(),
    datetime: v.string(),
    type: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("readings", {
      glucose: args.glucose,
      datetime: args.datetime,
      type: args.type,
      notes: args.notes,
    });
  },
});

// Delete a reading by its Convex document ID
export const deleteReading = mutation({
  args: { id: v.id("readings") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// One-time migration: move local storage data into Convex
export const migrateReadings = mutation({
  args: {
    readings: v.array(
      v.object({
        glucose: v.number(),
        datetime: v.string(),
        type: v.optional(v.string()),
        notes: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    let count = 0;
    for (const r of args.readings) {
      await ctx.db.insert("readings", r);
      count++;
    }
    return { migrated: count };
  },
});
