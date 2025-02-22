"use client";

import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "~/components/ui/sheet";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Button } from "~/components/ui/button";
import { Library, Music2 } from "lucide-react";
import type { Sound } from "~/app/_types/types";

interface SoundDrawerProps {
	sounds: Sound[];
	onPlaySound?: (sound: Sound) => void;
}

export function SoundDrawer({ sounds, onPlaySound }: SoundDrawerProps) {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline" size="icon" className="ml-4">
					<Library className="h-4 w-4" />
				</Button>
			</SheetTrigger>
			<SheetContent className="w-[400px] sm:w-[540px]">
				<SheetHeader>
					<SheetTitle>Discovered Sounds</SheetTitle>
				</SheetHeader>
				<div className="mt-4">
					<ScrollArea className="h-[calc(100vh-12rem)]">
						<div className="space-y-2">
							{sounds.map((sound) => (
								<div
									key={sound.emoji}
									className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted"
								>
									<div className="flex items-center gap-4">
										<div className="text-3xl">{sound.emoji}</div>
									</div>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => sound.audioUrl && onPlaySound?.(sound)}
										disabled={!sound.audioUrl}
									>
										<Music2 className="h-4 w-4" />
									</Button>
								</div>
							))}
						</div>
					</ScrollArea>
				</div>
			</SheetContent>
		</Sheet>
	);
}
