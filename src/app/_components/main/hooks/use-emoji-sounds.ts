import { useState, useCallback, useEffect } from "react";
import type { Sound } from "~/app/_types/types";
import { api } from "~/trpc/react";

const INITIAL_SOUNDS: Sound[] = [
	{ emoji: "🎸", name: "Guitar Strum" },
	{ emoji: "🎹", name: "Piano Melody" },
	{ emoji: "🎺", name: "Trumpet Blast" },
];

export function useEmojiSounds() {
	const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
	const [discoveredSounds, setDiscoveredSounds] = useState<Sound[]>(INITIAL_SOUNDS);

	const createEmojiRequest = api.emoji.create.useMutation();
	const createTextConversion = api.text.create.useMutation();

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
		
		try {
			// Create the emoji request. 
			const result = await createEmojiRequest.mutateAsync({
				emojiString: selectedEmojis.join(" "),
			});

			if (!result) {
				throw new Error("Failed to create emoji request");
			}

			// Progressively update the UI to show the emoji request.

			// Perform the GPT request.
			const gptResponse = await fetch("/api/generate", {
				method: "POST",
				body: JSON.stringify({
					emojis: selectedEmojis.join(" "),
					emojiRequestId: result.id,
				}),
			});

			if (!gptResponse.ok) {
				throw new Error("Failed to generate text from emojis");
			}

			const gptResponseData = await gptResponse.json();

			// Create the text conversion.
			const textResult = await createTextConversion.mutateAsync({
				emojiRequestId: result.id,
				text: gptResponseData.response,
			});

			if (!textResult) {
				throw new Error("Failed to create text conversion");
			}
			
			
			

		} catch (error) {
			console.error("Error creating emoji request:", error);
		}
	}, [selectedEmojis, createEmojiRequest, createTextConversion]);

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