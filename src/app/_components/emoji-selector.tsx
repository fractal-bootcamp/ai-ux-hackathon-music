"use client";

import { Button } from "~/components/ui/button";
import { EMOJI_POOL } from "~/app/_constants/constants";

interface EmojiSelectorProps {
	onEmojiSelect: (emoji: string) => void;
}

export function EmojiSelector({ onEmojiSelect }: EmojiSelectorProps) {
	return (
		<div className="relative">
			<div className="overflow-x-auto scrollbar-thin scrollbar-thumb-primary/10 hover:scrollbar-thumb-primary/20 scrollbar-track-transparent">
				<div className="flex gap-2 pb-2">
					{EMOJI_POOL.map((emoji) => (
						<Button
							key={emoji}
							variant="outline"
							className="h-16 w-16 flex-shrink-0 text-3xl"
							onClick={() => onEmojiSelect(emoji)}
						>
							{emoji}
						</Button>
					))}
				</div>
			</div>
		</div>
	);
}
