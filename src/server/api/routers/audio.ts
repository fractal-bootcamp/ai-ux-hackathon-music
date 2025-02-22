import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { audioGeneration } from "~/server/db/schema";

export const audioRouter = createTRPCRouter({
  createAudioGeneration: publicProcedure
    .input(
      z.object({
        textConversionId: z.string().uuid(),
        audioFileUrl: z.string().url(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const newAudioGeneration = await ctx.db.insert(audioGeneration).values({
        textConversionId: input.textConversionId,
        audioFileUrl: input.audioFileUrl,
      })
      .returning();

      return newAudioGeneration[0];
    }),
});
