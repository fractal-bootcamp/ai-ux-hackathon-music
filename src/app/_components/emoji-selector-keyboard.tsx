"use client";

import { Button } from "~/components/ui/button";
import { EMOJI_POOL } from "~/app/_constants/constants";
import { useEffect, useState } from "react";

interface EmojiSelectorProps {
    onEmojiSelect: (emoji: string) => void;
    onBackspace?: () => void;
}

export function EmojiSelector({ onEmojiSelect, onBackspace }: EmojiSelectorProps) {
    const [currentPage, setCurrentPage] = useState(0);

    // Define keyboard layout rows
    const keyboardRows = [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm']
    ];

    const totalKeys = keyboardRows.flat().length;
    const totalPages = Math.ceil(EMOJI_POOL.length / totalKeys);

    // Map keyboard keys to emojis based on current page
    const keyToEmojiMap = Object.fromEntries(
        keyboardRows.flat().map((key, index) => {
            const emojiIndex = currentPage * totalKeys + index;
            return [key, EMOJI_POOL[emojiIndex]];
        })
    );

    const handlePageChange = (direction: 'next' | 'back') => {
        setCurrentPage((prev) => {
            if (direction === 'next') {
                return (prev + 1) % totalPages;
            } else {
                return prev === 0 ? totalPages - 1 : prev - 1;
            }
        });
    };

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Tab') {
                event.preventDefault();
                handlePageChange('next');
                return;
            }

            if (event.key === 'Backspace' && onBackspace) {
                event.preventDefault();
                onBackspace();
                return;
            }

            const emoji = keyToEmojiMap[event.key.toLowerCase()];
            if (emoji) {
                onEmojiSelect(emoji);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [onEmojiSelect, keyToEmojiMap, onBackspace]);

    return (
        <div className="relative">
            <div className="flex flex-col gap-2">
                {keyboardRows.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex justify-center gap-1">
                        {row.map((key) => (
                            <Button
                                key={key}
                                variant="outline"
                                className="h-12 w-12 flex-shrink-0 text-xl relative"
                                onClick={() => keyToEmojiMap[key] && onEmojiSelect(keyToEmojiMap[key])}
                            >
                                <span className="absolute top-1 left-1 text-xs opacity-30">{key}</span>
                                {keyToEmojiMap[key] ?? ''}
                            </Button>
                        ))}
                    </div>
                ))}
                <div className="flex justify-center gap-2 mt-2">
                    <Button
                        variant="outline"
                        className="h-10 w-10"
                        onClick={() => handlePageChange('back')}
                    >
                        ⬅️
                    </Button>
                    <span className="flex items-center text-sm text-muted-foreground">
                        {currentPage + 1}/{totalPages}
                    </span>
                    <Button
                        variant="outline"
                        className="h-10 w-10"
                        onClick={() => handlePageChange('next')}
                    >
                        ➡️
                    </Button>
                </div>
            </div>
        </div>
    );
}
