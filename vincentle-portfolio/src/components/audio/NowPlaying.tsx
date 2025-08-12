'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '@/components/audio/PlayerProvider';
import {
    Play, Pause, SkipBack, SkipForward,
    Volume2, VolumeX, Repeat, Repeat1, ChevronUp
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const r = Math.floor(s % 60);
    return `${m}:${r.toString().padStart(2,'0')}`;
};

export default function NowPlaying() {
    const p = usePlayer();
    const [open, setOpen] = useState(false);
    const [showVol, setShowVol] = useState(false);
    const hasTrack = !!p.queue[p.index];
    const current = p.queue[p.index];

    const artist = 'Vincent Le'; // change if you have per-track artist
    const panelBg = 'bg-[#1A1D29]/90';

    // close volume popover on Esc; Esc also collapses expanded bar
    const onEsc = useCallback((e: KeyboardEvent) => {
        if (e.key !== 'Escape') return;
        if (showVol) setShowVol(false);
        else if (open) setOpen(false);
    }, [open, showVol]);

    useEffect(() => {
        window.addEventListener('keydown', onEsc);
        return () => window.removeEventListener('keydown', onEsc);
    }, [onEsc]);

    // -------- Collapsed chip (unchanged style, just ensure white icons/text) --------
    return (
        <AnimatePresence>
            {hasTrack && !open && (
                <motion.div
                    initial={{ y: 40, opacity: 0, scale: 0.98 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 40, opacity: 0, scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                    className="fixed right-4 bottom-4 z-50"
                >
                    <div className={`flex items-center gap-3 rounded-2xl ${panelBg} backdrop-blur border border-white/10 p-2.5 shadow-lg`}>
                        <div className="h-10 w-10 overflow-hidden rounded-lg bg-white/10">
                            {current?.albumCover ? <img src={current.albumCover} alt="" className="h-full w-full object-cover" /> : null}
                        </div>
                        <div className="min-w-0 text-white">
                            <div className="text-xs text-white/80">Now Playing:</div>
                            <div className="text-sm truncate max-w-[240px]">{current?.title}</div>
                        </div>
                        <button className="rounded-full p-2 hover:bg-white/10 text-white" onClick={p.toggle} aria-label={p.playing ? 'Pause' : 'Play'}>
                            {p.playing ? <Pause size={18} /> : <Play size={18} />}
                        </button>
                        <button className="rounded-full p-2 hover:bg-white/10 text-white" onClick={() => setOpen(true)} aria-label="Expand">
                            <ChevronUp size={18} />
                        </button>
                    </div>
                </motion.div>
            )}

            {/* -------- Expanded Spotify-like minimized bar (mobile + desktop) -------- */}
            {hasTrack && open && (
                <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 40, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                    className="fixed inset-x-0 bottom-3 z-50"
                >
                    <div className="relative mx-3 md:mx-auto md:max-w-5xl bg-[#1A1D29]/90 backdrop-blur rounded-2xl border border-white/10 shadow-lg">
                        {/* Collapse caret: centered horizontally, straddling the top border */}
                        <button
                            onClick={() => setOpen(false)}
                            aria-label="Collapse player"
                            className="
          absolute left-1/2 -translate-x-1/2 top-0 -translate-y-1/2
          h-8 w-8 rounded-full border border-white/15
          bg-white/10 hover:bg-white/15
          flex items-center justify-center text-white shadow-md backdrop-blur
        "
                            title="Collapse"
                        >
                            <ChevronUp size={16} className="rotate-180" />
                        </button>

                        {/* CONTENT */}
                        <div className="px-3 md:px-4 pt-3 pb-2">
                            <div className="grid md:grid-cols-[auto_1fr_auto] items-start gap-x-4 md:gap-x-6">
                                {/* LEFT: Cover + Titles (top-aligned with cover) */}
                                <div className="flex items-start gap-3 min-w-0">
                                    <div className="p-1 rounded-xl bg-white/5 shrink-0">
                                        <div className="h-14 w-14 md:h-20 md:w-20 overflow-hidden rounded-lg bg-white/10">
                                            {current?.albumCover ? (
                                                <img src={current.albumCover} alt="" className="h-full w-full object-cover" />
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="min-w-0 self-start">
                                        <div className="truncate text-white text-base md:text-lg leading-tight">
                                            {current?.title}
                                            <span className="truncate text-white/60"> • Vincent Le</span>
                                        </div>
                                        <div className="truncate text-xs md:text-sm text-white/70">
                                            {current?.albumTitle ?? ''}
                                        </div>
                                    </div>
                                </div>

                                {/* CENTER: (intentionally empty — bottom bar is the scrubber) */}
                                <div />

                                {/* RIGHT: Transport • Loop • Volume (with centered popover) */}
                                <div className="flex items-center justify-end">
                                    {/* Transport */}
                                    <div className="flex items-center gap-2">
                                        <button className="rounded-full p-2 hover:bg-white/10 text-white" onClick={p.prev} aria-label="Previous">
                                            <SkipBack size={18} />
                                        </button>
                                        <button
                                            className="rounded-full p-2.5 hover:bg-white/10 text-white"
                                            onClick={p.toggle}
                                            aria-label={p.playing ? 'Pause' : 'Play'}
                                        >
                                            {p.playing ? <Pause size={20} /> : <Play size={20} />}
                                        </button>
                                        <button className="rounded-full p-2 hover:bg-white/10 text-white" onClick={p.next} aria-label="Next">
                                            <SkipForward size={18} />
                                        </button>
                                    </div>

                                    {/* Loop with extra spacing */}
                                    <button
                                        className="ml-3 rounded-full p-2 hover:bg-white/10 text-white"
                                        onClick={p.cycleLoop}
                                        aria-label="Loop mode"
                                        title="Loop mode"
                                    >
                                        {p.loop === 'off'
                                            ? <Repeat size={18} className="opacity-60" />
                                            : p.loop === 'track'
                                                ? <Repeat1 size={18} />
                                                : <Repeat size={18} />}
                                    </button>

                                    {/* Volume cluster with centered popover and duration below */}
                                    <div className="relative ml-4 flex flex-col items-center">
                                        <button
                                            className="rounded-full p-2 hover:bg-white/10 text-white"
                                            onClick={() => setShowVol(v => !v)}
                                            aria-label="Volume"
                                            aria-expanded={showVol}
                                        >
                                            {p.volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                                        </button>

                                        {/* total/remaining duration directly under volume icon */}
                                        <div className="hidden md:block mt-1 text-[11px] tabular-nums text-white/70 text-center w-12">
                                            -{fmt(Math.max(0, (p.duration || 0) - p.currentTime))}
                                        </div>

                                        {/* Volume popover — centered to icon; slider centered within popover */}
                                        <AnimatePresence>
                                            {showVol && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.96, y: 8 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.96, y: 8 }}
                                                    transition={{ duration: 0.14, ease: 'easeOut' }}
                                                    className="absolute left-1/2 -translate-x-1/2 top-0 -translate-y-[10px]
                                                      rounded-xl border border-white/10 bg-[#1A1D29]/95 backdrop-blur
                                                      px-3 py-3 shadow-lg vol-pop"
                                                    style={{ transformOrigin: 'bottom center' }}
                                                >
                                                    {/* Center the vertical slider inside the popover */}
                                                    <div className="h-36 w-10 flex items-center justify-center">
                                                        <input
                                                            type="range"
                                                            min={0}
                                                            max={1}
                                                            step={0.01}
                                                            value={p.volume}
                                                            onChange={(e) => p.setVolume(parseFloat(e.target.value))}
                                                            aria-label="Volume"
                                                            className="input-slider w-32 rotate-[-90deg]"
                                                            style={{
                                                                background: (() => {
                                                                    const pct = Math.max(0, Math.min(100, (p.volume ?? 0) * 100));
                                                                    return `linear-gradient(to right, rgba(255,255,255,0.9) ${pct}%, rgba(255,255,255,0.18) ${pct}%)`;
                                                                })(),
                                                            }}
                                                        />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>

                            {/* BOTTOM: the only progress/scrubbing bar, with durations restored */}
                            <div className="mt-2 flex items-center gap-2">
                                <div className="text-[11px] tabular-nums text-white/70 w-10 text-right">
                                    {fmt(p.currentTime)}
                                </div>
                                <input
                                    type="range"
                                    min={0}
                                    max={p.duration || 0}
                                    value={Math.min(p.currentTime, p.duration || 0)}
                                    onChange={(e) => p.seek(parseFloat(e.target.value))}
                                    className="input-slider input-slider-thin w-full"
                                    aria-label="Seek"
                                    style={{
                                        background: (() => {
                                            const dur = p.duration || 0;
                                            const cur = Math.min(p.currentTime, dur);
                                            const pct = dur > 0 ? (cur / dur) * 100 : 0;
                                            return `linear-gradient(to right, rgba(255,255,255,0.9) ${pct}%, rgba(255,255,255,0.18) ${pct}%)`;
                                        })(),
                                    }}
                                />
                                <div className="hidden md:block text-[11px] tabular-nums text-white/70 w-12">
                                    -{fmt(Math.max(0, (p.duration || 0) - p.currentTime))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}