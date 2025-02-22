import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { emojiRouter } from "~/server/api/routers/emoji";
import { GPTTextRouter } from "~/server/api/routers/text";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  emoji: emojiRouter,
  text: GPTTextRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
