// AlbumCard.tsx
'use client';

import { Album } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Play as PlayIcon, Pause as PauseIcon } from 'lucide-react';
import { usePlayer } from '@/components/audio/PlayerProvider';
import { useEffect, useState, useMemo } from 'react';

const fmt = (s?: number) => {
    if (!s || s <= 0) return '--:--';
    const m = Math.floor(s / 60);
    const r = Math.floor(s % 60);
    return `${m}:${r.toString().padStart(2, '0')}`;
};

const HEADER_PX = 96;
const HEADER_DURATION = 0.32;
const MOBILE_ROW_H = 63;
const DESKTOP_ROW_H = 78;
const MOBILE_ROWS = 3; // ← change this to show more/less rows on mobile

export default function AlbumCard({
        album,
        isOpen,
        isDimmed = false,
        onToggleAction,
        onPlayAction,
        onHoverStartAction,
        onHoverEndAction,
        onFocusAction,
        onBlurAction,
    }: {
        album: Album;
        isOpen: boolean;
        isDimmed: boolean;
        onToggleAction: () => void;
        onPlayAction: (trackIndex: number) => void;
        onHoverStartAction?: () => void;
        onHoverEndAction?: () => void;
        onFocusAction?: () => void;
        onBlurAction?: () => void;
    }) {
    const p = usePlayer();
    const currentTrackId = p.queue[p.index]?.id;

    // delay track list mount so the squash looks clean (desktop/tablet only)
    const [showList, setShowList] = useState(isOpen);
    useEffect(() => {
        if (isOpen) {
            const id = setTimeout(() => setShowList(true), HEADER_DURATION * 1000);
            return () => clearTimeout(id);
        } else {
            setShowList(false);
        }
    }, [isOpen]);

    // ======== MOBILE (≤ sm) — horizontal, always-open list to the right of cover ========
    const mobileMaxHeight = useMemo(() => MOBILE_ROW_H * MOBILE_ROWS, []);
    const MobileCard = (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            whileHover={{ scale: 1.04, y: -2 }}
            whileFocus={{ scale: 1.04, y: -2 }}
            transition={{ duration: 0.22 }}
            className="sm:hidden group .card-ring
             hover:ring-primary focus-visible:ring-primary
             card-hover"
            style={{ transformOrigin: 'center' }}
            onMouseEnter={onHoverStartAction}
            onMouseLeave={onHoverEndAction}
            onFocus={onFocusAction}
            onBlur={onBlurAction}
        >
            <div className="flex gap-3 p-3">
                {/* Left: cover */}
                <div className="shrink-0">
                    <div className="h-28 w-28 overflow-hidden rounded-xl bg-white/10">
                        <img src={album.cover} alt="" className="h-full w-full object-cover" />
                    </div>
                </div>

                {/* Right: title + list (fixed rows, scroll overlay) */}
                <div className="min-w-0 flex-1">
                    <div className="font-semibold text-lg leading-tight mb-2">{album.title}</div>

                    <div
                        className="rounded-lg bg-white/5 backdrop-blur-sm modern-scrollbar scroll-overlay overflow-y-auto"
                        style={{ maxHeight: mobileMaxHeight }}
                    >
                        {album.tracks.map((t, i) => {
                            const isCurrent = currentTrackId === t.id;
                            const isActive = isCurrent && p.playing;
                            return (
                                <div
                                    key={t.id}
                                    role="option"
                                    aria-selected={isActive}
                                    className={`flex w-full items-center
                                        ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}
                                        border-b-2 border-white/10 last:border-b-0
                                        `}
                                    onDoubleClick={() => {
                                        if (isCurrent && p.playing) p.seek(0);
                                        else onPlayAction(i);
                                    }}
                                    style={{ height: MOBILE_ROW_H }}
                                >
                                    {/* tiny cover */}
                                    <div className="pl-3">
                                        <div className="h-8 w-8 overflow-hidden rounded-md bg-white/10">
                                            <img src={album.cover} alt="" className="h-full w-full object-cover" />
                                        </div>
                                    </div>

                                    {/* title */}
                                    <div className="flex-1 min-w-0 truncate text-sm px-3">{t.title}</div>

                                    {/* duration */}
                                    <div className="text-xs tabular-nums text-text/70 px-3">
                                        {fmt((t as any).duration)}
                                    </div>

                                    {/* play/pause */}
                                    <button
                                        className="rounded-md p-1.5 mr-3 hover:bg-white/10 cursor-pointer"
                                        aria-label={isActive ? 'Pause' : 'Play'}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            isCurrent ? p.toggle() : onPlayAction(i);
                                        }}
                                    >
                                        <span className="sr-only">{isActive ? 'Pause' : 'Play'}</span>
                                        {isActive ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </motion.div>
    );

    // ======== DESKTOP/TABLET (sm+) ========
    const DesktopCard = (
        <motion.div
            data-open={isOpen ? 'true' : 'false'}
            layout
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            whileHover={{ scale: 1.04, y: -2 }}
            whileFocus={{ scale: 1.04, y: -2 }}
            transition={{ duration: 0.22 }}
            className="hidden sm:block group aspect-square w-full
             card-hover card-ring card-ring-hover"
            style={{ transformOrigin: 'center' }}
            onMouseEnter={onHoverStartAction}
            onMouseLeave={onHoverEndAction}
            onFocus={onFocusAction}
            onBlur={onBlurAction}
        >
            {/* COVER WINDOW */}
            <motion.button
                type="button"
                onClick={onToggleAction}
                aria-expanded={isOpen}
                className="absolute inset-0 cursor-pointer"
                style={{ lineHeight: 0 }}
                animate={{
                    opacity: isDimmed ? 0.4 : 1,
                    filter: isDimmed ? 'grayscale(50%)' : 'none',
                }}
            >
                <motion.div
                    initial={false}
                    animate={{ height: isOpen ? HEADER_PX : '100%' }}
                    transition={{ duration: HEADER_DURATION, ease: 'easeInOut' }}
                    className="absolute left-0 right-0 top-0 overflow-hidden z-20"
                    style={{ willChange: 'height' }}
                >
                    <img src={album.cover} alt="" className="h-full w-full object-cover cover-img" />

                    {/* Bottom gradient on the unopened card so the title reads well */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />

                    {/* Readability overlay between image and album name when open */}
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: HEADER_DURATION, ease: 'easeInOut' }}
                            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/75 via-black/45 to-transparent"
                        />
                    )}

                    {/* Animate title chip position & padding with the squash */}
                    <motion.div
                        initial={false}
                        animate={{
                            bottom: isOpen ? 4 : 12, // px
                            padding: isOpen ? 4 : 12, // px
                        }}
                        transition={{ duration: HEADER_DURATION, ease: 'easeInOut' }}
                        className="absolute left-3 font-semibold text-2xl"
                        style={{ lineHeight: 1.1 }}
                    >
                        {album.title}
                    </motion.div>
                </motion.div>
            </motion.button>

            {/* TRACK LIST */}
            <AnimatePresence initial={false}>
                {showList && (
                    <motion.div
                        key="tracks"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.24, ease: 'easeInOut' }}
                        className="absolute inset-x-0 bottom-0 z-10"
                        style={{ top: HEADER_PX }}
                    >
                        <div className="h-full bg-white/5 backdrop-blur-sm">
                            <div className="h-full overflow-y-auto modern-scrollbar scroll-overlay">
                                {album.tracks.map((t, i) => {
                                    const isCurrent = currentTrackId === t.id;
                                    const isActive = isCurrent && p.playing;

                                    return (
                                        <div
                                            key={t.id}
                                            role="option"
                                            aria-selected={isActive}
                                            className={`flex w-full items-center
                                                ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}
                                                border-b border-white/10 last:border-b-0
                                                `}
                                            onDoubleClick={() => {
                                                if (isCurrent && p.playing) p.seek(0);
                                                else onPlayAction(i);
                                            }}
                                            style={{ height: DESKTOP_ROW_H }}
                                        >
                                            {/* tiny cover */}
                                            <div className="pl-3">
                                                <div className="h-8 w-8 overflow-hidden rounded-md bg-white/10">
                                                    <img src={album.cover} alt="" className="h-full w-full object-cover" />
                                                </div>
                                            </div>

                                            {/* title */}
                                            <div className="flex-1 min-w-0 truncate text-sm px-3">{t.title}</div>

                                            {/* duration */}
                                            <div className="text-xs tabular-nums text-text/70 px-3">
                                                {fmt((t as any).duration)}
                                            </div>

                                            {/* play/pause toggle */}
                                            <button
                                                className="rounded-md p-1.5 mr-3 hover:bg-white/10 cursor-pointer"
                                                aria-label={isActive ? 'Pause' : 'Play'}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    isCurrent ? p.toggle() : onPlayAction(i);
                                                }}
                                            >
                                                <span className="sr-only">{isActive ? 'Pause' : 'Play'}</span>
                                                {isActive ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );

    return (
        <>
            {MobileCard}
            {DesktopCard}
        </>
    );
}