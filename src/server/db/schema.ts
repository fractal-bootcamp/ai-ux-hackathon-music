import {
  pgTable,
  timestamp,
  text,
  uuid,
} from "drizzle-orm/pg-core";

// User Generated Requests (in Emoji Format)
export const emojiRequests = pgTable("emoji_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  emojiString: text("emoji_string").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ChatGPT Text Conversion (From Emoji String to Text)
export const textConversions = pgTable("text_conversions", {
  id: uuid("id").defaultRandom().primaryKey(),
  emojiRequestId: uuid("emoji_request_id")
    .notNull()
    .references(() => emojiRequests.id),
  text: text("text").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Audio Generation (Handles the receipt of the audio file URL from Fal.ai)
export const audioGeneration = pgTable("audio_generation", {
  id: uuid("id").defaultRandom().primaryKey(),
  textConversionId: uuid("text_conversion_id")
    .notNull()
    .references(() => textConversions.id),
  audioFileUrl: text("audio_file_url").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type EmojiRequest = typeof emojiRequests.$inferSelect;
export type TextConversion = typeof textConversions.$inferSelect;
export type AudioGeneration = typeof audioGeneration.$inferSelect;
