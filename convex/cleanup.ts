import { mutation } from "./_generated/server";

// Deletes ALL documents in hardwareLogs — run once to clear old schema data
export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("hardwareLogs").collect();
    let deleted = 0;
    for (const doc of all) {
      await ctx.db.delete(doc._id);
      deleted++;
    }
    return { deleted };
  },
});
