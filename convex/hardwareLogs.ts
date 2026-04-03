import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";

function buildHardwareLogDoc(args: {
  device?: string;
  glucose_mgdl: number;
  heart_rate?: number;
  spo2?: number;
  wifi_rssi?: number;
  glucose_status?: string;
  hr_status?: string;
  datetime: string;
}) {
  return Object.fromEntries(
    Object.entries({
      device: args.device,
      glucose_mgdl: args.glucose_mgdl,
      heart_rate: args.heart_rate,
      spo2: args.spo2,
      wifi_rssi: args.wifi_rssi,
      glucose_status: args.glucose_status,
      hr_status: args.hr_status,
      datetime: args.datetime,
    }).filter(([, value]) => value !== undefined),
  );
}

function normalizeHardwareLog(doc: {
  _id: unknown;
  _creationTime: number;
  device?: string;
  glucose_mgdl?: number;
  glucose?: number;
  heart_rate?: number;
  spo2?: number;
  wifi_rssi?: number;
  glucose_status?: string;
  hr_status?: string;
  datetime: string;
}) {
  return {
    ...doc,
    glucose_mgdl: doc.glucose_mgdl ?? doc.glucose ?? 0,
  };
}

// Get recent hardware readings (latest 50, newest first)
export const listLogs = query({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db
      .query("hardwareLogs")
      .withIndex("by_datetime")
      .order("desc")
      .take(50);
    return docs.map(normalizeHardwareLog);
  },
});

// Internal mutation called by the HTTP webhook — bypasses public API validation
export const saveLogInternal = internalMutation({
  args: {
    device:         v.optional(v.string()),
    glucose_mgdl:   v.number(),
    heart_rate:     v.optional(v.number()),
    spo2:           v.optional(v.number()),
    wifi_rssi:      v.optional(v.number()),
    glucose_status: v.optional(v.string()),
    hr_status:      v.optional(v.string()),
    datetime:       v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("hardwareLogs", buildHardwareLogDoc(args));
  },
});

// Public mutation (for manual use from frontend if needed)
export const saveLog = mutation({
  args: {
    device:         v.optional(v.string()),
    glucose_mgdl:   v.number(),
    heart_rate:     v.optional(v.number()),
    spo2:           v.optional(v.number()),
    wifi_rssi:      v.optional(v.number()),
    glucose_status: v.optional(v.string()),
    hr_status:      v.optional(v.string()),
    datetime:       v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const datetime = args.datetime ?? new Date().toISOString();
    return await ctx.db.insert(
      "hardwareLogs",
      buildHardwareLogDoc({
        device: args.device,
        glucose_mgdl: args.glucose_mgdl,
        heart_rate: args.heart_rate,
        spo2: args.spo2,
        wifi_rssi: args.wifi_rssi,
        glucose_status: args.glucose_status,
        hr_status: args.hr_status,
        datetime,
      }),
    );
  },
});

export const migrateLegacyLogs = mutation({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db
      .query("hardwareLogs")
      .withIndex("by_datetime")
      .take(200);

    let migrated = 0;

    for (const doc of docs) {
      if (doc.glucose_mgdl !== undefined || doc.glucose === undefined) {
        continue;
      }

      await ctx.db.replace(
        "hardwareLogs",
        doc._id,
        buildHardwareLogDoc({
          device: doc.device,
          glucose_mgdl: doc.glucose,
          heart_rate: doc.heart_rate,
          spo2: doc.spo2,
          wifi_rssi: doc.wifi_rssi,
          glucose_status: doc.glucose_status,
          hr_status: doc.hr_status,
          datetime: doc.datetime,
        }),
      );
      migrated++;
    }

    return { migrated };
  },
});
