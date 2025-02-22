"use client";
import React, { useRef, useEffect, useState } from 'react';
import AudioMotionAnalyzer from 'audiomotion-analyzer';
import { CoolMode } from '~/components/magicui/cool-mode';
import { Button } from '~/components/ui/button';

interface AudioVisualizerProps {
	audioUrl: string;
}

interface Particle {
	x: number;
	y: number;
	size: number;
	speedX: number;
	speedY: number;
	color: string;
	opacity: number;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ audioUrl }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const audioRef = useRef<HTMLAudioElement>(null);
	const analyzerRef = useRef<AudioMotionAnalyzer | null>(null);
	const coolModeRef = useRef<HTMLDivElement>(null);
	const [isInitialized, setIsInitialized] = useState(false);
	const [error, setError] = useState<string>('');
	const [isPlaying, setIsPlaying] = useState(false);
	const [particles, setParticles] = useState<Particle[]>([]);
	const [isEmitting, setIsEmitting] = useState(false);
	const particleContainerRef = useRef<HTMLDivElement>(null);

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
			setParticles([]); // Reset particles on play
			await initializeAnalyzer();
			if (audioRef.current) {
				await audioRef.current.play();
				setIsPlaying(true);
			}
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			setError(`Error playing audio: ${errorMessage}`);
			console.error('Playback error:', error);
		}
	};

	const handlePause = () => {
		if (audioRef.current) {
			audioRef.current.pause();
			setIsPlaying(false);
			setParticles([]); // Clear particles on pause
		}
	};

	// Add this effect to simulate interaction
	useEffect(() => {
		if (isPlaying && coolModeRef.current) {
			const interval = setInterval(() => {
				if (coolModeRef.current) {
					const rect = coolModeRef.current.getBoundingClientRect();
					const event = new MouseEvent('mousemove', {
						clientX: rect.left + Math.random() * rect.width,
						clientY: rect.top + Math.random() * rect.height
					});
					coolModeRef.current.dispatchEvent(event);
				}
			}, 100);

			return () => clearInterval(interval);
		}
	}, [isPlaying]);

	// Update particle constants
	const MAX_PARTICLES = 200;
	const INITIAL_PARTICLES = 100;

	// Replace emission effect with single burst
	useEffect(() => {
		if (!isPlaying) return;

		// Create initial particle burst
		setParticles(Array.from({ length: INITIAL_PARTICLES }).map(() => {
			const angle = Math.random() * Math.PI * 2;
			const speed = Math.random() * 5 + 3;
			return {
				x: window.innerWidth / 2,
				y: (window.innerHeight / 2) - 50,
				size: Math.random() * 8 + 4,
				speedX: Math.cos(angle) * speed,
				speedY: Math.sin(angle) * speed,
				color: `hsl(${Math.random() * 360}, 70%, 50%)`,
				opacity: 1
			};
		}));

	}, [isPlaying]);

	// Update animation effect with consistent physics
	useEffect(() => {
		let animationFrameId: number;
		
		const animateParticles = () => {
			setParticles(prev => {
				return prev
					.map(p => ({
						...p,
						x: p.x + p.speedX * 0.99,
						y: p.y + p.speedY * 0.99 + 0.1,
						opacity: p.opacity - 0.008,
						size: p.size * 0.985
					}))
					.filter(p => 
						p.opacity > 0.05 && 
						p.size > 0.5 &&
						p.y < window.innerHeight + 100
					);
			});
			
			animationFrameId = requestAnimationFrame(animateParticles);
		};

		if (isPlaying) {
			animateParticles();
		}

		return () => {
			if (animationFrameId) cancelAnimationFrame(animationFrameId);
		};
	}, [isPlaying]);

	return (
		<div className="relative">
			{error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
			<audio
				ref={audioRef}
				onPlay={handlePlay}
				onPause={handlePause}
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
			{isPlaying && (
				<div 
					ref={particleContainerRef}
					className="fixed inset-0 h-screen w-screen pointer-events-none"
				>
					{particles.map((particle, i) => (
						<div
							key={i}
							className="absolute rounded-full will-change-transform"
							style={{
								transform: `translate(${particle.x}px, ${particle.y}px)`,
								width: `${particle.size}px`,
								height: `${particle.size}px`,
								backgroundColor: particle.color,
								opacity: particle.opacity,
								transition: 'all 0.1s linear',
							}}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default AudioVisualizer;