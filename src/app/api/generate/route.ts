import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { z } from "zod";

// Define the expected request schema
const requestSchema = z.object({
    emojis: z.string(),
    emojiRequestId: z.string().uuid(),
});

export async function POST(request: Request) {
    const body = await request.json();
    // Validate the request body
    const { emojis, emojiRequestId } = requestSchema.parse(body);

    const response = await generateText({
        model: openai("gpt-4o-mini"),
        prompt: `You are an emoji-to-music translator. Your task is to interpret a sequence of emojis and generate a creative, emotionally rich description of music and visions. Instead of focusing solely on specific genres, emphasize the feelings, moods, and unique qualities each emoji represents, incorporating different instrumental textures and dynamic shifts.\n\nUse a weighted descriptor system: if an emoji appears multiple times, amplify its influence rather than treating the quantity literally. Never use an emoji in your text response.\n\nAvoid naming the emojis directly. Instead, translate them into adjectives and sensory details that capture their essence. The description should be concise yet vivid, maintaining clarity without being overly elusive.\n\nIncorporate references to the speed, movement, and flow of the music, describing whether it feels fast, slow, steady, or unpredictable. Do not include any emojis in the response: ${emojis}`,

    });

    return Response.json({
        response: response.text,
        emojiRequestId
    });
}
