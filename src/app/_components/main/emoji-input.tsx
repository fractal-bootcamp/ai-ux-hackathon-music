"use client";

import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { ArrowRight, Delete } from "lucide-react";
import { useEffect } from "react";

interface EmojiInputProps {
	value: string;
	onBackspace: () => void;
	onClearAll: () => void;
	onSubmit: () => void;
}

export function EmojiInput({
	value,
	onBackspace,
	onClearAll,
	onSubmit,
}: EmojiInputProps) {
	useEffect(() => {
		const handleKeyPress = (event: KeyboardEvent) => {
			if (event.key === "Enter") {
				event.preventDefault();
				onSubmit();
				onClearAll();
			}
		};

		window.addEventListener("keydown", handleKeyPress);
		return () => window.removeEventListener("keydown", handleKeyPress);
	}, [onSubmit, onClearAll]);

	return (
		<div className="flex flex-1 items-center space-x-2">
			<Button size="icon" variant="outline" onClick={onClearAll}>
				🗑️
			</Button>
			<Input value={value} className="font-mono text-lg" readOnly />
			<Button size="icon" variant="outline" onClick={onBackspace}>
				<Delete className="h-4 w-4" />
			</Button>
			<Button size="icon" onClick={() => {
				onSubmit();
				onClearAll();
			}}>
				<ArrowRight className="h-4 w-4" />
			</Button>
		</div>
	);
}
