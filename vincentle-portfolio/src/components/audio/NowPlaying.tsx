'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '@/components/audio/PlayerProvider';
import {
    Play, Pause, SkipBack, SkipForward,
    Volume2, VolumeX, Repeat, Repeat1, ChevronUp
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const r = Math.floor(s % 60);
    return `${m}:${r.toString().padStart(2, '0')}`;
};

/** ---- Animation knobs (tweak these) ---- */
const LAYOUT_DURATION = 0.61; // ← how long the card/cover morph takes
const LAYOUT_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]; // easeOutExpo-ish
const ENTER_SPRING = { type: 'spring' as const, stiffness: 260, damping: 26 }; // for slide-in/out
/** -------------------------------------- */

export default function NowPlaying() {
    const p = usePlayer();
    const [open, setOpen] = useState(false);
    const [showVol, setShowVol] = useState(false);

    const hasTrack = !!p.queue[p.index];
    const current = p.queue[p.index];
    const artist = 'Vincent Le'; // swap if you add per-track artist
    const panelBg = 'bg-[#1A1D29]/90';

    // Esc closes volume popover first, then the expanded bar
    const onEsc = useCallback((e: KeyboardEvent) => {
        if (e.key !== 'Escape') return;
        if (showVol) setShowVol(false);
        else if (open) setOpen(false);
    }, [open, showVol]);

    useEffect(() => {
        window.addEventListener('keydown', onEsc);
        return () => window.removeEventListener('keydown', onEsc);
    }, [onEsc]);

    return (
        <AnimatePresence>
            {/* ===================== Collapsed chip ===================== */}
            {hasTrack && !open && (
                <motion.div
                    initial={{ y: 40, opacity: 0, scale: 0.98 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 40, opacity: 0, scale: 0.98 }}
                    transition={ENTER_SPRING}
                    className="fixed right-6 bottom-6 z-50"
                >
                    {/* Shared layout container */}
                    <motion.div
                        layout
                        layoutId="np-card"
                        transition={{ layout: { duration: LAYOUT_DURATION, ease: LAYOUT_EASE } }}
                        className={`flex items-center gap-3 rounded-2xl ${panelBg} backdrop-blur border border-white/10 p-2.5 shadow-lg`}
                        style={{ willChange: 'transform, width, height' }}
                    >
                        <div className="h-10 w-10 overflow-hidden rounded-lg bg-white/10">
                            {current?.albumCover ? (
                                <motion.img
                                    layoutId="np-cover"
                                    transition={{ layout: { duration: LAYOUT_DURATION, ease: LAYOUT_EASE } }}
                                    src={current.albumCover}
                                    alt=""
                                    className="h-full w-full object-cover"
                                    style={{ willChange: 'transform, width, height' }}
                                />
                            ) : null}
                        </div>

                        {/* Title fades/slides (not shared) to avoid typography morph warping */}
                        <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 4 }}
                            transition={{ duration: 0.2 }}
                            className="min-w-0 text-white"
                        >
                            <div className="text-xs text-white/80">Now Playing</div>
                            <div className="text-sm truncate max-w-[240px]">{current?.title}</div>
                        </motion.div>

                        <button
                            className="rounded-full p-2 hover:bg-white/10 text-white"
                            onClick={p.toggle}
                            aria-label={p.playing ? 'Pause' : 'Play'}
                        >
                            {p.playing ? <Pause size={18} /> : <Play size={18} />}
                        </button>
                        <button
                            className="rounded-full p-2 hover:bg-white/10 text-white"
                            onClick={() => setOpen(true)}
                            aria-label="Expand"
                        >
                            <ChevronUp size={18} />
                        </button>
                    </motion.div>
                </motion.div>
            )}

            {/* ===================== Expanded bar (mobile + desktop) ===================== */}
            {hasTrack && open && (
                <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 40, opacity: 0 }}
                    transition={ENTER_SPRING}
                    className="fixed inset-x-0 bottom-6 z-50"
                >
                    {/* Shared layout container */}
                    <motion.div
                        layout
                        layoutId="np-card"
                        transition={{ layout: { duration: LAYOUT_DURATION, ease: LAYOUT_EASE } }}
                        className="relative mx-3 md:mx-auto md:max-w-5xl bg-[#1A1D29]/90 backdrop-blur rounded-2xl border border-white/10 shadow-lg"
                        style={{ willChange: 'transform, width, height' }}
                    >
                        {/* Collapse caret: centered horizontally, straddling the top border */}
                        <button
                            onClick={() => setOpen(false)}
                            aria-label="Collapse player"
                            className="absolute left-1/2 -translate-x-1/2 top-0 -translate-y-1/2
                            h-8 w-8 rounded-full border border-white/15
                            bg-white/10 hover:bg-white/15
                            flex items-center justify-center text-white shadow-md backdrop-blur"
                            title="Collapse"
                        >
                            <ChevronUp size={16} className="rotate-180" />
                        </button>

                        {/* CONTENT */}
                        <div className="px-3 md:px-4 pt-3 pb-2">
                            {/* Single row: art + titles + controls (always aligned) */}
                            <div className="relative flex items-center gap-3 md:gap-4 min-w-0">
                                {/* LEFT: album art */}
                                <div className="p-1 rounded-xl bg-white/5 shrink-0">
                                    <div className="h-14 w-14 md:h-20 md:w-20 overflow-hidden rounded-lg bg-white/10">
                                        {current?.albumCover ? (
                                            <motion.img
                                                layoutId="np-cover"
                                                transition={{ layout: { duration: LAYOUT_DURATION, ease: LAYOUT_EASE } }}
                                                src={current.albumCover}
                                                alt=""
                                                className="h-full w-full object-cover"
                                                style={{ willChange: 'transform, width, height' }}
                                            />
                                        ) : null}
                                    </div>
                                </div>

                                {/* Titles (fade, don't layout-share to avoid font morph) */}
                                <motion.div
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 6 }}
                                    transition={{ duration: 0.22 }}
                                    className="min-w-0 self-start flex-1"
                                >
                                    <div className="truncate text-white text-base md:text-lg leading-tight">
                                        {current?.title}
                                        <span className="text-white/60"> • {artist}</span>
                                    </div>
                                    <div className="truncate text-xs md:text-sm text-white/70">
                                        {current?.albumTitle ?? ''}
                                    </div>
                                </motion.div>

                                {/* CENTERED transport (desktop+) */}
                                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-2">
                                    <button
                                        className="rounded-full p-2 hover:bg-white/10 text-white"
                                        onClick={p.prev}
                                        aria-label="Previous"
                                    >
                                        <SkipBack size={18} />
                                    </button>
                                    <button
                                        className="rounded-full p-2.5 hover:bg-white/10 text-white"
                                        onClick={p.toggle}
                                        aria-label={p.playing ? 'Pause' : 'Play'}
                                    >
                                        {p.playing ? <Pause size={20} /> : <Play size={20} />}
                                    </button>
                                    <button
                                        className="rounded-full p-2 hover:bg-white/10 text-white"
                                        onClick={p.next}
                                        aria-label="Next"
                                    >
                                        <SkipForward size={18} />
                                    </button>
                                </div>

                                {/* RIGHT: Transport (mobile) • Loop • Volume (popover) */}
                                <div className="shrink-0 flex items-center ml-auto px-1.5">
                                    {/* Transport (mobile only) */}
                                    <div className="flex items-center gap-2 md:hidden">
                                        <button
                                            className="rounded-full p-2 hover:bg-white/10 text-white"
                                            onClick={p.prev}
                                            aria-label="Previous"
                                        >
                                            <SkipBack size={18} />
                                        </button>
                                        <button
                                            className="rounded-full p-2.5 hover:bg-white/10 text-white"
                                            onClick={p.toggle}
                                            aria-label={p.playing ? 'Pause' : 'Play'}
                                        >
                                            {p.playing ? <Pause size={20} /> : <Play size={20} />}
                                        </button>
                                        <button
                                            className="rounded-full p-2 hover:bg-white/10 text-white"
                                            onClick={p.next}
                                            aria-label="Next"
                                        >
                                            <SkipForward size={18} />
                                        </button>
                                    </div>

                                    {/* Loop */}
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

                                    {/* Volume (column) — width mirrors duration column (w-12) */}
                                    <div className="relative ml-4 flex flex-col items-center w-12">
                                        <button
                                            className="rounded-full p-2 hover:bg-white/10 text-white"
                                            onClick={() => setShowVol(v => !v)}
                                            aria-label="Volume"
                                            aria-expanded={showVol}
                                        >
                                            {p.volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                                        </button>

                                        {/* Volume popover — centered on icon, inside the bar */}
                                        <AnimatePresence>
                                            {showVol && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.96, y: 6 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.96, y: 6 }}
                                                    transition={{ duration: 0.14, ease: 'easeOut' }}
                                                    className="absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+8px)]
                                                    rounded-xl border border-white/10 bg-[#1A1D29]/95 backdrop-blur-2xl
                                                    px-3 py-3 shadow-lg"
                                                >
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

                            {/* Bottom scrubber (single) with times (right time column width = volume column width) */}
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
                                <div className="hidden md:block text-[11px] tabular-nums text-white/70 w-12 text-center">
                                    -{fmt(Math.max(0, (p.duration || 0) - p.currentTime))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
