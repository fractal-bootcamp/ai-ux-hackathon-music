"use client";
import React, { useRef, useEffect, useState } from 'react';
import AudioMotionAnalyzer from 'audiomotion-analyzer';

interface AudioVisualizerProps {
	audioUrl: string;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ audioUrl }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const audioRef = useRef<HTMLAudioElement>(null);
	const analyzerRef = useRef<AudioMotionAnalyzer | null>(null);
	const [isInitialized, setIsInitialized] = useState(false);
	const [error, setError] = useState<string>('');

	// Set up audio source
	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.src = audioUrl;
			audioRef.current.crossOrigin = "anonymous";
		}
	}, [audioUrl]);

	// Initialize analyzer on first user interaction
	const initializeAnalyzer = async () => {
		if (!containerRef.current || !audioRef.current || isInitialized) return;

		try {
			const audioCtx = new AudioContext();
			const source = audioCtx.createMediaElementSource(audioRef.current);

			analyzerRef.current = new AudioMotionAnalyzer(containerRef.current, {
				source: source,
				audioCtx: audioCtx,
				height: 400,
				width: 400,
				mode: 2,
				radial: true, // radial mode
				spinSpeed: 1,
				showBgColor: true,
				bgAlpha: 0.0,
				overlay: true,
				showScaleX: false, // Hide scale in radial mode
				showPeaks: true,
				gradient: 'prism',
				mirror: 1,
				lumiBars: false,
				reflexRatio: 0.1,
				reflexAlpha: 0.25,
				reflexBright: 1.1
			});

			setIsInitialized(true);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			setError(`Failed to initialize analyzer: ${errorMessage}`);
			console.error('Analyzer initialization error:', error);
		}
	};

	// Clean up on unmount
	useEffect(() => {
		return () => {
			if (analyzerRef.current) {
				analyzerRef.current.destroy();
			}
		};
	}, []);

	const handlePlay = async () => {
		try {
			await initializeAnalyzer();
			if (audioRef.current) {
				await audioRef.current.play();
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			setError(`Error playing audio: ${errorMessage}`);
			console.error('Playback error:', error);
		}
	};

	return (
		<div>
			{error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
			<audio
				ref={audioRef}
				onPlay={handlePlay}
				onPause={() => audioRef.current?.pause()}
				controls
			/>
			<div
				ref={containerRef}
				style={{
					width: '400px',
					height: '400px',
					margin: '0 auto'
				}}
			/>
		</div>
	);
};

export default AudioVisualizer;