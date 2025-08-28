'use client';

import { Icon } from '@iconify/react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useState } from 'react';

// ───────────────────────────────────────────────────────────────────────────────
// Data
// ───────────────────────────────────────────────────────────────────────────────
type ToolKey =
    | 'Unity'
    | 'C#'
    | 'Trello'
    | 'GitHub'
    | 'Wwise'
    | 'Unreal Engine'
    | 'C++'
    | 'React';

const TOOL_MAP: Record<ToolKey, { label: string; icon: string }> = {
    Unity:          { label: 'Unity',  icon: 'simple-icons:unity' },
    'C#':           { label: 'C#',     icon: 'simple-icons:csharp' },
    Trello:         { label: 'Trello', icon: 'simple-icons:trello' },
    GitHub:         { label: 'GitHub', icon: 'simple-icons:github' },
    Wwise:          { label: 'Wwise',  icon: 'simple-icons:wwise' },
    'Unreal Engine':{ label: 'Unreal', icon: 'simple-icons:unrealengine' },
    'C++':          { label: 'C++',    icon: 'simple-icons:cplusplus' },
    React:          { label: 'React',  icon: 'simple-icons:react' },
};

const ROWS: ToolKey[][] = [
    ['Unity', 'C#'],
    ['Trello', 'GitHub', 'Wwise'],
    ['Unreal Engine', 'C++', 'React'],
];

// ───────────────────────────────────────────────────────────────────────────────
// Animation helpers
// ───────────────────────────────────────────────────────────────────────────────
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const rowVariants =
    ({
        hidden: { opacity: 0 },
        show:   { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
    } satisfies Variants);

const itemVariants =
    ({
        hidden: { opacity: 0, y: 6 },
        show:   { opacity: 1, y: 0, transition: { duration: 0.22, ease: EASE_OUT } },
    } satisfies Variants);

const iconVariants =
    ({
        idle:  { y: 0 },
        hover: { y: -10, transition: { duration: 0.18, ease: EASE_OUT } },
    } satisfies Variants);

const labelVariants =
    ({
        idle:  { opacity: 0, y: 0 },
        hover: { opacity: 1, y: 12, transition: { duration: 0.18, ease: EASE_OUT } },
    } satisfies Variants);

// ───────────────────────────────────────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────────────────────────────────────
function originForIndex(index: number, len: number) {
    if (index === 0) return 'origin-left';
    if (index === len - 1) return 'origin-right';
    return 'origin-center';
}

// row-specific flexGrow targets so total ≈ constant:
// 2-up: hovered 1.3, others 0.7  (1.3 + 0.7 = 2)
// 3-up: hovered 1.2, others 0.9  (1.2 + 0.9 + 0.9 = 3)
function flexTargets(len: number) {
    return len === 2
        ? { hovered: 1.3, rest: 0.7 }
        : { hovered: 1.2, rest: 0.9 };
}

// ───────────────────────────────────────────────────────────────────────────────
// Card
// ───────────────────────────────────────────────────────────────────────────────
function IconCard({
                      label,
                      icon,
                      originClass,
                      isHovered,
                      reduceMotion,
                  }: {
    label: string;
    icon: string;
    originClass: string;
    isHovered: boolean;
    reduceMotion: boolean;
}) {
    const animateState = reduceMotion ? 'idle' : isHovered ? 'hover' : 'idle';

    return (
        <motion.li variants={itemVariants} className="list-none min-w-0">
            <motion.div
                className={[
                    // Base card + your utilities
                    'group relative isolate flex h-24 sm:h-28 items-center justify-center overflow-hidden',
                    'rounded-2xl text-current select-none',
                    'card-hover card-ring card-ring-hover',
                    // Growth anchored to edge
                    originClass,
                ].join(' ')}
                // Subtle scale for tactile feel; main width change comes from flexGrow on wrapper
                animate={reduceMotion ? { scale: 1 } : { scale: isHovered ? 1.03 : 1 }}
                transition={{ duration: 0.18, ease: EASE_OUT }}
            >
                {/* ICON — centered; nudges up on hover */}
                <motion.div variants={reduceMotion ? undefined : iconVariants} animate={animateState} className="relative z-10">
                    <Icon icon={icon} aria-hidden className="h-11 w-11 sm:h-12 sm:w-12 opacity-90" />
                </motion.div>

                {/* DESKTOP+ LABEL — fades in & nudges down from center */}
                <motion.span
                    variants={reduceMotion ? undefined : labelVariants}
                    animate={animateState}
                    className="absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 text-xs sm:block"
                    style={reduceMotion ? { opacity: 1, transform: 'translate(-50%, -50%)' } : undefined}
                >
                    {label}
                </motion.span>

                {/* MOBILE LABEL — always visible at bottom */}
                <span className="absolute bottom-1 left-1/2 z-10 block -translate-x-1/2 text-[11px] sm:hidden">
          {label}
        </span>
            </motion.div>
        </motion.li>
    );
}

// ───────────────────────────────────────────────────────────────────────────────
// Row
// ───────────────────────────────────────────────────────────────────────────────
function IconRow({ keys }: { keys: ToolKey[] }) {
    const [hovered, setHovered] = useState<number | null>(null);
    const reduce = useReducedMotion();
    const { hovered: fgHovered, rest: fgRest } = flexTargets(keys.length);

    return (
        <motion.ul
            variants={rowVariants}
            initial={reduce ? 'show' : 'hidden'}
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="flex gap-3"
            onMouseLeave={() => setHovered(null)}
        >
            {keys.map((key, idx) => {
                const t = TOOL_MAP[key];
                const originClass = originForIndex(idx, keys.length);
                const isHovered = hovered === idx;

                // Animate flexGrow so siblings shrink and hovered expands
                const targetGrow = hovered === null ? 1 : isHovered ? fgHovered : fgRest;

                return (
                    <motion.div
                        key={key}
                        className="flex-1 min-w-0"
                        // Let flexbox handle width; animate flexGrow numerically
                        animate={reduce ? { flexGrow: 1 } : { flexGrow: targetGrow }}
                        transition={{ duration: 0.22, ease: EASE_OUT }}
                        onMouseEnter={() => setHovered(idx)}
                        onFocus={() => setHovered(idx)}
                        onBlur={() => setHovered(null)}
                    >
                        <IconCard
                            label={t.label}
                            icon={t.icon}
                            originClass={originClass}
                            isHovered={!!isHovered}
                            reduceMotion={!!reduce}
                        />
                    </motion.div>
                );
            })}
        </motion.ul>
    );
}

// ───────────────────────────────────────────────────────────────────────────────
// Section
// ───────────────────────────────────────────────────────────────────────────────
export default function IconSection() {
    return (
        <div className="space-y-4">
            {ROWS.map((row, i) => (
                <IconRow key={i} keys={row} />
            ))}
        </div>
    );
}
