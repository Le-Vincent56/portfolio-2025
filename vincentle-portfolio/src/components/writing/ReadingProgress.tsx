'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function ReadingProgress({
    targetId = 'article-root',
    thicknessPx = 4,
    position = 'top',
}: {
    targetId?: string;
    thicknessPx?: number;
    position?: 'top' | 'bottom';
}) {
    const [progress, setProgress] = useState(0);
    const [celebrate, setCelebrate] = useState(false);
    const wasComplete = useRef(false);
    const reduce = useReducedMotion();

    useEffect(() => {
        const el = document.getElementById(targetId);
        if (!el) return;

        const onScroll = () => {
            const start = el.offsetTop;
            const end = el.offsetTop + el.offsetHeight - window.innerHeight;
            const current = Math.min(Math.max((window.scrollY - start) / (end - start), 0), 1);
            const p = Number.isFinite(current) ? current : 0;
            setProgress(p);

            if (p >= 0.999 && !wasComplete.current) {
                wasComplete.current = true;
                setCelebrate(true);
                window.setTimeout(() => setCelebrate(false), 900);
            }
            if (p < 0.999 && wasComplete.current) wasComplete.current = false;
        };

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, [targetId]);

    const sparks = useMemo(
        () => Array.from({ length: 6 }, (_, i) => ({ key: i, x: 10 + i * (80 / 5) })),
        []
    );

    return (
        <div
            className={`fixed inset-x-0 ${position === 'top' ? 'top-0' : 'bottom-0'} z-40 bg-white/5`}
            style={{ height: thicknessPx }}
            data-offset
        >
            <motion.div
                className="h-full bg-[var(--color-primary)]"
                style={{ width: `${progress * 100}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: reduce ? 0 : 0.15, ease: 'easeOut' }}
            />

            {celebrate && (
                <div className="pointer-events-none absolute inset-0">
                    {/* glow sweep */}
                    <motion.div
                        className="absolute inset-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.6 }}
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }}
                    />
                    {/* tiny sparks */}
                    {sparks.map((s) => (
                        <motion.span
                            key={s.key}
                            className="absolute block h-1 w-1 rounded-full bg-white"
                            initial={{ x: `${s.x}%`, y: 0, opacity: 0, scale: 0.6 }}
                            animate={{ y: [-6, -14, -20], opacity: [0, 1, 0], scale: [0.6, 1, 0.8] }}
                            transition={{ duration: 0.8, delay: s.key * 0.03 }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}