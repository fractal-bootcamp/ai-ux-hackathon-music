import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { textConversions } from "~/server/db/schema";

export const GPTTextRouter = createTRPCRouter({
    create: publicProcedure
        .input(
            z.object({
                emojiRequestId: z.string().uuid(),
                text: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const textConversion = await ctx.db.insert(textConversions)
                .values({
                    emojiRequestId: input.emojiRequestId,
                    text: input.text,
                })
                .returning({ id: textConversions.id });

            if (!textConversion[0]?.id) {
                throw new Error("Failed to create text conversion");
            }

            return { id: textConversion[0].id };
        }),
});
