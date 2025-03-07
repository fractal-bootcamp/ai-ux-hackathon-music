import { useState, useCallback, useEffect } from "react";
import type { Sound } from "~/app/_types/types";
import { api } from "~/trpc/react";

export function useEmojiSounds() {
	const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
	const [progress, setProgress] = useState<number>(0);
	const { data: discoveredSounds = [] } = api.schema.getSounds.useQuery();

	const createEmojiRequest = api.emoji.create.useMutation();
	const createTextConversion = api.text.create.useMutation();
	const createAudioGeneration = api.audio.createAudioGeneration.useMutation();

	const handleEmojiClick = useCallback((emoji: string) => {
		setSelectedEmojis((prev) => [...prev, emoji]);
	}, []);

	const handleBackspace = useCallback(() => {
		setSelectedEmojis((prev) => prev.slice(0, -1));
	}, []);

	const handleClearAll = useCallback(() => {
		setSelectedEmojis([]);
	}, []);

	const handlePlaySound = useCallback((sound: Sound) => {
		if (sound.audioUrl) {
			const audio = new Audio(sound.audioUrl);
			audio.play().catch(console.error);
		}
	}, []);

	const handleGPTSubmit = useCallback(async () => {
		if (selectedEmojis.length === 0) return;
		
		try {
			setProgress(0);
			// Create the emoji request
			const result = await createEmojiRequest.mutateAsync({
				emojiString: selectedEmojis.join(" "),
			});
			setProgress(25);

			if (!result) {
				throw new Error("Failed to create emoji request");
			}

			// Perform the GPT request
			const gptResponse = await fetch("/api/generate", {
				method: "POST",
				body: JSON.stringify({
					emojis: selectedEmojis.join(" "),
					emojiRequestId: result.id,
				}),
			});
			setProgress(50);

			if (!gptResponse.ok) {
				throw new Error("Failed to generate text from emojis");
			}

			const gptResponseData = await gptResponse.json();

			// Create the text conversion
			const textResult = await createTextConversion.mutateAsync({
				emojiRequestId: result.id,
				text: gptResponseData.response,
			});
			setProgress(75);

			if (!textResult) {
				throw new Error("Failed to create text conversion");
			}
			
			// Send to Fal AI 
			const falResponse = await fetch("/api/fal", {
				method: "POST",
				body: JSON.stringify({
					prompt: gptResponseData.response,
				}),
			});

			if (!falResponse.ok) {
				throw new Error("Failed to generate audio from text");
			}

			const falResponseData = await falResponse.json();

			// Update the audio generation
			const audioResult = await createAudioGeneration.mutateAsync({
				textConversionId: textResult.id,
				audioFileUrl: falResponseData.data.audio.url,
			});
			setProgress(100);

			if (!audioResult) {
				throw new Error("Failed to create audio generation");
			}

			// Reset progress after a delay
			setTimeout(() => setProgress(0), 1000);

		} catch (error) {
			console.error("Error creating audio generation:", error);
			setProgress(0);
		}
	}, [selectedEmojis, createEmojiRequest, createTextConversion, createAudioGeneration]);

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
		progress,
	};
} 