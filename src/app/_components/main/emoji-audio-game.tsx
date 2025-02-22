"use client";

import { Card } from "~/components/ui/card";
import { SoundDrawer } from "~/app/_components/sound-drawer";
import { EmojiSelector } from "~/app/_components/emoji-selector-keyboard";
import { SoundVisualizer } from "~/app/_components/sound-visualizer";
import { EmojiInput } from "./emoji-input";
import { useEmojiSounds } from "./hooks/use-emoji-sounds";

export function EmojiAudioGame() {
	const {
		selectedEmojis,
		discoveredSounds,
		handleEmojiClick,
		handleBackspace,
		handleClearAll,
		handlePlaySound,
		handleGPTSubmit,
	} = useEmojiSounds();

	return (
		<Card className="mx-auto max-w-2xl space-y-6 p-6">
			<div className="flex items-center justify-between">
				<EmojiInput
					value={selectedEmojis.join(" ")}
					onBackspace={handleBackspace}
					onClearAll={handleClearAll}
					onSubmit={handleGPTSubmit}
				/>
				<SoundDrawer sounds={discoveredSounds} onPlaySound={handlePlaySound} />
			</div>

			<SoundVisualizer />

			<EmojiSelector onEmojiSelect={handleEmojiClick} />
		</Card>
	);
}
