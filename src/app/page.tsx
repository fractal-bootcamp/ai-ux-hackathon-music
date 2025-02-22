"use client";

import { useState, useEffect } from "react";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { ArrowRight, Delete } from "lucide-react";
import { SoundDrawer } from "~/app/_components/sound-drawer";
import { EmojiSelector } from "~/app/_components/emoji-selector-keyboard";
import AudioVisualizer from "~/app/_components/sound-visualizer";
import type { Sound } from "~/app/_types/types";
const sampleAudioUrl = '/sample-15s.mp3';

export default function EmojiAudioGame() {
	const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
	const [discoveredSounds, setDiscoveredSounds] = useState<Sound[]>([
		{ emoji: "🎸", name: "Guitar Strum" },
		{ emoji: "🎹", name: "Piano Melody" },
		{ emoji: "🎺", name: "Trumpet Blast" },
	]);

	const handleEmojiClick = (emoji: string) => {
		setSelectedEmojis([...selectedEmojis, emoji]);
		if (!discoveredSounds.find((sound) => sound.emoji === emoji)) {
			setDiscoveredSounds([
				...discoveredSounds,
				{
					emoji,
					name: `Sound ${discoveredSounds.length + 1}`,
				},
			]);
		}
	};

	const handleBackspace = () => {
		setSelectedEmojis(selectedEmojis.slice(0, -1));
	};

	const handleClearAll = () => {
		setSelectedEmojis([]);
	};

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Backspace") {
				handleBackspace();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [selectedEmojis]);

	const handlePlaySound = (sound: Sound) => {
		// Implement sound playback logic
		console.log(`Playing sound: ${sound.name}`);
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-8">
			<Card className="mx-auto max-w-2xl space-y-6 p-6">
				<div className="flex items-center justify-between">
					<div className="flex flex-1 items-center space-x-2">
						<Button size="icon" variant="outline" onClick={handleClearAll}>
							🗑️
						</Button>
						<Input
							value={selectedEmojis.join(" ")}
							className="font-mono text-lg"
							readOnly
						/>
						<Button size="icon" variant="outline" onClick={handleBackspace}>
							<Delete className="h-4 w-4" />
						</Button>
						<Button size="icon">
							<ArrowRight className="h-4 w-4" />
						</Button>
					</div>
					<SoundDrawer
						sounds={discoveredSounds}
						onPlaySound={handlePlaySound}
					/>
				</div>

				<AudioVisualizer audioUrl={sampleAudioUrl} />

				<EmojiSelector onEmojiSelect={handleEmojiClick} />
			</Card>
		</div>
	);
}
