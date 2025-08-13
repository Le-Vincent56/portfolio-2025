'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { GamesMeta } from '@/lib/types';

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
    return (
        <motion.a
            href={`/games/${project.slug}`}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            whileHover={{ scale: 1.015 }}
            transition={{
                scale: { type: 'tween', duration: 0.12, ease: 'easeOut' },
            }}
            animate={{
                opacity: isDimmed ? 0.4 : 1,
                filter: isDimmed ? 'grayscale(50%)' : 'none',
            }}
            className="group block rounded-2xl overflow-hidden
                 ring-2 ring-transparent hover:ring-primary
                 ring-offset-2 ring-offset-[#0D0E11]
                 transition-colors duration-300 ease-out relative"
            aria-label={`${project.title} — ${project.roles.join(', ')}`}
            onMouseEnter={onHoverStartAction}
            onMouseLeave={onHoverEndAction}
            onFocus={onFocusAction}
            onBlur={onBlurAction}
        >
            <div className="relative aspect-video">
                {project.cover && (
                    <Image
                        src={project.cover}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-transparent" />
                <div className="absolute left-5 right-5 bottom-5">
                    <h3 className="text-2xl font-semibold tracking-tight">{project.title}</h3>
                    {project.hook && <p className="text-text/80">{project.hook}</p>}
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
        </motion.a>
    );
}
