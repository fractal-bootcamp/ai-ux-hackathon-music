"use client";

import { useRef } from "react";
import { api } from "~/trpc/react";

interface SoundVisualizerProps {
	className?: string;
}

export function SoundVisualizer({ className }: SoundVisualizerProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const { data: latestSound } = api.schema.getLatestSound.useQuery();
	return (
		<div className={`h-32 w-full rounded-lg border ${className} flex flex-col`}>
			<div className="text-sm text-muted-foreground p-2">
				{latestSound?.emoji}
				{latestSound?.audioUrl}
			</div>
			<canvas
				ref={canvasRef}
				className="h-full w-full"
				width={800}
				height={128}
			/>
		</div>
	);
}
