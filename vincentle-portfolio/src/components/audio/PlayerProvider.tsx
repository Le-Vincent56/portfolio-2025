'use client';
import React, { createContext, use, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Track, LoopMode } from '@/lib/types';

type Ctx = {
    queue: Track[];
    index: number;
    playing: boolean;
    volume: number;
    loop: LoopMode;
    currentTime: number;
    duration: number;
    setQueue: (tracks: Track[], startIndex?: number) => void;
    toggle: () => void;
    next: () => void;
    prev: () => void;
    seek: (sec: number) => void;
    setVolume: (n: number) => void;
    toggleMute: () => void;
    cycleLoop: () => void;
};

const PlayerCtx = createContext<Ctx | null>(null);
export const usePlayer = () => {
    const v = use(PlayerCtx);
    if (!v) throw new Error('usePlayer must be used within PlayerProvider');
    return v;
};

export default function PlayerProvider({ children }: { children: React.ReactNode }) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [queue, setQ] = useState<Track[]>([]);
    const [index, setIndex] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [volume, setVol] = useState<number>(() => {
        const v = typeof window !== 'undefined' ? window.localStorage.getItem('audio:volume') : null;
        return v ? Math.min(1, Math.max(0, parseFloat(v))) : 0.8;
    });
    const [loop, setLoop] = useState<LoopMode>(() => {
        const l = typeof window !== 'undefined' ? window.localStorage.getItem('audio:loop') : null;
        return (l as LoopMode) || 'off';
    });
    const [muted, setMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const setQueue = useCallback((tracks: Track[], startIndex = 0) => {
        setQ(tracks);
        setIndex(Math.max(0, Math.min(tracks.length - 1, startIndex)));
        setPlaying(true);
    }, []);

    const current = queue[index];

    const toggle = useCallback(() => setPlaying(p => !p), []);
    const next = useCallback(() => {
        if (loop === 'track') {
            audioRef.current?.currentTime && (audioRef.current.currentTime = 0);
            audioRef.current?.play();
            return;
        }
        setIndex(i => {
            const n = i + 1 < queue.length ? i + 1 : 0;
            // album loop or wrap-off: always wrap because spec says wrapping
            return n;
        });
        setPlaying(true);
    }, [queue.length, loop]);

    const prev = useCallback(() => {
        const a = audioRef.current;
        if (a && a.currentTime > 3) {
            a.currentTime = 0;
            return;
        }
        setIndex(i => (i - 1 >= 0 ? i - 1 : Math.max(0, queue.length - 1)));
        setPlaying(true);
    }, [queue.length]);

    const seek = useCallback((sec: number) => {
        if (!audioRef.current) return;
        audioRef.current.currentTime = Math.max(0, Math.min(audioRef.current.duration || 0, sec));
    }, []);

    const setVolume = useCallback((n: number) => {
        const clamped = Math.min(1, Math.max(0, n));
        setVol(clamped);
        if (typeof window !== 'undefined') localStorage.setItem('audio:volume', String(clamped));
        if (audioRef.current) audioRef.current.volume = clamped;
        if (clamped > 0) setMuted(false);
    }, []);

    const toggleMute = useCallback(() => {
        setMuted(m => {
            const nextMuted = !m;
            if (audioRef.current) audioRef.current.muted = nextMuted;
            return nextMuted;
        });
    }, []);

    const cycleLoop = useCallback(() => {
        setLoop(l => {
            const nxt: LoopMode = l === 'off' ? 'track' : l === 'track' ? 'album' : 'off';
            if (typeof window !== 'undefined') localStorage.setItem('audio:loop', nxt);
            if (audioRef.current) audioRef.current.loop = nxt === 'track';
            return nxt;
        });
    }, []);

    // bind audio element to state
    useEffect(() => {
        const a = audioRef.current;
        if (!a) return;
        a.volume = volume;
        a.muted = muted;
        a.loop = loop === 'track';
    }, [volume, muted, loop]);

    // play/pause on state
    useEffect(() => {
        const a = audioRef.current;
        if (!a) return;
        if (!current) return;
        if (playing) a.play().catch(() => {});
        else a.pause();
    }, [playing, current]);

    // time/duration listeners
    useEffect(() => {
        const a = audioRef.current;
        if (!a) return;
        const onTime = () => setCurrentTime(a.currentTime || 0);
        const onMeta = () => setDuration(a.duration || (current?.duration ?? 0));
        a.addEventListener('timeupdate', onTime);
        a.addEventListener('loadedmetadata', onMeta);
        return () => {
            a.removeEventListener('timeupdate', onTime);
            a.removeEventListener('loadedmetadata', onMeta);
        };
    }, [current?.id]);

    // ended behavior for album loop
    useEffect(() => {
        const a = audioRef.current;
        if (!a) return;
        const onEnded = () => {
            if (loop === 'track') return; // handled by <audio loop>
            // album loop or wrap
            setIndex(i => (i + 1 < queue.length ? i + 1 : 0));
            setPlaying(true);
        };
        a.addEventListener('ended', onEnded);
        return () => a.removeEventListener('ended', onEnded);
    }, [loop, queue.length]);

    // keyboard shortcuts (Space, ←, →, L) — skip ↑/↓
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const t = e.target as HTMLElement | null;
            if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || (t as any).isContentEditable)) return;
            if (e.code === 'Space') { e.preventDefault(); toggle(); }
            else if (e.code === 'ArrowRight') next();
            else if (e.code === 'ArrowLeft') prev();
            else if (e.key.toLowerCase() === 'l') cycleLoop();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [toggle, next, prev, cycleLoop]);

    // Media Session
    useEffect(() => {
        if (!('mediaSession' in navigator) || !current) return;
        try {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: current.title,
                artist: 'Vincent Le',
                album: '', // you can fill this from UI context when you pass album title if desired
                artwork: [{ src: '', sizes: '512x512', type: 'image/png' }], // optional cover; you can update from caller
            });
            navigator.mediaSession.setActionHandler('play', () => setPlaying(true));
            navigator.mediaSession.setActionHandler('pause', () => setPlaying(false));
            navigator.mediaSession.setActionHandler('previoustrack', prev);
            navigator.mediaSession.setActionHandler('nexttrack', next);
            navigator.mediaSession.setActionHandler('seekto', (d: any) => seek(d.seekTime ?? 0));
        } catch {}
    }, [current?.id, current?.title, next, prev, seek]);

    const value = useMemo<Ctx>(() => ({
        queue, index, playing, volume, loop, currentTime, duration,
        setQueue, toggle, next, prev, seek, setVolume, toggleMute, cycleLoop,
    }), [queue, index, playing, volume, loop, currentTime, duration, setQueue, toggle, next, prev, seek, setVolume, toggleMute, cycleLoop]);

    return (
        <PlayerCtx.Provider value={value}>
            {children}
            <audio ref={audioRef} src={current?.src} preload="metadata" />
        </PlayerCtx.Provider>
    );
}
