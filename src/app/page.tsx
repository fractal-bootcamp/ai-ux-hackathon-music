"use client";

import { useState } from "react";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SoundDrawer } from "~/app/_components/sound-drawer";
import { EmojiSelector } from "~/app/_components/emoji-selector";
import { SoundVisualizer } from "~/app/_components/sound-visualizer";
import type { Sound } from "~/app/_types/types";

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

	const handlePlaySound = (sound: Sound) => {
		// Implement sound playback logic
		console.log(`Playing sound: ${sound.name}`);
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-8">
			<Card className="mx-auto max-w-2xl space-y-6 p-6">
				<div className="flex items-center justify-between">
					<div className="flex flex-1 items-center space-x-2">
						<Input
							value={selectedEmojis.join(" ")}
							readOnly
							className="font-mono text-lg"
						/>
						<Button size="icon">
							<ArrowRight className="h-4 w-4" />
						</Button>
					</div>
					<SoundDrawer
						sounds={discoveredSounds}
						onPlaySound={handlePlaySound}
					/>
				</div>

				<SoundVisualizer />

				<EmojiSelector onEmojiSelect={handleEmojiClick} />
			</Card>
		</div>
	);
}
