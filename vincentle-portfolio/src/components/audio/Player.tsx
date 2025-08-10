'use client';

import { useEffect, useState } from 'react';
import { Track } from '@/lib/types';
import { cn } from '@/lib/utils';

function Wave({ progress }: { progress: number }) {
    const bars = 64;
    return (
        <div className="flex items-end gap-[2px] h-8 w-full" aria-hidden>
            {Array.from({ length: bars }).map((_, i) => {
                const height = (Math.sin(i / 4) * 0.5 + 0.5) * 28 + 4;
                const filled = i / bars <= progress;
                return (
                    <div
                        key={i}
                        style={{ height }}
                        className={cn('w-[3px] rounded-sm', filled ? 'bg-white' : 'bg-white/30')}
                    />
                );
            })}
        </div>
    );
}

export default function Player({
        queue,
        index,
        setIndexAction,
        playing,
        setPlayingAction,
    }: {
    queue: Track[];
    index: number;
    setIndexAction: (n: number) => void;
    playing: boolean;
    setPlayingAction: (b: boolean) => void;
}) {
    const [open, setOpen] = useState(false);
    const [volume, setVolume] = useState(0.8);
    const current = queue[index];

    // keyboard controls
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const tag = (e.target as HTMLElement)?.tagName;
            if (tag && /INPUT|TEXTAREA|SELECT/.test(tag)) return;
            if (e.code === 'Space') {
                e.preventDefault();
                setPlayingAction(!playing);
            }
            if (e.code === 'ArrowRight') setIndexAction(Math.min(queue.length - 1, index + 1));
            if (e.code === 'ArrowLeft') setIndexAction(Math.max(0, index - 1));
            if (e.code === 'ArrowUp') setVolume((v) => Math.min(1, v + 0.05));
            if (e.code === 'ArrowDown') setVolume((v) => Math.max(0, v - 0.05));
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [queue.length, index, playing, setPlayingAction, setIndexAction]);

    // mock progress
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        if (!playing) return;
        const id = setInterval(() => setProgress((p) => (p >= 1 ? 0 : p + 0.01)), 200);
        return () => clearInterval(id);
    }, [playing]);
    useEffect(() => setProgress(0), [index]);

    return (
        <div className="fixed left-0 right-0 bottom-0 z-50">
            <div className="mx-auto max-w-6xl">
                <div className="rounded-t-2xl bg-[#0F1016] ring-1 ring-white/10 p-3 md:p-4">
                    <div className="flex items-center gap-4">
                        <button
                            className="text-white/80 hover:text-white px-2"
                            onClick={() => setOpen((o) => !o)}
                            aria-expanded={open}
                            aria-controls="audio-queue"
                            aria-label="Toggle queue"
                        >
                            ▦
                        </button>
                        <div className="min-w-0 flex-1">
                            <div className="text-sm text-white/70 truncate">
                                {current ? current.title : 'Queue empty'}
                            </div>
                            <div className="mt-1">
                                <Wave progress={progress} />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                className="rounded-full bg-white/10 hover:bg-white/20 px-3 py-2"
                                onClick={() => setIndexAction(Math.max(0, index - 1))}
                                aria-label="Previous track"
                            >
                                ⟨⟨
                            </button>
                            <button
                                className="rounded-full bg-[var(--brand)] hover:bg-[var(--brand-2)] px-4 py-2 font-medium"
                                onClick={() => setPlayingAction(!playing)}
                                aria-label={playing ? 'Pause' : 'Play'}
                            >
                                {playing ? 'Pause' : 'Play'}
                            </button>
                            <button
                                className="rounded-full bg-white/10 hover:bg-white/20 px-3 py-2"
                                onClick={() => setIndexAction(Math.min(queue.length - 1, index + 1))}
                                aria-label="Next track"
                            >
                                ⟩⟩
                            </button>
                            <div className="hidden md:flex items-center gap-2 ml-2 text-white/70">
                                <span className="text-xs">Vol</span>
                                <input
                                    type="range"
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    value={volume}
                                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                                    aria-label="Volume"
                                />
                            </div>
                        </div>
                    </div>

                    {open && (
                        <div
                            id="audio-queue"
                            className="mt-3 rounded-xl bg-black/20 p-2 max-h-48 overflow-auto"
                            role="listbox"
                            aria-label="Queue"
                        >
                            {queue.length === 0 && (
                                <div className="text-sm text-white/60 px-2 py-1">
                                    Queue is empty — pick any album track above.
                                </div>
                            )}
                            {queue.map((t, i) => (
                                <button
                                    key={t.id}
                                    onClick={() => setIndexAction(i)}
                                    className={cn(
                                        'w-full text-left px-3 py-2 rounded-lg hover:bg-white/5',
                                        i === index && 'bg-white/10'
                                    )}
                                    role="option"
                                    aria-selected={i === index}
                                >
                                    {t.title}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
