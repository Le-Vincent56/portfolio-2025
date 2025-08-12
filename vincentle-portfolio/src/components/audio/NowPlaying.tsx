'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '@/components/audio/PlayerProvider';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Repeat1, ChevronUp, ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';

const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const r = Math.floor(s % 60);
    return `${m}:${r.toString().padStart(2,'0')}`;
};

export default function NowPlaying({ coverUrl, albumTitle }: { coverUrl?: string; albumTitle?: string }) {
    const p = usePlayer();
    const [open, setOpen] = useState(false);
    const hasTrack = !!p.queue[p.index];

    // collapsed chip appears only after the first play
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
                    <div className="flex items-center gap-3 rounded-2xl bg-[#0F1016]/90 backdrop-blur border border-white/10 p-2.5 shadow-lg">
                        <div className="h-10 w-10 overflow-hidden rounded-lg bg-white/5">
                            {coverUrl ? <img src={coverUrl} alt="" className="h-full w-full object-cover" /> : null}
                        </div>
                        <div className="min-w-0">
                            <div className="text-xs text-white/60">Now Playing:</div>
                            <div className="text-sm truncate max-w-[240px]">{p.queue[p.index]?.title}</div>
                        </div>
                        <button
                            className="rounded-full p-2 hover:bg-white/10"
                            aria-label={p.playing ? 'Pause' : 'Play'}
                            onClick={p.toggle}
                        >
                            {p.playing ? <Pause size={18}/> : <Play size={18}/>}
                        </button>
                        <button
                            className="rounded-full p-2 hover:bg-white/10"
                            aria-label="Expand player"
                            onClick={() => setOpen(true)}
                        >
                            <ChevronUp size={18}/>
                        </button>
                    </div>
                </motion.div>
            )}

            {hasTrack && open && (
                <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 40, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                    className="fixed inset-x-0 bottom-0 z-50"
                >
                    <div className="w-full border-t border-white/10 bg-[#0F1016]/95 backdrop-blur">
                        <div className="mx-auto max-w-6xl px-4 py-3">
                            <div className="flex items-center gap-3">
                                <button className="rounded-full p-2 hover:bg-white/10" aria-label="Collapse player" onClick={() => setOpen(false)}>
                                    <ChevronDown size={18}/>
                                </button>
                                <div className="h-12 w-12 overflow-hidden rounded-xl bg-white/5">
                                    {coverUrl ? <img src={coverUrl} alt="" className="h-full w-full object-cover" /> : null}
                                </div>
                                <div className="min-w-0 mr-4">
                                    <div className="truncate">{p.queue[p.index]?.title}</div>
                                    <div className="text-xs text-white/60 truncate">{albumTitle ?? ''}</div>
                                </div>

                                <div className="ml-auto flex items-center gap-1">
                                    <button className="rounded-full p-2 hover:bg-white/10" onClick={p.prev} aria-label="Previous"><SkipBack size={18}/></button>
                                    <button className="rounded-full p-2 hover:bg-white/10" onClick={p.toggle} aria-label={p.playing ? 'Pause' : 'Play'}>
                                        {p.playing ? <Pause size={18}/> : <Play size={18}/>}
                                    </button>
                                    <button className="rounded-full p-2 hover:bg-white/10" onClick={p.next} aria-label="Next"><SkipForward size={18}/></button>
                                </div>
                            </div>

                            {/* scrubber */}
                            <div className="mt-2 flex items-center gap-3">
                                <div className="text-xs tabular-nums">{fmt(p.currentTime)}</div>
                                <input
                                    type="range"
                                    min={0}
                                    max={p.duration || 0}
                                    value={Math.min(p.currentTime, p.duration || 0)}
                                    onChange={(e) => p.seek(parseFloat(e.target.value))}
                                    className="w-full"
                                    aria-label="Seek"
                                />
                                <div className="text-xs tabular-nums">-{fmt(Math.max(0, (p.duration || 0) - p.currentTime))}</div>
                            </div>

                            {/* bottom controls */}
                            <div className="mt-2 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <button className="rounded-full p-2 hover:bg-white/10" onClick={p.cycleLoop} aria-label="Loop mode">
                                        {p.loop === 'off' ? <Repeat size={18} className="opacity-50"/> : p.loop === 'track' ? <Repeat1 size={18}/> : <Repeat size={18}/>}
                                    </button>
                                    <button className="rounded-full p-2 hover:bg-white/10" onClick={p.toggleMute} aria-label="Mute">
                                        {p.volume === 0 ? <VolumeX size={18}/> : <Volume2 size={18}/>}
                                    </button>
                                    <input
                                        aria-label="Volume"
                                        type="range" min={0} max={1} step={0.01}
                                        value={p.volume}
                                        onChange={(e) => p.setVolume(parseFloat(e.target.value))}
                                    />
                                </div>

                                {/* queue list (current album only) */}
                                <div className="ml-4 max-h-40 overflow-auto rounded-xl bg-white/5 border border-white/10 px-2 py-1 w-full">
                                    <div className="text-xs text-white/60 px-1 py-1">Queue</div>
                                    {p.queue.map((t, i) => (
                                        <div
                                            key={t.id}
                                            role="option"
                                            aria-selected={i === p.index}
                                            tabIndex={0}
                                            className={`px-2 py-1.5 rounded-lg cursor-default ${i === p.index ? 'bg-white/10' : 'hover:bg-white/5'}`}
                                            onDoubleClick={() => {
                                                if (i === p.index && p.playing) {
                                                    // restart if double-click on current playing
                                                    p.seek(0);
                                                } else {
                                                    // jump
                                                    p.setQueue(p.queue, i);
                                                }
                                            }}
                                        >
                                            <div className="truncate text-sm">{t.title}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
