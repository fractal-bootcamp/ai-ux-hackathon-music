import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { emojiRequests } from "~/server/db/schema";

export const emojiRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        emojiString: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Insert the emoji request into the database
      const result = await ctx.db.insert(emojiRequests).values({
        emojiString: input.emojiString,
      })
      .returning();

      return result[0];
    }),
});
