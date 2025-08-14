'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { WritingMeta } from '@/lib/types';

type Props = {
    item: WritingMeta;
    isDimmed?: boolean;
    onHoverStartAction?: () => void;
    onHoverEndAction?: () => void;
    onFocusAction?: () => void;
    onBlurAction?: () => void;
};

export default function WritingCard({
                                        item,
                                        isDimmed,
                                        onHoverStartAction,
                                        onHoverEndAction,
                                        onFocusAction,
                                        onBlurAction,
                                    }: Props) {
    return (
        <motion.a
            href={`/writing/${item.slug}`}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.22 }}
            whileHover={{ scale: 1.04, y: -2 }}
            whileFocus={{ scale: 1.04, y: -2 }}
            onHoverStart={onHoverStartAction}
            onHoverEnd={onHoverEndAction}
            onFocus={onFocusAction}
            onBlur={onBlurAction}
            aria-label={`${item.title} — ${item.type}`}
            className={clsx(
                'group block will-change-transform focus:outline-none',
                isDimmed && 'opacity-50'
            )}
            animate={{
                opacity: isDimmed ? 0.4 : 1,
                filter: isDimmed ? 'grayscale(50%)' : 'none',
            }}
            style={{ transformOrigin: 'center' }}
        >
            {/* Ringed container – hover/focus transitions the ring to your primary */}
            <div
                className="relative overflow-hidden rounded-2xl
                  ring-3 ring-white/10
                  transition-[ring-color,box-shadow] duration-200
                  group-hover:ring-primary
                  focus-visible:ring-primary
                  bg-border"
            >
                <div className="relative aspect-[2/3]">
                    {item.cover && (
                        <Image
                            src={item.cover}
                            alt={item.title}
                            fill
                            sizes="180px"
                            className="object-cover"
                            priority={false}
                        />
                    )}

                    {/* Bottom gradient for legibility */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                    {/* Bottom-left text overlay */}
                    <div className="absolute left-3 bottom-3 md:left-4 md:bottom-4">
                        <div className="text-sm tracking-wide uppercase text-white/80">
                            {item.type}
                        </div>
                        <div className="text-2xl font-semibold leading-tight text-white drop-shadow">
                            {item.title}
                        </div>
                    </div>
                </div>
            </div>
        </motion.a>
    );
}