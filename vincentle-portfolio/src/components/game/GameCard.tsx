'use client';

import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { GamesMeta } from '@/lib/types';
import { useUIPrefs } from '@/components/prefs/UIPrefsProvider';
import Link from 'next/link';
import {useRouter} from "next/navigation";

export default function GameCard({
        project,
        isDimmed = false,
        onHoverStartAction,
        onHoverEndAction,
        onFocusAction,
        onBlurAction,
    }: {
        project: GamesMeta;
        isDimmed?: boolean;
        onHoverStartAction?: () => void;
        onHoverEndAction?: () => void;
        onFocusAction?: () => void;
        onBlurAction?: () => void;
    }) {
    const { reducedMotion, parallaxEnabled, ringPulseEnabled } = useUIPrefs();

    // ---- Micro‑parallax (tiny offsets) ----
    const ref = useRef<HTMLAnchorElement>(null);
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const springX = useSpring(mx, { stiffness: 200, damping: 24, mass: 0.4 });
    const springY = useSpring(my, { stiffness: 200, damping: 24, mass: 0.4 });

    // Clamp to ±4px
    const tx = useTransform(springX, (v) => Math.max(-4, Math.min(4, v)));
    const ty = useTransform(springY, (v) => Math.max(-4, Math.min(4, v)));

    function handleMove(e: React.MouseEvent) {
        if (reducedMotion || !parallaxEnabled) return;
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        mx.set(((e.clientX - cx) / rect.width) * 12);  // scale to small px
        my.set(((e.clientY - cy) / rect.height) * 12);
    }
    function resetParallax() {
        mx.set(0);
        my.set(0);
    }

    // ---- Soft bloom on tap ----
    const [bloom, setBloom] = useState(false);
    function tapStart() {
        if (reducedMotion) return;
        setBloom(true);
        // quick timer to remove bloom
        window.setTimeout(() => setBloom(false), 140);
    }
    
    const router = useRouter();
    const anchorRef = useRef<HTMLDivElement>(null);
    
    const canShared = typeof window !== 'undefined'
        ? window.matchMedia('(hover:hover) and (pointer:fine)').matches && window.innerWidth >= 768
        : true;
    
    async function handleClick(e: React.MouseEvent) {
        if (!canShared) return; // let Link do a normal nav (we'll add a wipe later)
        e.preventDefault();

        // Ensure in view
        const el = anchorRef.current;
        if (el) {
            const rect = el.getBoundingClientRect();
            const fullyVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
            if (!fullyVisible) {
                el.scrollIntoView({behavior: 'smooth', block: 'center'});
                // wait a tick for scroll, you can tune this if needed
                await new Promise((r) => setTimeout(r, 160));
            }
        }
        
        router.push(`/games/${project.slug}`, { scroll: false });
    }

    return (
        <Link href={`/games/${project.slug}`} scroll={false} prefetch onClick={handleClick}>
            <motion.div
                ref={anchorRef}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                whileHover={{ scale: 1.015 }}
                transition={{ scale: { type: 'tween', duration: 0.12, ease: 'easeOut' } }}
                animate={{ opacity: isDimmed ? 0.45 : 1, filter: isDimmed ? 'grayscale(30%)' : 'none' }}
                className={[
                    'group block relative rounded-2xl overflow-hidden',
                    'ring-2 ring-transparent hover:ring-[var(--brand)] ring-offset-2 ring-offset-[#0D0E11]',
                    'transition-colors duration-300 ease-out',
                ].join(' ')}
                aria-label={`${project.title}${project.roles?.length ? ` — ${project.roles.join(', ')}` : ''}`}
                onMouseEnter={() => {
                    onHoverStartAction?.();
                }}
                onMouseLeave={() => {
                    onHoverEndAction?.();
                    resetParallax();
                }}
                onMouseMove={handleMove}
                onFocus={() => onFocusAction?.()}
                onBlur={() => onBlurAction?.()}
                onPointerDown={tapStart}
                style={{
                    // soft bloom (brightness + slight saturate)
                    filter: bloom ? 'brightness(1.1) saturate(1.06)' : undefined,
                }}
            >
                {/* Accent ring pulse (outer aura) */}
                {ringPulseEnabled && (
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
                        style={{
                            animation: 'ring-breathe 1.2s ease-out infinite',
                            // Use transparent ring color at low alpha to keep it subtle
                        }}
                    />
                )}

                <motion.div style={{ x: tx, y: ty }}>
                    <div className="relative aspect-video">
                        {project.cover && (
                            <motion.div
                                layoutId={`cover-${project.slug}`}
                                className="absolute inset-0 rounded-2xl transform-gpu will-change-transform"
                                initial={false}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                            >
                                <Image src={project.cover} alt="" fill className="object-cover" />
                            </motion.div>

                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/10" />

                        <div className="absolute left-5 right-5 bottom-5">
                            <h3 className="text-2xl font-semibold tracking-tight">{project.title}</h3>
                            {project.hook && <p className="text-white/80">{project.hook}</p>}
                            {!!project.roles?.length && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {project.roles.map((r) => (
                                        <span key={r} className="rounded-full bg-white/10 text-xs px-2 py-1 ring-1 ring-white/10">
                                            {r}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </Link>
    );
}
