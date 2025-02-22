import { NextResponse } from 'next/server'
import { fal } from "@fal-ai/client"

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    const result = await fal.subscribe("fal-ai/mmaudio-v2/text-to-audio", {
      input: {
        prompt: prompt
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });

    return NextResponse.json({ 
      data: result.data,
      requestId: result.requestId 
    })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate audio' },
      { status: 500 }
    )
  }
}
