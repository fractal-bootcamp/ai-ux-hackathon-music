"use client";

import { useRef } from "react";

interface SoundVisualizerProps {
	className?: string;
}

export function SoundVisualizer({ className }: SoundVisualizerProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	return (
		<div className={`h-32 w-full rounded-lg border ${className}`}>
			<canvas
				ref={canvasRef}
				className="h-full w-full"
				width={800}
				height={128}
			/>
		</div>
	);
}
