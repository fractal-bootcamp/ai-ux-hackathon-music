"use client";

import { useState, useCallback, useEffect } from "react";
import type { Sound } from "~/app/_types/types";

const INITIAL_SOUNDS: Sound[] = [
	{ emoji: "🎸", name: "Guitar Strum" },
	{ emoji: "🎹", name: "Piano Melody" },
	{ emoji: "🎺", name: "Trumpet Blast" },
];

export function useEmojiSounds() {
	const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
	const [discoveredSounds, setDiscoveredSounds] = useState<Sound[]>(INITIAL_SOUNDS);

	const handleEmojiClick = useCallback((emoji: string) => {
		setSelectedEmojis((prev) => [...prev, emoji]);
		setDiscoveredSounds((prev) => {
			if (prev.find((sound) => sound.emoji === emoji)) return prev;
			return [...prev, { emoji, name: `Sound ${prev.length + 1}` }];
		});
	}, []);

	const handleBackspace = useCallback(() => {
		setSelectedEmojis((prev) => prev.slice(0, -1));
	}, []);

	const handleClearAll = useCallback(() => {
		setSelectedEmojis([]);
	}, []);

	const handlePlaySound = useCallback((sound: Sound) => {
		// Implement sound playback logic
		console.log(`Playing sound: ${sound.name}`);
	}, []);

	const handleGPTSubmit = useCallback(async () => {
		if (selectedEmojis.length === 0) return;
		console.log("Submitting emojis:", selectedEmojis.join(" "));
	}, [selectedEmojis]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Backspace") {
				handleBackspace();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [handleBackspace]);

	return {
		selectedEmojis,
		discoveredSounds,
		handleEmojiClick,
		handleBackspace,
		handleClearAll,
		handlePlaySound,
		handleGPTSubmit,
	};
} 